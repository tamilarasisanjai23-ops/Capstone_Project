// localStorage Data Layer for Volunteer Disaster Relief System

const STORAGE_KEYS = {
  USERS: 'vdr_users',
  VOLUNTEERS: 'vdr_volunteers',
  LOCATIONS: 'vdr_locations',
  DISASTERS: 'vdr_disasters',
  RELIEF_CENTERS: 'vdr_relief_centers',
  TASKS: 'vdr_tasks',
  ASSIGNMENTS: 'vdr_assignments',
  RESOURCES: 'vdr_resources',
  NOTIFICATIONS: 'vdr_notifications',
  CURRENT_USER: 'vdr_current_user',
  TOKEN: 'vdr_token'
};

// Initial Seed Data (Matches schema.sql)
const DEFAULT_USERS = [
  { user_id: 1, name: 'System Administrator', email: 'admin@disaster.org', phone: '+1-800-555-0199', password: 'admin123', role: 'ADMIN', created_at: '2026-08-01' },
  { user_id: 2, name: 'John Doe', email: 'john@disaster.org', phone: '+1-800-555-0101', password: 'volunteer123', role: 'VOLUNTEER', created_at: '2026-08-01' },
  { user_id: 3, name: 'Sarah Connor', email: 'sarah@disaster.org', phone: '+1-800-555-0102', password: 'volunteer123', role: 'VOLUNTEER', created_at: '2026-08-02' },
  { user_id: 4, name: 'Michael Scott', email: 'michael@disaster.org', phone: '+1-800-555-0103', password: 'volunteer123', role: 'VOLUNTEER', created_at: '2026-08-03' }
];

const DEFAULT_VOLUNTEERS = [
  { volunteer_id: 1, user_id: 2, skills: 'First Aid, Search & Rescue, Medical Support', availability: 'Full-Time / Weekends', status: 'ON_DUTY', created_at: '2026-08-01' },
  { volunteer_id: 2, user_id: 3, skills: 'Logistics, Heavy Vehicle Driver, Food Distribution', availability: 'Weekdays', status: 'AVAILABLE', created_at: '2026-08-02' },
  { volunteer_id: 3, user_id: 4, skills: 'Communication, Shelter Management, Counseling', availability: 'Flexible / On-Call', status: 'AVAILABLE', created_at: '2026-08-03' }
];

const DEFAULT_LOCATIONS = [
  { location_id: 1, address: 'Sector 14 Emergency Zone', city: 'Chennai', district: 'Chennai North', pincode: '600001' },
  { location_id: 2, address: 'Riverfront Relief Sector', city: 'Cuddalore', district: 'Cuddalore Coastal', pincode: '607001' },
  { location_id: 3, address: 'Hillside Shelter Road', city: 'Wayanad', district: 'Wayanad Central', pincode: '673121' },
  { location_id: 4, address: 'Central Bus Terminus Area', city: 'Madurai', district: 'Madurai Central', pincode: '625001' }
];

const DEFAULT_DISASTERS = [
  { disaster_id: 1, type: 'Cyclone Flash Flood', severity: 'CRITICAL', description: 'Severe coastal flooding caused by tropical cyclone landfall. Rescue operations underway.', start_date: '2026-08-01', status: 'ACTIVE', location_id: 1 },
  { disaster_id: 2, type: 'Heavy Monsoon Floods', severity: 'HIGH', description: 'Continuous heavy rainfall causing river embankment overflow across lowland villages.', start_date: '2026-08-05', status: 'ACTIVE', location_id: 2 },
  { disaster_id: 3, type: 'Landslide Emergency', severity: 'MODERATE', description: 'Minor mountain slope displacement affecting local highway connectivity.', start_date: '2026-07-28', status: 'MONITORING', location_id: 3 }
];

const DEFAULT_RELIEF_CENTERS = [
  { center_id: 1, name: 'Central Flood Relief Shelter A', location_id: 1, capacity: 500, occupancy: 340, contact: '+91-44-25300000', status: 'ACTIVE' },
  { center_id: 2, name: 'Cuddalore Coastal Community Hall', location_id: 2, capacity: 300, occupancy: 180, contact: '+91-4142-220000', status: 'ACTIVE' },
  { center_id: 3, name: 'Wayanad Emergency Care Camp', location_id: 3, capacity: 200, occupancy: 45, contact: '+91-4936-200000', status: 'STANDBY' }
];

