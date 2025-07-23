import React, { useState, useEffect } from 'react';
import * as reporting from '../services/reporting';
import * as address from '../services/address';
import { useForm } from 'react-hook-form';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link, Routes, Route, useParams, useNavigate } from 'react-router-dom';

const tabs = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'country', label: 'Country' },
  { key: 'region', label: 'Region' },
  { key: 'transport', label: 'Transport Type' },
  { key: 'package', label: 'Package Types' },
  { key: 'id', label: 'Id Types' },
  { key: 'user', label: 'Users' },
  { key: 'reporting', label: 'Reporting' },
];

function useAdminMetrics() {
  const [metrics, setMetrics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchMetrics() {
      setLoading(true);
      setError(null);
      try {
        const [totalUsers, newUsers, verifiedTravelers, totalTrips, totalPackageRequests] = await Promise.all([
          reporting.getTotalUsers(),
          reporting.getNewUsers(),
          reporting.getVerifiedTravelers(),
          reporting.getTotalTrips(),
          reporting.getTotalPackageRequests(),
        ]);
        if (mounted) {
          setMetrics({
            totalUsers: totalUsers.data,
            newUsers: newUsers.data,
            verifiedTravelers: verifiedTravelers.data,
            totalTrips: totalTrips.data,
            totalPackageRequests: totalPackageRequests.data,
          });
        }
      } catch (err) {
        setError('Failed to load metrics');
      } finally {
        setLoading(false);
      }
    }
    fetchMetrics();
    return () => { mounted = false; };
  }, []);

  return { metrics, loading, error };
}

function useReportingMetrics() {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const [
          tripsPerDay,
          tripsPerWeek,
          tripsPerMonth,
          tripsPerYear,
          avgPricePerKg,
          totalKgOffered,
          totalKgSold,
          kgSoldVsAvailable,
          offerToMessageRatio,
          dauWauMau,
          tripCreatorsVsSenders,
          avgTimeToFirstPackageRequest,
          packageRequestResponseTimeBuckets,
          routeSaturation,
          cancellationDisputeRates,
          funnelConversion,
          packageStatusDistribution,
          routes
        ] = await Promise.all([
          reporting.getTripsPerDay(),
          reporting.getTripsPerWeek(),
          reporting.getTripsPerMonth(),
          reporting.getTripsPerYear(),
          reporting.getAvgPricePerKg(),
          reporting.getTotalKgOffered(),
          reporting.getTotalKgSold(),
          reporting.getKgSoldVsAvailable(),
          reporting.getOfferToMessageRatio(),
          reporting.getDauWauMau(),
          reporting.getTripCreatorsVsSenders(),
          reporting.getAvgTimeToFirstPackageRequest(),
          reporting.getPackageRequestResponseTimeBuckets(),
          reporting.getRouteSaturation(),
          reporting.getCancellationDisputeRates(),
          reporting.getFunnelConversion(),
          reporting.getPackageStatusDistribution(),
          reporting.getRoutes(),
        ]);
        if (mounted) {
          setData({
            tripsPerDay: tripsPerDay.data,
            tripsPerWeek: tripsPerWeek.data,
            tripsPerMonth: tripsPerMonth.data,
            tripsPerYear: tripsPerYear.data,
            avgPricePerKg: avgPricePerKg.data,
            totalKgOffered: totalKgOffered.data,
            totalKgSold: totalKgSold.data,
            kgSoldVsAvailable: kgSoldVsAvailable.data,
            offerToMessageRatio: offerToMessageRatio.data,
            dauWauMau: dauWauMau.data,
            tripCreatorsVsSenders: tripCreatorsVsSenders.data,
            avgTimeToFirstPackageRequest: avgTimeToFirstPackageRequest.data,
            packageRequestResponseTimeBuckets: packageRequestResponseTimeBuckets.data,
            routeSaturation: routeSaturation.data,
            cancellationDisputeRates: cancellationDisputeRates.data,
            funnelConversion: funnelConversion.data,
            packageStatusDistribution: packageStatusDistribution.data,
            routes: routes.data,
          });
        }
      } catch (err) {
        setError('Failed to load reporting metrics');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
    return () => { mounted = false; };
  }, []);

  return { data, loading, error };
}

