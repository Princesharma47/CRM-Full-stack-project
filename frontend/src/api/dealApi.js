import API from './axios';

// All calls use the shared axios instance — JWT auto-attached via interceptor
// /summary must be registered BEFORE /:id to avoid Express matching "summary" as an ID
export const fetchDeals   = (params = {}) => API.get('/deals', { params });
export const fetchSummary = ()            => API.get('/deals/summary');
export const createDeal   = (data)        => API.post('/deals', data);
export const updateDeal   = (id, data)    => API.put(`/deals/${id}`, data);
export const deleteDeal   = (id)          => API.delete(`/deals/${id}`);
