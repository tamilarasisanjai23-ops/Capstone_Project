// Unified API Service with Backend Integration & LocalStorage Fallback
import {
  authService as localAuth,
  volunteerService as localVolunteers,
  disasterService as localDisasters,
  reliefCenterService as localShelters,
  taskService as localTasks,
  resourceService as localResources,
  locationService as localLocations,
  notificationService as localNotifications,
  reportsService as localReports,
  emergencyAlertService as localEmergencyAlerts,
  voiceAlertService as localVoiceAlerts,
  sosAlertService as localSosAlerts,
  radioChannelService as localRadioChannels,
  volunteerLocationService as localVolunteerLocations
} from './storageService';

const BASE_URL = '/api';

// Helper to determine if backend is available
const fetchWithFallback = async (endpoint, options = {}, fallbackFn) => {
  try {
    const token = localAuth.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    // If backend request fails, gracefully fallback to LocalStorage Service
    if (fallbackFn) {
      return fallbackFn();
    }
    throw err;
  }
};

export const apiService = {
  // Auth API
  login: async (credentials) => {
    return fetchWithFallback('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }, () => localAuth.login(credentials.email, credentials.password));
  },
  register: async (userData) => {
    return fetchWithFallback('/auth/register', { method: 'POST', body: JSON.stringify(userData) }, () => localAuth.register(userData));
  },
  logout: () => localAuth.logout(),
  getCurrentUser: () => localAuth.getCurrentUser(),

  // Volunteers API
  getVolunteers: async () => {
    return fetchWithFallback('/volunteers', {}, () => localVolunteers.getAll());
  },
  getVolunteerById: async (id) => {
    return fetchWithFallback(`/volunteers/${id}`, {}, () => localVolunteers.getById(id));
  },
  createVolunteer: async (data) => {
    return fetchWithFallback(
      '/volunteers',
      { method: 'POST', body: JSON.stringify(data) },
      () => localVolunteers.create(data)
    );
  },
  updateVolunteer: async (id, data) => {
    return fetchWithFallback(
      `/volunteers/${id}`,
      { method: 'PUT', body: JSON.stringify(data) },
      () => localVolunteers.update(id, data)
    );
  },
  deleteVolunteer: async (id) => {
    return fetchWithFallback(
      `/volunteers/${id}`,
      { method: 'DELETE' },
      () => localVolunteers.delete(id)
    );
  },

  // Disasters API
  getDisasters: async () => {
    return fetchWithFallback('/disasters', {}, () => localDisasters.getAll());
  },
  getDisasterById: async (id) => {
    return fetchWithFallback(`/disasters/${id}`, {}, () => localDisasters.getById(id));
  },
  createDisaster: async (data) => {
    return fetchWithFallback(
      '/disasters',
      { method: 'POST', body: JSON.stringify(data) },
      () => localDisasters.create(data)
    );
  },
  updateDisaster: async (id, data) => {
    return fetchWithFallback(
      `/disasters/${id}`,
      { method: 'PUT', body: JSON.stringify(data) },
      () => localDisasters.update(id, data)
    );
  },

  // Tasks API
  getTasks: async () => {
    return fetchWithFallback('/tasks', {}, () => localTasks.getAll());
  },
  getTaskById: async (id) => {
    return fetchWithFallback(`/tasks/${id}`, {}, () => localTasks.getById(id));
  },
  createTask: async (data) => {
    return fetchWithFallback(
      '/tasks',
      { method: 'POST', body: JSON.stringify(data) },
      () => localTasks.create(data)
    );
  },
  updateTaskStatus: async (taskId, status) => {
    return fetchWithFallback(
      `/tasks/${taskId}/status?status=${status}`,
      { method: 'PATCH' },
      () => localTasks.updateStatus(taskId, status)
    );
  },
  assignTask: async (taskId, volunteerId) => {
    return fetchWithFallback(
      `/tasks/${taskId}/assign?volunteerId=${volunteerId}`,
      { method: 'POST' },
      () => localTasks.assignVolunteer(taskId, volunteerId)
    );
  },
  deleteTask: async (id) => {
    return fetchWithFallback(
      `/tasks/${id}`,
      { method: 'DELETE' },
      () => localTasks.delete(id)
    );
  },

  // Resources API
  getResources: async () => {
    return fetchWithFallback('/resources', {}, () => localResources.getAll());
  },
  createResource: async (data) => {
    return fetchWithFallback(
      '/resources',
      { method: 'POST', body: JSON.stringify(data) },
      () => localResources.create(data)
    );
  },
  updateResource: async (id, data) => {
    return fetchWithFallback(
      `/resources/${id}`,
      { method: 'PUT', body: JSON.stringify(data) },
      () => localResources.update(id, data)
    );
  },
  deleteResource: async (id) => {
    return fetchWithFallback(
      `/resources/${id}`,
      { method: 'DELETE' },
      () => localResources.delete(id)
    );
  },

  // Relief Centers / Shelters API
  getReliefCenters: async () => {
    return fetchWithFallback('/relief-centers', {}, () => localShelters.getAll());
  },
  createReliefCenter: async (data) => {
    return fetchWithFallback(
      '/relief-centers',
      { method: 'POST', body: JSON.stringify(data) },
      () => localShelters.create(data)
    );
  },
  updateReliefCenter: async (id, data) => {
    return fetchWithFallback(
      `/relief-centers/${id}`,
      { method: 'PUT', body: JSON.stringify(data) },
      () => localShelters.update(id, data)
    );
  },
  deleteReliefCenter: async (id) => {
    return fetchWithFallback(
      `/relief-centers/${id}`,
      { method: 'DELETE' },
      () => localShelters.delete(id)
    );
  },

  // Locations API
  getLocations: async () => {
    return fetchWithFallback('/locations', {}, () => localLocations.getAll());
  },
  createLocation: async (data) => {
    return fetchWithFallback(
      '/locations',
      { method: 'POST', body: JSON.stringify(data) },
      () => localLocations.create(data)
    );
  },
  deleteLocation: async (id) => {
    return fetchWithFallback(
      `/locations/${id}`,
      { method: 'DELETE' },
      () => localLocations.delete(id)
    );
  },

  // Notifications API
  getNotifications: async (userId) => {
    return fetchWithFallback('/notifications', {}, () => localNotifications.getAllForUser(userId));
  },
  createNotification: async (data) => {
    return fetchWithFallback(
      '/notifications',
      { method: 'POST', body: JSON.stringify(data) },
      () => localNotifications.create(data)
    );
  },
  markNotificationAsRead: async (id) => {
    return fetchWithFallback(
      `/notifications/${id}/read`,
      { method: 'PATCH' },
      () => localNotifications.markAsRead(id)
    );
  },

  // Reports Summary API
  getReportsSummary: async () => {
    return fetchWithFallback('/reports/summary', {}, () => localReports.getSummaryMetrics());
  },

  // --- NEW EMERGENCY RESPONSE APIs ---

  // Emergency Alerts API
  getEmergencyAlerts: async () => {
    return fetchWithFallback('/emergency-alerts', {}, () => localEmergencyAlerts.getAll());
  },
  createEmergencyAlert: async (data) => {
    return fetchWithFallback(
      '/emergency-alerts',
      { method: 'POST', body: JSON.stringify(data) },
      () => localEmergencyAlerts.create(data)
    );
  },
  deleteEmergencyAlert: async (id) => {
    return fetchWithFallback(
      `/emergency-alerts/${id}`,
      { method: 'DELETE' },
      () => localEmergencyAlerts.delete(id)
    );
  },

  // Voice Alerts API
  getVoiceAlerts: async () => {
    return fetchWithFallback('/voice-alerts', {}, () => localVoiceAlerts.getAll());
  },
  createVoiceAlert: async (data) => {
    return fetchWithFallback(
      '/voice-alerts',
      { method: 'POST', body: JSON.stringify(data) },
      () => localVoiceAlerts.create(data)
    );
  },
  deleteVoiceAlert: async (id) => {
    return fetchWithFallback(
      `/voice-alerts/${id}`,
      { method: 'DELETE' },
      () => localVoiceAlerts.delete(id)
    );
  },

  // SOS Alerts API
  getSosAlerts: async () => {
    return fetchWithFallback('/sos-alerts', {}, () => localSosAlerts.getAll());
  },
  createSosAlert: async (data) => {
    return fetchWithFallback(
      '/sos-alerts',
      { method: 'POST', body: JSON.stringify(data) },
      () => localSosAlerts.create(data)
    );
  },
  updateSosStatus: async (id, status) => {
    return fetchWithFallback(
      `/sos-alerts/${id}/status?status=${status}`,
      { method: 'PUT' },
      () => localSosAlerts.updateStatus(id, status)
    );
  },

  // Emergency Radio Channels API
  getRadioChannels: async () => {
    return fetchWithFallback('/radio-channels', {}, () => localRadioChannels.getAll());
  },

  // Volunteer Locations API
  getVolunteerLocations: async () => {
    return fetchWithFallback('/volunteer-locations', {}, () => localVolunteerLocations.getAll());
  },
  updateVolunteerLocation: async (data) => {
    return fetchWithFallback(
      '/volunteer-locations',
      { method: 'POST', body: JSON.stringify(data) },
      () => localVolunteerLocations.updateLocation(data)
    );
  }
};

export default apiService;
