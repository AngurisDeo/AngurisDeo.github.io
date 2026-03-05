import { useState } from "react";
function VolunteerDemo() {
  const initVols = [
    { id: 1, name: "Maria Santos", role: "Event Coordinator", status: "active", hours: 42, email: "maria@vol.org", events: ["Food Drive", "Tech Workshop"], phone: "905-555-0101" },
    { id: 2, name: "James Okafor", role: "Tech Support", status: "active", hours: 28, email: "james@vol.org", events: ["Tech Workshop"], phone: "905-555-0102" },
    { id: 3, name: "Priya Patel", role: "Outreach Lead", status: "inactive", hours: 15, email: "priya@vol.org", events: ["Food Drive"], phone: "905-555-0103" },
    { id: 4, name: "Lucas Chen", role: "Logistics", status: "active", hours: 33, email: "lucas@vol.org", events: ["Food Drive", "Cleanup"], phone: "905-555-0104" },
  ];
  const [volunteers, setVolunteers] = useState(initVols);
  const [view, setView] = useState("list");
  const [form, setForm] = useState({ name: "", role: "", email: "", phone: "" });
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);

  let filtered = volunteers.filter(v => filter === "all" || v.status === filter);
  if (search) filtered = filtered.filter(v => v.name.toLowerCase().includes(search.toLowerCase()) || v.role.toLowerCase().includes(search.toLowerCase()));

  const totalHours = volunteers.reduce((s, v) => s + v.hours, 0);
  const activeCount = volunteers.filter(v => v.status === "active").length;

  const addVol = () => {
    if (!form.name || !form.role) return;
    setVolunteers([...volunteers, { id: Date.now(), name: form.name, role: form.role, email: form.email, phone: form.phone, status: "active", hours: 0, events: [] }]);
    setForm({ name: "", role: "", email: "", phone: "" }); setView("list");
  };
  const toggleStatus = (id) => setVolunteers(v => v.map(vol => vol.id === id ? { ...vol, status: vol.status === "active" ? "inactive" : "active" } : vol));
  const addHours = (id, n) => setVolunteers(v => v.map(vol => vol.id === id ? { ...vol, hours: vol.hours + n } : vol));
  const deleteVol = (id) => { setVolunteers(v => v.filter(vol => vol.id !== id)); setSelected(null); };

  const S = { fontFamily: "'Space Mono',monospace" };
  const selectedVol = selected ? volunteers.find(v => v.id === selected) : null;

  return (
    <div style={{ ...S, background: "#0A0A0F", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#111", borderBottom: "1px solid #1E1E2E", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: "#FF9671", fontWeight: 700, fontSize: 13 }}>🤝 VolunteerHub</span>
        <div style={{ display: "flex", gap: 5 }}>
          {[["list", "📋 List"], ["add", "+ Add"], ["stats", "📊 Stats"]].map(([t, lbl]) => (
            <button key={t} onClick={() => { setView(t); setSelected(null); }} style={{ background: view === t ? "#FF9671" : "transparent", color: view === t ? "#000" : "#888", border: "1px solid #FF967133", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 10, ...S }}>{lbl}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", padding: 14 }}>
        {/* LIST */}
        {view === "list" && !selectedVol && (
          <>
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search volunteers…" style={{ flex: 1, background: "#111118", border: "1px solid #2A2A3E", color: "#E8E8F0", padding: "6px 10px", borderRadius: 4, fontSize: 11, ...S, outline: "none" }} />
              <div style={{ display: "flex", gap: 4 }}>
                {["all", "active", "inactive"].map(f => <button key={f} onClick={() => setFilter(f)} style={{ background: filter === f ? "#FF967133" : "transparent", color: filter === f ? "#FF9671" : "#555", border: "1px solid #2A2A3E", padding: "3px 8px", borderRadius: 3, cursor: "pointer", fontSize: 10, ...S, textTransform: "capitalize" }}>{f}</button>)}
              </div>
            </div>
            {filtered.map(v => (
              <div key={v.id} onClick={() => setSelected(v.id)} style={{ background: "#111118", border: "1px solid #1E1E2E", borderRadius: 8, padding: 12, marginBottom: 8, cursor: "pointer", transition: "all 0.15s" }} onMouseOver={e => { e.currentTarget.style.borderColor = "#FF967166"; e.currentTarget.style.transform = "translateX(2px)"; }} onMouseOut={e => { e.currentTarget.style.borderColor = "#1E1E2E"; e.currentTarget.style.transform = ""; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#FF967122", border: "1px solid #FF967144", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#FF9671", fontWeight: 700 }}>{v.name[0]}</div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: "#E8E8F0" }}>{v.name}</div>
                      <div style={{ fontSize: 10, color: "#888" }}>{v.role}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 10, background: v.status === "active" ? "#00FFB222" : "#55555522", color: v.status === "active" ? "#00FFB2" : "#555", border: `1px solid ${v.status === "active" ? "#00FFB244" : "#55555544"}` }}>{v.status}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 10, color: "#FF9671" }}>⏱ {v.hours}h logged</div>
                  <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
                    <button onClick={() => addHours(v.id, 1)} style={{ background: "#FF967122", color: "#FF9671", border: "none", padding: "3px 7px", borderRadius: 3, cursor: "pointer", fontSize: 10, ...S }}>+1h</button>
                    <button onClick={() => addHours(v.id, 4)} style={{ background: "#FF967122", color: "#FF9671", border: "none", padding: "3px 7px", borderRadius: 3, cursor: "pointer", fontSize: 10, ...S }}>+4h</button>
                    <button onClick={() => toggleStatus(v.id)} style={{ background: "#1E1E2E", color: "#888", border: "1px solid #2A2A3E", padding: "3px 7px", borderRadius: 3, cursor: "pointer", fontSize: 10, ...S }}>Toggle</button>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && <div style={{ textAlign: "center", color: "#555", marginTop: 30, fontSize: 12 }}>No volunteers found</div>}
          </>
        )}

        {/* DETAIL */}
        {view === "list" && selectedVol && (
          <div>
            <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: "#FF9671", cursor: "pointer", fontSize: 11, ...S, marginBottom: 14, display: "flex", alignItems: "center", gap: 4 }}>← Back to list</button>
            <div style={{ background: "#111118", border: "1px solid #1E1E2E", borderRadius: 10, padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#FF967122", border: "2px solid #FF967144", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#FF9671", fontWeight: 700 }}>{selectedVol.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: "#E8E8F0", marginBottom: 3 }}>{selectedVol.name}</div>
                    <div style={{ fontSize: 11, color: "#888" }}>{selectedVol.role}</div>
                    {selectedVol.email && <div style={{ fontSize: 10, color: "#555", marginTop: 3 }}>✉ {selectedVol.email}</div>}
                    {selectedVol.phone && <div style={{ fontSize: 10, color: "#555" }}>☎ {selectedVol.phone}</div>}
                  </div>
                </div>
                <span style={{ fontSize: 9, padding: "3px 10px", borderRadius: 10, background: selectedVol.status === "active" ? "#00FFB222" : "#55555522", color: selectedVol.status === "active" ? "#00FFB2" : "#555", border: `1px solid ${selectedVol.status === "active" ? "#00FFB244" : "#55555544"}` }}>{selectedVol.status}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                {[["Total Hours", `${selectedVol.hours}h`, "#FF9671"], ["Events", selectedVol.events.length, "#00FFB2"], ["Status", selectedVol.status === "active" ? "Active" : "Inactive", selectedVol.status === "active" ? "#00FFB2" : "#555"], ["This Month", `${Math.round(selectedVol.hours / 4)}h`, "#845EC2"]].map(([label, val, col]) => (
                  <div key={label} style={{ background: "#0A0A0F", borderRadius: 6, padding: 10, textAlign: "center" }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: col }}>{val}</div>
                    <div style={{ fontSize: 9, color: "#555", marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
              {selectedVol.events.length > 0 && <div style={{ marginBottom: 14 }}><div style={{ fontSize: 9, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 2 }}>Events</div><div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>{selectedVol.events.map(e => <span key={e} style={{ fontSize: 10, padding: "3px 8px", background: "#FF967122", color: "#FF9671", borderRadius: 3 }}>{e}</span>)}</div></div>}
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[1, 4, 8].map(n => <button key={n} onClick={() => addHours(selectedVol.id, n)} style={{ background: "#FF967122", color: "#FF9671", border: "1px solid #FF967133", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 11, ...S }}>+{n}h</button>)}
                <button onClick={() => toggleStatus(selectedVol.id)} style={{ background: "#1E1E2E", color: "#888", border: "1px solid #2A2A3E", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 11, ...S }}>Toggle Status</button>
                <button onClick={() => deleteVol(selectedVol.id)} style={{ background: "#FF3B5C22", color: "#FF3B5C", border: "1px solid #FF3B5C33", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 11, ...S }}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* ADD */}
        {view === "add" && (
          <div style={{ maxWidth: 360 }}>
            <div style={{ fontSize: 13, color: "#FF9671", fontWeight: 700, marginBottom: 16 }}>Add New Volunteer</div>
            {[["Full Name *", "name", "text"], ["Role *", "role", "text"], ["Email", "email", "email"], ["Phone", "phone", "tel"]].map(([label, key, type]) => (
              <div key={key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 9, color: "#555", display: "block", marginBottom: 5, ...S, textTransform: "uppercase", letterSpacing: 1 }}>{label}</label>
                <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={{ width: "100%", background: "#111118", border: "1px solid #2A2A3E", color: "#E8E8F0", padding: "8px 12px", borderRadius: 4, fontSize: 12, ...S, outline: "none" }} />
              </div>
            ))}
            <button onClick={addVol} style={{ background: "#FF9671", color: "#000", border: "none", padding: "10px", borderRadius: 4, cursor: "pointer", ...S, fontSize: 12, fontWeight: 700, width: "100%", marginTop: 4 }}>Add Volunteer →</button>
          </div>
        )}

        {/* STATS */}
        {view === "stats" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[["Total", volunteers.length, "👥"], ["Active", activeCount, "✅"], ["Hours", totalHours + "h", "⏱"], ["Avg Hrs", Math.round(totalHours / Math.max(volunteers.length, 1)) + "h", "📊"]].map(([label, val, icon]) => (
                <div key={label} style={{ background: "#111118", border: "1px solid #1E1E2E", borderRadius: 8, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 22 }}>{icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: "#FF9671", marginTop: 4 }}>{val}</div>
                  <div style={{ fontSize: 9, color: "#555", marginTop: 2, ...S }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 9, color: "#555", marginBottom: 10, textTransform: "uppercase", letterSpacing: 2, ...S }}>Hours Breakdown</div>
            {[...volunteers].sort((a, b) => b.hours - a.hours).map(v => (
              <div key={v.id} style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                  <span style={{ color: "#E8E8F0", ...S }}>{v.name}</span>
                  <span style={{ color: "#FF9671", ...S }}>{v.hours}h</span>
                </div>
                <div style={{ background: "#1A1A2E", borderRadius: 2, height: 5, overflow: "hidden" }}>
                  <div style={{ width: `${(v.hours / Math.max(...volunteers.map(x => x.hours), 1)) * 100}%`, height: "100%", background: "linear-gradient(90deg,#FF9671,#FF6B35)", borderRadius: 2, transition: "width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export default VolunteerDemo;
