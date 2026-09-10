import api from './axios';

export const getAnalytics = () => api.get('/admin/analytics');

export const trackActivity = (data) => api.post('/admin/analytics/track', data);