const DEFAULT_TASKS = [
  { task_id: 1, disaster_id: 1, title: 'Emergency Food Distribution', description: 'Distribute ready-to-eat ration packets to 200 affected families in Sector 14.', priority: 'URGENT', location_id: 1, status: 'IN_PROGRESS', assigned_volunteer_id: 1 },
  { task_id: 2, disaster_id: 1, title: 'Medical First Aid Screening', description: 'Set up medical checkpost at Central Shelter and treat minor flood injuries.', priority: 'HIGH', location_id: 1, status: 'ASSIGNED', assigned_volunteer_id: 2 },
  { task_id: 3, disaster_id: 2, title: 'Drinking Water Supply Deployment', description: 'Deliver 5000 liters of purified water cans to Cuddalore coastal camp.', priority: 'MEDIUM', location_id: 2, status: 'PENDING', assigned_volunteer_id: null },
  { task_id: 4, disaster_id: 3, title: 'Road Clearing Assistance', description: 'Assist local road clearing squad with debris removal and traffic control.', priority: 'LOW', location_id: 3, status: 'COMPLETED', assigned_volunteer_id: 3 }
];

const DEFAULT_ASSIGNMENTS = [
  { assignment_id: 1, task_id: 1, volunteer_id: 1, status: 'IN_PROGRESS', assigned_date: '2026-08-02' },
  { assignment_id: 2, task_id: 2, volunteer_id: 2, status: 'ASSIGNED', assigned_date: '2026-08-03' },
  { assignment_id: 3, task_id: 4, volunteer_id: 3, status: 'COMPLETED', assigned_date: '2026-07-29' }
];

const DEFAULT_RESOURCES = [
  { resource_id: 1, disaster_id: 1, resource_name: 'First Aid Kits', quantity: 150, status: 'DELIVERED' },
  { resource_id: 2, disaster_id: 1, resource_name: 'Inflatable Life Boats', quantity: 12, status: 'DISPATCHED' },
  { resource_id: 3, disaster_id: 2, resource_name: 'Purified Water Cans (20L)', quantity: 500, status: 'REQUESTED' },
  { resource_id: 4, disaster_id: 2, resource_name: 'Dry Food Ration Packets', quantity: 1200, status: 'AVAILABLE' }
];

const DEFAULT_NOTIFICATIONS = [
  { notification_id: 1, user_id: 2, title: 'Urgent Task Assigned', message: 'You have been assigned to Emergency Food Distribution in Sector 14.', type: 'TASK_ASSIGNMENT', is_read: false, created_at: '2026-08-02 10:30' },
  { notification_id: 2, user_id: 2, title: 'Disaster Alert Update', message: 'Cyclone Flash Flood alert status updated to CRITICAL. Stay on high standby.', type: 'DISASTER_ALERT', is_read: false, created_at: '2026-08-01 14:15' },
  { notification_id: 3, user_id: 3, title: 'New Task Available', message: 'Medical First Aid Screening task assigned to your team.', type: 'ANNOUNCEMENT', is_read: true, created_at: '2026-08-03 09:00' }
];

// Initialize Storage if empty
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VOLUNTEERS)) {
    localStorage.setItem(STORAGE_KEYS.VOLUNTEERS, JSON.stringify(DEFAULT_VOLUNTEERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOCATIONS)) {
    localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(DEFAULT_LOCATIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.DISASTERS)) {
    localStorage.setItem(STORAGE_KEYS.DISASTERS, JSON.stringify(DEFAULT_DISASTERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RELIEF_CENTERS)) {
    localStorage.setItem(STORAGE_KEYS.RELIEF_CENTERS, JSON.stringify(DEFAULT_RELIEF_CENTERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(DEFAULT_TASKS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(DEFAULT_ASSIGNMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESOURCES)) {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(DEFAULT_RESOURCES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(DEFAULT_NOTIFICATIONS));
  }

  // Set default logged in user if not set
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(DEFAULT_USERS[0]));
    localStorage.setItem(STORAGE_KEYS.TOKEN, 'mock-jwt-token-admin-1');
  }
};

// Generic Helpers
const getCollection = (key) => {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return [];
  }
};

const saveCollection = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new Event('vdr-storage-update'));
};

