import { useState, useEffect } from "react";
import EcommerceDemo from "./demos/EcommerceDemo";
import SnakeGame from "./demos/SnakeGame";
import VolunteerDemo from "./demos/VolunteerDemo";
import CasinoDemo from "./demos/CasinoDemo";
import MobileDemo from "./demos/MobileDemo";
import YouTubeDemo from "./demos/YouTubeDemo";

const PROJECTS = [
  { title: "E-Commerce Platform", tech: ["React", "MongoDB", "REST API"], desc: "Full-stack shop with cart, wishlist, filters, sorting and checkout flow.", icon: "🛒", color: "#FF6B35", Demo: EcommerceDemo },
  { title: "Snake Game", tech: ["React", "Canvas API", "Hooks"], desc: "Fully playable Snake — arrow keys, speed modes, high score, game over screen.", icon: "🐍", color: "#00FFB2", Demo: SnakeGame },
  { title: "Volunteer Manager", tech: ["React", "MongoDB", "Node.js"], desc: "Full CRUD app — add volunteers, track hours, view profiles, stats dashboard.", icon: "🤝", color: "#FF9671", Demo: VolunteerDemo },
  { title: "Casino Suite", tech: ["JavaScript", "React", "CSS3"], desc: "Slots, Blackjack with real card logic, and Dice — all with balance and bet history.", icon: "🎰", color: "#F9F871", Demo: CasinoDemo },
  { title: "Mobile App UI", tech: ["React", "CSS3", "Firebase"], desc: "Phone shell with live tasks, weather, messages and stats — fully interactive.", icon: "📱", color: "#00C9FF", Demo: MobileDemo },
  { title: "YouTube Clone", tech: ["React", "CSS3", "Video API"], desc: "Real video player UI — categories, progress scrubber, likes, subscribe, comments per video.", icon: "▶️", color: "#FF0000", Demo: YouTubeDemo },
];

const SKILLS = [
  { name: "React", level: 90 }, { name: "JavaScript ES6+", level: 88 },
  { name: "HTML5 / CSS3", level: 92 }, { name: "MongoDB", level: 75 },
  { name: "REST APIs", level: 82 }, { name: "AWS Cloud", level: 65 },
  { name: "Git / GitHub", level: 85 }, { name: "Java / C#", level: 60 },
];