function renderMetricValue(value) {
  if (value == null) return '-';
  if (typeof value === 'number' || typeof value === 'string') return value;
  if (Array.isArray(value)) {
    if (value.length === 0) return 'No data';
    const keys = Object.keys(value[0]);
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs border mt-2 rounded-lg shadow">
          <thead className="bg-blue-50 sticky top-0 z-10">
            <tr>{keys.map(k => <th key={k} className="px-3 py-2 border-b text-blue-700 font-semibold whitespace-nowrap">{formatKey(k)}</th>)}</tr>
          </thead>
          <tbody>
            {value.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                {keys.map(k => <td key={k} className="px-3 py-2 border-b whitespace-nowrap" title={typeof row[k] === 'object' ? JSON.stringify(row[k]) : ''}>{renderMetricValue(row[k])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 1 && Array.isArray(entries[0][1])) {
      return renderMetricValue(entries[0][1]);
    }
    if (entries.length === 1 && (typeof entries[0][1] === 'number' || typeof entries[0][1] === 'string')) {
      return entries[0][1];
    }
    return (
      <table className="text-xs mt-2 rounded-lg shadow bg-white">
        <tbody>
          {entries.map(([k, v], i) => (
            <tr key={k} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
              <td className="pr-3 py-1 text-blue-700 font-semibold whitespace-nowrap">{formatKey(k)}</td>
              <td className="py-1" title={typeof v === 'object' ? JSON.stringify(v) : ''}>{renderMetricValue(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return <span title={JSON.stringify(value)}>{JSON.stringify(value)}</span>;
}

function formatKey(key) {
  if (key === 'dauWauMau') return 'DAU/WAU/MAU';

  const withSpaces = key
    .replace(/_/g, ' ') // snake_case to spaces
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2'); // camelCase to spaces

  // Title Case every word
  return withSpaces.replace(/\b\w/g, l => l.toUpperCase());
}

function CountryCRUD() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetch = async (pageNum = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await address.fetchCountries(pageNum);
      const arr = Array.isArray(res?.data?.results)
        ? res.data.results
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.results)
            ? res.results
            : Array.isArray(res)
              ? res
              : [];
      setCountries(arr);
      setTotalPages(res?.data?.count ? Math.ceil(res.data.count / arr.length) : 1);
    } catch (e) {
      setError('Failed to fetch countries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(page); }, [page]);

  const onSubmit = async (data) => {
    try {
      let res;
      if (editId) {
        res = await address.updateCountry(editId, data);
      } else {
        res = await address.createCountry(data);
      }
      reset();
      setEditId(null);
      fetch(page);
    } catch (e) {
      if (Array.isArray(e?.response?.data?.error) && e.response.data.error.length) setError(e.response.data.error);
      else setError('Failed to save country');
    }
  };

  const onEdit = (country) => {
    setEditId(country.id);
    setValue('name', country.name);
    setValue('code', country.code);
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this country?')) return;
    try {
      await address.deleteCountry(id);
      fetch(page);
    } catch (e) {
      setError('Failed to delete country');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-8 border border-blue-100">
        <h2 className="text-2xl font-extrabold text-blue-700 mb-6 tracking-tight drop-shadow">Countries</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4 items-end mb-6">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input {...register('name', { required: 'Name required' })} className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-300 transition" />
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Code</label>
            <input {...register('code', { required: 'Code required' })} className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-300 transition" />
            {errors.code && <span className="text-xs text-red-500">{errors.code.message}</span>}
          </div>
          <button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400">{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); reset(); }} className="ml-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>}
        </form>
        {loading ? <div className="text-blue-500">Loading...</div> : error ? <div className="text-red-500 mb-4">{
          Array.isArray(error) ? (
            <ul className="list-disc pl-5 space-y-1">
              {error.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          ) : error
        }</div> : (
          <>
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full text-sm rounded-xl shadow border border-blue-100">
                <thead className="bg-gradient-to-r from-blue-100 to-purple-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Code</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {countries.map((c, i) => (
                    <tr key={c.id} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100 transition'}>
                      <td className="px-4 py-2 font-semibold text-blue-900">{c.name}</td>
                      <td className="px-4 py-2">{c.code}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button onClick={() => onEdit(c)} className="text-blue-600 hover:underline font-bold">Edit</button>
                        <button onClick={() => onDelete(c.id)} className="text-red-600 hover:underline font-bold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center gap-2 mt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-bold disabled:opacity-50">Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded font-bold ${p === page ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-bold disabled:opacity-50">Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function RegionCRUD() {
  const [regions, setRegions] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetchCountriesList = async () => {
    try {
      const res = await address.fetchCountries();
      const arr = Array.isArray(res?.data?.results)
        ? res.data.results
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.results)
            ? res.results
            : Array.isArray(res)
              ? res
              : [];
      setCountries(arr);
    } catch {}
  };

  const fetchRegionsList = async (countryId, pageNum = page) => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (countryId) {
        res = await address.fetchRegionsByCountry(countryId, pageNum);
      } else {
        res = await address.fetchRegions(pageNum);
      }
      const arr = Array.isArray(res?.data?.results)
        ? res.data.results
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.results)
            ? res.results
            : Array.isArray(res)
              ? res
              : [];
      setRegions(arr);
      setTotalPages(res?.data?.count ? Math.ceil(res.data.count / arr.length) : 1);
    } catch (e) {
      setError('Failed to fetch regions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCountriesList(); fetchRegionsList(selectedCountry, page); }, [page]);
  useEffect(() => { setPage(1); fetchRegionsList(selectedCountry, 1); }, [selectedCountry]);

  const onSubmit = async (data) => {
    try {
      let res;
      if (editId) {
        res = await address.updateRegion(editId, data);
      } else {
        res = await address.createRegion(data);
      }
      reset();
      setEditId(null);
      fetchRegionsList(selectedCountry, page);
    } catch (e) {
      if (Array.isArray(e?.response?.data?.error) && e.response.data.error.length) setError(e.response.data.error);
      else setError('Failed to save region');
    }
  };

  const onEdit = (region) => {
    setEditId(region.id);
    setValue('name', region.name);
    setValue('country', region.country);
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this region?')) return;
    try {
      await address.deleteRegion(id);
      fetchRegionsList(selectedCountry, page);
    } catch (e) {
      setError('Failed to delete region');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto mt-10">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-8 border border-blue-100">
        <h2 className="text-2xl font-extrabold text-blue-700 mb-6 tracking-tight drop-shadow">Regions</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4 items-end mb-6">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Country</label>
            <select {...register('country', { required: 'Country required' })} className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-300 transition">
              <option value="">Select Country</option>
              {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            {errors.country && <span className="text-xs text-red-500">{errors.country.message}</span>}
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input {...register('name', { required: 'Name required' })} className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-300 transition" />
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>
          <button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400">{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); reset(); }} className="ml-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>}
        </form>
        <div className="flex gap-4 items-center mb-6">
          <label className="text-sm font-semibold text-gray-700">Filter by Country:</label>
          <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-300 transition">
            <option value="">All</option>
            {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        {loading ? <div className="text-blue-500">Loading...</div> : error ? <div className="text-red-500 mb-4">{
          Array.isArray(error) ? (
            <ul className="list-disc pl-5 space-y-1">
              {error.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          ) : error
        }</div> : (
          <>
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full text-sm rounded-xl shadow border border-blue-100">
                <thead className="bg-gradient-to-r from-blue-100 to-purple-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Country</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {regions.map((r, i) => (
                    <tr key={r.id} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100 transition'}>
                      <td className="px-4 py-2 font-semibold text-blue-900">{r.name}</td>
                      <td className="px-4 py-2">{r.country_name || countries.find(c => c.id === r.country)?.name || r.country}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button onClick={() => onEdit(r)} className="text-blue-600 hover:underline font-bold">Edit</button>
                        <button onClick={() => onDelete(r.id)} className="text-red-600 hover:underline font-bold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center gap-2 mt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-bold disabled:opacity-50">Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded font-bold ${p === page ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-bold disabled:opacity-50">Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TransportTypeCRUD() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetch = async (pageNum = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await address.fetchTransportTypes(pageNum);
      const arr = Array.isArray(res?.data?.results)
        ? res.data.results
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.results)
            ? res.results
            : Array.isArray(res)
              ? res
              : [];
      setTypes(arr);
      setTotalPages(res?.data?.count ? Math.ceil(res.data.count / arr.length) : 1);
    } catch (e) {
      setError('Failed to fetch transport types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(page); }, [page]);

  const onSubmit = async (data) => {
    try {
      let res;
      if (editId) {
        res = await address.updateTransportType(editId, data);
      } else {
        res = await address.createTransportType(data);
      }
      reset();
      setEditId(null);
      fetch(page);
    } catch (e) {
      if (Array.isArray(e?.response?.data?.error) && e.response.data.error.length) setError(e.response.data.error);
      else setError('Failed to save transport type');
    }
  };

  const onEdit = (type) => {
    setEditId(type.id);
    setValue('name', type.name);
    setValue('description', type.description);
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this transport type?')) return;
    try {
      await address.deleteTransportType(id);
      fetch(page);
    } catch (e) {
      setError('Failed to delete transport type');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-8 border border-blue-100">
        <h2 className="text-2xl font-extrabold text-blue-700 mb-6 tracking-tight drop-shadow">Transport Types</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4 items-end mb-6">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input {...register('name', { required: 'Name required' })} className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-300 transition" />
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <input {...register('description', { required: 'Description required' })} className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-300 transition" />
            {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
          </div>
          <button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400">{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); reset(); }} className="ml-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>}
        </form>
        {loading ? <div className="text-blue-500">Loading...</div> : error ? <div className="text-red-500 mb-4">{
          Array.isArray(error) ? (
            <ul className="list-disc pl-5 space-y-1">
              {error.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          ) : error
        }</div> : (
          <>
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full text-sm rounded-xl shadow border border-blue-100">
                <thead className="bg-gradient-to-r from-blue-100 to-purple-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {types.map((t, i) => (
                    <tr key={t.id} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100 transition'}>
                      <td className="px-4 py-2 font-semibold text-blue-900">{t.name}</td>
                      <td className="px-4 py-2">{t.description}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button onClick={() => onEdit(t)} className="text-blue-600 hover:underline font-bold">Edit</button>
                        <button onClick={() => onDelete(t.id)} className="text-red-600 hover:underline font-bold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center gap-2 mt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-bold disabled:opacity-50">Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded font-bold ${p === page ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-bold disabled:opacity-50">Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function PackageTypeCRUD() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetch = async (pageNum = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await address.fetchPackageTypes(pageNum);
      const arr = Array.isArray(res?.data?.results)
        ? res.data.results
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.results)
            ? res.results
            : Array.isArray(res)
              ? res
              : [];
      setTypes(arr);
      setTotalPages(res?.data?.count ? Math.ceil(res.data.count / arr.length) : 1);
    } catch (e) {
      setError('Failed to fetch package types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(page); }, [page]);

  const onSubmit = async (data) => {
    try {
      let res;
      if (editId) {
        res = await address.updatePackageType(editId, data);
      } else {
        res = await address.createPackageType(data);
      }
      reset();
      setEditId(null);
      fetch(page);
    } catch (e) {
      if (Array.isArray(e?.response?.data?.error) && e.response.data.error.length) setError(e.response.data.error);
      else setError('Failed to save package type');
    }
  };

  const onEdit = (type) => {
    setEditId(type.id);
    setValue('name', type.name);
    setValue('description', type.description);
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this package type?')) return;
    try {
      await address.deletePackageType(id);
      fetch(page);
    } catch (e) {
      setError('Failed to delete package type');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-8 border border-blue-100">
        <h2 className="text-2xl font-extrabold text-blue-700 mb-6 tracking-tight drop-shadow">Package Types</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4 items-end mb-6">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input {...register('name', { required: 'Name required' })} className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-300 transition" />
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <input {...register('description', { required: 'Description required' })} className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-300 transition" />
            {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
          </div>
          <button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400">{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); reset(); }} className="ml-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>}
        </form>
        {loading ? <div className="text-blue-500">Loading...</div> : error ? <div className="text-red-500 mb-4">{
          Array.isArray(error) ? (
            <ul className="list-disc pl-5 space-y-1">
              {error.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          ) : error
        }</div> : (
          <>
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full text-sm rounded-xl shadow border border-blue-100">
                <thead className="bg-gradient-to-r from-blue-100 to-purple-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {types.map((t, i) => (
                    <tr key={t.id} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100 transition'}>
                      <td className="px-4 py-2 font-semibold text-blue-900">{t.name}</td>
                      <td className="px-4 py-2">{t.description}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button onClick={() => onEdit(t)} className="text-blue-600 hover:underline font-bold">Edit</button>
                        <button onClick={() => onDelete(t.id)} className="text-red-600 hover:underline font-bold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center gap-2 mt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-bold disabled:opacity-50">Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded font-bold ${p === page ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-bold disabled:opacity-50">Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function IDTypeCRUD() {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editId, setEditId] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const fetch = async (pageNum = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await address.fetchIDTypes(pageNum);
      const arr = Array.isArray(res?.data?.results)
        ? res.data.results
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.results)
            ? res.results
            : Array.isArray(res)
              ? res
              : [];
      setTypes(arr);
      setTotalPages(res?.data?.count ? Math.ceil(res.data.count / arr.length) : 1);
    } catch (e) {
      setError('Failed to fetch ID types');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(page); }, [page]);

  const onSubmit = async (data) => {
    try {
      let res;
      if (editId) {
        res = await address.updateIDType(editId, data);
      } else {
        res = await address.createIDType(data);
      }
      reset();
      setEditId(null);
      fetch(page);
    } catch (e) {
      if (Array.isArray(e?.response?.data?.error) && e.response.data.error.length) setError(e.response.data.error);
      else setError('Failed to save ID type');
    }
  };

  const onEdit = (type) => {
    setEditId(type.id);
    setValue('name', type.name);
    setValue('description', type.description);
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this ID type?')) return;
    try {
      await address.deleteIDType(id);
      fetch(page);
    } catch (e) {
      setError('Failed to delete ID type');
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-8 border border-blue-100">
        <h2 className="text-2xl font-extrabold text-blue-700 mb-6 tracking-tight drop-shadow">ID Types</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap gap-4 items-end mb-6">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
            <input {...register('name', { required: 'Name required' })} className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-300 transition" />
            {errors.name && <span className="text-xs text-red-500">{errors.name.message}</span>}
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <input {...register('description', { required: 'Description required' })} className="border rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-300 transition" />
            {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
          </div>
          <button type="submit" className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400">{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); reset(); }} className="ml-2 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold">Cancel</button>}
        </form>
        {loading ? <div className="text-blue-500">Loading...</div> : error ? <div className="text-red-500 mb-4">{
          Array.isArray(error) ? (
            <ul className="list-disc pl-5 space-y-1">
              {error.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          ) : error
        }</div> : (
          <>
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full text-sm rounded-xl shadow border border-blue-100">
                <thead className="bg-gradient-to-r from-blue-100 to-purple-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {types.map((t, i) => (
                    <tr key={t.id} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100 transition'}>
                      <td className="px-4 py-2 font-semibold text-blue-900">{t.name}</td>
                      <td className="px-4 py-2">{t.description}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button onClick={() => onEdit(t)} className="text-blue-600 hover:underline font-bold">Edit</button>
                        <button onClick={() => onDelete(t.id)} className="text-red-600 hover:underline font-bold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center gap-2 mt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-bold disabled:opacity-50">Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded font-bold ${p === page ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-bold disabled:opacity-50">Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function UserCRUD() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updatingId, setUpdatingId] = useState(null);
  const [updateError, setUpdateError] = useState(null);

  const fetch = async (pageNum = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await address.fetchUsers(pageNum);
      const arr = Array.isArray(res?.data?.results)
        ? res.data.results
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.results)
            ? res.results
            : Array.isArray(res)
              ? res
              : [];
      setUsers(arr);
      setTotalPages(res?.data?.count ? Math.ceil(res.data.count / arr.length) : 1);
    } catch (e) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(page); }, [page]);

  const handleIdentityChange = async (id, value) => {
    setUpdatingId(id);
    setUpdateError(null);
    try {
      await address.updateUserIdentityStatus(id, value);
      fetch(page);
    } catch (e) {
      setUpdateError('Failed to update identity status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="bg-white/90 rounded-2xl shadow-2xl p-4 sm:p-8 border border-blue-100">
        <h2 className="text-2xl font-extrabold text-blue-700 mb-6 tracking-tight drop-shadow">Users</h2>
        {loading ? <div className="text-blue-500">Loading...</div> : error ? <div className="text-red-500 mb-4">{
          Array.isArray(error) ? (
            <ul className="list-disc pl-5 space-y-1">{error.map((msg, i) => <li key={i}>{msg}</li>)}</ul>
          ) : error
        }</div> : (
          <>
            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full text-xs sm:text-sm rounded-xl shadow border border-blue-100">
                <thead className="bg-gradient-to-r from-blue-100 to-purple-100">
                  <tr>
                    <th className="px-2 py-2 text-left">Username</th>
                    <th className="px-2 py-2 text-left">Email</th>
                    <th className="px-2 py-2 text-left">First Name</th>
                    <th className="px-2 py-2 text-left">Last Name</th>
                    <th className="px-2 py-2 text-left">Phone</th>
                    <th className="px-2 py-2 text-left">Identity Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => (
                    <tr key={u.id} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100 transition'}>
                      <td className="px-2 py-2 font-semibold text-blue-900">
                        <Link to={`/dashboard/users/${u.id}`} className="text-blue-700 hover:underline">{u.username}</Link>
                      </td>
                      <td className="px-2 py-2">{u.email}</td>
                      <td className="px-2 py-2">{u.first_name}</td>
                      <td className="px-2 py-2">{u.last_name}</td>
                      <td className="px-2 py-2">{u.phone_number}</td>
                      <td className="px-2 py-2">{u.is_identity_verified}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-center items-center gap-2 mt-4">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-bold disabled:opacity-50">Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={`px-3 py-1 rounded font-bold ${p === page ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}>{p}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded bg-blue-100 text-blue-700 font-bold disabled:opacity-50">Next</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const res = await address.fetchUsers();
        const arr = Array.isArray(res?.data?.results)
          ? res.data.results
          : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.results)
              ? res.results
              : Array.isArray(res)
                ? res
                : [];
        const found = arr.find(u => String(u.id) === String(id));
        setUser(found);
        setStatus(found?.is_identity_verified || '');
      } catch (e) {
        setError('Failed to fetch user');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      await address.updateUserIdentityStatus(id, status);
      navigate('/dashboard?tab=user');
    } catch (e) {
      if (Array.isArray(e?.response?.data?.error)) setSaveError(e.response.data.error);
      else setSaveError('Failed to update identity status');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-blue-500 p-8">Loading user...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;
  if (!user) return <div className="text-red-500 p-8">User not found</div>;

  return (
    <div className="max-w-xl mx-auto bg-white/90 rounded-2xl shadow-2xl p-8 border border-blue-100 mt-8">
      <h2 className="text-2xl font-extrabold text-blue-700 mb-6 tracking-tight drop-shadow">User Detail</h2>
      <div className="mb-4"><span className="font-bold">Username:</span> {user.username}</div>
      <div className="mb-4"><span className="font-bold">Email:</span> {user.email}</div>
      <div className="mb-4"><span className="font-bold">First Name:</span> {user.first_name}</div>
      <div className="mb-4"><span className="font-bold">Last Name:</span> {user.last_name}</div>
      <div className="mb-4"><span className="font-bold">Phone:</span> {user.phone_number}</div>
      <div className="mb-4"><span className="font-bold">Identity Status:</span>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="border rounded px-2 py-1 bg-white focus:ring-2 focus:ring-blue-300 ml-2"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      {saveError && (
        <div className="text-red-500 mb-4">{
          Array.isArray(saveError) ? (
            <ul className="list-disc pl-5 space-y-1">{saveError.map((msg, i) => <li key={i}>{msg}</li>)}</ul>
          ) : saveError
        }</div>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold px-6 py-2 rounded-lg shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
      <button
        onClick={() => navigate('/dashboard?tab=user')}
        className="ml-4 px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 font-semibold"
      >
        Back
      </button>
    </div>
  );
}

function DashboardGraph() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await reporting.getDashboardData();
        if (mounted) setData(res.data);
      } catch (e) {
        setError('Failed to load dashboard graph data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    return () => { mounted = false; };
  }, []);

  // Merge users_per_day, trips_per_day, requests_per_day by day
  const merged = [];
  if (data) {
    const days = new Set([
      ...(data.users_per_day || []).map(d => d.day),
      ...(data.trips_per_day || []).map(d => d.day),
      ...(data.requests_per_day || []).map(d => d.day),
    ]);
    Array.from(days).sort().forEach(day => {
      merged.push({
        day: day.slice(0, 10),
        users: (data.users_per_day || []).find(d => d.day === day)?.count || 0,
        trips: (data.trips_per_day || []).find(d => d.day === day)?.count || 0,
        requests: (data.requests_per_day || []).find(d => d.day === day)?.count || 0,
      });
    });
  }

  return (
    <div className="bg-white/90 rounded-2xl shadow-2xl p-8 border border-blue-100 mb-8">
      <h2 className="text-xl font-bold text-blue-700 mb-4">User, Trip, and Request Trends (per Day)</h2>
      {loading ? <div className="text-blue-500">Loading graph...</div> : error ? <div className="text-red-500">{error}</div> : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={merged} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2} dot={false} name="Users" />
            <Line type="monotone" dataKey="trips" stroke="#9333ea" strokeWidth={2} dot={false} name="Trips" />
            <Line type="monotone" dataKey="requests" stroke="#f59e42" strokeWidth={2} dot={false} name="Requests" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mountedTabs, setMountedTabs] = useState({ dashboard: true, reporting: true });
  const { metrics, loading, error } = useAdminMetrics();
  const reportingMetrics = useReportingMetrics();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Responsive sidebar toggle
  function Sidebar() {
    return (
      <>
        {/* Mobile menu button */}
        <button
          className="md:hidden fixed top-4 left-4 z-40 bg-white/90 border border-blue-100 rounded-lg shadow p-2 focus:outline-none"
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        {/* Sidebar */}
        <aside className={`fixed md:static top-0 left-0 h-full w-64 bg-white/90 border-r border-blue-100 shadow-lg flex flex-col py-8 px-4 z-30 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
          style={{ minHeight: '100vh' }}
        >
          <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">Verlo Admin</h2>
          <nav className="flex flex-col gap-2">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  if (!mountedTabs[tab.key]) {
                    setMountedTabs(prev => ({ ...prev, [tab.key]: true }));
                  }
                  setSidebarOpen(false);
                }}
                className={`text-left px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${activeTab === tab.key ? 'bg-gradient-to-r from-blue-500 to-purple-400 text-white shadow' : 'text-blue-700 hover:bg-blue-100'}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>
        {/* Overlay for mobile */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setSidebarOpen(false)} />}
      </>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-purple-100">
      <Sidebar />
      {/* Main Content */}
      <main className="flex-1 p-2 sm:p-4 md:p-10 overflow-y-auto h-full md:h-screen max-w-full w-full">
        {mountedTabs.dashboard && (
          <div className={`animate-fade-in ${activeTab === 'dashboard' ? '' : 'hidden'}`}>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-blue-700">Dashboard Overview</h1>
            <DashboardGraph />
            {loading ? (
              <div className="text-blue-500">Loading metrics...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-blue-600">{metrics.totalUsers?.total_users ?? '-'}</span>
                  <span className="text-gray-500">Total Users</span>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-purple-600">{metrics.newUsers?.new_users ?? '-'}</span>
                  <span className="text-gray-500">New Users</span>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-pink-600">{metrics.verifiedTravelers?.verified_travelers ?? '-'}</span>
                  <span className="text-gray-500">Verified Travelers</span>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-green-600">{metrics.totalTrips?.total_trips ?? '-'}</span>
                  <span className="text-gray-500">Total Trips</span>
                </div>
                <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-yellow-600">{metrics.totalPackageRequests?.total_package_requests ?? '-'}</span>
                  <span className="text-gray-500">Total Package Requests</span>
                </div>
              </div>
            )}
            <div className="bg-white rounded-xl shadow p-8 mt-8">
              <h2 className="text-xl font-bold mb-4 text-blue-700">Sample Graph</h2>
              <div className="w-full h-48 flex items-center justify-center text-gray-400">[Graph Placeholder]</div>
            </div>
          </div>
        )}
        {mountedTabs.country && (
          <div className={`animate-fade-in ${activeTab === 'country' ? '' : 'hidden'}`}>
            <CountryCRUD />
          </div>
        )}
        {mountedTabs.region && (
          <div className={`animate-fade-in ${activeTab === 'region' ? '' : 'hidden'}`}>
            <RegionCRUD />
          </div>
        )}
        {mountedTabs.transport && (
          <div className={`animate-fade-in ${activeTab === 'transport' ? '' : 'hidden'}`}>
            <TransportTypeCRUD />
          </div>
        )}
        {mountedTabs.package && (
          <div className={`animate-fade-in ${activeTab === 'package' ? '' : 'hidden'}`}>
            <PackageTypeCRUD />
          </div>
        )}
        {mountedTabs.id && (
          <div className={`animate-fade-in ${activeTab === 'id' ? '' : 'hidden'}`}>
            <IDTypeCRUD />
          </div>
        )}
        {mountedTabs.user && (
          <div className={`animate-fade-in ${activeTab === 'user' ? '' : 'hidden'}`}>
            <UserCRUD />
          </div>
        )}
        {activeTab === 'reporting' && (
          <div className="animate-fade-in">
            <h1 className="text-2xl font-bold mb-4 text-blue-700">Reporting Metrics</h1>
            {reportingMetrics.loading ? (
              <div className="text-blue-500">Loading reporting metrics...</div>
            ) : reportingMetrics.error ? (
              <div className="text-red-500">{reportingMetrics.error}</div>
            ) : (
              <div className="bg-white rounded-2xl shadow-2xl border border-blue-100">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-100 to-purple-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-blue-700 text-lg font-bold tracking-wide rounded-tl-2xl">Metric</th>
                        <th className="px-6 py-3 text-left text-blue-700 text-lg font-bold tracking-wide rounded-tr-2xl">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(reportingMetrics.data).map(([key, value], i) => (
                        <tr key={key} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50 hover:bg-blue-100 transition'}>
                          <td className="px-6 py-3 font-semibold text-blue-900 whitespace-nowrap border-b border-blue-100">{formatKey(key)}</td>
                          <td className="px-6 py-3 border-b border-blue-100 align-top">{renderMetricValue(value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Mobile Card View */}
                <div className="block md:hidden p-4 space-y-4">
                  {Object.entries(reportingMetrics.data).map(([key, value], i) => (
                    <div key={key} className={`p-4 rounded-lg shadow ${i % 2 === 0 ? 'bg-white' : 'bg-blue-50'}`}>
                      <div className="font-bold text-blue-800 text-lg">{formatKey(key)}</div>
                      <div className="mt-2 text-gray-800">{renderMetricValue(value)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <Routes>
          <Route path="/dashboard/users/:id" element={<UserDetail />} />
        </Routes>
        <style>{`
          .animate-fade-in { animation: fadeIn 0.7s; }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
      </main>
    </div>
  );
} 