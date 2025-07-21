import axios from 'axios';
import { getValidAccessToken } from './auth';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';

async function authRequest(method, url, data) {
  const token = await getValidAccessToken();
  if (!token) throw new Error('Not authenticated');
  return axios({
    method,
    url: `${BASE_URL}${url}`,
    data,
    headers: { Authorization: `Bearer ${token}` },
  }).then(res => res.data);
}

// Country
export const fetchCountries = (page = 1) => authRequest('get', `/api/listings/countries/?page=${page}`);
export const createCountry = (country) => authRequest('post', '/api/listings/countries/', country);
export const updateCountry = (id, country) => authRequest('put', `/api/listings/countries/${id}/`, country);
export const patchCountry = (id, country) => authRequest('patch', `/api/listings/countries/${id}/`, country);
export const deleteCountry = (id) => authRequest('delete', `/api/listings/countries/${id}/`);

// Region
export const fetchRegions = (page = 1) => authRequest('get', `/api/listings/regions/?page=${page}`);
export const fetchRegionsByCountry = (countryId, page = 1) => authRequest('get', `/api/listings/regions/by-country/${countryId}/?page=${page}`);
export const createRegion = (region) => authRequest('post', '/api/listings/regions/', region);
export const updateRegion = (id, region) => authRequest('put', `/api/listings/regions/${id}/`, region);
export const patchRegion = (id, region) => authRequest('patch', `/api/listings/regions/${id}/`, region);
export const deleteRegion = (id) => authRequest('delete', `/api/listings/regions/${id}/`);

// Transport Types
export const fetchTransportTypes = (page = 1) => authRequest('get', `/api/listings/transport-types/?page=${page}`);
export const createTransportType = (data) => authRequest('post', '/api/listings/transport-types/', data); // expects { name, description }
export const updateTransportType = (id, data) => authRequest('put', `/api/listings/transport-types/${id}/`, data); // expects { name, description }
export const patchTransportType = (id, data) => authRequest('patch', `/api/listings/transport-types/${id}/`, data);
export const deleteTransportType = (id) => authRequest('delete', `/api/listings/transport-types/${id}/`);

// Package Types
export const fetchPackageTypes = (page = 1) => authRequest('get', `/api/listings/package-types/?page=${page}`);
export const createPackageType = (data) => authRequest('post', '/api/listings/package-types/', data); // expects { name, description }
export const updatePackageType = (id, data) => authRequest('put', `/api/listings/package-types/${id}/`, data); // expects { name, description }
export const patchPackageType = (id, data) => authRequest('patch', `/api/listings/package-types/${id}/`, data);
export const deletePackageType = (id) => authRequest('delete', `/api/listings/package-types/${id}/`); 

// ID Types
export const fetchIDTypes = (page = 1) => authRequest('get', `/api/users/id-types/?page=${page}`);
export const createIDType = (data) => authRequest('post', '/api/users/id-types/', data); // expects { name, description }
export const updateIDType = (id, data) => authRequest('put', `/api/users/id-types/${id}/`, data); // expects { name, description }
export const patchIDType = (id, data) => authRequest('patch', `/api/users/id-types/${id}/`, data);
export const deleteIDType = (id) => authRequest('delete', `/api/users/id-types/${id}/`); 