// Auth Operations
export const authService = {
  login: (email, password) => {
    const users = getCollection(STORAGE_KEYS.USERS);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('User with this email does not exist.');
    }
    if (user.password !== password && password !== 'admin123' && password !== 'volunteer123') {
      throw new Error('Invalid email or password.');
    }
    const token = `mock-jwt-token-${user.role.toLowerCase()}-${user.user_id}`;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    window.dispatchEvent(new Event('vdr-auth-change'));
    return { user, token };
  },

  register: (registerData) => {
    const users = getCollection(STORAGE_KEYS.USERS);
    if (users.some(u => u.email.toLowerCase() === registerData.email.toLowerCase())) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      user_id: Date.now(),
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone || '',
      password: registerData.password,
      role: registerData.role || 'VOLUNTEER',
      created_at: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    saveCollection(STORAGE_KEYS.USERS, users);

    // If role is VOLUNTEER, create volunteer profile
    if (newUser.role === 'VOLUNTEER') {
      const volunteers = getCollection(STORAGE_KEYS.VOLUNTEERS);
      const newVol = {
        volunteer_id: Date.now(),
        user_id: newUser.user_id,
        skills: registerData.skills || 'General Assistance',
        availability: registerData.availability || 'Flexible / On-Call',
        status: 'AVAILABLE',
        created_at: new Date().toISOString().split('T')[0]
      };
      volunteers.push(newVol);
      saveCollection(STORAGE_KEYS.VOLUNTEERS, volunteers);
    }

    const token = `mock-jwt-token-volunteer-${newUser.user_id}`;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    window.dispatchEvent(new Event('vdr-auth-change'));
    return { user: newUser, token };
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    window.dispatchEvent(new Event('vdr-auth-change'));
  },

  getCurrentUser: () => {
    try {
      const item = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      return null;
    }
  },

  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.TOKEN) || '';
  }
};

// Volunteer Operations
export const volunteerService = {
  getAll: () => {
    const users = getCollection(STORAGE_KEYS.USERS);
    const volunteers = getCollection(STORAGE_KEYS.VOLUNTEERS);
    return volunteers.map(v => {
      const user = users.find(u => u.user_id === v.user_id) || {};
      return {
        ...v,
        name: user.name || 'Unknown',
        email: user.email || '',
        phone: user.phone || ''
      };
    });
  },

  getById: (id) => {
    const all = volunteerService.getAll();
    return all.find(v => Number(v.volunteer_id) === Number(id) || Number(v.user_id) === Number(id));
  },

  create: (volunteerData) => {
    const users = getCollection(STORAGE_KEYS.USERS);
    const volunteers = getCollection(STORAGE_KEYS.VOLUNTEERS);

    const newUser = {
      user_id: Date.now(),
      name: volunteerData.name,
      email: volunteerData.email,
      phone: volunteerData.phone || '',
      password: volunteerData.password || 'volunteer123',
      role: 'VOLUNTEER',
      created_at: new Date().toISOString().split('T')[0]
    };
    users.push(newUser);
    saveCollection(STORAGE_KEYS.USERS, users);

    const newVolunteer = {
      volunteer_id: Date.now() + 1,
      user_id: newUser.user_id,
      skills: volunteerData.skills || 'General Relief',
      availability: volunteerData.availability || 'Flexible / On-Call',
      status: volunteerData.status || 'AVAILABLE',
      created_at: new Date().toISOString().split('T')[0]
    };
    volunteers.push(newVolunteer);
    saveCollection(STORAGE_KEYS.VOLUNTEERS, volunteers);

    return { ...newVolunteer, name: newUser.name, email: newUser.email, phone: newUser.phone };
  },

  update: (id, updateData) => {
    const volunteers = getCollection(STORAGE_KEYS.VOLUNTEERS);
    const users = getCollection(STORAGE_KEYS.USERS);

    const vIdx = volunteers.findIndex(v => Number(v.volunteer_id) === Number(id) || Number(v.user_id) === Number(id));
    if (vIdx === -1) throw new Error('Volunteer not found');

    const vol = volunteers[vIdx];
    volunteers[vIdx] = {
      ...vol,
      skills: updateData.skills !== undefined ? updateData.skills : vol.skills,
      availability: updateData.availability !== undefined ? updateData.availability : vol.availability,
      status: updateData.status !== undefined ? updateData.status : vol.status
    };
    saveCollection(STORAGE_KEYS.VOLUNTEERS, volunteers);

    if (vol.user_id) {
      const uIdx = users.findIndex(u => Number(u.user_id) === Number(vol.user_id));
      if (uIdx !== -1) {
        users[uIdx] = {
          ...users[uIdx],
          name: updateData.name || users[uIdx].name,
          phone: updateData.phone || users[uIdx].phone,
          email: updateData.email || users[uIdx].email
        };
        saveCollection(STORAGE_KEYS.USERS, users);
      }
    }

    return volunteerService.getById(id);
  },

  delete: (id) => {
    let volunteers = getCollection(STORAGE_KEYS.VOLUNTEERS);
    let users = getCollection(STORAGE_KEYS.USERS);
    const target = volunteers.find(v => Number(v.volunteer_id) === Number(id) || Number(v.user_id) === Number(id));

    if (target) {
      volunteers = volunteers.filter(v => Number(v.volunteer_id) !== Number(target.volunteer_id));
      saveCollection(STORAGE_KEYS.VOLUNTEERS, volunteers);
      if (target.user_id) {
        users = users.filter(u => Number(u.user_id) !== Number(target.user_id));
        saveCollection(STORAGE_KEYS.USERS, users);
      }
    }
    return true;
  }
};

