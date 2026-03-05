import { useState } from "react";
function CasinoDemo() {
  const [game, setGame] = useState("menu");
  const [balance, setBalance] = useState(500);
  const [bet, setBet] = useState(10);
  const [slots, setSlots] = useState(["🍒", "🍒", "🍒"]);
  const [spinning, setSpinning] = useState(false);
  const [lastWin, setLastWin] = useState(null);
  const [history, setHistory] = useState([]);
  const [bjHand, setBjHand] = useState([]);
  const [bjDealer, setBjDealer] = useState([]);
  const [bjResult, setBjResult] = useState(null);
  const [bjPhase, setBjPhase] = useState("idle");
  const [diceResult, setDiceResult] = useState(null);
  const [dicePick, setDicePick] = useState(null);
  const SYMBOLS = ["🍒", "🍋", "⭐", "🔔", "💎", "7️⃣"];
  const CARDS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const DICE_FACES = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
  const cardVal = c => c === "A" ? 11 : ["J", "Q", "K"].includes(c) ? 10 : parseInt(c);
  const handVal = hand => { let total = hand.reduce((s, c) => s + cardVal(c), 0); let aces = hand.filter(c => c === "A").length; while (total > 21 && aces > 0) { total -= 10; aces--; } return total; };
  const dealCard = () => CARDS[Math.floor(Math.random() * CARDS.length)];
  const addHistory = (entry) => setHistory(h => [{ ...entry, id: Date.now() }, ...h].slice(0, 8));

  const spinSlots = () => {
    if (balance < bet || spinning) return;
    setBalance(b => b - bet); setSpinning(true); setLastWin(null);
    let ticks = 0;
    const iv = setInterval(() => {
      setSlots([SYMBOLS[Math.floor(Math.random() * 6)], SYMBOLS[Math.floor(Math.random() * 6)], SYMBOLS[Math.floor(Math.random() * 6)]]);
      ticks++;
      if (ticks >= 14) {
        clearInterval(iv);
        const final = [SYMBOLS[Math.floor(Math.random() * 6)], SYMBOLS[Math.floor(Math.random() * 6)], SYMBOLS[Math.floor(Math.random() * 6)]];
        setSlots(final); setSpinning(false);
        let result = "No match";
        if (final[0] === final[1] && final[1] === final[2]) {
          const mult = final[0] === "💎" ? 20 : final[0] === "7️⃣" ? 10 : 5;
          const win = bet * mult; setBalance(b => b + win);
          result = `JACKPOT ${final[0]}! +$${win}`; setLastWin(result);
        } else if (final[0] === final[1] || final[1] === final[2] || final[0] === final[2]) {
          const win = bet * 2; setBalance(b => b + win);
          result = `Pair! +$${win}`; setLastWin(result);
        } else { setLastWin("No match 😔"); }
        addHistory({ game: "Slots", result });
      }
    }, 80);
  };

  const bjDeal = () => {
    if (balance < bet) return;
    setBalance(b => b - bet);
    setBjHand([dealCard(), dealCard()]); setBjDealer([dealCard(), dealCard()]); setBjResult(null); setBjPhase("playing");
  };
  const bjHit = () => {
    const newHand = [...bjHand, dealCard()]; setBjHand(newHand);
    if (handVal(newHand) > 21) { setBjResult("Bust! Dealer wins 💀"); setBjPhase("idle"); addHistory({ game: "Blackjack", result: "Bust" }); }
  };
  const bjStand = () => {
    let dealer = [...bjDealer];
    while (handVal(dealer) < 17) dealer.push(dealCard());
    setBjDealer(dealer);
    const pv = handVal(bjHand), dv = handVal(dealer);
    let result;
    if (dv > 21 || pv > dv) { setBalance(b => b + bet * 2); result = `You win! +$${bet} 🎉`; }
    else if (pv === dv) { setBalance(b => b + bet); result = "Push! Tie 🤝"; }
    else result = "Dealer wins 😔";
    setBjResult(result); setBjPhase("idle"); addHistory({ game: "Blackjack", result });
  };

  const rollDice = () => {
    if (!dicePick || balance < bet) return;
    setBalance(b => b - bet);
    const roll = Math.floor(Math.random() * 6) + 1; setDiceResult(roll);
    const win = roll === dicePick;
    const result = win ? `Hit ${DICE_FACES[roll]}! +$${bet * 5}` : `Rolled ${DICE_FACES[roll]}, picked ${DICE_FACES[dicePick]}`;
    if (win) setBalance(b => b + bet * 5);
    addHistory({ game: "Dice", result });
  };

  const S = { fontFamily: "'Space Mono',monospace" };
  return (
    <div style={{ ...S, background: "#0A0A0F", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#111", borderBottom: "1px solid #1E1E2E", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ color: "#F9F871", fontWeight: 700, fontSize: 13 }}>🎰 DeoCasino</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#00FFB2", fontWeight: 700 }}>${balance}</span>
          {game !== "menu" && <button onClick={() => setGame("menu")} style={{ background: "#1E1E2E", color: "#888", border: "1px solid #2A2A3E", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 10, ...S }}>← Menu</button>}
        </div>
      </div>
      <div style={{ flex: 1, overflow: "auto", padding: 14 }}>
        {/* Bet control always visible */}
        {game !== "menu" && (
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 12, padding: "8px 12px", background: "#111118", borderRadius: 6, border: "1px solid #1E1E2E" }}>
            <span style={{ fontSize: 10, color: "#555" }}>Bet: </span>
            {[5, 10, 25, 50].map(b => <button key={b} onClick={() => setBet(b)} style={{ background: bet === b ? "#F9F871" : "#1E1E2E", color: bet === b ? "#000" : "#888", border: "1px solid #2A2A3E", padding: "3px 8px", borderRadius: 3, cursor: "pointer", fontSize: 10, ...S }}>${b}</button>)}
            {balance < 50 && <button onClick={() => setBalance(500)} style={{ background: "#FF6B35", color: "#000", border: "none", padding: "3px 8px", borderRadius: 3, cursor: "pointer", fontSize: 9, ...S, marginLeft: "auto" }}>Reload $500</button>}
          </div>
        )}

        {game === "menu" && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 6 }}>🎰</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#F9F871", marginBottom: 4 }}>DeoCasino</div>
              <div style={{ fontSize: 11, color: "#555" }}>Balance: <span style={{ color: "#00FFB2", fontWeight: 700 }}>${balance}</span></div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[["🎰", "Slots", "Match symbols to win — jackpot pays 20×!", "slots"], ["🃏", "Blackjack", "Beat the dealer. Hit or Stand.", "blackjack"], ["🎲", "Dice", "Pick a number, roll to win 5×.", "dice"]].map(([icon, name, desc, id]) => (
                <button key={id} onClick={() => setGame(id)} style={{ background: "#111118", border: "1px solid #1E1E2E", borderRadius: 8, padding: "14px 16px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", ...S }} onMouseOver={e => { e.currentTarget.style.borderColor = "#F9F87166"; e.currentTarget.style.transform = "translateX(4px)"; }} onMouseOut={e => { e.currentTarget.style.borderColor = "#1E1E2E"; e.currentTarget.style.transform = ""; }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#E8E8F0", marginBottom: 2 }}>{name}</div>
                  <div style={{ fontSize: 10, color: "#555" }}>{desc}</div>
                </button>
              ))}
            </div>
            {history.length > 0 && <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 9, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 2 }}>History</div>
              {history.map(h => (
                <div key={h.id} style={{ fontSize: 10, color: h.result.includes("+") || h.result.includes("win") || h.result.includes("Hit") ? "#00FFB2" : "#555", padding: "3px 0", borderBottom: "1px solid #1A1A2E" }}>{h.game}: {h.result}</div>
              ))}
            </div>}
          </div>
        )}

        {game === "slots" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F9F871", marginBottom: 16 }}>🎰 Slots</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
              {slots.map((s, i) => (
                <div key={i} style={{ width: 70, height: 80, background: "#111118", border: "2px solid #F9F87133", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, transition: "transform 0.1s", transform: spinning ? "translateY(-2px)" : "" }}>
                  {s}
                </div>
              ))}
            </div>
            {lastWin && <div style={{ fontSize: 12, color: lastWin.includes("+") || lastWin.includes("JACKPOT") ? "#00FFB2" : "#555", marginBottom: 12, fontWeight: 700, padding: "8px", background: lastWin.includes("+") || lastWin.includes("JACKPOT") ? "#00FFB222" : "#1E1E2E", borderRadius: 6 }}>{lastWin}</div>}
            <button onClick={spinSlots} disabled={spinning || balance < bet} style={{ background: spinning || balance < bet ? "#1E1E2E" : "#F9F871", color: spinning || balance < bet ? "#555" : "#000", border: "none", padding: "10px 28px", borderRadius: 6, cursor: spinning || balance < bet ? "default" : "pointer", ...S, fontWeight: 700, fontSize: 12, transition: "transform 0.15s" }} onMouseOver={e => { if (!spinning) e.currentTarget.style.transform = "scale(1.05)"; }} onMouseOut={e => e.currentTarget.style.transform = ""}>
              {spinning ? "Spinning…" : "Spin! (−$" + bet + ")"}
            </button>
            <div style={{ marginTop: 10, fontSize: 9, color: "#555" }}>💎×3 = 20× · 7️⃣×3 = 10× · Any×3 = 5× · Pair = 2×</div>
          </div>
        )}

        {game === "blackjack" && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F9F871", marginBottom: 12, textAlign: "center" }}>🃏 Blackjack</div>
            {bjPhase === "playing" && (
              <>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 9, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 2 }}>Dealer ({bjDealer.length > 0 ? bjDealer[0] : "?"} + ?)</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {bjDealer.map((c, i) => (
                      <div key={i} style={{ width: 36, height: 50, background: i === 1 ? "#1A1A2E" : "#E8E8F0", border: `1px solid ${i === 1 ? "#2A2A3E" : "#ccc"}`, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: i === 1 ? 16 : 14, fontWeight: 700, color: i === 1 ? "#555" : "#111" }}>
                        {i === 1 ? "🂠" : c}
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 9, color: "#555", marginBottom: 6, textTransform: "uppercase", letterSpacing: 2 }}>Your Hand — {handVal(bjHand)}</div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {bjHand.map((c, i) => (
                      <div key={i} style={{ width: 36, height: 50, background: "#E8E8F0", border: "1px solid #ccc", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#111" }}>{c}</div>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={bjHit} style={{ background: "#00C9A7", color: "#000", border: "none", padding: "8px 20px", borderRadius: 4, cursor: "pointer", ...S, fontSize: 12, fontWeight: 700 }}>Hit</button>
                  <button onClick={bjStand} style={{ background: "#FF6B35", color: "#000", border: "none", padding: "8px 20px", borderRadius: 4, cursor: "pointer", ...S, fontSize: 12, fontWeight: 700 }}>Stand</button>
                </div>
              </>
            )}
            {bjResult && (
              <div style={{ padding: "12px", background: bjResult.includes("win") || bjResult.includes("🎉") ? "#00FFB222" : "#FF3B5C22", border: `1px solid ${bjResult.includes("win") || bjResult.includes("🎉") ? "#00FFB244" : "#FF3B5C44"}`, borderRadius: 6, marginBottom: 10, textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: bjResult.includes("win") || bjResult.includes("🎉") ? "#00FFB2" : "#FF6B6B", marginBottom: 4 }}>{bjResult}</div>
                {bjPhase === "idle" && bjDealer.length > 0 && <div style={{ fontSize: 10, color: "#888" }}>Dealer: {handVal(bjDealer)} · You: {handVal(bjHand)}</div>}
              </div>
            )}
            {bjPhase === "idle" && <button onClick={bjDeal} disabled={balance < bet} style={{ background: balance < bet ? "#1E1E2E" : "#F9F871", color: balance < bet ? "#555" : "#000", border: "none", padding: "10px 24px", borderRadius: 4, cursor: balance < bet ? "default" : "pointer", ...S, fontSize: 12, fontWeight: 700 }}>Deal (−${bet})</button>}
          </div>
        )}

        {game === "dice" && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F9F871", marginBottom: 14 }}>🎲 Pick a Number</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 16 }}>
              {[1, 2, 3, 4, 5, 6].map(n => (
                <button key={n} onClick={() => setDicePick(n)} style={{ width: 42, height: 42, background: dicePick === n ? "#F9F871" : "#111118", color: dicePick === n ? "#000" : "#888", border: `2px solid ${dicePick === n ? "#F9F871" : "#2A2A3E"}`, borderRadius: 6, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
                  {DICE_FACES[n]}
                </button>
              ))}
            </div>
            {diceResult && (
              <div style={{ fontSize: 40, marginBottom: 8, transition: "all 0.3s" }}>{DICE_FACES[diceResult]}</div>
            )}
            {diceResult && (
              <div style={{ fontSize: 12, fontWeight: 700, color: diceResult === dicePick ? "#00FFB2" : "#555", marginBottom: 12, padding: "8px", background: diceResult === dicePick ? "#00FFB222" : "#1E1E2E", borderRadius: 6 }}>
                {diceResult === dicePick ? `Hit! +$${bet * 5} 🎉` : `Rolled ${DICE_FACES[diceResult]} — Better luck next time!`}
              </div>
            )}
            <button onClick={rollDice} disabled={!dicePick || balance < bet} style={{ background: !dicePick || balance < bet ? "#1E1E2E" : "#F9F871", color: !dicePick || balance < bet ? "#555" : "#000", border: "none", padding: "10px 24px", borderRadius: 4, cursor: !dicePick || balance < bet ? "default" : "pointer", ...S, fontSize: 12, fontWeight: 700 }}>
              {!dicePick ? "Pick a number first" : `Roll! (−$${bet})`}
            </button>
            <div style={{ marginTop: 8, fontSize: 9, color: "#555" }}>Win 5× your bet if you pick right</div>
          </div>
        )}
      </div>
    </div>
  );
}


export default CasinoDemo;
