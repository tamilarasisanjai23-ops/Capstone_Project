import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Search, Filter, Edit3, Trash2, MapPin, Calendar } from 'lucide-react';
import { apiService } from '../services/apiService';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

export const Disasters = ({ currentUser }) => {
  const [disasters, setDisasters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDisaster, setSelectedDisaster] = useState(null);

  const [formData, setFormData] = useState({
    type: '',
    severity: 'HIGH',
    description: '',
    start_date: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    location_id: ''
  });

  const isAdmin = currentUser?.role === 'ADMIN';

  const loadData = async () => {
    const dList = await apiService.getDisasters();
    const lList = await apiService.getLocations();
    setDisasters(dList);
    setLocations(lList);
    if (lList.length > 0 && !formData.location_id) {
      setFormData(prev => ({ ...prev, location_id: lList[0].location_id }));
    }
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('vdr-storage-update', handleStorageUpdate);
    return () => window.removeEventListener('vdr-storage-update', handleStorageUpdate);
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      type: '',
      severity: 'HIGH',
      description: '',
      start_date: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      location_id: locations[0]?.location_id || 1
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (disaster) => {
    setSelectedDisaster(disaster);
    setFormData({
      type: disaster.type || '',
      severity: disaster.severity || 'HIGH',
      description: disaster.description || '',
      start_date: disaster.start_date || '',
      status: disaster.status || 'ACTIVE',
      location_id: disaster.location_id || 1
    });
    setShowEditModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await apiService.createDisaster(formData);
    setShowAddModal(false);
    loadData();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedDisaster) return;
    await apiService.updateDisaster(selectedDisaster.disaster_id, formData);
    setShowEditModal(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this disaster record?')) {
      await apiService.deleteDisaster(id);
      loadData();
    }
  };

  const filteredDisasters = disasters.filter(d => {
    const matchesSearch = (d.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (d.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (d.location?.city || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || d.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="disasters-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Disaster Incidents Management</h1>
          <p>Track emergency incident logs, severity classifications, and affected response zones.</p>
        </div>

        {isAdmin && (
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Log Disaster Incident
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="nav-search" style={{ width: '280px' }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search disaster type, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Severity Level:</span>
          <select
            className="form-control"
            style={{ padding: '0.35rem 0.75rem', width: 'auto' }}
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">CRITICAL</option>
            <option value="HIGH">HIGH</option>
            <option value="MODERATE">MODERATE</option>
            <option value="LOW">LOW</option>
          </select>
        </div>
      </div>

      {/* Disasters Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredDisasters.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No disaster incidents found matching your query.
          </div>
        ) : (
          filteredDisasters.map(d => (
            <div key={d.disaster_id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{d.type}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--accent-sky)', marginTop: '0.2rem' }}>
                    <MapPin size={13} />
                    <span>{d.location ? `${d.location.address}, ${d.location.city}` : `Location ID #${d.location_id}`}</span>
                  </div>
                </div>
                <Badge variant={d.severity}>{d.severity}</Badge>
              </div>

              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', flex: 1 }}>
                {d.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Calendar size={14} /> Reported: {d.start_date}
                </div>
                <Badge variant={d.status}>{d.status}</Badge>
              </div>

              {isAdmin && (
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => handleOpenEdit(d)}>
                    <Edit3 size={14} /> Edit Log
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(d.disaster_id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Disaster Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Report Disaster Incident"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>Save Disaster Incident</button>
          </>
        }
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Disaster Type</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Cyclone Flash Flood, Earthquake"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Severity Level</label>
            <select
              className="form-control"
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
            >
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MODERATE">MODERATE</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
          <div className="form-group">
            <label>Incident Description</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Describe scale of impact, emergency needs, affected population..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Incident Location Zone</label>
            <select
              className="form-control"
              value={formData.location_id}
              onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
            >
              {locations.map(loc => (
                <option key={loc.location_id} value={loc.location_id}>
                  {loc.address}, {loc.city} ({loc.district})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              className="form-control"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Edit Disaster Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Disaster Incident: ${selectedDisaster?.type}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUpdate}>Save Changes</button>
          </>
        }
      >
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Disaster Type</label>
            <input
              type="text"
              className="form-control"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Severity Level</label>
            <select
              className="form-control"
              value={formData.severity}
              onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
            >
              <option value="CRITICAL">CRITICAL</option>
              <option value="HIGH">HIGH</option>
              <option value="MODERATE">MODERATE</option>
              <option value="LOW">LOW</option>
            </select>
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
            <label>Location Zone</label>
            <select
              className="form-control"
              value={formData.location_id}
              onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
            >
              {locations.map(loc => (
                <option key={loc.location_id} value={loc.location_id}>
                  {loc.address}, {loc.city} ({loc.district})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="MONITORING">MONITORING</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Disasters;