export default function App() {
  const [section, setSection] = useState("home");
  const [animSkills, setAnimSkills] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [typedText, setTypedText] = useState("");
  const [cursor, setCursor] = useState(true);
  const fullText = "Full Stack Developer & Problem Solver";

  useEffect(() => { let i = 0; const iv = setInterval(() => { setTypedText(fullText.slice(0, i)); i++; if (i > fullText.length) clearInterval(iv); }, 55); return () => clearInterval(iv); }, []);
  useEffect(() => { const iv = setInterval(() => setCursor(v => !v), 530); return () => clearInterval(iv); }, []);
  useEffect(() => { if (section === "skills") setTimeout(() => setAnimSkills(true), 100); else setAnimSkills(false); }, [section]);

  return (
    <div style={{ fontFamily: "'Courier New',monospace", background: "#0A0A0F", minHeight: "100vh", color: "#E8E8F0", overflowX: "hidden" }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:#0A0A0F;}
        .nav-btn{background:none;border:none;color:#666;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:3px;text-transform:uppercase;cursor:pointer;padding:8px 0;transition:color 0.2s;position:relative;}
        .nav-btn:hover,.nav-btn.active{color:#00FFB2;}
        .nav-btn.active::after{content:'';position:absolute;bottom:0;left:0;right:0;height:1px;background:#00FFB2;}
        .sec{display:none;animation:fadeUp 0.5s ease;}
        .sec.on{display:block;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .pcard{background:#111118;border:1px solid #1E1E2E;border-radius:8px;padding:24px;cursor:pointer;transition:all 0.25s ease;position:relative;overflow:hidden;}
        .pcard::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--a);transform:scaleX(0);transition:transform 0.3s ease;}
        .pcard:hover{border-color:#2E2E4E;transform:translateY(-4px);box-shadow:0 20px 40px rgba(0,0,0,0.5);}
        .pcard:hover::before{transform:scaleX(1);}
        .badge{position:absolute;top:12px;right:12px;background:var(--a);color:#000;font-size:9px;padding:3px 8px;border-radius:10px;font-family:'Space Mono',monospace;font-weight:700;letter-spacing:1px;opacity:0;transition:opacity 0.2s;}
        .pcard:hover .badge{opacity:1;}
        .sbar-o{background:#1A1A2E;border-radius:2px;height:4px;overflow:hidden;}
        .sbar-i{height:100%;background:linear-gradient(90deg,#00FFB2,#00C9FF);border-radius:2px;transition:width 1.2s cubic-bezier(0.4,0,0.2,1);}
        .tag{display:inline-block;font-size:10px;letter-spacing:1px;padding:3px 10px;border-radius:2px;border:1px solid #2A2A3E;color:#888;font-family:'Space Mono',monospace;}
        .cl{color:#00FFB2;text-decoration:none;font-family:'Space Mono',monospace;font-size:13px;letter-spacing:1px;display:flex;align-items:center;gap:10px;padding:14px 20px;border:1px solid #1E1E2E;border-radius:4px;transition:all 0.2s;}
        .cl:hover{border-color:#00FFB2;background:rgba(0,255,178,0.05);}
        .glitch{position:relative;}
        .glitch::before,.glitch::after{content:attr(data-text);position:absolute;top:0;left:0;width:100%;height:100%;}
        .glitch::before{color:#FF6B35;animation:g1 3s infinite;clip-path:polygon(0 0,100% 0,100% 35%,0 35%);}
        .glitch::after{color:#00C9FF;animation:g2 3s infinite;clip-path:polygon(0 65%,100% 65%,100% 100%,0 100%);}
        @keyframes g1{0%,90%,100%{transform:translate(0)}92%{transform:translate(-2px,1px)}94%{transform:translate(2px,-1px)}}
        @keyframes g2{0%,90%,100%{transform:translate(0)}93%{transform:translate(2px,1px)}95%{transform:translate(-2px,-1px)}}
        .grid-bg{position:fixed;inset:0;background-image:linear-gradient(rgba(0,255,178,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,178,0.03) 1px,transparent 1px);background-size:50px 50px;pointer-events:none;z-index:0;}
        .dot{width:6px;height:6px;background:#00FFB2;border-radius:50%;display:inline-block;margin-right:8px;animation:pulse 2s ease-in-out infinite;}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.93);display:flex;align-items:center;justify-content:center;z-index:1000;animation:fi 0.2s ease;padding:16px;}
        @keyframes fi{from{opacity:0}to{opacity:1}}
        .modal{background:#0E0E1A;border:1px solid #2A2A3E;border-radius:12px;width:100%;max-width:720px;height:560px;display:flex;flex-direction:column;animation:su 0.25s ease;overflow:hidden;}
        @keyframes su{from{transform:translateY(24px);opacity:0}to{transform:translateY(0);opacity:1}}
        .mhead{padding:14px 20px;border-bottom:1px solid #1E1E2E;display:flex;justify-content:space-between;align-items:center;flex-shrink:0;}
        .mclose{background:none;border:1px solid #2A2A3E;color:#888;width:28px;height:28px;border-radius:6px;cursor:pointer;font-size:14px;display:flex;align-items:center;justify-content:center;transition:all 0.15s;}
        .mclose:hover{border-color:#FF6B6B;color:#FF6B6B;}
        .mbody{flex:1;overflow:hidden;position:relative;}
        @media(max-width:600px){.modal{height:90vh;max-width:100%;border-radius:16px;}}
        @keyframes slideIn{from{opacity:0;transform:translateX(20px)}to{opacity:1;transform:translateX(0)}}
      `}</style>

      <div className="grid-bg" />

      {/* Header */}
      <header style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: "rgba(10,10,15,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #1A1A2A", padding: "0 40px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: 64 }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 16, letterSpacing: 2, color: "#00FFB2" }}>DMS<span style={{ color: "#333" }}>_</span></div>
          <nav style={{ display: "flex", gap: 32 }}>
            {["home", "projects", "skills", "about"].map(s => <button key={s} className={`nav-btn ${section === s ? "active" : ""}`} onClick={() => setSection(s)}>{s}</button>)}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 40px 60px", position: "relative", zIndex: 1 }}>

        {/* HOME */}
        <div className={`sec ${section === "home" ? "on" : ""}`}>
          <div style={{ minHeight: "75vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: 4, color: "#00FFB2", marginBottom: 24, display: "flex", alignItems: "center" }}>
              <span className="dot" />AVAILABLE FOR INTERNSHIP · OSHAWA, ONTARIO
            </div>
            <h1 className="glitch" data-text="DEODATO MANUEL SOZINHO" style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "clamp(32px,5.5vw,76px)", lineHeight: 1, letterSpacing: -2, marginBottom: 28, color: "#E8E8F0" }}>DEODATO MANUEL SOZINHO</h1>
            <div style={{ fontFamily: "'Space Mono'", fontSize: 16, color: "#888", marginBottom: 48, height: 28 }}>
              {typedText}<span style={{ opacity: cursor ? 1 : 0, color: "#00FFB2" }}>_</span>
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <button onClick={() => setSection("projects")} style={{ background: "#00FFB2", color: "#0A0A0F", border: "none", padding: "14px 32px", fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", borderRadius: 2, fontWeight: 700, transition: "transform 0.2s,box-shadow 0.2s" }} onMouseOver={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 24px rgba(0,255,178,0.3)"; }} onMouseOut={e => { e.target.style.transform = ""; e.target.style.boxShadow = ""; }}>View Projects →</button>
              <button onClick={() => setSection("about")} style={{ background: "transparent", color: "#E8E8F0", border: "1px solid #2A2A3E", padding: "14px 32px", fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", cursor: "pointer", borderRadius: 2, transition: "border-color 0.2s,color 0.2s" }} onMouseOver={e => { e.target.style.borderColor = "#00FFB2"; e.target.style.color = "#00FFB2"; }} onMouseOut={e => { e.target.style.borderColor = "#2A2A3E"; e.target.style.color = "#E8E8F0"; }}>About Me</button>
            </div>
            <div style={{ display: "flex", gap: 48, marginTop: 80, paddingTop: 40, borderTop: "1px solid #1A1A2A", flexWrap: "wrap" }}>
              {[["6+", "Projects Built"], ["2", "AWS Certs"], ["4", "Languages"], ["Honor", "Roll Student"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 28, color: "#00FFB2" }}>{num}</div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: 10, letterSpacing: 2, color: "#555", textTransform: "uppercase", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PROJECTS */}
        <div className={`sec ${section === "projects" ? "on" : ""}`}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: 4, color: "#00FFB2", marginBottom: 12 }}>02 / WORK</p>
            <h2 style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 48, letterSpacing: -1 }}>Projects</h2>
          </div>
          <p style={{ fontFamily: "'Space Mono'", fontSize: 11, color: "#555", marginBottom: 32, letterSpacing: 1 }}>↗ Click any card to launch a live interactive demo</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
            {PROJECTS.map((p, i) => (
              <div key={i} className="pcard" style={{ "--a": p.color }} onClick={() => setActiveProject(p)}>
                <span className="badge">LAUNCH ↗</span>
                <div style={{ fontSize: 32, marginBottom: 16 }}>{p.icon}</div>
                <h3 style={{ fontFamily: "'Syne'", fontWeight: 700, fontSize: 18, marginBottom: 10, color: "#E8E8F0" }}>{p.title}</h3>
                <p style={{ fontFamily: "'Space Mono'", fontSize: 11, color: "#666", lineHeight: 1.7, marginBottom: 18 }}>{p.desc}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {p.tech.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SKILLS */}
        <div className={`sec ${section === "skills" ? "on" : ""}`}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: 4, color: "#00FFB2", marginBottom: 12 }}>03 / SKILLS</p>
            <h2 style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 48, letterSpacing: -1 }}>Tech Stack</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 60px", maxWidth: 800 }}>
            {SKILLS.map(s => (
              <div key={s.name}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ fontFamily: "'Space Mono'", fontSize: 12, letterSpacing: 1 }}>{s.name}</span>
                  <span style={{ fontFamily: "'Space Mono'", fontSize: 11, color: "#00FFB2" }}>{s.level}%</span>
                </div>
                <div className="sbar-o"><div className="sbar-i" style={{ width: animSkills ? `${s.level}%` : "0%" }} /></div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 60 }}>
            <p style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: 3, color: "#555", marginBottom: 20, textTransform: "uppercase" }}>Also familiar with</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {["MySQL", "Firebase", "Agile/Scrum", "SDLC", "WebStorm", "Visual Studio", "React Native"].map(t => <span key={t} className="tag" style={{ fontSize: 11, padding: "6px 14px" }}>{t}</span>)}
            </div>
          </div>
        </div>

        {/* ABOUT */}
        <div className={`sec ${section === "about" ? "on" : ""}`}>
          <div style={{ marginBottom: 48 }}>
            <p style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: 4, color: "#00FFB2", marginBottom: 12 }}>04 / ABOUT</p>
            <h2 style={{ fontFamily: "'Syne'", fontWeight: 800, fontSize: 48, letterSpacing: -1 }}>About Me</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60 }}>
            <div>
              <p style={{ fontFamily: "'Space Mono'", fontSize: 13, color: "#999", lineHeight: 2, marginBottom: 24 }}>Web-focused Computer Programming student at Durham College (graduating June 2026), on the Dean's Honor Roll. I build responsive, interactive full stack web applications using React, Node.js, MongoDB, and AWS.</p>
              <p style={{ fontFamily: "'Space Mono'", fontSize: 13, color: "#999", lineHeight: 2 }}>I speak Portuguese (native), English (native), Afrikaans, and Spanish. Outside code, I play chess, practice Brazilian Jiu-Jitsu at Oshawa BJJ, perform music ministry, and write light novels.</p>
              <div style={{ marginTop: 40 }}>
                <p style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: 3, color: "#555", marginBottom: 16, textTransform: "uppercase" }}>Contact & Profiles</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <a href="mailto:sozinhodedi@gmail.com" className="cl"><span>✉</span> sozinhodedi@gmail.com</a>
                  <a href="tel:9054399120" className="cl"><span>☎</span> (905) 439-9120</a>
                  <a href="https://github.com/AngurisDeo" target="_blank" rel="noreferrer" className="cl"><span style={{ fontFamily: "monospace", fontWeight: 700 }}>⌥</span> github.com/AngurisDeo</a>
                  <a href="https://www.linkedin.com/in/deodato-sozinho-8511782bb/" target="_blank" rel="noreferrer" className="cl"><span style={{ fontWeight: 700, fontSize: 12 }}>in</span> LinkedIn — Deodato Manuel Sozinho</a>
                </div>
              </div>
              <div style={{ marginTop: 40 }}>
                <p style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: 3, color: "#555", marginBottom: 16, textTransform: "uppercase" }}>Beyond the Code</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { icon: "♟", label: "Chess", sub: "Lichess: Deo566", href: "https://lichess.org/@/Deo566", color: "#F9F871" },
                    { icon: "🥋", label: "Brazilian Jiu-Jitsu", sub: "Oshawa BJJ & Fitness", href: "https://oshawabjj.com/", color: "#FF9671" },
                    { icon: "✍", label: "Light Novels", sub: "300 Days of Divinity", href: "https://www.webnovel.com/book/300-days-of-divinity_33614831308755105", color: "#845EC2" },
                    { icon: "🎹", label: "Music Ministry", sub: "Worship & performance", href: null, color: "#00C9FF" },
                  ].map(item => (
                    <a key={item.label} href={item.href || "#"} target={item.href ? "_blank" : "_self"} rel="noreferrer"
                      style={{ display: "block", background: "#111118", border: `1px solid ${item.color}33`, borderRadius: 8, padding: "14px 16px", textDecoration: "none", transition: "all 0.2s", cursor: item.href ? "pointer" : "default" }}
                      onMouseOver={e => { if (item.href) { e.currentTarget.style.borderColor = item.color + "88"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = item.color + "33"; e.currentTarget.style.transform = ""; }}>
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{item.icon}</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 13, color: "#E8E8F0", marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: item.color }}>{item.sub}{item.href ? " ↗" : ""}</div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <p style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: 3, color: "#555", marginBottom: 20, textTransform: "uppercase" }}>Certifications</p>
              {[
                { name: "AWS Cloud Badge — Advanced", date: "Sept–Dec 2025", desc: "Scalable cloud solutions, compute, storage, networking, monitoring & deployment." },
                { name: "AWS Cloud Badge — Foundations", date: "Jan–Apr 2025", desc: "EC2, S3, IAM, cloud architecture principles, security, and pricing models." },
              ].map(c => (
                <div key={c.name} style={{ padding: "20px", border: "1px solid #1E1E2E", borderRadius: 8, marginBottom: 14, background: "#111118", transition: "border-color 0.2s" }} onMouseOver={e => e.currentTarget.style.borderColor = "#00FFB233"} onMouseOut={e => e.currentTarget.style.borderColor = "#1E1E2E"}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Syne'", fontWeight: 700, fontSize: 14, color: "#E8E8F0" }}>{c.name}</span>
                    <span style={{ fontFamily: "'Space Mono'", fontSize: 10, color: "#00FFB2", whiteSpace: "nowrap", marginLeft: 12 }}>{c.date}</span>
                  </div>
                  <p style={{ fontFamily: "'Space Mono'", fontSize: 11, color: "#666", lineHeight: 1.7 }}>{c.desc}</p>
                </div>
              ))}
              <div style={{ marginTop: 28 }}>
                <p style={{ fontFamily: "'Space Mono'", fontSize: 11, letterSpacing: 3, color: "#555", marginBottom: 16, textTransform: "uppercase" }}>Featured Work</p>
                <a href="https://www.webnovel.com/book/300-days-of-divinity_33614831308755105" target="_blank" rel="noreferrer"
                  style={{ display: "block", background: "linear-gradient(135deg,#1A1020,#111118)", border: "1px solid #845EC244", borderRadius: 10, padding: "20px", textDecoration: "none", transition: "all 0.2s", marginBottom: 14 }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "#845EC2"; e.currentTarget.style.boxShadow = "0 8px 32px #845EC222"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "#845EC244"; e.currentTarget.style.boxShadow = ""; }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ fontSize: 34, flexShrink: 0 }}>📖</div>
                    <div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: 15, color: "#E8E8F0", marginBottom: 4 }}>300 Days of Divinity</div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#845EC2", marginBottom: 8 }}>Web Novel · WebNovel.com ↗</div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, color: "#666", lineHeight: 1.7 }}>An original fantasy light novel. Creativity beyond the screen — proof that building worlds isn't just for code.</div>
                    </div>
                  </div>
                </a>
                <a href="https://oshawabjj.com/" target="_blank" rel="noreferrer"
                  style={{ display: "block", background: "linear-gradient(135deg,#1A1008,#111118)", border: "1px solid #FF967144", borderRadius: 10, padding: "16px 20px", textDecoration: "none", transition: "all 0.2s" }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "#FF9671"; e.currentTarget.style.boxShadow = "0 8px 32px #FF967122"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "#FF967144"; e.currentTarget.style.boxShadow = ""; }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <div style={{ fontSize: 26, flexShrink: 0 }}>🥋</div>
                    <div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: 14, color: "#E8E8F0", marginBottom: 2 }}>Oshawa BJJ & Fitness</div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#FF9671", marginBottom: 4 }}>1160 Simcoe St S · oshawabjj.com ↗</div>
                      <div style={{ fontFamily: "'Space Mono',monospace", fontSize: 10, color: "#666" }}>Led by Black Belt Igor Mocaiber & Janine Mutton</div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: "1px solid #1A1A2A", padding: "20px 40px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <p style={{ fontFamily: "'Space Mono'", fontSize: 10, color: "#333", letterSpacing: 2 }}>© 2026 DEODATO MANUEL SOZINHO · BUILT WITH REACT · OSHAWA, ONTARIO</p>
      </footer>

      {/* MODAL */}
      {activeProject && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setActiveProject(null)}>
          <div className="modal">
            <div className="mhead" style={{ borderLeft: `3px solid ${activeProject.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{activeProject.icon}</span>
                <div>
                  <div style={{ fontFamily: "'Syne'", fontWeight: 700, fontSize: 16, color: "#E8E8F0" }}>{activeProject.title}</div>
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    {activeProject.tech.map(t => <span key={t} className="tag" style={{ fontSize: 9, padding: "1px 6px" }}>{t}</span>)}
                  </div>
                </div>
              </div>
              <button className="mclose" onClick={() => setActiveProject(null)}>✕</button>
            </div>
            <div className="mbody"><activeProject.Demo /></div>
          </div>
        </div>
      )}
    </div>
  );
}
