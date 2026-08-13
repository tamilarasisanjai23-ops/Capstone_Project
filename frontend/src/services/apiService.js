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
  reportsService as localReports
} from './storageService';

const BASE_URL = '/api';

// Helper to determine if backend is available
const fetchWithFallback = async (endpoint, options = {}, fallbackFn) => {
  try {
    const token = localAuth.getToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    };

    const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
    if (!res.ok) {
      // If server returns error, fallback to local storage function
      return fallbackFn();
    }
    return await res.json();
  } catch (err) {
    // Network error / backend not running -> use fallback
    return fallbackFn();
  }
};

export const apiService = {
  // Auth API
  login: async (email, password) => {
    return fetchWithFallback(
      '/auth/login',
      { method: 'POST', body: JSON.stringify({ email, password }) },
      () => localAuth.login(email, password)
    );
  },

  register: async (data) => {
    return fetchWithFallback(
      '/auth/register',
      { method: 'POST', body: JSON.stringify(data) },
      () => localAuth.register(data)
    );
  },

  // Volunteers API
  getVolunteers: async () => {
    return fetchWithFallback('/volunteers', {}, () => localVolunteers.getAll());
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

  deleteDisaster: async (id) => {
    return fetchWithFallback(
      `/disasters/${id}`,
      { method: 'DELETE' },
      () => localDisasters.delete(id)
    );
  },

  // Tasks API
  getTasks: async () => {
    return fetchWithFallback('/tasks', {}, () => localTasks.getAll());
  },

  createTask: async (data) => {
    return fetchWithFallback(
      '/tasks',
      { method: 'POST', body: JSON.stringify(data) },
      () => localTasks.create(data)
    );
  },

  updateTaskStatus: async (id, status) => {
    return fetchWithFallback(
      `/tasks/${id}/status`,
      { method: 'PATCH', body: JSON.stringify({ status }) },
      () => localTasks.updateStatus(id, status)
    );
  },

  assignTaskVolunteer: async (id, volunteerId) => {
    return fetchWithFallback(
      `/tasks/${id}/assign`,
      { method: 'POST', body: JSON.stringify({ volunteerId }) },
      () => localTasks.assignVolunteer(id, volunteerId)
    );
  },

  updateTask: async (id, data) => {
    return fetchWithFallback(
      `/tasks/${id}`,
      { method: 'PUT', body: JSON.stringify(data) },
      () => localTasks.update(id, data)
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

  // Relief Centers API
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

  updateLocation: async (id, data) => {
    return fetchWithFallback(
      `/locations/${id}`,
      { method: 'PUT', body: JSON.stringify(data) },
      () => localLocations.update(id, data)
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
  }
};