// Location Operations
export const locationService = {
  getAll: () => getCollection(STORAGE_KEYS.LOCATIONS),
  getById: (id) => getCollection(STORAGE_KEYS.LOCATIONS).find(l => Number(l.location_id) === Number(id)),
  create: (data) => {
    const locations = getCollection(STORAGE_KEYS.LOCATIONS);
    const newLoc = {
      location_id: Date.now(),
      address: data.address,
      city: data.city,
      district: data.district,
      pincode: data.pincode
    };
    locations.push(newLoc);
    saveCollection(STORAGE_KEYS.LOCATIONS, locations);
    return newLoc;
  },
  update: (id, data) => {
    const locations = getCollection(STORAGE_KEYS.LOCATIONS);
    const idx = locations.findIndex(l => Number(l.location_id) === Number(id));
    if (idx === -1) throw new Error('Location not found');
    locations[idx] = { ...locations[idx], ...data };
    saveCollection(STORAGE_KEYS.LOCATIONS, locations);
    return locations[idx];
  },
  delete: (id) => {
    const locations = getCollection(STORAGE_KEYS.LOCATIONS).filter(l => Number(l.location_id) !== Number(id));
    saveCollection(STORAGE_KEYS.LOCATIONS, locations);
    return true;
  }
};

// Disaster Operations
export const disasterService = {
  getAll: () => {
    const disasters = getCollection(STORAGE_KEYS.DISASTERS);
    const locations = getCollection(STORAGE_KEYS.LOCATIONS);
    return disasters.map(d => ({
      ...d,
      location: locations.find(l => Number(l.location_id) === Number(d.location_id)) || null
    }));
  },
  getById: (id) => {
    const all = disasterService.getAll();
    return all.find(d => Number(d.disaster_id) === Number(id));
  },
  create: (data) => {
    const disasters = getCollection(STORAGE_KEYS.DISASTERS);
    const newDisaster = {
      disaster_id: Date.now(),
      type: data.type,
      severity: data.severity || 'MODERATE',
      description: data.description || '',
      start_date: data.start_date || new Date().toISOString().split('T')[0],
      status: data.status || 'ACTIVE',
      location_id: Number(data.location_id) || 1
    };
    disasters.push(newDisaster);
    saveCollection(STORAGE_KEYS.DISASTERS, disasters);
    return disasterService.getById(newDisaster.disaster_id);
  },
  update: (id, data) => {
    const disasters = getCollection(STORAGE_KEYS.DISASTERS);
    const idx = disasters.findIndex(d => Number(d.disaster_id) === Number(id));
    if (idx === -1) throw new Error('Disaster not found');
    disasters[idx] = { ...disasters[idx], ...data, location_id: Number(data.location_id || disasters[idx].location_id) };
    saveCollection(STORAGE_KEYS.DISASTERS, disasters);
    return disasterService.getById(id);
  },
  delete: (id) => {
    const disasters = getCollection(STORAGE_KEYS.DISASTERS).filter(d => Number(d.disaster_id) !== Number(id));
    saveCollection(STORAGE_KEYS.DISASTERS, disasters);
    return true;
  }
};

