import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Search, Filter, Edit3, Trash2, UserPlus, MapPin, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { apiService } from '../services/apiService';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

export const Tasks = ({ currentUser }) => {
  const [tasks, setTasks] = useState([]);
  const [disasters, setDisasters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'HIGH',
    disaster_id: '',
    location_id: '',
    assigned_volunteer_id: ''
  });

  const [assignVolId, setAssignVolId] = useState('');

  const isAdmin = currentUser?.role === 'ADMIN';

  const loadData = async () => {
    const tList = await apiService.getTasks();
    const dList = await apiService.getDisasters();
    const lList = await apiService.getLocations();
    const vList = await apiService.getVolunteers();

    setTasks(tList);
    setDisasters(dList);
    setLocations(lList);
    setVolunteers(vList);
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('vdr-storage-update', handleStorageUpdate);
    return () => window.removeEventListener('vdr-storage-update', handleStorageUpdate);
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'HIGH',
      disaster_id: disasters[0]?.disaster_id || 1,
      location_id: locations[0]?.location_id || 1,
      assigned_volunteer_id: ''
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'HIGH',
      disaster_id: task.disaster_id || 1,
      location_id: task.location_id || 1,
      assigned_volunteer_id: task.assigned_volunteer_id || ''
    });
    setShowEditModal(true);
  };

  const handleOpenAssign = (task) => {
    setSelectedTask(task);
    setAssignVolId(task.assigned_volunteer_id || (volunteers[0]?.volunteer_id || ''));
    setShowAssignModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await apiService.createTask(formData);
    setShowAddModal(false);
    loadData();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    await apiService.updateTask(selectedTask.task_id, formData);
    setShowEditModal(false);
    loadData();
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    await apiService.assignTaskVolunteer(selectedTask.task_id, assignVolId);
    setShowAssignModal(false);
    loadData();
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    await apiService.updateTaskStatus(taskId, newStatus);
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await apiService.deleteTask(id);
      loadData();
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesSearch = (t.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (t.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  return (
    <div className="tasks-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Relief Tasks & Dispatch Board</h1>
          <p>Assign field tasks to registered volunteers, track lifecycle, and update duty status.</p>
        </div>

        {isAdmin && (
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Create Relief Task
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="nav-search" style={{ width: '260px' }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search task title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Priority:</span>
          <select
            className="form-control"
            style={{ padding: '0.35rem 0.75rem', width: 'auto' }}
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">URGENT</option>
            <option value="HIGH">HIGH</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="LOW">LOW</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Status:</span>
          <select
            className="form-control"
            style={{ padding: '0.35rem 0.75rem', width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">PENDING</option>
            <option value="ASSIGNED">ASSIGNED</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filteredTasks.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No tasks found.
          </div>
        ) : (
          filteredTasks.map(t => (
            <div key={t.task_id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{t.title}</h3>
                    <Badge variant={t.priority}>{t.priority}</Badge>
                    <Badge variant={t.status}>{t.status.replace('_', ' ')}</Badge>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    {t.description}
                  </p>
                </div>

                {isAdmin && (
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleOpenAssign(t)} title="Assign Volunteer">
                      <UserPlus size={14} /> Assign
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(t)} title="Edit Task">
                      <Edit3 size={14} />
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t.task_id)} title="Delete Task">
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                  <span>
                    Disaster: <strong style={{ color: 'var(--text-main)' }}>{t.disaster?.type || 'General'}</strong>
                  </span>
                  <span>
                    Location: <strong style={{ color: 'var(--accent-sky)' }}>{t.location?.city || 'Zone'}</strong>
                  </span>
                  <span>
                    Assigned Responder:{' '}
                    <strong style={{ color: t.assignedVolunteer ? 'var(--accent-emerald)' : 'var(--text-dim)' }}>
                      {t.assignedVolunteer ? t.assignedVolunteer.name : 'Unassigned'}
                    </strong>
                  </span>
                </div>

                {/* Quick Status Buttons */}
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {t.status === 'PENDING' && (
                    <button className="btn btn-secondary btn-sm" onClick={() => handleStatusUpdate(t.task_id, 'ASSIGNED')}>
                      Mark Assigned
                    </button>
                  )}
                  {(t.status === 'PENDING' || t.status === 'ASSIGNED') && (
                    <button className="btn btn-primary btn-sm" onClick={() => handleStatusUpdate(t.task_id, 'IN_PROGRESS')}>
                      Start Task
                    </button>
                  )}
                  {t.status === 'IN_PROGRESS' && (
                    <button className="btn btn-emerald btn-sm" onClick={() => handleStatusUpdate(t.task_id, 'COMPLETED')}>
                      Complete Task
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Create Relief Task"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>Save Task</button>
          </>
        }
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Task Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Food Ration Delivery"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Task Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Detail duty requirements, quantity, contact info..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Priority Level</label>
            <select
              className="form-control"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="URGENT">URGENT</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
          <div className="form-group">
            <label>Associated Disaster</label>
            <select
              className="form-control"
              value={formData.disaster_id}
              onChange={(e) => setFormData({ ...formData, disaster_id: e.target.value })}
            >
              {disasters.map(d => (
                <option key={d.disaster_id} value={d.disaster_id}>
                  {d.type} ({d.severity})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Location Zone</label>
            <select
              className="form-control"
              value={formData.location_id}
              onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
            >
              {locations.map(loc => (
                <option key={loc.location_id} value={loc.location_id}>
                  {loc.address}, {loc.city}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Assign Volunteer (Optional)</label>
            <select
              className="form-control"
              value={formData.assigned_volunteer_id}
              onChange={(e) => setFormData({ ...formData, assigned_volunteer_id: e.target.value })}
            >
              <option value="">-- Leave Unassigned --</option>
              {volunteers.map(v => (
                <option key={v.volunteer_id} value={v.volunteer_id}>
                  {v.name} ({v.skills})
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Task: ${selectedTask?.title}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
          </>
        }
      >
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Task Title</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              className="form-control"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select
              className="form-control"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="URGENT">URGENT</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Assign Volunteer Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title={`Assign Volunteer to Task: ${selectedTask?.title}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>Cancel</button>
            <button className="btn btn-emerald" onClick={handleAssignSubmit}>Confirm Assignment</button>
          </>
        }
      >
        <form onSubmit={handleAssignSubmit}>
          <div className="form-group">
            <label>Select Volunteer Responder</label>
            <select
              className="form-control"
              value={assignVolId}
              onChange={(e) => setAssignVolId(e.target.value)}
              required
            >
              <option value="">-- Select Registered Volunteer --</option>
              {volunteers.map(v => (
                <option key={v.volunteer_id} value={v.volunteer_id}>
                  {v.name} - Skills: {v.skills} ({v.status})
                </option>
              ))}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Tasks;
