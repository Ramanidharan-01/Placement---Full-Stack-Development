import { useState, useEffect, useCallback } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Inter',sans-serif;background:#F1F5F9;color:#1E293B;font-size:14px;}
h1,h2,h3,h4{font-family:'Sora',sans-serif;}
.shell{display:flex;min-height:100vh;}
.sidebar{position:fixed;top:0;left:0;bottom:0;width:236px;background:#0D1117;display:flex;flex-direction:column;z-index:100;border-right:1px solid rgba(255,255,255,0.05);}
.main{margin-left:236px;flex:1;min-height:100vh;}
.brand{padding:18px 16px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:10px;}
.brand-icon{width:30px;height:30px;border-radius:8px;background:#7C3AED;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;}
.brand-name{font-size:14px;font-weight:700;color:#F8FAFC;letter-spacing:-0.01em;}
.brand-sub{font-size:10px;color:#4B5563;margin-top:1px;letter-spacing:0.04em;}
.nav{padding:10px 8px;flex:1;}
.nav-label{font-size:10px;font-weight:600;color:#374151;letter-spacing:0.08em;text-transform:uppercase;padding:14px 10px 6px;}
.nav-item{display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:8px;cursor:pointer;font-size:13px;font-weight:500;color:#6B7280;transition:all 0.12s;position:relative;user-select:none;margin-bottom:2px;}
.nav-item:hover{background:rgba(255,255,255,0.04);color:#D1D5DB;}
.nav-item.active{background:rgba(124,58,237,0.14);color:#A78BFA;}
.nav-dot{width:5px;height:5px;border-radius:50%;background:transparent;margin-left:auto;transition:all 0.15s;flex-shrink:0;}
.nav-item.active .nav-dot{background:#7C3AED;box-shadow:0 0 7px rgba(124,58,237,0.9);}
.sidebar-foot{padding:12px;border-top:1px solid rgba(255,255,255,0.05);}
.api-badge{display:flex;align-items:center;gap:7px;padding:8px 10px;border-radius:8px;background:rgba(255,255,255,0.04);font-size:11px;font-weight:500;}
.api-badge.live{color:#34D399;} .api-badge.demo{color:#A78BFA;}
.pulse{width:6px;height:6px;border-radius:50%;flex-shrink:0;}
.pulse.green{background:#10B981;animation:glow 2s ease-in-out infinite;}
.pulse.violet{background:#7C3AED;}
@keyframes glow{0%,100%{opacity:1;}50%{opacity:0.4;}}
.topbar{height:60px;background:#fff;border-bottom:1px solid #E2E8F0;display:flex;align-items:center;padding:0 26px;position:sticky;top:0;z-index:50;gap:14px;}
.topbar-title{font-size:17px;font-weight:600;color:#0F172A;flex:1;}
.topbar-hint{font-size:11px;color:#94A3B8;margin-top:2px;font-weight:400;}
.page{padding:24px 26px;}
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:22px;}
.stat{background:#fff;border:1px solid #E2E8F0;border-radius:12px;padding:18px 20px;}
.stat-icon{font-size:20px;margin-bottom:10px;}
.stat-num{font-size:26px;font-weight:700;color:#0F172A;font-family:'Sora',sans-serif;line-height:1;}
.stat-label{font-size:11px;color:#6B7280;margin-top:4px;font-weight:500;text-transform:uppercase;letter-spacing:0.05em;}
.stat-sub{font-size:11px;color:#94A3B8;margin-top:7px;}
.card{background:#fff;border:1px solid #E2E8F0;border-radius:12px;overflow:hidden;}
.card-head{padding:15px 20px;border-bottom:1px solid #F1F5F9;display:flex;align-items:center;gap:10px;}
.card-title{font-size:13px;font-weight:600;color:#0F172A;flex:1;}
.page-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:18px;}
.page-title{font-family:'Sora',sans-serif;font-size:21px;font-weight:700;color:#0F172A;}
.page-sub{font-size:12px;color:#6B7280;margin-top:3px;}
table{width:100%;border-collapse:collapse;}
thead tr{background:#F8FAFC;}
th{padding:10px 16px;text-align:left;font-size:10.5px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.07em;white-space:nowrap;}
td{padding:13px 16px;font-size:13px;color:#374151;border-top:1px solid #F8FAFC;}
tbody tr{transition:background 0.1s;}
tbody tr:hover{background:#FAFBFC;}
.badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:600;white-space:nowrap;}
.b-student{background:#EFF6FF;color:#2563EB;} .b-teacher{background:#F0FDF4;color:#16A34A;} .b-admin{background:#FDF4FF;color:#9333EA;}
.b-active{background:#D1FAE5;color:#065F46;} .b-inactive{background:#F3F4F6;color:#6B7280;}
.b-low{background:#FEF3C7;color:#92400E;} .b-out{background:#FEE2E2;color:#991B1B;}
.b-cat{background:#F1F5F9;color:#475569;}
.btn{display:inline-flex;align-items:center;gap:5px;padding:8px 14px;border-radius:8px;font-size:13px;font-weight:500;cursor:pointer;border:none;transition:all 0.12s;white-space:nowrap;font-family:'Inter',sans-serif;}
.btn:disabled{opacity:0.55;cursor:not-allowed;}
.btn-violet{background:#7C3AED;color:#fff;}
.btn-violet:hover:not(:disabled){background:#6D28D9;transform:translateY(-1px);box-shadow:0 4px 12px rgba(124,58,237,0.3);}
.btn-ghost{background:transparent;color:#6B7280;border:1px solid #E2E8F0;}
.btn-ghost:hover{background:#F8FAFC;color:#374151;}
.btn-danger{background:#FEE2E2;color:#DC2626;border:1px solid #FECACA;}
.btn-danger:hover{filter:brightness(0.95);}
.btn-sm{padding:5px 10px;font-size:12px;}
.form-row{margin-bottom:14px;}
.form-label{display:block;font-size:11px;font-weight:600;color:#374151;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.04em;}
.fi{width:100%;padding:9px 11px;border-radius:7px;border:1px solid #D1D5DB;font-size:13px;color:#111827;font-family:'Inter',sans-serif;transition:border-color 0.12s,box-shadow 0.12s;background:#fff;}
.fi:focus{outline:none;border-color:#7C3AED;box-shadow:0 0 0 3px rgba(124,58,237,0.1);}
textarea.fi{resize:vertical;min-height:72px;}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;}
.divider{font-size:10px;font-weight:700;color:#6B7280;text-transform:uppercase;letter-spacing:0.07em;margin:18px 0 12px;padding-bottom:8px;border-bottom:1px solid #F1F5F9;}
.overlay{position:fixed;inset:0;background:rgba(15,23,42,0.45);z-index:200;display:flex;align-items:flex-start;justify-content:flex-end;}
.drawer{width:480px;max-width:95vw;height:100vh;background:#fff;overflow-y:auto;box-shadow:-12px 0 48px rgba(0,0,0,0.14);display:flex;flex-direction:column;animation:slideIn 0.18s ease;}
@keyframes slideIn{from{transform:translateX(100%);}to{transform:translateX(0);}}
.drawer-head{padding:19px 22px;border-bottom:1px solid #F1F5F9;display:flex;align-items:flex-start;justify-content:space-between;position:sticky;top:0;background:#fff;z-index:1;}
.drawer-title{font-size:16px;font-weight:700;color:#0F172A;font-family:'Sora',sans-serif;}
.drawer-sub{font-size:11px;color:#6B7280;margin-top:2px;}
.drawer-close{width:28px;height:28px;border-radius:7px;background:#F8FAFC;border:1px solid #E2E8F0;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:14px;color:#6B7280;flex-shrink:0;}
.drawer-close:hover{background:#F1F5F9;}
.drawer-body{padding:22px;flex:1;}
.drawer-foot{padding:15px 22px;border-top:1px solid #F1F5F9;display:flex;gap:10px;justify-content:flex-end;}
.modal-c{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:300;display:flex;align-items:center;justify-content:center;}
.modal-box{background:#fff;border-radius:14px;padding:28px;max-width:360px;width:90%;box-shadow:0 24px 80px rgba(0,0,0,0.18);}
.modal-title{font-size:17px;font-weight:700;color:#0F172A;margin-bottom:8px;font-family:'Sora',sans-serif;}
.modal-desc{font-size:13px;color:#6B7280;margin-bottom:22px;line-height:1.6;}
.modal-actions{display:flex;gap:10px;justify-content:flex-end;}
.toasts{position:fixed;bottom:20px;right:20px;z-index:999;display:flex;flex-direction:column;gap:8px;}
.toast{background:#fff;border:1px solid #E2E8F0;border-radius:10px;padding:12px 16px;min-width:250px;max-width:320px;box-shadow:0 4px 20px rgba(0,0,0,0.1);display:flex;align-items:center;gap:10px;animation:tIn 0.2s ease;}
.toast.success{border-left:3px solid #10B981;} .toast.error{border-left:3px solid #EF4444;} .toast.info{border-left:3px solid #7C3AED;}
.toast-txt{font-size:13px;color:#374151;flex:1;}
@keyframes tIn{from{transform:translateX(36px);opacity:0;}to{transform:translateX(0);opacity:1;}}
.toolbar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:16px;}
.search-wrap{display:flex;align-items:center;gap:6px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;padding:0 10px;flex:1;min-width:160px;max-width:260px;}
.search-wrap input{border:none;background:transparent;box-shadow:none;padding:8px 6px;font-size:13px;font-family:'Inter',sans-serif;color:#111827;width:100%;}
.search-wrap input:focus{border:none;box-shadow:none;outline:none;}
.empty{text-align:center;padding:50px 20px;}
.empty-icon{font-size:38px;margin-bottom:12px;}
.empty-head{font-size:15px;font-weight:600;color:#374151;margin-bottom:6px;}
.empty-body{font-size:13px;color:#9CA3AF;}
.stock-bar{height:4px;border-radius:2px;background:#E5E7EB;width:56px;overflow:hidden;margin-top:4px;}
.stock-fill{height:100%;border-radius:2px;}
.toggle{position:relative;display:inline-block;width:36px;height:20px;}
.toggle input{opacity:0;width:0;height:0;}
.slider{position:absolute;cursor:pointer;inset:0;background:#D1D5DB;border-radius:20px;transition:.15s;}
.slider::before{content:'';position:absolute;width:14px;height:14px;left:3px;bottom:3px;background:#fff;border-radius:50%;transition:.15s;}
input:checked+.slider{background:#7C3AED;}
input:checked+.slider::before{transform:translateX(16px);}
.cart-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;}
.preview-panel{background:#F8FAFC;border-radius:10px;padding:18px;}
.preview-label{font-size:10.5px;font-weight:600;color:#6B7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:12px;}
.preview-row{display:flex;flex-direction:column;padding:10px 0;border-bottom:1px solid #E5E7EB;}
.preview-row:last-child{border-bottom:none;}
.pr-key{font-size:11px;color:#9CA3AF;margin-bottom:2px;}
.pr-val{font-size:13px;color:#111827;font-weight:500;}
.dash-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.mono{font-family:monospace;color:#9CA3AF;}
@media(max-width:900px){.stats-grid{grid-template-columns:repeat(2,1fr);}.cart-grid{grid-template-columns:1fr;}.dash-grid{grid-template-columns:1fr;}}
@media(max-width:600px){.stats-grid{grid-template-columns:1fr 1fr;}.page{padding:14px 14px;}.g2,.g3{grid-template-columns:1fr;}}
`;

const BASE = "http://localhost:8000";
const ROLES = ["STUDENT", "TEACHER", "ADMIN"];

const MOCK_STUDENTS = [
  { id: 1, firstName: "Anjali", lastName: "Nair", email: "anjali@campus.in", phone: "9876543210", role: "TEACHER", address: { streetid: 1, street: "12 Marine Lines", city: "Mumbai", state: "Maharashtra", country: "India", zipcode: "400020" } },
  { id: 2, firstName: "Kiran", lastName: "Rao", email: "kiran@campus.in", phone: "8765432109", role: "STUDENT", address: { streetid: 2, street: "34 Brigade Road", city: "Bengaluru", state: "Karnataka", country: "India", zipcode: "560001" } },
  { id: 3, firstName: "Suresh", lastName: "Patel", email: "suresh@campus.in", phone: "7654321098", role: "ADMIN", address: { streetid: 3, street: "56 Anna Salai", city: "Chennai", state: "Tamil Nadu", country: "India", zipcode: "600002" } },
  { id: 4, firstName: "Meera", lastName: "Krishnan", email: "meera@campus.in", phone: "6543210987", role: "STUDENT", address: { streetid: 4, street: "78 Park Street", city: "Kolkata", state: "West Bengal", country: "India", zipcode: "700016" } },
];
const MOCK_PRODUCTS = [
  { id: 1, name: "Data Structures Handbook", description: "Complete guide to DSA with Java examples and practice problems", price: 799, category: "Books", stockQuantity: 120, imageUrl: "", active: true },
  { id: 2, name: "Spring Boot Masterclass", description: "Build production-ready REST APIs with Spring Boot 3.x", price: 3499, category: "Courses", stockQuantity: 200, imageUrl: "", active: true },
  { id: 3, name: "Mechanical Keyboard", description: "RGB backlit mechanical keyboard with tactile switches", price: 4999, category: "Electronics", stockQuantity: 3, imageUrl: "", active: true },
  { id: 4, name: "JS: The Good Parts", description: "Classic JavaScript design patterns by Douglas Crockford", price: 649, category: "Books", stockQuantity: 0, imageUrl: "", active: false },
];

async function apiFetch(method, path, body = null, extraHeaders = {}) {
  const opts = { method, headers: { "Content-Type": "application/json", ...extraHeaders }, signal: AbortSignal.timeout(5000) };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

const fmtINR = n => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
const fullName = s => `${s.firstName} ${s.lastName}`;

function RoleBadge({ role }) {
  const cls = { STUDENT: "b-student", TEACHER: "b-teacher", ADMIN: "b-admin" };
  return <span className={`badge ${cls[role] || "b-inactive"}`}>{role}</span>;
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return [toasts, push];
}

function Toasts({ toasts }) {
  const icons = { success: "✅", error: "❌", info: "💜" };
  return <div className="toasts">{toasts.map(t => <div key={t.id} className={`toast ${t.type}`}><span>{icons[t.type]}</span><span className="toast-txt">{t.msg}</span></div>)}</div>;
}

function Confirm({ title, desc, onOk, onCancel, danger = true }) {
  return (
    <div className="modal-c">
      <div className="modal-box">
        <div style={{ fontSize: 32, marginBottom: 12 }}>🗑️</div>
        <div className="modal-title">{title}</div>
        <div className="modal-desc">{desc}</div>
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button className={`btn ${danger ? "btn-danger" : "btn-violet"}`} onClick={onOk}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function Drawer({ title, sub, children, onClose, footer }) {
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="drawer">
        <div className="drawer-head">
          <div><div className="drawer-title">{title}</div>{sub && <div className="drawer-sub">{sub}</div>}</div>
          <div className="drawer-close" onClick={onClose}>✕</div>
        </div>
        <div className="drawer-body">{children}</div>
        {footer && <div className="drawer-foot">{footer}</div>}
      </div>
    </div>
  );
}

// ── STUDENTS ─────────────────────────────────────────────────────────
function Students({ students, setStudents, toast, demo }) {
  const [mode, setMode] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);
  const blank = { firstName: "", lastName: "", email: "", phone: "", role: "STUDENT", address: { street: "", city: "", state: "", country: "India", zipcode: "" } };
  const [form, setForm] = useState(blank);

  function patchForm(path, val) {
    const keys = path.split(".");
    setForm(f => {
      const c = JSON.parse(JSON.stringify(f));
      let r = c; for (let i = 0; i < keys.length - 1; i++) r = r[keys[i]];
      r[keys[keys.length - 1]] = val; return c;
    });
  }

  async function save() {
    setSaving(true);
    try {
      if (demo) {
        if (mode === "add") setStudents(p => [...p, { ...form, id: Date.now() }]);
        else setStudents(p => p.map(x => x.id === editing.id ? { ...editing, ...form } : x));
        toast("Saved in demo mode", "success");
      } else {
        if (mode === "add") { const r = await apiFetch("POST", "/api/v1/students", form); setStudents(p => [...p, r]); toast("Student added", "success"); }
        else { const r = await apiFetch("PUT", `/api/v1/students/${editing.id}`, form); setStudents(p => p.map(x => x.id === editing.id ? r : x)); toast("Student updated", "success"); }
      }
      setMode(null);
    } catch { toast("Save failed", "error"); }
    finally { setSaving(false); }
  }

  async function del(id) {
    try {
      if (!demo) await apiFetch("DELETE", `/api/v1/students/${id}`);
      setStudents(p => p.filter(x => x.id !== id));
      toast("Student removed", "success");
    } catch { toast("Delete failed", "error"); }
    setDeleting(null);
  }

  return (
    <>
      <div className="page-head">
        <div><div className="page-title">Students</div><div className="page-sub">{students.length} records</div></div>
        <button className="btn btn-violet" onClick={() => { setForm(blank); setMode("add"); }}>＋ Add Student</button>
      </div>
      <div className="card">
        {students.length === 0 ? (
          <div className="empty"><div className="empty-icon">👥</div><div className="empty-head">No students yet</div><div className="empty-body">Click "Add Student" to create your first record.</div></div>
        ) : (
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>City</th><th>Actions</th></tr></thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td><span className="mono">#{s.id}</span></td>
                  <td style={{ fontWeight: 500 }}>{fullName(s)}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td><RoleBadge role={s.role} /></td>
                  <td>{s.address?.city || "—"}</td>
                  <td><div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(s); setForm({ ...s }); setMode("edit"); }}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleting(s)}>Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {mode && (
        <Drawer title={mode === "add" ? "Add Student" : "Edit Student"} sub={mode === "edit" ? `Editing: ${fullName(editing)}` : "Fill in student details"} onClose={() => setMode(null)}
          footer={<><button className="btn btn-ghost" onClick={() => setMode(null)}>Cancel</button><button className="btn btn-violet" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Student"}</button></>}>
          <div className="g2">
            <div className="form-row"><label className="form-label">First Name</label><input className="fi" value={form.firstName} onChange={e => patchForm("firstName", e.target.value)} placeholder="First name" /></div>
            <div className="form-row"><label className="form-label">Last Name</label><input className="fi" value={form.lastName} onChange={e => patchForm("lastName", e.target.value)} placeholder="Last name" /></div>
          </div>
          <div className="form-row"><label className="form-label">Email</label><input className="fi" type="email" value={form.email} onChange={e => patchForm("email", e.target.value)} placeholder="email@example.com" /></div>
          <div className="g2">
            <div className="form-row"><label className="form-label">Phone</label><input className="fi" value={form.phone} onChange={e => patchForm("phone", e.target.value)} placeholder="10-digit mobile" /></div>
            <div className="form-row"><label className="form-label">Role</label><select className="fi" value={form.role} onChange={e => patchForm("role", e.target.value)}>{ROLES.map(r => <option key={r}>{r}</option>)}</select></div>
          </div>
          <div className="divider">Address</div>
          <div className="form-row"><label className="form-label">Street</label><input className="fi" value={form.address?.street || ""} onChange={e => patchForm("address.street", e.target.value)} placeholder="Street address" /></div>
          <div className="g2">
            <div className="form-row"><label className="form-label">City</label><input className="fi" value={form.address?.city || ""} onChange={e => patchForm("address.city", e.target.value)} placeholder="City" /></div>
            <div className="form-row"><label className="form-label">State</label><input className="fi" value={form.address?.state || ""} onChange={e => patchForm("address.state", e.target.value)} placeholder="State" /></div>
          </div>
          <div className="g2">
            <div className="form-row"><label className="form-label">Country</label><input className="fi" value={form.address?.country || ""} onChange={e => patchForm("address.country", e.target.value)} placeholder="Country" /></div>
            <div className="form-row"><label className="form-label">ZIP Code</label><input className="fi" value={form.address?.zipcode || ""} onChange={e => patchForm("address.zipcode", e.target.value)} placeholder="ZIP" /></div>
          </div>
        </Drawer>
      )}
      {deleting && <Confirm title="Delete Student?" desc={`This permanently removes ${fullName(deleting)} and all their data.`} onOk={() => del(deleting.id)} onCancel={() => setDeleting(null)} />}
    </>
  );
}

// ── PRODUCTS ─────────────────────────────────────────────────────────
function Products({ products, setProducts, toast, demo }) {
  const [mode, setMode] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const blank = { name: "", description: "", price: "", category: "Books", stockQuantity: "", imageUrl: "", active: true };
  const [form, setForm] = useState(blank);
  const patch = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  async function save() {
    setSaving(true);
    const payload = { ...form, price: parseFloat(form.price) || 0, stockQuantity: parseInt(form.stockQuantity) || 0 };
    try {
      if (demo) {
        if (mode === "add") setProducts(p => [...p, { ...payload, id: Date.now() }]);
        else setProducts(p => p.map(x => x.id === editing.id ? { ...x, ...payload } : x));
        toast("Saved in demo mode", "success");
      } else {
        if (mode === "add") { const r = await apiFetch("POST", "/api/v1/products", payload); setProducts(p => [...p, r]); toast("Product created", "success"); }
        else { const r = await apiFetch("PUT", `/api/v1/products/${editing.id}`, payload); setProducts(p => p.map(x => x.id === editing.id ? r : x)); toast("Product updated", "success"); }
      }
      setMode(null);
    } catch { toast("Save failed", "error"); }
    finally { setSaving(false); }
  }

  async function del(id) {
    try {
      if (!demo) await apiFetch("DELETE", `/api/v1/products/${id}`);
      setProducts(p => p.filter(x => x.id !== id));
      toast("Product removed", "success");
    } catch { toast("Delete failed", "error"); }
    setDeleting(null);
  }

  function StockCell({ q }) {
    const pct = Math.min(100, (q / 200) * 100);
    const col = q === 0 ? "#EF4444" : q <= 5 ? "#F59E0B" : "#10B981";
    return <div><span style={{ fontSize: 12, fontWeight: 600 }}>{q}</span><div className="stock-bar"><div className="stock-fill" style={{ width: `${pct}%`, background: col }} /></div></div>;
  }

  return (
    <>
      <div className="page-head">
        <div><div className="page-title">Products</div><div className="page-sub">{products.length} items</div></div>
        <button className="btn btn-violet" onClick={() => { setForm(blank); setMode("add"); }}>＋ Add Product</button>
      </div>
      <div className="toolbar">
        <div className="search-wrap">
          <span style={{ color: "#9CA3AF", fontSize: 14 }}>🔍</span>
          <input placeholder="Search by name or category…" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span style={{ fontSize: 12, color: "#9CA3AF" }}>{filtered.length} of {products.length} shown</span>
      </div>
      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty"><div className="empty-icon">📦</div><div className="empty-head">{search ? "No results" : "No products yet"}</div><div className="empty-body">{search ? "Try a different term." : "Add your first product above."}</div></div>
        ) : (
          <table>
            <thead><tr><th>ID</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td><span className="mono">#{p.id}</span></td>
                  <td>
                    <div style={{ fontWeight: 500 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{(p.description || "").slice(0, 44)}{p.description?.length > 44 ? "…" : ""}</div>
                  </td>
                  <td><span className="badge b-cat">{p.category}</span></td>
                  <td style={{ fontWeight: 600, color: "#0F172A" }}>{fmtINR(p.price)}</td>
                  <td><StockCell q={p.stockQuantity} /></td>
                  <td>{p.active ? <span className="badge b-active">Active</span> : <span className="badge b-inactive">Inactive</span>}</td>
                  <td><div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(p); setForm({ ...p }); setMode("edit"); }}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleting(p)}>Delete</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {mode && (
        <Drawer title={mode === "add" ? "Add Product" : "Edit Product"} sub={mode === "edit" ? `Editing: ${editing.name}` : "Fill in product details"} onClose={() => setMode(null)}
          footer={<><button className="btn btn-ghost" onClick={() => setMode(null)}>Cancel</button><button className="btn btn-violet" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Product"}</button></>}>
          <div className="form-row"><label className="form-label">Product Name</label><input className="fi" value={form.name} onChange={e => patch("name", e.target.value)} placeholder="Product name" /></div>
          <div className="form-row"><label className="form-label">Description</label><textarea className="fi" value={form.description} onChange={e => patch("description", e.target.value)} placeholder="Short description…" /></div>
          <div className="g3">
            <div className="form-row"><label className="form-label">Price (₹)</label><input className="fi" type="number" value={form.price} onChange={e => patch("price", e.target.value)} placeholder="0" /></div>
            <div className="form-row"><label className="form-label">Stock Qty</label><input className="fi" type="number" value={form.stockQuantity} onChange={e => patch("stockQuantity", e.target.value)} placeholder="0" /></div>
            <div className="form-row"><label className="form-label">Category</label><select className="fi" value={form.category} onChange={e => patch("category", e.target.value)}>{["Books","Courses","Electronics","Stationery","Other"].map(c => <option key={c}>{c}</option>)}</select></div>
          </div>
          <div className="form-row"><label className="form-label">Image URL</label><input className="fi" value={form.imageUrl} onChange={e => patch("imageUrl", e.target.value)} placeholder="https://…" /></div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
            <label className="toggle"><input type="checkbox" checked={form.active} onChange={e => patch("active", e.target.checked)} /><span className="slider" /></label>
            <span style={{ fontSize: 13, color: "#374151" }}>Product is active</span>
          </div>
        </Drawer>
      )}
      {deleting && <Confirm title="Delete Product?" desc={`"${deleting.name}" will be permanently removed from the catalog.`} onOk={() => del(deleting.id)} onCancel={() => setDeleting(null)} />}
    </>
  );
}

// ── CART ──────────────────────────────────────────────────────────────
function Cart({ students, products, toast, demo }) {
  const [form, setForm] = useState({ studentId: "", productId: "", quantity: 1, price: "" });
  const [loading, setLoading] = useState(false);
  const patch = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const selProduct = products.find(p => String(p.id) === String(form.productId));
  const selStudent = students.find(s => String(s.id) === String(form.studentId));

  useEffect(() => { if (selProduct) patch("price", selProduct.price); }, [form.productId]);

  const total = (parseFloat(form.price) || 0) * (parseInt(form.quantity) || 0);
  const available = products.filter(p => p.active && p.stockQuantity > 0);

  async function addToCart() {
    if (!form.studentId || !form.productId) { toast("Select a student and product first", "error"); return; }
    setLoading(true);
    try {
      if (demo) { toast(`Added to cart (demo) for ${fullName(selStudent)}`, "success"); }
      else {
        await apiFetch("POST", "/api/cart", { productId: Number(form.productId), quantity: Number(form.quantity), price: parseFloat(form.price) }, { "X-Student-ID": String(form.studentId) });
        toast(`Added to cart for ${fullName(selStudent)}`, "success");
      }
      setForm(f => ({ ...f, productId: "", quantity: 1, price: "" }));
    } catch (e) { toast("Cart error: " + (e.message || "unknown"), "error"); }
    finally { setLoading(false); }
  }

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        <div className="page-title">Add to Cart</div>
        <div className="page-sub">Assign a product to a student's cart</div>
      </div>
      <div className="cart-grid">
        <div className="card">
          <div className="card-head"><span className="card-title">Cart Details</span></div>
          <div style={{ padding: "20px 22px" }}>
            <div className="form-row"><label className="form-label">Student</label>
              <select className="fi" value={form.studentId} onChange={e => patch("studentId", e.target.value)}>
                <option value="">Select a student…</option>
                {students.map(s => <option key={s.id} value={s.id}>{fullName(s)} · {s.role}</option>)}
              </select>
            </div>
            <div className="form-row"><label className="form-label">Product</label>
              <select className="fi" value={form.productId} onChange={e => patch("productId", e.target.value)}>
                <option value="">Select a product…</option>
                {available.map(p => <option key={p.id} value={p.id}>{p.name} — {fmtINR(p.price)}</option>)}
              </select>
            </div>
            <div className="g2">
              <div className="form-row"><label className="form-label">Quantity</label><input className="fi" type="number" min="1" value={form.quantity} onChange={e => patch("quantity", e.target.value)} /></div>
              <div className="form-row"><label className="form-label">Unit Price (₹)</label><input className="fi" type="number" value={form.price} onChange={e => patch("price", e.target.value)} /></div>
            </div>
            <button className="btn btn-violet" style={{ width: "100%", justifyContent: "center", marginTop: 4 }} onClick={addToCart} disabled={loading}>
              {loading ? "Adding to cart…" : "🛒  Add to Cart"}
            </button>
          </div>
        </div>

        <div>
          <div className="preview-panel" style={{ marginBottom: 16 }}>
            <div className="preview-label">Order Preview</div>
            <div className="preview-row"><span className="pr-key">Student</span><span className="pr-val">{selStudent ? fullName(selStudent) : "—"}</span>{selStudent && <span style={{ fontSize: 11, color: "#94A3B8" }}>{selStudent.email}</span>}</div>
            <div className="preview-row"><span className="pr-key">Product</span><span className="pr-val">{selProduct ? selProduct.name : "—"}</span>{selProduct && <span style={{ fontSize: 11, color: "#94A3B8" }}>{selProduct.category}</span>}</div>
            <div className="preview-row"><span className="pr-key">Qty × Unit</span><span className="pr-val">{form.quantity} × {fmtINR(form.price)}</span></div>
            <div style={{ paddingTop: 12 }}><span style={{ fontSize: 11, color: "#9CA3AF" }}>Total</span><div style={{ fontSize: 24, fontWeight: 700, color: "#7C3AED", fontFamily: "'Sora', sans-serif", lineHeight: 1.2 }}>{fmtINR(total)}</div></div>
          </div>
          <div className="card">
            <div className="card-head"><span className="card-title">Available Products</span></div>
            {available.length === 0 ? <div className="empty" style={{ padding: "20px" }}><div className="empty-body">No in-stock products</div></div> :
              available.slice(0, 6).map(p => (
                <div key={p.id} style={{ padding: "11px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F8FAFC" }}>
                  <div><div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div><div style={{ fontSize: 11, color: "#94A3B8" }}>{p.category} · {p.stockQuantity} left</div></div>
                  <span style={{ fontWeight: 600, color: "#7C3AED", fontSize: 13 }}>{fmtINR(p.price)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────
function Dashboard({ students, products }) {
  const active = products.filter(p => p.active).length;
  const alerts = products.filter(p => p.stockQuantity <= 5).length;
  const cats = [...new Set(products.map(p => p.category))];

  const stats = [
    { icon: "👥", num: students.length, label: "Total Students", sub: `${students.filter(s => s.role === "STUDENT").length} students · ${students.filter(s => s.role === "TEACHER").length} teachers` },
    { icon: "📦", num: products.length, label: "Total Products", sub: `${cats.length} categories` },
    { icon: "✅", num: active, label: "Active Products", sub: `${Math.round((active / Math.max(products.length, 1)) * 100)}% of catalog` },
    { icon: "⚠️", num: alerts, label: "Stock Alerts", sub: `${products.filter(p => p.stockQuantity === 0).length} out of stock` },
  ];

  return (
    <>
      <div style={{ marginBottom: 22 }}><div className="page-title">Dashboard</div><div className="page-sub">Management overview</div></div>
      <div className="stats-grid">
        {stats.map((s, i) => <div key={i} className="stat"><div className="stat-icon">{s.icon}</div><div className="stat-num">{s.num}</div><div className="stat-label">{s.label}</div><div className="stat-sub">{s.sub}</div></div>)}
      </div>
      <div className="dash-grid">
        <div className="card">
          <div className="card-head"><span className="card-title">Recent Students</span></div>
          {students.length === 0 ? <div className="empty" style={{ padding: 24 }}><div className="empty-body">No students yet</div></div> :
            [...students].reverse().slice(0, 5).map(s => (
              <div key={s.id} style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F8FAFC" }}>
                <div><div style={{ fontSize: 13, fontWeight: 500 }}>{fullName(s)}</div><div style={{ fontSize: 11, color: "#94A3B8" }}>{s.email}</div></div>
                <RoleBadge role={s.role} />
              </div>
            ))}
        </div>
        <div className="card">
          <div className="card-head"><span className="card-title">Recent Products</span></div>
          {products.length === 0 ? <div className="empty" style={{ padding: 24 }}><div className="empty-body">No products yet</div></div> :
            [...products].reverse().slice(0, 5).map(p => (
              <div key={p.id} style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F8FAFC" }}>
                <div><div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div><div style={{ fontSize: 11, color: "#94A3B8" }}>{p.category}</div></div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{fmtINR(p.price)}</div>
                  {p.active ? <span className="badge b-active" style={{ fontSize: 10 }}>Active</span> : <span className="badge b-inactive" style={{ fontSize: 10 }}>Inactive</span>}
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

// ── APP ───────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", icon: "🏠", label: "Dashboard" },
  { id: "students", icon: "👥", label: "Students" },
  { id: "products", icon: "📦", label: "Products" },
  { id: "cart", icon: "🛒", label: "Cart" },
];

export default function App() {
  const [section, setSection] = useState("dashboard");
  const [students, setStudents] = useState([]);
  const [products, setProducts] = useState([]);
  const [demo, setDemo] = useState(false);
  const [status, setStatus] = useState("connecting");
  const [toasts, toast] = useToast();

  useEffect(() => {
    (async () => {
      try {
        const [ss, ps] = await Promise.all([apiFetch("GET", "/api/v1/students"), apiFetch("GET", "/api/v1/products")]);
        setStudents(Array.isArray(ss) ? ss : []);
        setProducts(Array.isArray(ps) ? ps : []);
        setStatus("connected"); setDemo(false);
      } catch {
        setStudents(MOCK_STUDENTS); setProducts(MOCK_PRODUCTS);
        setStatus("demo"); setDemo(true);
      }
    })();
  }, []);

  const TITLES = { dashboard: "Dashboard", students: "Students", products: "Products", cart: "Add to Cart" };

  return (
    <>
      <style>{css}</style>
      <div className="shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon">🎓</div>
            <div><div className="brand-name">EduManage</div><div className="brand-sub">Spring Boot · v0.0.1</div></div>
          </div>
          <nav className="nav">
            <div className="nav-label">Navigation</div>
            {NAV.map(n => (
              <div key={n.id} className={`nav-item ${section === n.id ? "active" : ""}`} onClick={() => setSection(n.id)}>
                <span style={{ fontSize: 15 }}>{n.icon}</span>
                <span>{n.label}</span>
                <span className="nav-dot" />
              </div>
            ))}
          </nav>
          <div className="sidebar-foot">
            <div className={`api-badge ${status === "connected" ? "live" : "demo"}`}>
              <div className={`pulse ${status === "connected" ? "green" : "violet"}`} />
              <span style={{ lineHeight: 1.3 }}>{status === "connected" ? <>API Connected<br /><span style={{ fontSize: 10, opacity: 0.7 }}>localhost:8000</span></> : <>Demo Mode<br /><span style={{ fontSize: 10, opacity: 0.7 }}>No backend found</span></>}</span>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div>
              <div className="topbar-title">{TITLES[section]}</div>
              {demo && <div className="topbar-hint">Showing sample data — start your Spring Boot server at localhost:8000 to connect</div>}
            </div>
          </div>
          <div className="page">
            {section === "dashboard" && <Dashboard students={students} products={products} />}
            {section === "students" && <Students students={students} setStudents={setStudents} toast={toast} demo={demo} />}
            {section === "products" && <Products products={products} setProducts={setProducts} toast={toast} demo={demo} />}
            {section === "cart" && <Cart students={students} products={products} toast={toast} demo={demo} />}
          </div>
        </main>
      </div>
      <Toasts toasts={toasts} />
    </>
  );
}
