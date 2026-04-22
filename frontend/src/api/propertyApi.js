import API from './axios';

// All requests go through the shared axios instance (auto-attaches JWT)
// For multipart/form-data (image uploads), axios sets Content-Type automatically when FormData is passed

export const fetchProperties = (params = {}) => API.get('/properties', { params });
export const fetchProperty   = (id)          => API.get(`/properties/${id}`);
export const createProperty  = (formData)    => API.post('/properties', formData);
export const updateProperty  = (id, formData)=> API.put(`/properties/${id}`, formData);
export const deleteProperty  = (id)          => API.delete(`/properties/${id}`);
export const deleteImage     = (id, filename)=> API.delete(`/properties/${id}/image/${filename}`);
