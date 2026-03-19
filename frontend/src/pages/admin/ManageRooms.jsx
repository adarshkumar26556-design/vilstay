import { useState, useEffect } from 'react';
import { getResorts, getRoomsByResort, createRoom, updateRoom, deleteRoom, uploadImage } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import { formatPrice } from '../../utils/helpers';

const ROOM_TYPES = ['AC', 'Non-AC', 'Deluxe', 'Suite', 'Villa', 'Cottage'];
const EMPTY_FORM = { name: '', type: 'Deluxe', pricePerNight: '', resort: '', description: '', amenities: '', adults: 2, children: 1, totalRooms: 1, images: '', available: true };

export default function ManageRooms() {
  const [resorts, setResorts] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedResort, setSelectedResort] = useState('');
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getResorts({ limit: 50 }).then(r => setResorts(r.data.resorts)).catch(console.error);
  }, []);

  useEffect(() => {
    if (!selectedResort) { setRooms([]); return; }
    setLoading(true);
    getRoomsByResort(selectedResort).then(r => setRooms(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [selectedResort]);

  const openCreate = () => { setEditing(null); setForm({ ...EMPTY_FORM, resort: selectedResort }); setModal(true); };
  const openEdit = (r) => {
    setEditing(r._id);
    setForm({ name: r.name, type: r.type, pricePerNight: r.pricePerNight, resort: r.resort, description: r.description || '', amenities: r.amenities?.join(', '), adults: r.capacity?.adults, children: r.capacity?.children, totalRooms: r.totalRooms, images: r.images?.map(i => i.url).join('\n'), available: r.available });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.resort) return toast.error('Select a resort');
    setSaving(true);
    try {
      const payload = { name: form.name, type: form.type, pricePerNight: +form.pricePerNight, resort: form.resort, description: form.description, amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean), capacity: { adults: +form.adults, children: +form.children }, totalRooms: +form.totalRooms, images: form.images.split('\n').filter(Boolean).map(url => ({ url: url.trim(), public_id: url.trim() })), available: form.available };
      if (editing) { await updateRoom(editing, payload); toast.success('Room updated!'); }
      else { await createRoom(payload); toast.success('Room created!'); }
      setModal(false);
      if (selectedResort) { getRoomsByResort(selectedResort).then(r => setRooms(r.data)); }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this room?')) return;
    try { await deleteRoom(id); toast.success('Room deleted'); setRooms(prev => prev.filter(r => r._id !== id)); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-extrabold text-gray-900">Manage Rooms</h1><p className="text-gray-400 text-sm mt-1">Select a resort to view its rooms</p></div>
        <button onClick={openCreate} disabled={!selectedResort} className="btn-primary flex items-center gap-2 disabled:opacity-50"><FiPlus /> Add Room</button>
      </div>

      <div className="mb-6">
        <select className="input-field max-w-sm" value={selectedResort} onChange={e => setSelectedResort(e.target.value)}>
          <option value="">— Select a Resort —</option>
          {resorts.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
        </select>
      </div>

      {loading ? <LoadingSpinner /> : selectedResort ? (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-5 py-3">Room</th>
                <th className="text-left px-5 py-3">Type</th>
                <th className="text-left px-5 py-3">Capacity</th>
                <th className="text-left px-5 py-3">Price/Night</th>
                <th className="text-left px-5 py-3">Available</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {rooms.map(r => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4 font-semibold text-gray-900">{r.name}</td>
                  <td className="px-5 py-4"><span className="badge badge-blue">{r.type}</span></td>
                  <td className="px-5 py-4 text-gray-600">{r.capacity?.adults}A + {r.capacity?.children}C</td>
                  <td className="px-5 py-4 font-bold text-primary-600">{formatPrice(r.pricePerNight)}</td>
                  <td className="px-5 py-4"><span className={`badge ${r.available ? 'badge-green' : 'badge-red'}`}>{r.available ? 'Yes' : 'No'}</span></td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(r)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg"><FiEdit2 size={15} /></button>
                      <button onClick={() => handleDelete(r._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {rooms.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-gray-400">No rooms found for this resort</td></tr>}
            </tbody>
          </table>
        </div>
      ) : <div className="card p-16 text-center text-gray-400">Select a resort to manage its rooms</div>}

      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-lg text-gray-900">{editing ? 'Edit Room' : 'Add Room'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Room Name *</label><input className="input-field" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required /></div>
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Type *</label><select className="input-field" value={form.type} onChange={e => setForm(p => ({...p, type: e.target.value}))}>{ROOM_TYPES.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Resort *</label><select className="input-field" value={form.resort} onChange={e => setForm(p => ({...p, resort: e.target.value}))} required><option value="">Select Resort</option>{resorts.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}</select></div>
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Price/Night (₹) *</label><input type="number" className="input-field" value={form.pricePerNight} onChange={e => setForm(p => ({...p, pricePerNight: e.target.value}))} required /></div>
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Adults</label><input type="number" className="input-field" value={form.adults} min={1} onChange={e => setForm(p => ({...p, adults: e.target.value}))} /></div>
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Children</label><input type="number" className="input-field" value={form.children} min={0} onChange={e => setForm(p => ({...p, children: e.target.value}))} /></div>
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Total Rooms</label><input type="number" className="input-field" value={form.totalRooms} min={1} onChange={e => setForm(p => ({...p, totalRooms: e.target.value}))} /></div>
                <div className="flex items-center gap-2 pt-6"><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.available} onChange={e => setForm(p => ({...p, available: e.target.checked}))} className="accent-primary-600" /><span className="text-sm font-medium">Available</span></label></div>
                <div className="sm:col-span-2"><label className="text-sm font-semibold text-gray-700 mb-1 block">Description</label><textarea className="input-field resize-none" rows={2} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} /></div>
                <div className="sm:col-span-2"><label className="text-sm font-semibold text-gray-700 mb-1 block">Amenities (comma separated)</label><input className="input-field" value={form.amenities} onChange={e => setForm(p => ({...p, amenities: e.target.value}))} placeholder="AC, TV, WiFi…" /></div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Images (Upload or paste URLs)</label>
                  <input type="file" multiple accept="image/*" onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    if(!files.length) return;
                    toast.loading('Uploading images...', { id: 'upload' });
                    try {
                      let urls = [];
                      for(const f of files) {
                        const { data } = await uploadImage(f);
                        urls.push(`http://localhost:5000${data}`);
                      }
                      setForm(p => ({...p, images: p.images + (p.images ? '\n' : '') + urls.join('\n')}));
                      toast.success('Images uploaded!', { id: 'upload' });
                    } catch(err) { toast.error('Upload failed', { id: 'upload' }); }
                  }} className="mb-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                  <textarea className="input-field font-mono text-xs resize-none" rows={2} value={form.images} onChange={e => setForm(p => ({...p, images: e.target.value}))} placeholder="Each image URL on a new line" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setModal(false)} className="btn-outline py-2 px-5">Cancel</button><button type="submit" disabled={saving} className="btn-primary py-2 px-6">{saving ? 'Saving...' : editing ? 'Update Room' : 'Create Room'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
