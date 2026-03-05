import { useState, useEffect, useRef } from "react";
function YouTubeDemo() {
  const VIDEOS = [
    { id: 1, title: "React Hooks Explained – useState, useEffect, useRef", channel: "CodeWithDeo", views: "124K", duration: "10:32", subs: "12.4K", color: "#FF4444", category: "React", likes: 3420, desc: "In this video we break down every React hook you need to know as a beginner. We cover useState, useEffect, useRef, useCallback and useMemo with real examples.", thumb: "⚛️", bg: "linear-gradient(135deg,#1a0a2e,#0d1a2e)" },
    { id: 2, title: "Build a Full Stack App – React + Node + MongoDB", channel: "DevJourney", views: "89K", duration: "28:15", subs: "8.9K", color: "#47A248", category: "Full Stack", likes: 2180, desc: "A complete walkthrough building a full stack web app from scratch. We set up Express, connect MongoDB Atlas, build a REST API, then wire up a React frontend.", thumb: "🍃", bg: "linear-gradient(135deg,#0a2010,#0d2a1a)" },
    { id: 3, title: "AWS S3 & EC2 Complete Beginner Guide 2026", channel: "CloudPro", views: "67K", duration: "15:44", subs: "34K", color: "#FF9900", category: "AWS", likes: 1890, desc: "Learn how to deploy your web apps on AWS! We cover S3 for static hosting, EC2 for your backend, IAM roles, and security groups — everything you need.", thumb: "☁️", bg: "linear-gradient(135deg,#1a1000,#2a1a00)" },
    { id: 4, title: "JavaScript ES2024 – Every New Feature Explained", channel: "JSMaster", views: "203K", duration: "12:08", subs: "89K", color: "#F7DF1E", category: "JavaScript", likes: 5620, desc: "ES2024 brings exciting new features to JavaScript. We cover Array grouping, Promise.withResolvers, Object.groupBy, and more with live code examples.", thumb: "✨", bg: "linear-gradient(135deg,#1a1a00,#2a2a00)" },
    { id: 5, title: "CSS Grid vs Flexbox – When to Use Each", channel: "UIDesignHub", views: "45K", duration: "8:55", subs: "6.1K", color: "#61DAFB", category: "CSS", likes: 1240, desc: "The age old debate — Grid or Flexbox? In this video I show you exactly when to use each layout system with real UI examples and side-by-side comparisons.", thumb: "🎨", bg: "linear-gradient(135deg,#001a2e,#00102a)" },
    { id: 6, title: "Git & GitHub for Beginners – Full Course 2026", channel: "CodeWithDeo", views: "312K", duration: "20:00", subs: "12.4K", color: "#F05032", category: "Git", likes: 8910, desc: "Master Git and GitHub from zero. Learn commits, branches, merging, pull requests, and how to collaborate on team projects like a real developer.", thumb: "🐙", bg: "linear-gradient(135deg,#1a0a00,#2a0800)" },
  ];

  const [active, setActive] = useState(VIDEOS[0]);
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState(new Set());
  const [subscribed, setSubscribed] = useState(new Set());
  const [saved, setSaved] = useState(new Set());
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState({
    1: ["Great tutorial! useMemo finally makes sense 🙏", "Best React hooks video out there", "This channel is underrated fr"],
    2: ["Followed this step by step — my first full stack app works!", "MongoDB connection setup helped a lot"],
    3: ["Just passed my AWS cert thanks to this 💯", "Please do a video on Lambda next!"],
    4: ["Didn't know about Object.groupBy, game changer", "The code examples are so clear"],
    5: ["Finally understand when to use Grid vs Flex", "Been coding for 2 years and this cleared it up"],
    6: ["Git always scared me, not anymore! 😂", "The branching section is gold"],
  });
  const [filterCat, setFilterCat] = useState("All");
  const ivRef = useRef(null);
  const S = { fontFamily: "'Space Mono',monospace" };

  const cats = ["All", ...new Set(VIDEOS.map(v => v.category))];
  const filtered = VIDEOS.filter(v => {
    const q = search.toLowerCase();
    const matchQ = !q || v.title.toLowerCase().includes(q) || v.channel.toLowerCase().includes(q);
    const matchC = filterCat === "All" || v.category === filterCat;
    return matchQ && matchC;
  });

  useEffect(() => {
    if (playing) {
      ivRef.current = setInterval(() => setProgress(p => {
        if (p >= 100) { setPlaying(false); return 100; }
        return p + 0.3;
      }), 100);
    } else {
      clearInterval(ivRef.current);
    }
    return () => clearInterval(ivRef.current);
  }, [playing]);

  const selectVideo = (v) => { setActive(v); setProgress(0); setPlaying(false); setShowComments(false); };
  const toggleLike = () => setLiked(s => { const n = new Set(s); n.has(active.id) ? n.delete(active.id) : n.add(active.id); return n; });
  const likesCount = active.likes + (liked.has(active.id) ? 1 : 0);

  const postComment = () => {
    if (!comment.trim()) return;
    setAllComments(prev => ({ ...prev, [active.id]: [comment, ...(prev[active.id] || [])] }));
    setComment("");
  };

  return (
    <div style={{ ...S, background: "#0A0A0F", height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: "#111", borderBottom: "1px solid #1E1E2E", padding: "8px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0, gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ background: "#FF0000", color: "#fff", fontWeight: 700, fontSize: 11, padding: "2px 8px", borderRadius: 3 }}>▶ DeoTube</span>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" style={{ background: "#1A1A2E", border: "1px solid #2A2A3E", color: "#E8E8F0", padding: "5px 12px", borderRadius: 20, fontSize: 11, ...S, outline: "none", flex: 1, maxWidth: 200 }} />
      </div>

      {/* Category bar */}
      <div style={{ display: "flex", gap: 5, padding: "8px 14px", borderBottom: "1px solid #1E1E2E", overflowX: "auto", flexShrink: 0 }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilterCat(c)} style={{ background: filterCat === c ? "#E8E8F0" : "#1A1A2E", color: filterCat === c ? "#000" : "#888", border: "none", padding: "4px 12px", borderRadius: 20, cursor: "pointer", fontSize: 10, ...S, whiteSpace: "nowrap" }}>{c}</button>
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Player */}
        <div style={{ flex: 1.6, padding: 12, display: "flex", flexDirection: "column", overflow: "auto" }}>
          {/* Thumbnail / player area */}
          <div style={{ background: active.bg, borderRadius: 8, aspectRatio: "16/9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 8, position: "relative", overflow: "hidden", cursor: "pointer" }} onClick={() => setPlaying(p => !p)}>
            <div style={{ fontSize: 56, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}>{active.thumb}</div>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: playing ? "transparent" : "rgba(0,0,0,0.3)", transition: "background 0.2s" }}>
              {!playing && <div style={{ width: 50, height: 50, background: "rgba(0,0,0,0.7)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>▶</div>}
            </div>
            {playing && <div style={{ position: "absolute", top: 8, right: 8, background: "#FF0000", color: "#fff", fontSize: 9, padding: "2px 6px", borderRadius: 2, fontWeight: 700, ...S }}>● LIVE</div>}
            <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(0,0,0,0.8)", color: "#fff", fontSize: 9, padding: "2px 6px", borderRadius: 2, ...S }}>{active.duration}</div>
            {/* Progress overlay */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.2)" }}>
              <div style={{ width: `${progress}%`, height: "100%", background: "#FF0000", transition: "width 0.1s" }} />
            </div>
          </div>

          {/* Scrubber */}
          <div style={{ background: "#1A1A2E", height: 4, borderRadius: 2, marginBottom: 6, cursor: "pointer", position: "relative" }} onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setProgress(((e.clientX - r.left) / r.width) * 100); }}>
            <div style={{ width: `${progress}%`, height: "100%", background: "#FF0000", borderRadius: 2 }} />
            <div style={{ position: "absolute", top: "50%", left: `${progress}%`, transform: "translate(-50%,-50%)", width: 10, height: 10, borderRadius: "50%", background: "#FF0000", boxShadow: "0 0 4px #FF0000" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#555", marginBottom: 6, ...S }}>
            <span>{(() => { const parts = active.duration.split(":"); const total = (parseInt(parts[0] || 0) * 60) + (parseInt(parts[1] || 0)); const elapsed = Math.round((progress / 100) * total); const m = Math.floor(elapsed / 60); const s = elapsed % 60; return `${m}:${String(s).padStart(2, "0")}`; })()}</span>
            <span>{active.duration}</span>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: "#E8E8F0", marginBottom: 3, ...S, lineHeight: 1.4 }}>{active.title}</div>
          <div style={{ fontSize: 10, color: "#555", marginBottom: 8, ...S }}>{active.views} views · {active.category}</div>

          {/* Channel row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, padding: "8px 0", borderTop: "1px solid #1E1E2E", borderBottom: "1px solid #1E1E2E" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: active.color + "33", border: `1px solid ${active.color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: active.color, fontWeight: 700 }}>{active.channel[0]}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#E8E8F0", ...S }}>{active.channel}</div>
                <div style={{ fontSize: 9, color: "#555", ...S }}>{active.subs} subscribers</div>
              </div>
            </div>
            <button onClick={() => setSubscribed(s => { const n = new Set(s); n.has(active.channel) ? n.delete(active.channel) : n.add(active.channel); return n; })} style={{ background: subscribed.has(active.channel) ? "#333" : "#FF0000", color: "#fff", border: "none", padding: "5px 12px", borderRadius: 4, cursor: "pointer", fontSize: 10, ...S, fontWeight: 700, transition: "all 0.2s" }}>
              {subscribed.has(active.channel) ? "✓ Subscribed" : "Subscribe"}
            </button>
          </div>

          {/* Action bar */}
          <div style={{ display: "flex", gap: 6, marginBottom: 10, flexWrap: "wrap" }}>
            {[["▶ / ⏸", () => setPlaying(p => !p), "#333", playing ? "#E8E8F0" : "#888"],
            [`👍 ${likesCount.toLocaleString()}`, toggleLike, liked.has(active.id) ? "#61DAFB33" : "#333", liked.has(active.id) ? "#61DAFB" : "#888"],
            [`🔖 Save`, () => setSaved(s => { const n = new Set(s); n.has(active.id) ? n.delete(active.id) : n.add(active.id); return n; }), saved.has(active.id) ? "#F9F87133" : "#333", saved.has(active.id) ? "#F9F871" : "#888"],
            ["↺ Restart", () => { setProgress(0); setPlaying(false); }, "#333", "#888"]
            ].map(([label, fn, bg, col]) => (
              <button key={label} onClick={fn} style={{ background: bg, color: col, border: "1px solid #2A2A3E", padding: "5px 10px", borderRadius: 20, cursor: "pointer", fontSize: 10, ...S, transition: "all 0.15s" }} onMouseOver={e => e.currentTarget.style.borderColor = "#666"} onMouseOut={e => e.currentTarget.style.borderColor = "#2A2A3E"}>{label}</button>
            ))}
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 9, color: "#444", ...S }}>🔊 {volume}%</span>
              <input type="range" min="0" max="100" value={volume} onChange={e => setVolume(e.target.value)} style={{ width: 55, accentColor: "#FF0000" }} />
            </div>
          </div>

          {/* Description */}
          <div style={{ background: "#111118", borderRadius: 6, padding: "10px 12px", marginBottom: 8, fontSize: 11, color: "#888", lineHeight: 1.7, ...S }}>{active.desc}</div>

          {/* Comments */}
          <button onClick={() => setShowComments(s => !s)} style={{ background: "none", border: "1px solid #2A2A3E", color: "#666", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontSize: 10, ...S, textAlign: "left", marginBottom: 6, transition: "border-color 0.15s" }} onMouseOver={e => e.currentTarget.style.borderColor = "#666"} onMouseOut={e => e.currentTarget.style.borderColor = "#2A2A3E"}>
            💬 {(allComments[active.id] || []).length} Comments {showComments ? "▲" : "▼"}
          </button>
          {showComments && (
            <div>
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                <input value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === "Enter" && postComment()} placeholder="Add a comment…" style={{ flex: 1, background: "#111118", border: "1px solid #2A2A3E", color: "#E8E8F0", padding: "7px 10px", borderRadius: 4, fontSize: 11, ...S, outline: "none" }} />
                <button onClick={postComment} style={{ background: "#FF0000", color: "#fff", border: "none", padding: "7px 14px", borderRadius: 4, cursor: "pointer", fontSize: 11, ...S, fontWeight: 700 }}>Post</button>
              </div>
              {(allComments[active.id] || []).map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 8, padding: "8px 0", borderBottom: "1px solid #1E1E2A" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#2A2A3E", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>👤</div>
                  <div style={{ fontSize: 11, color: "#999", ...S, lineHeight: 1.5 }}>{c}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ width: 185, borderLeft: "1px solid #1E1E2E", overflow: "auto", padding: 8, flexShrink: 0 }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: "#555", marginBottom: 8, textTransform: "uppercase", ...S }}>Up Next</div>
          {filtered.map(v => (
            <div key={v.id} onClick={() => selectVideo(v)} style={{ padding: 8, borderRadius: 6, marginBottom: 6, cursor: "pointer", background: active.id === v.id ? "#111120" : "transparent", border: `1px solid ${active.id === v.id ? "#FF000033" : "transparent"}`, transition: "all 0.15s" }} onMouseOver={e => { if (active.id !== v.id) e.currentTarget.style.background = "#111118" }} onMouseOut={e => { if (active.id !== v.id) e.currentTarget.style.background = "transparent" }}>
              <div style={{ background: v.bg, borderRadius: 4, height: 52, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 5, position: "relative" }}>
                {v.thumb}
                <span style={{ position: "absolute", bottom: 2, right: 4, background: "rgba(0,0,0,0.8)", color: "#fff", fontSize: 8, padding: "1px 3px", borderRadius: 2 }}>{v.duration}</span>
              </div>
              <div style={{ fontSize: 10, color: active.id === v.id ? "#FF4444" : "#B0B0C8", lineHeight: 1.3, marginBottom: 2, ...S }}>{v.title.slice(0, 45)}{v.title.length > 45 ? "…" : ""}</div>
              <div style={{ fontSize: 9, color: "#555", ...S }}>{v.channel}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


export default YouTubeDemo;
