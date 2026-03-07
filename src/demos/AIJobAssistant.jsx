import { useState, useRef, useEffect } from "react";

const ACCENT = "#00FFB2";
const FONT_MONO = "'Space Mono', monospace";
const FONT_DISPLAY = "'Syne', sans-serif";
const BG = "#0A0A0F";
const CARD = "#111118";
const BORDER = "#1E1E2E";

export default function AIJobAssistant() {
    const [jobDesc, setJobDesc] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [phase, setPhase] = useState("input");
    const [streamText, setStreamText] = useState("");
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, streamText]);

    async function analyze() {
        if (!jobDesc.trim() || loading) return;
        setLoading(true);
        setPhase("chat");

        const userMsg = { role: "user", content: jobDesc };
        const newMessages = [userMsg];
        setMessages(newMessages);

        const systemPrompt = `You are a sharp, direct career advisor for job seekers. 
When given a job description, you:
1. Extract the 3 most critical skills/requirements in bullet form (keep it tight)
2. Give a "Fit Score" out of 10 for a full-stack developer with React, Node.js, MongoDB, AWS, Zapier/Albato, and AI tool experience
3. Give 2-3 punchy, specific tips to tailor a resume or cover letter for this exact role
4. End with one bold action item

Keep responses concise, direct, and useful. Use short paragraphs. Use → for bullet points. No fluff.`;

        const prompt = `Here is the job description I want to analyze:\n\n${jobDesc}\n\nGive me your analysis.`;

        try {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    system: systemPrompt,
                    messages: [{ role: "user", content: prompt }],
                }),
            });

            const data = await response.json();
            const text = data.content?.[0]?.text || "Something went wrong. Please try again.";

            setStreamText("");
            let i = 0;
            const interval = setInterval(() => {
                setStreamText(text.slice(0, i));
                i += 3;
                if (i > text.length) {
                    clearInterval(interval);
                    setStreamText("");
                    setMessages([...newMessages, { role: "assistant", content: text }]);
                    setLoading(false);
                }
            }, 12);
        } catch {
            setMessages([...newMessages, { role: "assistant", content: "⚠ Connection error. Please try again." }]);
            setLoading(false);
        }
    }

    async function followUp(question) {
        if (loading) return;
        setLoading(true);

        const userMsg = { role: "user", content: question };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);

        const systemPrompt = `You are a sharp, direct career advisor. Keep answers concise and actionable. Use → for bullets. No fluff.`;

        try {
            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 600,
                    system: systemPrompt,
                    messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
                }),
            });

            const data = await response.json();
            const text = data.content?.[0]?.text || "Something went wrong.";

            let i = 0;
            setStreamText("");
            const interval = setInterval(() => {
                setStreamText(text.slice(0, i));
                i += 3;
                if (i > text.length) {
                    clearInterval(interval);
                    setStreamText("");
                    setMessages([...updatedMessages, { role: "assistant", content: text }]);
                    setLoading(false);
                }
            }, 12);
        } catch {
            setMessages([...updatedMessages, { role: "assistant", content: "⚠ Connection error." }]);
            setLoading(false);
        }
    }

    const QUICK_QUESTIONS = [
        "What keywords should I add to my resume?",
        "Write me a tailored cover letter opening",
        "What questions might they ask in the interview?",
    ];

    return (
        <div style={{
            fontFamily: FONT_MONO,
            background: BG,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
        }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@700;800&display=swap');
        .ai-scroll::-webkit-scrollbar { width: 4px; }
        .ai-scroll::-webkit-scrollbar-track { background: transparent; }
        .ai-scroll::-webkit-scrollbar-thumb { background: #2A2A3E; border-radius: 2px; }
        .ai-textarea { resize: none; outline: none; background: #0D0D14; border: 1px solid #1E1E2E; border-radius: 6px; color: #E8E8F0; font-family: 'Space Mono', monospace; font-size: 11px; line-height: 1.8; padding: 14px; width: 100%; box-sizing: border-box; transition: border-color 0.2s; }
        .ai-textarea:focus { border-color: #00FFB244; }
        .ai-textarea::placeholder { color: #333; }
        .ai-btn { background: #00FFB2; color: #0A0A0F; border: none; padding: 10px 24px; font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; border-radius: 2px; font-weight: 700; transition: all 0.2s; white-space: nowrap; }
        .ai-btn:hover:not(:disabled) { box-shadow: 0 4px 20px rgba(0,255,178,0.3); transform: translateY(-1px); }
        .ai-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .ai-chip { background: none; border: 1px solid #2A2A3E; color: #666; font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 1px; padding: 6px 12px; border-radius: 2px; cursor: pointer; transition: all 0.2s; text-align: left; }
        .ai-chip:hover:not(:disabled) { border-color: #00FFB244; color: #00FFB2; }
        .ai-chip:disabled { opacity: 0.3; cursor: not-allowed; }
        .pulse-dot { width: 5px; height: 5px; background: #00FFB2; border-radius: 50%; animation: aiPulse 1s ease-in-out infinite; display: inline-block; }
        .pulse-dot:nth-child(2) { animation-delay: 0.2s; }
        .pulse-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes aiPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.6)} }
        @keyframes fadeSlide { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .msg-in { animation: fadeSlide 0.3s ease; }
        .reset-btn { background: none; border: 1px solid #1E1E2E; color: #555; font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 1px; padding: 5px 10px; border-radius: 2px; cursor: pointer; transition: all 0.2s; }
        .reset-btn:hover { border-color: #FF6B35; color: #FF6B35; }
      `}</style>

            {/* Top bar */}
            <div style={{ padding: "10px 16px", borderBottom: `1px solid ${BORDER}`, display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: 14 }}>🤖</span>
                <div>
                    <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 13, color: "#E8E8F0" }}>Job Search AI Assistant</div>
                    <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: ACCENT, letterSpacing: 2 }}>POWERED BY CLAUDE · AI DEMO</div>
                </div>
                {phase === "chat" && (
                    <button
                        className="reset-btn"
                        onClick={() => { setPhase("input"); setMessages([]); setJobDesc(""); setStreamText(""); }}
                        style={{ marginLeft: "auto" }}
                    >↺ RESET</button>
                )}
            </div>

            {/* INPUT PHASE */}
            {phase === "input" && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 16, gap: 12, overflow: "auto" }} className="ai-scroll">
                    <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: "#555", letterSpacing: 1, lineHeight: 1.8 }}>
                        → Paste a job description below<br />
                        → Get instant fit analysis + resume tips
                    </div>
                    <textarea
                        className="ai-textarea"
                        rows={9}
                        placeholder="Paste the full job description here..."
                        value={jobDesc}
                        onChange={e => setJobDesc(e.target.value)}
                    />
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button className="ai-btn" onClick={analyze} disabled={!jobDesc.trim() || loading}>
                            {loading ? "Analyzing..." : "Analyze →"}
                        </button>
                        <span style={{ fontFamily: FONT_MONO, fontSize: 9, color: "#333", letterSpacing: 1 }}>
                            {jobDesc.length > 0 ? `${jobDesc.length} chars` : ""}
                        </span>
                    </div>
                    <div style={{ marginTop: 4 }}>
                        <div style={{ fontFamily: FONT_MONO, fontSize: 9, color: "#333", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>Try an example</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {[
                                "Full-Stack Developer — React, Node.js, AWS, team collaboration, Agile.",
                                "IT Field Placement — JavaScript, AI tools, Zapier automations, chatbot dev.",
                                "Junior Developer — Python, REST APIs, MongoDB, remote, startup environment.",
                            ].map((ex, i) => (
                                <button key={i} className="ai-chip" onClick={() => setJobDesc(ex)}>
                                    Example {i + 1} ↗
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* CHAT PHASE */}
            {phase === "chat" && (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <div className="ai-scroll" style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
                        {messages.map((m, i) => (
                            <div key={i} className="msg-in" style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>
                                <div style={{ fontFamily: FONT_MONO, fontSize: 8, color: "#333", letterSpacing: 2, marginBottom: 4, textTransform: "uppercase" }}>
                                    {m.role === "user" ? "YOU" : "AI ASSISTANT"}
                                </div>
                                <div style={{
                                    background: m.role === "user" ? "#1A1A2E" : CARD,
                                    border: `1px solid ${m.role === "user" ? "#2A2A4E" : BORDER}`,
                                    borderLeft: m.role === "assistant" ? `2px solid ${ACCENT}` : undefined,
                                    borderRadius: 6,
                                    padding: "10px 14px",
                                    maxWidth: "92%",
                                    fontFamily: FONT_MONO,
                                    fontSize: 11,
                                    color: m.role === "user" ? "#888" : "#C8C8D8",
                                    lineHeight: 1.9,
                                    whiteSpace: "pre-wrap",
                                    wordBreak: "break-word",
                                }}>
                                    {m.role === "user"
                                        ? (m.content.length > 120 ? m.content.slice(0, 120) + "…" : m.content)
                                        : m.content}
                                </div>
                            </div>
                        ))}

                        {loading && streamText && (
                            <div className="msg-in" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                                <div style={{ fontFamily: FONT_MONO, fontSize: 8, color: "#333", letterSpacing: 2, marginBottom: 4 }}>AI ASSISTANT</div>
                                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderLeft: `2px solid ${ACCENT}`, borderRadius: 6, padding: "10px 14px", maxWidth: "92%", fontFamily: FONT_MONO, fontSize: 11, color: "#C8C8D8", lineHeight: 1.9, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                                    {streamText}<span style={{ color: ACCENT, animation: "aiPulse 1s infinite" }}>▋</span>
                                </div>
                            </div>
                        )}

                        {loading && !streamText && (
                            <div style={{ display: "flex", alignItems: "flex-start", flexDirection: "column" }}>
                                <div style={{ fontFamily: FONT_MONO, fontSize: 8, color: "#333", letterSpacing: 2, marginBottom: 4 }}>AI ASSISTANT</div>
                                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderLeft: `2px solid ${ACCENT}`, borderRadius: 6, padding: "12px 16px", display: "flex", gap: 5, alignItems: "center" }}>
                                    <span className="pulse-dot" /><span className="pulse-dot" /><span className="pulse-dot" />
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {messages.length >= 2 && !loading && (
                        <div style={{ padding: "8px 16px", borderTop: `1px solid ${BORDER}`, display: "flex", flexWrap: "wrap", gap: 6 }}>
                            {QUICK_QUESTIONS.map((q, i) => (
                                <button key={i} className="ai-chip" disabled={loading} onClick={() => followUp(q)}>{q}</button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}