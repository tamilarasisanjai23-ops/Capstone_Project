import React, { useState, useEffect } from 'react';
import { Package, Plus, Search, Filter, Edit3, Trash2, Box, CheckCircle } from 'lucide-react';
import { apiService } from '../services/apiService';
import Badge from '../components/Badge';
import Modal from '../components/Modal';

export const Resources = ({ currentUser }) => {
  const [resources, setResources] = useState([]);
  const [disasters, setDisasters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);

  const [formData, setFormData] = useState({
    resource_name: '',
    quantity: 100,
    status: 'REQUESTED',
    disaster_id: 1
  });

  const isAdmin = currentUser?.role === 'ADMIN';

  const loadData = async () => {
    const rList = await apiService.getResources();
    const dList = await apiService.getDisasters();
    setResources(rList);
    setDisasters(dList);
  };

  useEffect(() => {
    loadData();
    const handleStorageUpdate = () => loadData();
    window.addEventListener('vdr-storage-update', handleStorageUpdate);
    return () => window.removeEventListener('vdr-storage-update', handleStorageUpdate);
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      resource_name: '',
      quantity: 100,
      status: 'REQUESTED',
      disaster_id: disasters[0]?.disaster_id || 1
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (res) => {
    setSelectedResource(res);
    setFormData({
      resource_name: res.resource_name || '',
      quantity: res.quantity || 0,
      status: res.status || 'REQUESTED',
      disaster_id: res.disaster_id || 1
    });
    setShowEditModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await apiService.createResource(formData);
    setShowAddModal(false);
    loadData();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedResource) return;
    await apiService.updateResource(selectedResource.resource_id, formData);
    setShowEditModal(false);
    loadData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resource entry?')) {
      await apiService.deleteResource(id);
      loadData();
    }
  };

  const filteredResources = resources.filter(r => {
    const matchesSearch = (r.resource_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="resources-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>Emergency Resource Inventory</h1>
          <p>Monitor emergency supply stockpiles, dispatch tracking, and fulfillment status.</p>
        </div>

        {isAdmin && (
          <button className="btn btn-primary" onClick={handleOpenAdd}>
            <Plus size={16} /> Log Resource Request
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="nav-search" style={{ width: '280px' }}>
          <Search size={16} />
          <input
            type="text"
            placeholder="Search resource item..."
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
            <option value="REQUESTED">REQUESTED</option>
            <option value="DISPATCHED">DISPATCHED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="AVAILABLE">AVAILABLE</option>
          </select>
        </div>
      </div>

      {/* Resources Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Resource Name</th>
                <th>Target Disaster</th>
                <th>Stock Quantity</th>
                <th>Lifecycle Status</th>
                {isAdmin && <th style={{ textAlign: 'right' }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredResources.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)' }}>
                    No resource entries match filter.
                  </td>
                </tr>
              ) : (
                filteredResources.map(r => (
                  <tr key={r.resource_id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div className="stat-icon-wrapper stat-icon-sky" style={{ width: '36px', height: '36px', fontSize: '1rem' }}>
                          <Box size={18} />
                        </div>
                        <strong style={{ fontSize: '0.925rem' }}>{r.resource_name}</strong>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {r.disaster?.type || `Disaster #${r.disaster_id}`}
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-main)' }}>{r.quantity}</strong> units
                    </td>
                    <td>
                      <Badge variant={r.status}>{r.status}</Badge>
                    </td>
                    {isAdmin && (
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleOpenEdit(r)} title="Edit Resource">
                            <Edit3 size={14} />
                          </button>
                          <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.resource_id)} title="Delete Resource">
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

      {/* Add Resource Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Log New Emergency Resource"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>Save Supply Request</button>
          </>
        }
      >
        <form onSubmit={handleCreate}>
          <div className="form-group">
            <label>Resource Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Inflatable Life Boats, Water Cans"
              value={formData.resource_name}
              onChange={(e) => setFormData({ ...formData, resource_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              className="form-control"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Target Disaster Incident</label>
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
            <label>Initial Status</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="REQUESTED">REQUESTED</option>
              <option value="DISPATCHED">DISPATCHED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="AVAILABLE">AVAILABLE</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* Edit Resource Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Edit Resource: ${selectedResource?.resource_name}`}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleUpdate}>Update Stock & Status</button>
          </>
        }
      >
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Resource Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.resource_name}
              onChange={(e) => setFormData({ ...formData, resource_name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              className="form-control"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select
              className="form-control"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="REQUESTED">REQUESTED</option>
              <option value="DISPATCHED">DISPATCHED</option>
              <option value="DELIVERED">DELIVERED</option>
              <option value="AVAILABLE">AVAILABLE</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Resources;
