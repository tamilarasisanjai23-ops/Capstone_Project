import React, { useState, useEffect } from 'react';
import { Map, MapPin, AlertTriangle, Home, Users, AlertOctagon, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { apiService } from '../services/apiService';
import Badge from '../components/Badge';

export const EmergencyMap = () => {
  const [disasters, setDisasters] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [locations, setLocations] = useState([]);

  const [showDisasters, setShowDisasters] = useState(true);
  const [showShelters, setShowShelters] = useState(true);
  const [showSos, setShowSos] = useState(true);
  const [showVolunteers, setShowVolunteers] = useState(true);

  const [selectedMarker, setSelectedMarker] = useState(null);

  const loadMapData = async () => {
    const dList = await apiService.getDisasters();
    const sList = await apiService.getReliefCenters();
    const sosList = await apiService.getSosAlerts();
    const volLocs = await apiService.getVolunteerLocations();
    const locList = await apiService.getLocations();

    setDisasters(dList);
    setShelters(sList);
    setSosAlerts(sosList);
    setVolunteers(volLocs);
    setLocations(locList);
  };

  useEffect(() => {
    loadMapData();
  }, []);

  // Compute map pins with SVG relative coordinates or canvas grid simulation
  const mapPins = [];

  if (showDisasters) {
    disasters.forEach(d => {
      const loc = locations.find(l => Number(l.location_id) === Number(d.location_id)) || { city: 'Sector Zone' };
      mapPins.push({
        id: `disaster-${d.disaster_id}`,
        type: 'DISASTER',
        title: d.type,
        subtitle: `${loc.city} - ${d.severity}`,
        severity: d.severity,
        coords: d.location_id === 1 ? { x: 30, y: 35 } : d.location_id === 2 ? { x: 65, y: 55 } : { x: 45, y: 75 },
        data: d
      });
    });
  }

  if (showShelters) {
    shelters.forEach(s => {
      mapPins.push({
        id: `shelter-${s.center_id}`,
        type: 'SHELTER',
        title: s.name,
        subtitle: `Capacity: ${s.capacity} | Status: ${s.status}`,
        coords: s.center_id === 1 ? { x: 35, y: 40 } : s.center_id === 2 ? { x: 70, y: 60 } : { x: 50, y: 80 },
        data: s
      });
    });
  }

  if (showSos) {
    sosAlerts.filter(sos => sos.status !== 'RESOLVED').forEach(sos => {
      mapPins.push({
        id: `sos-${sos.sos_id}`,
        type: 'SOS',
        title: `SOS: ${sos.volunteer_name || 'Volunteer Emergency'}`,
        subtitle: sos.message || 'Distress signal received!',
        status: sos.status,
        coords: { x: 32, y: 38 },
        data: sos
      });
    });
  }

  if (showVolunteers) {
    volunteers.forEach(v => {
      mapPins.push({
        id: `vol-${v.location_record_id || v.volunteer_id}`,
        type: 'VOLUNTEER',
        title: v.volunteer_name || `Volunteer #${v.volunteer_id}`,
        subtitle: `Coordinates: (${v.latitude}, ${v.longitude})`,
        coords: v.volunteer_id === 1 ? { x: 34, y: 36 } : v.volunteer_id === 2 ? { x: 67, y: 58 } : { x: 48, y: 72 },
        data: v
      });
    });
  }

  return (
    <div className="emergency-map-page">
      <div className="page-header">
        <div className="page-title-group">
          <h1>
            <Map size={28} color="var(--accent-sky)" style={{ display: 'inline', marginRight: '8px' }} />
            Crisis Emergency Map & Live Location Portal
          </h1>
          <p>Real-time spatial visualization of disaster zones, relief shelters, active SOS alerts, and volunteer positions.</p>
        </div>

        <div className="header-actions">
          <button className="btn btn-secondary btn-sm" onClick={loadMapData}>
            <RefreshCw size={15} /> Refresh Map Layers
          </button>
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-card" style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-muted)' }}>LAYER FILTERS:</span>

        <button
          className={`btn btn-sm ${showDisasters ? 'btn-danger' : 'btn-secondary'}`}
          onClick={() => setShowDisasters(!showDisasters)}
          style={{ gap: '0.35rem' }}
        >
          <AlertTriangle size={14} /> Disasters ({disasters.length})
        </button>

        <button
          className={`btn btn-sm ${showShelters ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setShowShelters(!showShelters)}
          style={{ gap: '0.35rem' }}
        >
          <Home size={14} /> Relief Shelters ({shelters.length})
        </button>

        <button
          className={`btn btn-sm ${showSos ? 'btn-rose' : 'btn-secondary'}`}
          onClick={() => setShowSos(!showSos)}
          style={{ gap: '0.35rem' }}
        >
          <AlertOctagon size={14} /> SOS Alerts ({sosAlerts.filter(s => s.status !== 'RESOLVED').length})
        </button>

        <button
          className={`btn btn-sm ${showVolunteers ? 'btn-emerald' : 'btn-secondary'}`}
          onClick={() => setShowVolunteers(!showVolunteers)}
          style={{ gap: '0.35rem' }}
        >
          <Users size={14} /> Live Volunteers ({volunteers.length})
        </button>
      </div>

      {/* Main Map Container */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Interactive Map Visualizer Canvas */}
        <div className="glass-card" style={{
          position: 'relative',
          minHeight: '480px',
          background: '#0d1527',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          overflow: 'hidden'
        }}>
          {/* Simulated Geographic Grid Pattern */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.8
          }} />

          {/* Map Title Overlay */}
          <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10, background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)', padding: '0.5rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              CRISIS VECTOR GEOSPATIAL MAP
            </span>
          </div>

          {/* Render Pins */}
          {mapPins.map(pin => (
            <div
              key={pin.id}
              onClick={() => setSelectedMarker(pin)}
              style={{
                position: 'absolute',
                left: `${pin.coords.x}%`,
                top: `${pin.coords.y}%`,
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                zIndex: pin.type === 'SOS' ? 20 : 15,
                transition: 'transform 0.2s ease'
              }}
            >
              {pin.type === 'SOS' && (
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px #ef4444'
                }} className="animate-pulse">
                  <div style={{ background: '#ef4444', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <AlertOctagon size={18} />
                  </div>
                </div>
              )}

              {pin.type === 'DISASTER' && (
                <div style={{ background: '#dc2626', color: '#fff', padding: '0.4rem', borderRadius: '50%', boxShadow: '0 0 12px rgba(220, 38, 38, 0.6)' }}>
                  <AlertTriangle size={20} />
                </div>
              )}

              {pin.type === 'SHELTER' && (
                <div style={{ background: '#0284c7', color: '#fff', padding: '0.4rem', borderRadius: '50%', boxShadow: '0 0 12px rgba(2, 132, 199, 0.6)' }}>
                  <Home size={20} />
                </div>
              )}

              {pin.type === 'VOLUNTEER' && (
                <div style={{ background: '#10b981', color: '#fff', padding: '0.35rem', borderRadius: '50%', boxShadow: '0 0 10px rgba(16, 185, 129, 0.6)' }}>
                  <Users size={16} />
                </div>
              )}
            </div>
          ))}

          {/* Map Legend */}
          <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(8px)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.75rem' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>MAP LEGEND</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#dc2626' }}></span> Disaster Zone</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0284c7' }}></span> Relief Center</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }}></span> SOS Call (Active)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></span> Live Volunteer</div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Selected Pin Details & Active Elements list */}
        <div className="glass-card">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={18} color="var(--accent-sky)" />
            Location Details & Marker Telemetry
          </h3>

          {selectedMarker ? (
            <div style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-card-secondary, rgba(255,255,255,0.03))', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span className={`badge ${
                  selectedMarker.type === 'SOS' ? 'badge-critical' :
                  selectedMarker.type === 'DISASTER' ? 'badge-urgent' :
                  selectedMarker.type === 'SHELTER' ? 'badge-info' : 'badge-success'
                }`}>
                  {selectedMarker.type}
                </span>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedMarker(null)}>Close</button>
              </div>

              <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{selectedMarker.title}</h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedMarker.subtitle}</p>
            </div>
          ) : (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
              Click any pin on the map to inspect live disaster updates, relief center capacity, or volunteer distress call telemetry.
            </p>
          )}

          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
              Active Map Entities ({mapPins.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
              {mapPins.map(pin => (
                <div
                  key={pin.id}
                  onClick={() => setSelectedMarker(pin)}
                  style={{
                    padding: '0.6rem 0.85rem',
                    borderRadius: '8px',
                    background: selectedMarker?.id === pin.id ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '0.85rem' }}>{pin.title}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{pin.subtitle}</div>
                  </div>
                  <MapPin size={15} color="var(--accent-sky)" />
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EmergencyMap;
