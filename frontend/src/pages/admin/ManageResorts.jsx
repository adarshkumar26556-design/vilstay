import { useState, useEffect } from 'react';
import { getResorts, createResort, updateResort, deleteResort, uploadImage } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from 'react-icons/fi';
import { imgFallback } from '../../utils/helpers';

const EMPTY_FORM = {
  name: '', shortDescription: '', description: '',
  'location.city': '', 'location.state': '', 'location.address': '',
  category: 'boutique', contactEmail: '', contactPhone: '',
  amenities: '', images: '', featured: false, isActive: true,
};

export default function ManageResorts() {
  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getResorts({ limit: 50 })
      .then((r) => setResorts(r.data.resorts))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(EMPTY_FORM); setModal(true); };
  const openEdit = (r) => {
    setEditing(r._id);
    setForm({
      name: r.name, shortDescription: r.shortDescription, description: r.description,
      'location.city': r.location?.city, 'location.state': r.location?.state, 'location.address': r.location?.address,
      category: r.category, contactEmail: r.contactEmail, contactPhone: r.contactPhone,
      amenities: r.amenities?.join(', '), images: r.images?.map(i => i.url).join('\n'), featured: r.featured, isActive: r.isActive,
    });
    setModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name, shortDescription: form.shortDescription, description: form.description,
        location: { city: form['location.city'], state: form['location.state'], address: form['location.address'] },
        category: form.category, contactEmail: form.contactEmail, contactPhone: form.contactPhone,
        amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean),
        images: form.images.split('\n').filter(Boolean).map(url => ({ url: url.trim(), public_id: url.trim() })),
        featured: form.featured, isActive: form.isActive,
      };
      if (editing) { await updateResort(editing, payload); toast.success('Resort updated!'); }
      else { await createResort(payload); toast.success('Resort created!'); }
      setModal(false); load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this resort?')) return;
    try { await deleteResort(id); toast.success('Resort deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-extrabold text-gray-900">Manage Resorts</h1><p className="text-gray-400 text-sm mt-1">{resorts.length} properties</p></div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><FiPlus /> Add Resort</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="text-left px-5 py-3">Resort</th>
                <th className="text-left px-5 py-3">Location</th>
                <th className="text-left px-5 py-3">Category</th>
                <th className="text-left px-5 py-3">Rating</th>
                <th className="text-left px-5 py-3">Featured</th>
                <th className="text-left px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {resorts.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img src={r.images?.[0]?.url || ''} onError={imgFallback} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                      <div><p className="font-semibold text-gray-900">{r.name}</p><p className="text-xs text-gray-400">{r.reviewCount} reviews</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600">{r.location?.city}, {r.location?.state}</td>
                  <td className="px-5 py-4"><span className="badge badge-blue capitalize">{r.category}</span></td>
                  <td className="px-5 py-4 font-bold text-amber-500">⭐ {r.rating}</td>
                  <td className="px-5 py-4">{r.featured ? <FiCheck className="text-green-500" size={18} /> : <FiX className="text-gray-300" size={18} />}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(r)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all"><FiEdit2 size={15} /></button>
                      <button onClick={() => handleDelete(r._id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-lg text-gray-900">{editing ? 'Edit Resort' : 'Add New Resort'}</h2>
              <button onClick={() => setModal(false)} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><label className="text-sm font-semibold text-gray-700 mb-1 block">Resort Name *</label><input className="input-field" value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required /></div>
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">City *</label><input className="input-field" value={form['location.city']} onChange={e => setForm(p => ({...p, 'location.city': e.target.value}))} required /></div>
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">State *</label><input className="input-field" value={form['location.state']} onChange={e => setForm(p => ({...p, 'location.state': e.target.value}))} required /></div>
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Address</label><input className="input-field" value={form['location.address']} onChange={e => setForm(p => ({...p, 'location.address': e.target.value}))} /></div>
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Category</label>
                  <select className="input-field" value={form.category} onChange={e => setForm(p => ({...p, category: e.target.value}))}>
                    {['luxury','boutique','heritage','eco','budget'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Contact Email</label><input type="email" className="input-field" value={form.contactEmail} onChange={e => setForm(p => ({...p, contactEmail: e.target.value}))} /></div>
                <div><label className="text-sm font-semibold text-gray-700 mb-1 block">Contact Phone</label><input className="input-field" value={form.contactPhone} onChange={e => setForm(p => ({...p, contactPhone: e.target.value}))} /></div>
                <div className="sm:col-span-2"><label className="text-sm font-semibold text-gray-700 mb-1 block">Short Description</label><input className="input-field" value={form.shortDescription} onChange={e => setForm(p => ({...p, shortDescription: e.target.value}))} /></div>
                <div className="sm:col-span-2"><label className="text-sm font-semibold text-gray-700 mb-1 block">Full Description *</label><textarea className="input-field resize-none" rows={3} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))} required /></div>
                <div className="sm:col-span-2"><label className="text-sm font-semibold text-gray-700 mb-1 block">Amenities (comma separated)</label><input className="input-field" value={form.amenities} onChange={e => setForm(p => ({...p, amenities: e.target.value}))} placeholder="Free WiFi, Swimming Pool, Restaurant…" /></div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Images (Upload or paste URLs)</label>
                  <input type="file" multiple accept="image/*" onChange={async (e) => {
                    const files = Array.from(e.target.files);
                    if(!files.length) return;
                    toast.loading('Uploading images...', { id: 'upload_r' });
                    try {
                      let urls = [];
                      for(const f of files) {
                        const { data } = await uploadImage(f);
                        urls.push(`http://localhost:5000${data}`);
                      }
                      setForm(p => ({...p, images: p.images + (p.images ? '\n' : '') + urls.join('\n')}));
                      toast.success('Images uploaded!', { id: 'upload_r' });
                    } catch(err) { toast.error('Upload failed', { id: 'upload_r' }); }
                  }} className="mb-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
                  <textarea className="input-field resize-none font-mono text-xs" rows={3} value={form.images} onChange={e => setForm(p => ({...p, images: e.target.value}))} placeholder="https://..." />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e => setForm(p => ({...p, featured: e.target.checked}))} className="accent-primary-600" /><span className="text-sm font-medium">Featured</span></label>
                  <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({...p, isActive: e.target.checked}))} className="accent-primary-600" /><span className="text-sm font-medium">Active</span></label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2"><button type="button" onClick={() => setModal(false)} className="btn-outline py-2 px-5">Cancel</button><button type="submit" disabled={saving} className="btn-primary py-2 px-6">{saving ? 'Saving...' : editing ? 'Update Resort' : 'Create Resort'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
