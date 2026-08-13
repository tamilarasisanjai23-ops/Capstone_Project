import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Filter, Edit3, Trash2, Phone, Mail, Award, CheckCircle } from 'lucide-react';
import { apiService } from '../services/apiService';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

export const Volunteers = ({ currentUser }) => {
  const [volunteers, setVolunteers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    availability: 'Flexible / On-Call',
    status: 'AVAILABLE'
  });

  const isAdmin = currentUser?.role === 'ADMIN';

  const loadVolunteers = async () => {
    const data = await apiService.getVolunteers();
    setVolunteers(data);
  };

  useEffect(() => {
    loadVolunteers();
    const handleStorageUpdate = () => loadVolunteers();
    window.addEventListener('vdr-storage-update', handleStorageUpdate);
    return () => window.removeEventListener('vdr-storage-update', handleStorageUpdate);
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      skills: 'First Aid, Logistics',
      availability: 'Flexible / On-Call',
      status: 'AVAILABLE'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (vol) => {
    setSelectedVolunteer(vol);
    setFormData({
      name: vol.name || '',
      email: vol.email || '',
      phone: vol.phone || '',
      skills: vol.skills || '',
      availability: vol.availability || 'Flexible / On-Call',
      status: vol.status || 'AVAILABLE'
    });
    setShowEditModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await apiService.createVolunteer(formData);
    setShowAddModal(false);
    loadVolunteers();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedVolunteer) return;
    await apiService.updateVolunteer(selectedVolunteer.volunteer_id, formData);
    setShowEditModal(false);
    loadVolunteers();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this volunteer from system?')) {
      await apiService.deleteVolunteer(id);
      loadVolunteers();
    }
  };

  const filteredVolunteers = volunteers.filter(v => {
    const matchesSearch = (v.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (v.skills || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (v.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="volunteers-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Volunteer Roster</h1>
          <p>Manage community responders, skill profiling, and availability deployments.</p>
        </div>

        {isAdmin && (
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Register Volunteer
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="nav-search" style={{ width: '280px' }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search name, skills, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
            <option value="AVAILABLE">Available</option>
            <option value="ON_DUTY">On Duty</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table View */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Volunteer Name</th>
                <th>Contact Info</th>
                <th>Skills & Specialties</th>
                <th>Availability</th>
                <th>Status</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredVolunteers.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No volunteers match your criteria.
                  </td>
                </tr>
              ) : (
                filteredVolunteers.map((vol) => (
                  <tr key={vol.volunteer_id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="avatar-circle" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-sky))' }}>
                          {vol.name ? vol.name[0] : 'V'}
                        </div>
                        <div>
                          <strong style={{ fontSize: '0.9rem', display: 'block' }}>{vol.name}</strong>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: #{vol.volunteer_id}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Mail size={13} /> {vol.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                          <Phone size={13} /> {vol.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                        {vol.skills}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {vol.availability}
                      </span>
                    </td>
                    <td>
                      <Badge variant={vol.status}>{vol.status.replace('_', ' ')}</Badge>
                    </td>
                    {isAdmin && (
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => handleOpenEdit(vol)}
                            title="Edit Volunteer"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(vol.volunteer_id)}
                            title="Delete Volunteer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Volunteer Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Volunteer"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>Save Volunteer</button>
          </>
        }
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="email@disaster.org"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              className="form-control"
              placeholder="+1-800-555-0100"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Skills & Qualifications</label>
            <input
              type="text"
              className="form-control"
              placeholder="First Aid, Heavy Vehicle, Search & Rescue"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Availability Schedule</label>
            <select
              className="form-control"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            >
              <option value="Flexible / On-Call">Flexible / On-Call</option>
              <option value="Full-Time / Weekends">Full-Time / Weekends</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Night Duty">Night Duty</option>
            </select>
          </div>
          <div className="form-group">
            <label>Deployment Status</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="ON_DUTY">ON_DUTY</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Edit Volunteer Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Volunteer: ${selectedVolunteer?.name}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUpdate}>Update Details</button>
          </>
        }
      >
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              className="form-control"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Skills & Qualifications</label>
            <input
              type="text"
              className="form-control"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Availability Schedule</label>
            <select
              className="form-control"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            >
              <option value="Flexible / On-Call">Flexible / On-Call</option>
              <option value="Full-Time / Weekends">Full-Time / Weekends</option>
              <option value="Weekdays">Weekdays</option>
              <option value="Night Duty">Night Duty</option>
            </select>
          </div>
          <div className="form-group">
            <label>Deployment Status</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="AVAILABLE">AVAILABLE</option>
              <option value="ON_DUTY">ON_DUTY</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Volunteers;