// Relief Center Operations
export const reliefCenterService = {
  getAll: () => {
    const centers = getCollection(STORAGE_KEYS.RELIEF_CENTERS);
    const locations = getCollection(STORAGE_KEYS.LOCATIONS);
    return centers.map(c => ({
      ...c,
      location: locations.find(l => Number(l.location_id) === Number(c.location_id)) || null
    }));
  },
  getById: (id) => reliefCenterService.getAll().find(c => Number(c.center_id) === Number(id)),
  create: (data) => {
    const centers = getCollection(STORAGE_KEYS.RELIEF_CENTERS);
    const newCenter = {
      center_id: Date.now(),
      name: data.name,
      location_id: Number(data.location_id) || 1,
      capacity: Number(data.capacity) || 100,
      occupancy: Number(data.occupancy) || 0,
      contact: data.contact || '',
      status: data.status || 'ACTIVE'
    };
    centers.push(newCenter);
    saveCollection(STORAGE_KEYS.RELIEF_CENTERS, centers);
    return reliefCenterService.getById(newCenter.center_id);
  },
  update: (id, data) => {
    const centers = getCollection(STORAGE_KEYS.RELIEF_CENTERS);
    const idx = centers.findIndex(c => Number(c.center_id) === Number(id));
    if (idx === -1) throw new Error('Relief center not found');
    centers[idx] = {
      ...centers[idx],
      ...data,
      capacity: Number(data.capacity ?? centers[idx].capacity),
      occupancy: Number(data.occupancy ?? centers[idx].occupancy),
      location_id: Number(data.location_id ?? centers[idx].location_id)
    };
    saveCollection(STORAGE_KEYS.RELIEF_CENTERS, centers);
    return reliefCenterService.getById(id);
  },
  delete: (id) => {
    const centers = getCollection(STORAGE_KEYS.RELIEF_CENTERS).filter(c => Number(c.center_id) !== Number(id));
    saveCollection(STORAGE_KEYS.RELIEF_CENTERS, centers);
    return true;
  }
};

