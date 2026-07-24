import { apiClient } from '../lib/apiClient';
import { workerApiUrl } from '../lib/apiBase';

// -- Catalog & Services API --
export const ServiceAPI = {
  getCatalogServices: () => apiClient.get<any>(workerApiUrl('/api/catalog/services')),
  getAdminServices: () => apiClient.get<any>(workerApiUrl('/api/admin/services')),
  getAdminService: (id: string) => apiClient.get<any>(workerApiUrl(`/api/admin/services/${id}`)),
  createAdminService: (data: any) => apiClient.post<any>(workerApiUrl('/api/admin/services'), data),
  updateAdminService: (id: string, data: any) => apiClient.put<any>(workerApiUrl(`/api/admin/services/${id}`), data),
  patchAdminService: (id: string, data: any) => apiClient.post<any>(workerApiUrl(`/api/admin/services/${id}`), data, { method: 'PATCH' }),
  deleteAdminService: (id: string) => apiClient.delete<any>(workerApiUrl(`/api/admin/services/${id}`)),
  previewSquareSync: () => apiClient.post<any>(workerApiUrl('/api/admin/sync-square/preview')),
  syncSquare: (planHash: string) => apiClient.post<any>(workerApiUrl('/api/admin/sync-square'), { confirm: true, planHash }),
  removeAllDuplicates: () => apiClient.post<any>(workerApiUrl('/api/admin/remove-all-duplicates')),
  getLogs: (limit = 10) => apiClient.get<any>(workerApiUrl(`/api/admin/logs?limit=${limit}`))
};

// -- Booking & Availability API --
export const BookingAPI = {
  getAvailability: (start: string, end: string, serviceVariationIds: string[]) => 
    apiClient.get<any>(workerApiUrl(`/api/availability?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}&serviceVariationIds=${encodeURIComponent(serviceVariationIds.join(','))}`)),
  createBooking: (data: any) => apiClient.post<any>(workerApiUrl('/api/bookings'), data),
  createPayment: (data: any) => apiClient.post<any>('/api/payments', data)
};

// -- Quotes & Funnel API --
export const QuoteAPI = {
  submitQuote: (data: any) => apiClient.post<any>(workerApiUrl('/api/quote'), data),
  logFunnelStep: (data: { step: string; details?: any }) => apiClient.post<any>(workerApiUrl('/api/analytics/funnel'), data)
};

// -- Blog API --
export const BlogAPI = {
  getPosts: () => apiClient.get<any>(workerApiUrl('/api/blog/posts')),
  getPost: (slug: string) => apiClient.get<any>(workerApiUrl(`/api/blog/posts/${encodeURIComponent(slug)}`)),
  getAdminPosts: () => apiClient.get<any>(workerApiUrl('/api/admin/blog/posts')),
  getAdminStorage: () => apiClient.get<any>(workerApiUrl('/api/admin/blog/storage')),
  createPost: (data: any) => apiClient.post<any>(workerApiUrl('/api/admin/blog/posts'), data),
  updatePost: (id: string, data: any) => apiClient.put<any>(workerApiUrl(`/api/admin/blog/posts/${id}`), data),
  deletePost: (id: string) => apiClient.delete<any>(workerApiUrl(`/api/admin/blog/posts/${id}`))
};

// -- FAQ API --
export const FAQAPI = {
  getFaqs: () => apiClient.get<any>(workerApiUrl('/api/faqs')),
  createFaq: (data: any) => apiClient.post<any>(workerApiUrl('/api/admin/faqs'), data),
  updateFaq: (id: string, data: any) => apiClient.put<any>(workerApiUrl(`/api/admin/faqs/${id}`), data),
  deleteFaq: (id: string) => apiClient.delete<any>(workerApiUrl(`/api/admin/faqs/${id}`))
};

// -- Weather API --
export const WeatherAPI = {
  checkWeather: (date: string) => apiClient.post<any>('/api/weather/check', { date })
};

// -- Reviews API --
export const ReviewsAPI = {
  getReviews: () => apiClient.get<any>(workerApiUrl('/api/reviews'))
};
