import { useState } from "react";
function MobileDemo() {
  const [screen, setScreen] = useState("home");
  const [tasks, setTasks] = useState([
    { id: 1, text: "Push portfolio to GitHub", done: false, priority: "high" },
    { id: 2, text: "Apply to 3 internships today", done: false, priority: "high" },
    { id: 3, text: "Review React hooks", done: true, priority: "medium" },
    { id: 4, text: "Update LinkedIn profile", done: false, priority: "medium" },
    { id: 5, text: "Practice BJJ drills", done: true, priority: "low" },
  ]);
  const [newTask, setNewTask] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [messages] = useState([
    { id: 1, from: "Recruiter @ Shopify", text: "We'd love to chat about your React skills!", time: "2m", unread: true },
    { id: 2, from: "Prof. Williams", text: "Great work on the final project!", time: "1h", unread: false },
    { id: 3, from: "Team Lead @ Durham", text: "Can you demo your portfolio tomorrow?", time: "3h", unread: true },
  ]);
  const prioColor = { high: "#FF3B5C", medium: "#FF9500", low: "#00FFB2" };
  const APPS = [{ icon: "✅", label: "Tasks", screen: "tasks" }, { icon: "🌤", label: "Weather", screen: "weather" }, { icon: "💬", label: "Messages", screen: "messages" }, { icon: "📊", label: "Stats", screen: "stats" }];
  const toggleTask = (id) => setTasks(t => t.map(task => task.id === id ? { ...task, done: !task.done } : task));
  const addTask = () => { if (!newTask.trim()) return; setTasks(t => [...t, { id: Date.now(), text: newTask, done: false, priority: newPriority }]); setNewTask(""); };
  const deleteTask = (id) => setTasks(t => t.filter(task => task.id !== id));
  const S = { fontFamily: "'Space Mono',monospace" };
  const done = tasks.filter(t => t.done).length;

  return (
    <div style={{ ...S, background: "#0A0A0F", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 264, height: 480, background: "#111118", borderRadius: 32, border: "2px solid #2A2A3E", overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 24px 48px rgba(0,0,0,0.8)" }}>
        <div style={{ background: "#0C0C14", padding: "8px 16px 4px", display: "flex", justifyContent: "space-between", fontSize: 9, color: "#555", ...S }}>
          <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span><span>📶 🔋</span>
        </div>
        <div style={{ flex: 1, overflow: "auto" }}>
          {screen === "home" && (
            <div style={{ padding: 16 }}>
              <div style={{ marginBottom: 16, textAlign: "center" }}>
                <div style={{ fontSize: 9, color: "#555", marginBottom: 2, ...S }}>OSHAWA, ON</div>
                <div style={{ fontSize: 30, fontWeight: 700, color: "#00C9FF" }}>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                <div style={{ fontSize: 9, color: "#555", marginTop: 2, ...S }}>{new Date().toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
                {APPS.map(app => (
                  <button key={app.screen} onClick={() => setScreen(app.screen)} style={{ background: "#15151C", border: "1px solid #1E1E2E", borderRadius: 14, padding: "14px 10px", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, transition: "all 0.15s" }} onMouseOver={e => { e.currentTarget.style.background = "#1E1E2E"; e.currentTarget.style.transform = "scale(1.03)"; }} onMouseOut={e => { e.currentTarget.style.background = "#15151C"; e.currentTarget.style.transform = ""; }}>
                    <span style={{ fontSize: 22 }}>{app.icon}</span>
                    <span style={{ fontSize: 9, color: "#888", ...S }}>{app.label}</span>
                  </button>
                ))}
              </div>
              <div style={{ background: "#15151C", border: "1px solid #1E1E2E", borderRadius: 10, padding: 10 }}>
                <div style={{ fontSize: 9, color: "#555", marginBottom: 5, ...S }}>TASKS</div>
                <div style={{ background: "#1A1A2E", borderRadius: 2, height: 3, marginBottom: 4 }}>
                  <div style={{ width: `${tasks.length ? done / tasks.length * 100 : 0}%`, height: "100%", background: "#00FFB2", borderRadius: 2, transition: "width 0.3s" }} />
                </div>
                <div style={{ fontSize: 9, color: "#888", ...S }}>{done}/{tasks.length} tasks complete</div>
              </div>
            </div>
          )}
          {screen === "tasks" && (
            <div style={{ padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, alignItems: "center" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#00C9FF", ...S }}>My Tasks</span>
                <span style={{ fontSize: 10, color: "#555", ...S }}>{done}/{tasks.length}</span>
              </div>
              {tasks.map(task => (
                <div key={task.id} style={{ background: "#15151C", border: "1px solid #1E1E2E", borderRadius: 8, padding: "8px 10px", marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
                  <div onClick={() => toggleTask(task.id)} style={{ width: 13, height: 13, borderRadius: "50%", border: `2px solid ${task.done ? "#00FFB2" : prioColor[task.priority]}`, background: task.done ? "#00FFB2" : "transparent", flexShrink: 0, cursor: "pointer", transition: "all 0.2s" }} />
                  <span style={{ flex: 1, fontSize: 10, color: task.done ? "#444" : "#E8E8F0", textDecoration: task.done ? "line-through" : "none", ...S, lineHeight: 1.3 }}>{task.text}</span>
                  <button onClick={() => deleteTask(task.id)} style={{ background: "none", border: "none", color: "#333", cursor: "pointer", fontSize: 14, padding: 0, lineHeight: 1 }}>×</button>
                </div>
              ))}
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 5 }}>
                <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} placeholder="New task…" style={{ background: "#0C0C14", border: "1px solid #2A2A3E", color: "#E8E8F0", padding: "6px 10px", borderRadius: 6, fontSize: 10, ...S, outline: "none", width: "100%" }} />
                <div style={{ display: "flex", gap: 4 }}>
                  {["high", "medium", "low"].map(p => <button key={p} onClick={() => setNewPriority(p)} style={{ flex: 1, background: newPriority === p ? prioColor[p] + "33" : "transparent", color: newPriority === p ? prioColor[p] : "#555", border: `1px solid ${newPriority === p ? prioColor[p] + "44" : "#2A2A3E"}`, padding: "3px 0", borderRadius: 3, cursor: "pointer", fontSize: 8, ...S }}>{p}</button>)}
                  <button onClick={addTask} style={{ background: "#00C9FF", color: "#000", border: "none", borderRadius: 6, padding: "4px 10px", cursor: "pointer", ...S, fontSize: 11, fontWeight: 700 }}>+</button>
                </div>
              </div>
            </div>
          )}
          {screen === "weather" && (
            <div style={{ padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 9, color: "#555", marginBottom: 6, ...S }}>📍 Oshawa, ON</div>
              <div style={{ fontSize: 40, marginBottom: 4 }}>🌨</div>
              <div style={{ fontSize: 30, fontWeight: 700, color: "#00C9FF", marginBottom: 4 }}>-2°C</div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 12, ...S }}>Light Snow · Feels like -8°C</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, marginBottom: 10 }}>
                {[["💧", "Humidity", "68%"], ["💨", "Wind", "22km/h"], ["🌅", "Sunrise", "6:52AM"], ["🌇", "Sunset", "6:04PM"], ["☁️", "Cloud", "85%"], ["👁", "Visibility", "9km"]].map(([icon, label, val]) => (
                  <div key={label} style={{ background: "#15151C", border: "1px solid #1E1E2E", borderRadius: 8, padding: "5px 8px" }}>
                    <div style={{ fontSize: 9, color: "#555", marginBottom: 1, ...S }}>{icon} {label}</div>
                    <div style={{ fontSize: 11, color: "#E8E8F0", ...S }}>{val}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 4, overflowX: "auto" }}>
                {[["Mon", "🌨", "-2°"], ["Tue", "⛅", "2°"], ["Wed", "☀️", "5°"], ["Thu", "🌧", "1°"], ["Fri", "⛅", "3°"]].map(([day, icon, temp]) => (
                  <div key={day} style={{ background: "#15151C", border: "1px solid #1E1E2E", borderRadius: 6, padding: "5px 7px", textAlign: "center", flexShrink: 0, minWidth: 38 }}>
                    <div style={{ fontSize: 8, color: "#555", ...S }}>{day}</div>
                    <div style={{ fontSize: 13, margin: "2px 0" }}>{icon}</div>
                    <div style={{ fontSize: 9, color: "#00C9FF", ...S }}>{temp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {screen === "messages" && (
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#00C9FF", marginBottom: 10, ...S }}>Messages</div>
              {messages.map(m => (
                <div key={m.id} style={{ background: "#15151C", border: `1px solid ${m.unread ? "#00C9FF33" : "#1E1E2E"}`, borderRadius: 8, padding: "10px 12px", marginBottom: 8, cursor: "pointer", transition: "all 0.15s" }} onMouseOver={e => e.currentTarget.style.background = "#1E1E2E"} onMouseOut={e => e.currentTarget.style.background = "#15151C"}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: m.unread ? "#00C9FF" : "#E8E8F0", ...S }}>{m.from}</span>
                    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                      {m.unread && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#00C9FF", display: "inline-block" }} />}
                      <span style={{ fontSize: 9, color: "#555", ...S }}>{m.time}</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 10, color: "#888", ...S, lineHeight: 1.4 }}>{m.text}</span>
                </div>
              ))}
            </div>
          )}
          {screen === "stats" && (
            <div style={{ padding: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#00C9FF", marginBottom: 10, ...S }}>Your Stats</div>
              {[["Tasks Done", done, "#00FFB2"], ["Pending", tasks.length - done, "#FF9500"], ["Streak", "7 days", "#FF9500"], ["Focus Time", "4.2h", "#00C9FF"], ["Projects", "6", "#845EC2"], ["Commits", "142", "#F9F871"], ["Messages", messages.filter(m => m.unread).length + " unread", "#FF3B5C"]].map(([label, val, col]) => (
                <div key={label} style={{ background: "#15151C", border: "1px solid #1E1E2E", borderRadius: 8, padding: "8px 12px", marginBottom: 5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 10, color: "#888", ...S }}>{label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: col, ...S }}>{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ background: "#0C0C14", borderTop: "1px solid #1E1E2E", padding: "6px 0", display: "flex", justifyContent: "space-around" }}>
          <button onClick={() => setScreen("home")} style={{ background: "none", border: "none", color: screen === "home" ? "#00C9FF" : "#444", cursor: "pointer", fontSize: 16 }}>⊞</button>
          {APPS.map(a => <button key={a.screen} onClick={() => setScreen(a.screen)} style={{ background: "none", border: "none", color: screen === a.screen ? "#00C9FF" : "#444", cursor: "pointer", fontSize: 14 }}>{a.icon}</button>)}
        </div>
      </div>
    </div>
  );
}


export default MobileDemo;
