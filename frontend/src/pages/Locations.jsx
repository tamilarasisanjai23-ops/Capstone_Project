import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Search, Edit3, Trash2, Building, Navigation } from 'lucide-react';
import { apiService } from '../services/apiService';
import Modal from '../components/Modal';

export const Locations = ({ currentUser }) => {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedLoc, setSelectedLoc] = useState(null);

  const [formData, setFormData] = useState({
    address: '',
    city: '',
    district: '',
    pincode: ''
  });

  const isAdmin = currentUser?.role === 'ADMIN';

  const loadData = async () => {
    const list = await apiService.getLocations();
    setLocations(list);
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('vdr-storage-update', handleStorageUpdate);
    return () => window.removeEventListener('vdr-storage-update', handleStorageUpdate);
  }, []);

  const handleOpenAdd = () => {
    setFormData({ address: '', city: '', district: '', pincode: '' });
    setShowAddModal(true);
  };

  const handleOpenEdit = (loc) => {
    setSelectedLoc(loc);
    setFormData({
      address: loc.address || '',
      city: loc.city || '',
      district: loc.district || '',
      pincode: loc.pincode || ''
    });
    setShowEditModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await apiService.createLocation(formData);
    setShowAddModal(false);
    loadData();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedLoc) return;
    await apiService.updateLocation(selectedLoc.location_id, formData);
    setShowEditModal(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      await apiService.deleteLocation(id);
      loadData();
    }
  };

  const filteredLocations = locations.filter(l => 
    (l.address || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.district || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.pincode || '').includes(searchTerm)
  );

  return (
    <div className="locations-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Geographic Locations Repository</h1>
          <p>Standardized location database for disasters, relief shelters, and dispatch zones.</p>
        </div>

        {isAdmin && (
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Add Location Record
          </button>
        )}
      </div>

      {/* Search Filter */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem' }}>
        <div className="nav-search" style={{ width: '320px' }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search address, city, district, pincode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Locations Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Location ID</th>
                <th>Street Address / Sector</th>
                <th>City</th>
                <th>District / Zone</th>
                <th>Postal Pincode</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredLocations.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 6 : 5} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No location records found.
                  </td>
                </tr>
              ) : (
                filteredLocations.map(loc => (
                  <tr key={loc.location_id}>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: '600' }}>#{loc.location_id}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MapPin size={16} color="var(--accent-sky)" />
                        <strong style={{ fontSize: '0.9rem' }}>{loc.address}</strong>
                      </div>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{loc.city}</span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--text-muted)' }}>{loc.district}</span>
                    </td>
                    <td>
                      <span className="badge badge-pending">{loc.pincode}</span>
                    </td>
                    {isAdmin && (
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(loc)}>
                            <Edit3 size={14} />
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(loc.location_id)}>
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

      {/* Add Location Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Location Record"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>Save Location</button>
          </>
        }
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Street Address / Zone Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Sector 14 Emergency Zone"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                className="form-control"
                placeholder="Chennai"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>District</label>
              <input
                type="text"
                className="form-control"
                placeholder="Chennai North"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Postal Pincode</label>
            <input
              type="text"
              className="form-control"
              placeholder="600001"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Edit Location Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Location #${selectedLoc?.location_id}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUpdate}>Update Record</button>
          </>
        }
      >
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              className="form-control"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                className="form-control"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>District</label>
              <input
                type="text"
                className="form-control"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Pincode</label>
            <input
              type="text"
              className="form-control"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Locations;
