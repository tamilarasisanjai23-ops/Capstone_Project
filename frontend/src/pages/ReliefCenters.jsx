import React, { useState, useEffect } from 'react';
import { Home, Plus, Search, Filter, Edit3, Trash2, Phone, MapPin, Users } from 'lucide-react';
import { apiService } from '../services/apiService';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

export const ReliefCenters = ({ currentUser }) => {
  const [centers, setCenters] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCenter, setSelectedCenter] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    location_id: 1,
    capacity: 300,
    occupancy: 0,
    contact: '',
    status: 'ACTIVE'
  });

  const isAdmin = currentUser?.role === 'ADMIN';

  const loadData = async () => {
    const cList = await apiService.getReliefCenters();
    const lList = await apiService.getLocations();
    setCenters(cList);
    setLocations(lList);
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('vdr-storage-update', handleStorageUpdate);
    return () => window.removeEventListener('vdr-storage-update', handleStorageUpdate);
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      location_id: locations[0]?.location_id || 1,
      capacity: 300,
      occupancy: 0,
      contact: '',
      status: 'ACTIVE'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (center) => {
    setSelectedCenter(center);
    setFormData({
      name: center.name || '',
      location_id: center.location_id || 1,
      capacity: center.capacity || 100,
      occupancy: center.occupancy || 0,
      contact: center.contact || '',
      status: center.status || 'ACTIVE'
    });
    setShowEditModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await apiService.createReliefCenter(formData);
    setShowAddModal(false);
    loadData();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedCenter) return;
    await apiService.updateReliefCenter(selectedCenter.center_id, formData);
    setShowEditModal(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this relief center?')) {
      await apiService.deleteReliefCenter(id);
      loadData();
    }
  };

  const filteredCenters = centers.filter(c => {
    const matchesSearch = (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (c.location?.city || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="relief-centers-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Relief Centers & Emergency Shelters</h1>
          <p>Monitor shelter occupancy capacity, emergency hotlines, and field facilities.</p>
        </div>

        {isAdmin && (
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Register Relief Shelter
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="nav-search" style={{ width: '280px' }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search shelter name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          <Filter size={16} color="var(--text-muted)" />
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Operational Status:</span>
          <select
            className="form-control"
            style={{ padding: '0.35rem 0.75rem', width: 'auto' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="STANDBY">STANDBY</option>
            <option value="FULL">FULL</option>
          </select>
        </div>
      </div>

      {/* Grid View */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        {filteredCenters.length === 0 ? (
          <div className="glass-card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            No relief shelters found.
          </div>
        ) : (
          filteredCenters.map(c => {
            const percent = Math.min(100, Math.round(((c.occupancy || 0) / (c.capacity || 1)) * 100));
            const barColor = percent > 85 ? 'var(--accent-rose)' : percent > 60 ? 'var(--accent-amber)' : 'var(--accent-emerald)';

            return (
              <div key={c.center_id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{c.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--accent-sky)', marginTop: '0.2rem' }}>
                      <MapPin size={13} />
                      <span>{c.location ? `${c.location.address}, ${c.location.city}` : `Location #${c.location_id}`}</span>
                    </div>
                  </div>
                  <Badge variant={c.status}>{c.status}</Badge>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Users size={14} /> Shelter Occupancy
                    </span>
                    <strong style={{ color: 'var(--text-main)' }}>
                      {c.occupancy || 0} / {c.capacity || 0} ({percent}%)
                    </strong>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${percent}%`, background: barColor }} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-glass)', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Phone size={14} color="var(--accent-emerald)" />
                    <span style={{ color: 'var(--text-main)', fontWeight: '600' }}>{c.contact || 'Emergency Hotline'}</span>
                  </div>

                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(c)}>
                        <Edit3 size={14} />
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.center_id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Center Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Register New Relief Center"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>Save Center</button>
          </>
        }
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Shelter Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Central Community Hall Shelter"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
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
                  {loc.address}, {loc.city}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Total Capacity</label>
              <input
                type="number"
                className="form-control"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Current Occupancy</label>
              <input
                type="number"
                className="form-control"
                value={formData.occupancy}
                onChange={(e) => setFormData({ ...formData, occupancy: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Emergency Contact Phone</label>
            <input
              type="text"
              className="form-control"
              placeholder="+91-44-25300000"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Edit Center Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Center: ${selectedCenter?.name}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUpdate}>Update Details</button>
          </>
        }
      >
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Shelter Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Total Capacity</label>
              <input
                type="number"
                className="form-control"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Current Occupancy</label>
              <input
                type="number"
                className="form-control"
                value={formData.occupancy}
                onChange={(e) => setFormData({ ...formData, occupancy: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Emergency Contact</label>
            <input
              type="text"
              className="form-control"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="STANDBY">STANDBY</option>
              <option value="FULL">FULL</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ReliefCenters;