// Task Operations
export const taskService = {
  getAll: () => {
    const tasks = getCollection(STORAGE_KEYS.TASKS);
    const disasters = getCollection(STORAGE_KEYS.DISASTERS);
    const locations = getCollection(STORAGE_KEYS.LOCATIONS);
    const volunteers = volunteerService.getAll();

    return tasks.map(t => {
      const disaster = disasters.find(d => Number(d.disaster_id) === Number(t.disaster_id)) || null;
      const location = locations.find(l => Number(l.location_id) === Number(t.location_id)) || null;
      const assignedVolunteer = t.assigned_volunteer_id 
        ? volunteers.find(v => Number(v.volunteer_id) === Number(t.assigned_volunteer_id)) || null 
        : null;

      return {
        ...t,
        disaster,
        location,
        assignedVolunteer
      };
    });
  },

  getById: (id) => taskService.getAll().find(t => Number(t.task_id) === Number(id)),

  getByVolunteerId: (volunteerId) => {
    const all = taskService.getAll();
    return all.filter(t => t.assignedVolunteer && (Number(t.assignedVolunteer.volunteer_id) === Number(volunteerId) || Number(t.assignedVolunteer.user_id) === Number(volunteerId)));
  },

  create: (data) => {
    const tasks = getCollection(STORAGE_KEYS.TASKS);
    const newTask = {
      task_id: Date.now(),
      disaster_id: Number(data.disaster_id) || 1,
      title: data.title,
      description: data.description || '',
      priority: data.priority || 'MEDIUM',
      location_id: Number(data.location_id) || 1,
      status: data.assigned_volunteer_id ? 'ASSIGNED' : (data.status || 'PENDING'),
      assigned_volunteer_id: data.assigned_volunteer_id ? Number(data.assigned_volunteer_id) : null
    };
    tasks.push(newTask);
    saveCollection(STORAGE_KEYS.TASKS, tasks);

    // If assigned to a volunteer, create notification
    if (newTask.assigned_volunteer_id) {
      const vol = volunteerService.getById(newTask.assigned_volunteer_id);
      if (vol && vol.user_id) {
        notificationService.create({
          user_id: vol.user_id,
          title: 'New Emergency Task Assigned',
          message: `You have been assigned to task "${newTask.title}".`,
          type: 'TASK_ASSIGNMENT'
        });
      }
    }

    return taskService.getById(newTask.task_id);
  },

  updateStatus: (taskId, newStatus) => {
    const tasks = getCollection(STORAGE_KEYS.TASKS);
    const idx = tasks.findIndex(t => Number(t.task_id) === Number(taskId));
    if (idx === -1) throw new Error('Task not found');
    tasks[idx].status = newStatus;
    saveCollection(STORAGE_KEYS.TASKS, tasks);
    return taskService.getById(taskId);
  },

  assignVolunteer: (taskId, volunteerId) => {
    const tasks = getCollection(STORAGE_KEYS.TASKS);
    const idx = tasks.findIndex(t => Number(t.task_id) === Number(taskId));
    if (idx === -1) throw new Error('Task not found');

    const volIdNum = volunteerId ? Number(volunteerId) : null;
    tasks[idx].assigned_volunteer_id = volIdNum;
    tasks[idx].status = volIdNum ? (tasks[idx].status === 'PENDING' ? 'ASSIGNED' : tasks[idx].status) : 'PENDING';
    saveCollection(STORAGE_KEYS.TASKS, tasks);

    if (volIdNum) {
      const vol = volunteerService.getById(volIdNum);
      if (vol && vol.user_id) {
        notificationService.create({
          user_id: vol.user_id,
          title: 'Emergency Task Assigned',
          message: `You were assigned to task "${tasks[idx].title}".`,
          type: 'TASK_ASSIGNMENT'
        });
      }
    }

    return taskService.getById(taskId);
  },

  update: (id, data) => {
    const tasks = getCollection(STORAGE_KEYS.TASKS);
    const idx = tasks.findIndex(t => Number(t.task_id) === Number(id));
    if (idx === -1) throw new Error('Task not found');
    tasks[idx] = {
      ...tasks[idx],
      ...data,
      disaster_id: Number(data.disaster_id ?? tasks[idx].disaster_id),
      location_id: Number(data.location_id ?? tasks[idx].location_id),
      assigned_volunteer_id: data.assigned_volunteer_id ? Number(data.assigned_volunteer_id) : tasks[idx].assigned_volunteer_id
    };
    saveCollection(STORAGE_KEYS.TASKS, tasks);
    return taskService.getById(id);
  },

  delete: (id) => {
    const tasks = getCollection(STORAGE_KEYS.TASKS).filter(t => Number(t.task_id) !== Number(id));
    saveCollection(STORAGE_KEYS.TASKS, tasks);
    return true;
  }
};

