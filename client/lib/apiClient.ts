import { getSquareHeaders } from "./config";

class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function fetchWrapper<T>(url: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  
  // Merge default headers with custom options
  const headers: any = {
    ...getSquareHeaders(),
    ...options.headers,
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  } else {
    // Let browser set the correct multipart/form-data boundary
    delete headers["Content-Type"];
  }

  const response = await fetch(url, { ...options, headers });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  if (!response.ok) {
    throw new ApiError(data?.error || response.statusText || "An error occurred", response.status, data);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(url: string, options?: RequestInit) => fetchWrapper<T>(url, { ...options, method: 'GET' }),
  post: <T>(url: string, body?: any, options?: RequestInit) => fetchWrapper<T>(url, { ...options, method: 'POST', body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined) }),
  put: <T>(url: string, body?: any, options?: RequestInit) => fetchWrapper<T>(url, { ...options, method: 'PUT', body: body instanceof FormData ? body : (body ? JSON.stringify(body) : undefined) }),
  delete: <T>(url: string, options?: RequestInit) => fetchWrapper<T>(url, { ...options, method: 'DELETE' }),
};
