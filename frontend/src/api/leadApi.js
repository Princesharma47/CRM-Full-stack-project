import API from './axios';

// All calls go through the shared axios instance which auto-attaches the JWT token

export const fetchLeads  = (params = {}) => API.get('/leads', { params });
export const fetchLead   = (id)          => API.get(`/leads/${id}`);
export const createLead  = (data)        => API.post('/leads', data);
export const updateLead  = (id, data)    => API.put(`/leads/${id}`, data);
export const deleteLead  = (id)          => API.delete(`/leads/${id}`);