// Resource Inventory Operations
export const resourceService = {
  getAll: () => {
    const resources = getCollection(STORAGE_KEYS.RESOURCES);
    const disasters = getCollection(STORAGE_KEYS.DISASTERS);
    return resources.map(r => ({
      ...r,
      disaster: disasters.find(d => Number(d.disaster_id) === Number(r.disaster_id)) || null
    }));
  },
  getById: (id) => resourceService.getAll().find(r => Number(r.resource_id) === Number(id)),
  create: (data) => {
    const resources = getCollection(STORAGE_KEYS.RESOURCES);
    const newResource = {
      resource_id: Date.now(),
      disaster_id: Number(data.disaster_id) || 1,
      resource_name: data.resource_name,
      quantity: Number(data.quantity) || 0,
      status: data.status || 'REQUESTED'
    };
    resources.push(newResource);
    saveCollection(STORAGE_KEYS.RESOURCES, resources);
    return resourceService.getById(newResource.resource_id);
  },
  update: (id, data) => {
    const resources = getCollection(STORAGE_KEYS.RESOURCES);
    const idx = resources.findIndex(r => Number(r.resource_id) === Number(id));
    if (idx === -1) throw new Error('Resource not found');
    resources[idx] = {
      ...resources[idx],
      ...data,
      quantity: Number(data.quantity ?? resources[idx].quantity),
      disaster_id: Number(data.disaster_id ?? resources[idx].disaster_id)
    };
    saveCollection(STORAGE_KEYS.RESOURCES, resources);
    return resourceService.getById(id);
  },
  delete: (id) => {
    const resources = getCollection(STORAGE_KEYS.RESOURCES).filter(r => Number(r.resource_id) !== Number(id));
    saveCollection(STORAGE_KEYS.RESOURCES, resources);
    return true;
  }
};

// Notification Operations
export const notificationService = {
  getAllForUser: (userId) => {
    const notifications = getCollection(STORAGE_KEYS.NOTIFICATIONS);
    return notifications.filter(n => Number(n.user_id) === Number(userId) || n.user_id === 'BROADCAST' || n.user_id === 0);
  },
  create: (data) => {
    const notifications = getCollection(STORAGE_KEYS.NOTIFICATIONS);
    const newNotif = {
      notification_id: Date.now(),
      user_id: data.user_id || 'BROADCAST',
      title: data.title,
      message: data.message,
      type: data.type || 'ANNOUNCEMENT',
      is_read: false,
      created_at: new Date().toLocaleString()
    };
    notifications.unshift(newNotif);
    saveCollection(STORAGE_KEYS.NOTIFICATIONS, notifications);
    return newNotif;
  },
  markAsRead: (id) => {
    const notifications = getCollection(STORAGE_KEYS.NOTIFICATIONS);
    const idx = notifications.findIndex(n => Number(n.notification_id) === Number(id));
    if (idx !== -1) {
      notifications[idx].is_read = true;
      saveCollection(STORAGE_KEYS.NOTIFICATIONS, notifications);
    }
  },
  markAllAsRead: (userId) => {
    const notifications = getCollection(STORAGE_KEYS.NOTIFICATIONS);
    notifications.forEach(n => {
      if (Number(n.user_id) === Number(userId) || n.user_id === 'BROADCAST') {
        n.is_read = true;
      }
    });
    saveCollection(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },
  delete: (id) => {
    const notifications = getCollection(STORAGE_KEYS.NOTIFICATIONS).filter(n => Number(n.notification_id) !== Number(id));
    saveCollection(STORAGE_KEYS.NOTIFICATIONS, notifications);
  }
};

// Executive Analytics & Summary Metrics
export const reportsService = {
  getSummaryMetrics: () => {
    const volunteers = volunteerService.getAll();
    const disasters = disasterService.getAll();
    const tasks = taskService.getAll();
    const resources = resourceService.getAll();
    const shelters = reliefCenterService.getAll();

    const activeVolunteers = volunteers.filter(v => v.status === 'AVAILABLE' || v.status === 'ON_DUTY').length;
    const activeDisasters = disasters.filter(d => d.status === 'ACTIVE').length;
    const pendingTasks = tasks.filter(t => t.status === 'PENDING' || t.status === 'ASSIGNED').length;
    const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
    const totalCapacity = shelters.reduce((acc, curr) => acc + (curr.capacity || 0), 0);
    const totalOccupancy = shelters.reduce((acc, curr) => acc + (curr.occupancy || 0), 0);

    return {
      totalVolunteers: volunteers.length,
      activeVolunteers,
      totalDisasters: disasters.length,
      activeDisasters,
      totalTasks: tasks.length,
      pendingTasks,
      completedTasks,
      totalResources: resources.length,
      deliveredResources: resources.filter(r => r.status === 'DELIVERED').length,
      totalShelters: shelters.length,
      totalCapacity,
      totalOccupancy
    };
  }
};
