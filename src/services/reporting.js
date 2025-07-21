import axios from 'axios';
import { getValidAccessToken } from './auth';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000';
const METRICS_BASE = `${BASE_URL}/api/admin/metrics`;

async function authGet(endpoint) {
  const token = await getValidAccessToken();
  if (!token) throw new Error('Not authenticated');
  const res = await axios.get(`${METRICS_BASE}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export const getTotalUsers = () => authGet('/total_users/');
export const getNewUsers = () => authGet('/new_users/');
export const getVerifiedTravelers = () => authGet('/verified_travelers/');
export const getTotalTrips = () => authGet('/total_trips/');
export const getTripsPerDay = () => authGet('/trips_per_day/');
export const getTripsPerWeek = () => authGet('/trips_per_week/');
export const getTripsPerMonth = () => authGet('/trips_per_month/');
export const getTripsPerYear = () => authGet('/trips_per_year/');
export const getAvgPricePerKg = () => authGet('/avg_price_per_kg/');
export const getTotalKgOffered = () => authGet('/total_kg_offered/');
export const getRoutes = () => authGet('/routes/');
export const getTotalPackageRequests = () => authGet('/total_package_requests/');
export const getPackageStatusDistribution = () => authGet('/package_status_distribution/');
export const getOffersPerTrip = () => authGet('/offers_per_trip/');
export const getTotalKgSold = () => authGet('/total_kg_sold/');
export const getKgSoldVsAvailable = () => authGet('/kg_sold_vs_available/');
export const getOfferToMessageRatio = () => authGet('/offer_to_message_ratio/');
export const getDauWauMau = () => authGet('/dau_wau_mau/');
export const getTripCreatorsVsSenders = () => authGet('/trip_creators_vs_senders/');
export const getAvgTimeToFirstPackageRequest = () => authGet('/avg_time_to_first_package_request/');
export const getPackageRequestResponseTimeBuckets = () => authGet('/package_request_response_time_buckets/');
export const getRouteSaturation = () => authGet('/route_saturation/');
export const getCancellationDisputeRates = () => authGet('/cancellation_dispute_rates/');
export const getFunnelConversion = () => authGet('/funnel_conversion/');
export const getDashboardData = () => authGet('/dashboard_data/'); 