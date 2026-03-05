import { useState, useEffect, useRef, useCallback } from "react";
function SnakeGame() {
  const COLS = 20, ROWS = 18;
  const CELL = 20;
  const DIRS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
  const initSnake = [{ x: 10, y: 9 }, { x: 9, y: 9 }, { x: 8, y: 9 }];
  const randFood = (snake) => {
    let f;
    do { f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
    while (snake.some(s => s.x === f.x && s.y === f.y));
    return f;
  };

  const [snake, setSnake] = useState(initSnake);
  const [food, setFood] = useState({ x: 15, y: 9 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [nextDir, setNextDir] = useState({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | playing | paused | dead
  const [speed, setSpeed] = useState(150);
  const canvasRef = useRef(null);
  const stateRef = useRef({ snake: initSnake, food: { x: 15, y: 9 }, dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 }, score: 0, status: "idle" });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { snake, food } = stateRef.current;
    ctx.fillStyle = "#0A0A0F";
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);
    // Grid
    ctx.strokeStyle = "#111118";
    ctx.lineWidth = 0.5;
    for (let x = 0; x <= COLS; x++) { ctx.beginPath(); ctx.moveTo(x * CELL, 0); ctx.lineTo(x * CELL, ROWS * CELL); ctx.stroke(); }
    for (let y = 0; y <= ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * CELL); ctx.lineTo(COLS * CELL, y * CELL); ctx.stroke(); }
    // Food
    ctx.fillStyle = "#FF6B35";
    ctx.shadowColor = "#FF6B35";
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // Snake
    snake.forEach((seg, i) => {
      const isHead = i === 0;
      const ratio = 1 - (i / snake.length) * 0.5;
      ctx.fillStyle = isHead ? "#00FFB2" : `rgba(0,${Math.round(180 * ratio + 75)},${Math.round(100 * ratio)},1)`;
      if (isHead) { ctx.shadowColor = "#00FFB2"; ctx.shadowBlur = 8; }
      const pad = isHead ? 1 : 2;
      ctx.beginPath();
      ctx.roundRect(seg.x * CELL + pad, seg.y * CELL + pad, CELL - pad * 2, CELL - pad * 2, isHead ? 4 : 3);
      ctx.fill();
      ctx.shadowBlur = 0;
    });
  }, []);

  useEffect(() => { draw(); }, [snake, food, draw]);

  useEffect(() => {
    const handleKey = (e) => {
      if (DIRS[e.key]) {
        e.preventDefault();
        const nd = { x: DIRS[e.key][0], y: DIRS[e.key][1] };
        const cur = stateRef.current.dir;
        if (nd.x === -cur.x && nd.y === -cur.y) return; // no reverse
        stateRef.current.nextDir = nd;
        setNextDir(nd);
      }
      if (e.key === " ") {
        e.preventDefault();
        const s = stateRef.current.status;
        if (s === "playing") { stateRef.current.status = "paused"; setStatus("paused"); }
        else if (s === "paused") { stateRef.current.status = "playing"; setStatus("playing"); }
        else if (s === "idle" || s === "dead") startGame();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const startGame = () => {
    const s = initSnake.map(p => ({ ...p }));
    const f = randFood(s);
    stateRef.current = { snake: s, food: f, dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 }, score: 0, status: "playing" };
    setSnake(s); setFood(f); setDir({ x: 1, y: 0 }); setNextDir({ x: 1, y: 0 }); setScore(0); setStatus("playing");
  };

  useEffect(() => {
    if (status !== "playing") return;
    const iv = setInterval(() => {
      if (stateRef.current.status !== "playing") return;
      const { snake, food, nextDir } = stateRef.current;
      const d = nextDir;
      stateRef.current.dir = d;
      const head = { x: snake[0].x + d.x, y: snake[0].y + d.y };
      // Wall collision
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS || snake.some(s => s.x === head.x && s.y === head.y)) {
        stateRef.current.status = "dead";
        setStatus("dead");
        setBest(b => Math.max(b, stateRef.current.score));
        return;
      }
      const ate = head.x === food.x && head.y === food.y;
      const newSnake = [head, ...snake.slice(0, ate ? snake.length : snake.length - 1)];
      let newFood = food;
      if (ate) {
        newFood = randFood(newSnake);
        const ns = stateRef.current.score + 10;
        stateRef.current.score = ns;
        setScore(ns);
        setFood(newFood);
        stateRef.current.food = newFood;
      }
      stateRef.current.snake = newSnake;
      setSnake([...newSnake]);
    }, speed);
    return () => clearInterval(iv);
  }, [status, speed]);

  const S = { fontFamily: "'Space Mono',monospace" };

  return (
    <div style={{ ...S, background: "#0A0A0F", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
      {/* Score bar */}
      <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#00FFB2" }}>{score}</div>
          <div style={{ fontSize: 9, color: "#555", letterSpacing: 2 }}>SCORE</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#F9F871" }}>{best}</div>
          <div style={{ fontSize: 9, color: "#555", letterSpacing: 2 }}>BEST</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#845EC2" }}>{snake.length - 3}</div>
          <div style={{ fontSize: 9, color: "#555", letterSpacing: 2 }}>LENGTH</div>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ position: "relative", border: "1px solid #1E1E2E", borderRadius: 4, overflow: "hidden" }}>
        <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} style={{ display: "block" }} />
        {(status === "idle" || status === "dead") && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
            <div style={{ fontSize: 28 }}>{status === "dead" ? "💀" : "🐍"}</div>
            <div style={{ fontSize: 16, fontWeight: 700, color: status === "dead" ? "#FF6B35" : "#00FFB2" }}>{status === "dead" ? "GAME OVER" : "SNAKE"}</div>
            {status === "dead" && <div style={{ fontSize: 12, color: "#888" }}>Score: {score}</div>}
            <button onClick={startGame} style={{ background: "#00FFB2", color: "#000", border: "none", padding: "10px 24px", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 700, ...S }}>
              {status === "dead" ? "Play Again" : "Start Game"}
            </button>
          </div>
        )}
        {status === "paused" && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 20, color: "#E8E8F0", fontWeight: 700 }}>PAUSED</div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={status === "playing" ? () => { stateRef.current.status = "paused"; setStatus("paused"); } : status === "paused" ? () => { stateRef.current.status = "playing"; setStatus("playing"); } : startGame}
          style={{ background: "#00FFB2", color: "#000", border: "none", padding: "7px 18px", borderRadius: 4, cursor: "pointer", fontSize: 11, ...S, fontWeight: 700 }}>
          {status === "playing" ? "⏸ Pause" : status === "paused" ? "▶ Resume" : "▶ Start"}
        </button>
        <button onClick={startGame} style={{ background: "#1E1E2E", color: "#888", border: "1px solid #2A2A3E", padding: "7px 14px", borderRadius: 4, cursor: "pointer", fontSize: 11, ...S }}>↺ Restart</button>
        <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
          <span style={{ fontSize: 9, color: "#555" }}>Speed:</span>
          {[[200, "🐢"], [150, "🐍"], [100, "⚡"]].map(([sp, lbl]) => (
            <button key={sp} onClick={() => setSpeed(sp)} style={{ background: speed === sp ? "#845EC2" : "#1E1E2E", color: speed === sp ? "#fff" : "#666", border: "1px solid #2A2A3E", padding: "4px 8px", borderRadius: 3, cursor: "pointer", fontSize: 11 }}>{lbl}</button>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 9, color: "#333", letterSpacing: 1 }}>Arrow keys or WASD · Space to pause</div>
    </div>
  );
}


export default SnakeGame;
