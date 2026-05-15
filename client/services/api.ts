import { apiClient } from '../lib/apiClient';

// -- Catalog & Services API --
export const ServiceAPI = {
  getCatalogServices: () => apiClient.get<any>('/api/catalog/services'),
  getAdminServices: () => apiClient.get<any>('/api/admin/services'),
  getAdminService: (id: string) => apiClient.get<any>(`/api/admin/services/${id}`),
  createAdminService: (data: any) => apiClient.post<any>('/api/admin/services', data),
  updateAdminService: (id: string, data: any) => apiClient.put<any>(`/api/admin/services/${id}`, data),
  patchAdminService: (id: string, data: any) => apiClient.post<any>(`/api/admin/services/${id}`, data, { method: 'PATCH' }),
  deleteAdminService: (id: string) => apiClient.delete<any>(`/api/admin/services/${id}`),
  syncSquare: () => apiClient.post<any>('/api/admin/sync-square'),
  removeAllDuplicates: () => apiClient.post<any>('/api/admin/remove-all-duplicates'),
  getLogs: (limit = 10) => apiClient.get<any>(`/api/admin/logs?limit=${limit}`)
};

// -- Booking & Availability API --
export const BookingAPI = {
  getAvailability: (start: string, end: string, serviceVariationIds: string[]) => 
    apiClient.get<any>(`/api/availability?start=${start}&end=${end}&serviceVariationIds=${serviceVariationIds.join(',')}`),
  createBooking: (data: any) => apiClient.post<any>('/api/bookings', data),
  createPayment: (data: any) => apiClient.post<any>('/api/payments', data)
};

// -- Quotes & Funnel API --
export const QuoteAPI = {
  submitQuote: (data: any) => apiClient.post<any>('/api/quote', data),
  logFunnelStep: (data: { step: string; details?: any }) => apiClient.post<any>('/api/analytics/funnel', data)
};

// -- Blog API --
export const BlogAPI = {
  getPosts: () => apiClient.get<any>('/api/blog/posts'),
  getPost: (id: string) => apiClient.get<any>(`/api/blog/posts/${id}`),
  createPost: (data: any) => apiClient.post<any>('/api/blog/posts', data),
  updatePost: (id: string, data: any) => apiClient.put<any>(`/api/blog/posts/${id}`, data),
  deletePost: (id: string) => apiClient.delete<any>(`/api/blog/posts/${id}`)
};

// -- FAQ API --
export const FAQAPI = {
  getFaqs: () => apiClient.get<any>('/api/faqs'),
  createFaq: (data: any) => apiClient.post<any>('/api/faqs', data),
  updateFaq: (id: string, data: any) => apiClient.put<any>(`/api/faqs/${id}`, data),
  deleteFaq: (id: string) => apiClient.delete<any>(`/api/faqs/${id}`)
};

// -- Weather API --
export const WeatherAPI = {
  checkWeather: (date: string) => apiClient.post<any>('/api/weather/check', { date })
};

// -- Reviews API --
export const ReviewsAPI = {
  getReviews: () => apiClient.get<any>('/api/reviews')
};
