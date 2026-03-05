import { useState } from "react";
function EcommerceDemo() {
  const PRODUCTS = [
    { id: 1, name: "Wireless Headphones", price: 89.99, category: "Electronics", emoji: "🎧", rating: 4.5, reviews: 128 },
    { id: 2, name: "Running Shoes", price: 124.99, category: "Sports", emoji: "👟", rating: 4.8, reviews: 342 },
    { id: 3, name: "Coffee Maker", price: 59.99, category: "Kitchen", emoji: "☕", rating: 4.2, reviews: 89 },
    { id: 4, name: "Backpack", price: 44.99, category: "Lifestyle", emoji: "🎒", rating: 4.6, reviews: 201 },
    { id: 5, name: "Desk Lamp", price: 34.99, category: "Home", emoji: "💡", rating: 4.3, reviews: 67 },
    { id: 6, name: "Yoga Mat", price: 29.99, category: "Sports", emoji: "🧘", rating: 4.7, reviews: 156 },
  ];

  // ── Auth state ──
  const [user, setUser] = useState(null); // null = logged out, {name,email} = logged in
  const [accounts, setAccounts] = useState([{ email: "demo@deshop.com", password: "demo123", name: "Demo User" }]);
  const [authView, setAuthView] = useState("login"); // login | register
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [authError, setAuthError] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  // ── Shop state ──
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("shop");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("default");
  const [notification, setNotification] = useState("");
  const [wishlist, setWishlist] = useState(new Set());
  const [search, setSearch] = useState("");

  // ── Checkout state ──
  const [checkoutStep, setCheckoutStep] = useState(1); // 1=review 2=shipping 3=payment 4=done
  const [shipping, setShipping] = useState({ address: "", city: "", postal: "", province: "" });
  const [payment, setPayment] = useState({ card: "", expiry: "", cvv: "", name: "" });
  const [orderNum] = useState(() => "#ORD-" + Math.floor(10000 + Math.random() * 90000));

  const S = { fontFamily: "'Space Mono',monospace" };
  const categories = ["All", ...new Set(PRODUCTS.map(p => p.category))];
  let filtered = filter === "All" ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  if (search) filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
  if (sort === "price-asc") filtered = [...filtered].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filtered = [...filtered].sort((a, b) => b.price - a.price);
  if (sort === "rating") filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const notify = (msg) => { setNotification(msg); setTimeout(() => setNotification(""), 2000); };

  const addToCart = (product) => {
    setCart(c => { const ex = c.find(i => i.id === product.id); return ex ? c.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) : [...c, { ...product, qty: 1 }]; });
    notify(`${product.emoji} ${product.name} added!`);
  };
  const updateQty = (id, delta) => setCart(c => c.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  const toggleWish = (id) => setWishlist(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const doLogin = () => {
    setAuthError("");
    const acc = accounts.find(a => a.email === authForm.email && a.password === authForm.password);
    if (!acc) { setAuthError("Invalid email or password."); return; }
    setUser({ name: acc.name, email: acc.email });
    setShowAuth(false); setAuthForm({ name: "", email: "", password: "", confirm: "" });
    notify(`👋 Welcome back, ${acc.name}!`);
  };
  const doRegister = () => {
    setAuthError("");
    if (!authForm.name.trim()) { setAuthError("Name is required."); return; }
    if (!authForm.email.includes("@")) { setAuthError("Enter a valid email."); return; }
    if (authForm.password.length < 6) { setAuthError("Password must be at least 6 characters."); return; }
    if (authForm.password !== authForm.confirm) { setAuthError("Passwords do not match."); return; }
    if (accounts.find(a => a.email === authForm.email)) { setAuthError("Email already registered."); return; }
    const newAcc = { name: authForm.name, email: authForm.email, password: authForm.password };
    setAccounts(a => [...a, newAcc]);
    setUser({ name: newAcc.name, email: newAcc.email });
    setShowAuth(false); setAuthForm({ name: "", email: "", password: "", confirm: "" });
    notify(`🎉 Account created! Welcome, ${newAcc.name}!`);
  };
  const doLogout = () => { setUser(null); setView("shop"); notify("Logged out."); };

  const goToCheckout = () => {
    if (!user) { setShowAuth(true); setAuthView("login"); return; }
    setView("checkout"); setCheckoutStep(1);
  };
  const placeOrder = () => {
    setCart([]); setCheckoutStep(4);
  };

  const inputStyle = { background: "#111118", border: "1px solid #2A2A3E", color: "#E8E8F0", padding: "8px 10px", borderRadius: 4, fontSize: 11, ...S, outline: "none", width: "100%", boxSizing: "border-box" };
  const labelStyle = { fontSize: 9, color: "#555", display: "block", marginBottom: 5, ...S, textTransform: "uppercase", letterSpacing: 1 };

  return (
    <div style={{ ...S, height: "100%", display: "flex", flexDirection: "column", background: "#0A0A0F", position: "relative" }}>
      {notification && (
        <div style={{ position: "absolute", top: 10, right: 10, background: "#00FFB2", color: "#000", padding: "7px 14px", borderRadius: 6, fontSize: 11, fontWeight: 700, zIndex: 20, boxShadow: "0 4px 16px rgba(0,255,178,0.3)" }}>
          {notification}
        </div>
      )}

      {/* Auth modal */}
      {showAuth && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 30, padding: 16 }}>
          <div style={{ background: "#0E0E1A", border: "1px solid #2A2A3E", borderRadius: 12, padding: "24px 22px", width: "100%", maxWidth: 300 }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: "1px solid #1E1E2E" }}>
              {[["login", "Sign In"], ["register", "Register"]].map(([v, lbl]) => (
                <button key={v} onClick={() => { setAuthView(v); setAuthError(""); }} style={{ flex: 1, background: "none", border: "none", borderBottom: `2px solid ${authView === v ? "#FF6B35" : "transparent"}`, color: authView === v ? "#FF6B35" : "#555", padding: "8px 0", cursor: "pointer", fontSize: 11, ...S, fontWeight: authView === v ? 700 : 400, transition: "all 0.2s" }}>{lbl}</button>
              ))}
            </div>

            {authView === "register" && (
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Full Name</label>
                <input value={authForm.name} onChange={e => setAuthForm(f => ({ ...f, name: e.target.value }))} placeholder="Deodato Sozinho" style={inputStyle} />
              </div>
            )}
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>Email</label>
              <input type="email" value={authForm.email} onChange={e => setAuthForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" style={inputStyle} />
            </div>
            <div style={{ marginBottom: authView === "register" ? 12 : 16 }}>
              <label style={labelStyle}>Password</label>
              <input type="password" value={authForm.password} onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && (authView === "login" ? doLogin() : null)} placeholder={authView === "register" ? "Min 6 characters" : "••••••••"} style={inputStyle} />
            </div>
            {authView === "register" && (
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Confirm Password</label>
                <input type="password" value={authForm.confirm} onChange={e => setAuthForm(f => ({ ...f, confirm: e.target.value }))} onKeyDown={e => e.key === "Enter" && doRegister()} placeholder="Repeat password" style={inputStyle} />
              </div>
            )}

            {authError && <div style={{ background: "#FF3B5C22", border: "1px solid #FF3B5C44", color: "#FF6B6B", fontSize: 10, padding: "6px 10px", borderRadius: 4, marginBottom: 12, ...S }}>{authError}</div>}

            <button onClick={authView === "login" ? doLogin : doRegister} style={{ width: "100%", background: "#FF6B35", color: "#000", border: "none", padding: "10px", borderRadius: 6, cursor: "pointer", ...S, fontWeight: 700, fontSize: 12, marginBottom: 10 }}>
              {authView === "login" ? "Sign In →" : "Create Account →"}
            </button>
            <button onClick={() => setShowAuth(false)} style={{ width: "100%", background: "none", border: "1px solid #2A2A3E", color: "#555", padding: "8px", borderRadius: 6, cursor: "pointer", ...S, fontSize: 11 }}>Cancel</button>

            {authView === "login" && (
              <div style={{ marginTop: 12, fontSize: 9, color: "#555", textAlign: "center", ...S }}>
                Demo: demo@deshop.com / demo123
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid #1E1E2E", flexShrink: 0 }}>
        <span style={{ color: "#FF6B35", fontWeight: 700, fontSize: 13 }}>🛒 DeShop</span>
        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {view !== "checkout" && [["shop", "Shop"], ["wishlist", `♥ ${wishlist.size}`], ["cart", `Cart (${cartCount})`]].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{ background: view === v ? "#FF6B35" : "transparent", color: view === v ? "#000" : "#888", border: "1px solid #FF6B3533", padding: "4px 9px", borderRadius: 4, cursor: "pointer", fontSize: 10, ...S }}>{label}</button>
          ))}
          {user
            ? <div style={{ display: "flex", gap: 5, alignItems: "center", marginLeft: 4 }}>
              <span style={{ fontSize: 9, color: "#00FFB2", ...S }}>👤 {user.name.split(" ")[0]}</span>
              <button onClick={doLogout} style={{ background: "none", border: "1px solid #333", color: "#555", padding: "3px 8px", borderRadius: 4, cursor: "pointer", fontSize: 9, ...S }}>Out</button>
            </div>
            : <button onClick={() => setShowAuth(true)} style={{ background: "none", border: "1px solid #FF6B3555", color: "#FF6B35", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontSize: 10, ...S, marginLeft: 4 }}>Sign In</button>
          }
        </div>
      </div>

      {/* SHOP */}
      {view === "shop" && (
        <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…" style={{ ...inputStyle, flex: 1, minWidth: 100, padding: "6px 10px" }} />
            <select value={sort} onChange={e => setSort(e.target.value)} style={{ ...inputStyle, width: "auto", padding: "6px 8px", color: "#888" }}>
              <option value="default">Sort…</option><option value="price-asc">Price ↑</option><option value="price-desc">Price ↓</option><option value="rating">Rating</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
            {categories.map(c => <button key={c} onClick={() => setFilter(c)} style={{ background: filter === c ? "#FF6B35" : "#111118", color: filter === c ? "#000" : "#888", border: "1px solid #2A2A3E", padding: "3px 8px", borderRadius: 3, cursor: "pointer", fontSize: 10, ...S }}>{c}</button>)}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {filtered.map(p => (
              <div key={p.id} style={{ background: "#111118", border: "1px solid #1E1E2E", borderRadius: 8, padding: 10, position: "relative", transition: "border-color 0.2s" }} onMouseOver={e => e.currentTarget.style.borderColor = "#FF6B3555"} onMouseOut={e => e.currentTarget.style.borderColor = "#1E1E2E"}>
                <button onClick={() => toggleWish(p.id)} style={{ position: "absolute", top: 7, right: 7, background: "none", border: "none", cursor: "pointer", fontSize: 14, color: wishlist.has(p.id) ? "#FF6B35" : "#333" }}>♥</button>
                <div style={{ fontSize: 30, marginBottom: 6, textAlign: "center" }}>{p.emoji}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#E8E8F0", marginBottom: 2, lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ fontSize: 9, color: "#555", marginBottom: 6 }}>⭐ {p.rating} ({p.reviews})</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#FF6B35", fontWeight: 700, fontSize: 13 }}>${p.price}</span>
                  <button onClick={() => addToCart(p)} style={{ background: "#FF6B35", color: "#000", border: "none", padding: "4px 9px", borderRadius: 4, cursor: "pointer", fontSize: 10, ...S, fontWeight: 700 }}>+ Add</button>
                </div>
              </div>
            ))}
          </div>
          {filtered.length === 0 && <div style={{ textAlign: "center", color: "#555", marginTop: 30, fontSize: 12 }}>No products found 🔍</div>}
        </div>
      )}

      {/* WISHLIST */}
      {view === "wishlist" && (
        <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#FF6B35", marginBottom: 10 }}>♥ Wishlist</div>
          {wishlist.size === 0
            ? <div style={{ textAlign: "center", color: "#555", marginTop: 40, fontSize: 11 }}>No saved items — click ♥ on any product</div>
            : PRODUCTS.filter(p => wishlist.has(p.id)).map(p => (
              <div key={p.id} style={{ background: "#111118", border: "1px solid #1E1E2E", borderRadius: 8, padding: 10, marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 20 }}>{p.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: "#E8E8F0", fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: "#FF6B35" }}>${p.price}</div>
                </div>
                <button onClick={() => { addToCart(p); toggleWish(p.id); }} style={{ background: "#FF6B35", color: "#000", border: "none", padding: "4px 9px", borderRadius: 4, cursor: "pointer", fontSize: 10, ...S, fontWeight: 700 }}>→ Cart</button>
                <button onClick={() => toggleWish(p.id)} style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 14 }}>✕</button>
              </div>
            ))
          }
        </div>
      )}

      {/* CART */}
      {view === "cart" && (
        <div style={{ flex: 1, overflow: "auto", padding: 12 }}>
          {cart.length === 0
            ? <div style={{ textAlign: "center", color: "#555", marginTop: 40, fontSize: 11 }}>Your cart is empty — add some products</div>
            : <>
              {cart.map(item => (
                <div key={item.id} style={{ background: "#111118", border: "1px solid #1E1E2E", borderRadius: 8, padding: 10, marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 20 }}>{item.emoji}</span>
                    <div>
                      <div style={{ fontSize: 11, color: "#E8E8F0", fontWeight: 700 }}>{item.name}</div>
                      <div style={{ fontSize: 10, color: "#FF6B35" }}>${(item.price * item.qty).toFixed(2)}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                    <button onClick={() => updateQty(item.id, -1)} style={{ background: "#1E1E2E", color: "#E8E8F0", border: "1px solid #2A2A3E", width: 24, height: 24, borderRadius: 3, cursor: "pointer", fontSize: 14 }}>−</button>
                    <span style={{ fontSize: 12, minWidth: 18, textAlign: "center", fontWeight: 700 }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} style={{ background: "#1E1E2E", color: "#E8E8F0", border: "1px solid #2A2A3E", width: 24, height: 24, borderRadius: 3, cursor: "pointer", fontSize: 14 }}>+</button>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: "1px solid #1E1E2E", paddingTop: 12, marginTop: 4 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 11, color: "#666" }}><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 11, color: "#666" }}><span>Shipping</span><span style={{ color: "#00FFB2" }}>FREE</span></div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 14, fontWeight: 700 }}><span>Total</span><span style={{ color: "#00FFB2" }}>${cartTotal.toFixed(2)}</span></div>
                {!user && <div style={{ background: "#FF6B3511", border: "1px solid #FF6B3533", borderRadius: 6, padding: "8px 10px", marginBottom: 10, fontSize: 10, color: "#FF9671", ...S }}>🔒 Sign in to checkout</div>}
                <button onClick={goToCheckout} style={{ width: "100%", background: user ? "#00FFB2" : "#FF6B35", color: "#000", border: "none", padding: "11px", borderRadius: 6, cursor: "pointer", ...S, fontWeight: 700, fontSize: 12 }}>
                  {user ? "Proceed to Checkout →" : "Sign In to Checkout →"}
                </button>
              </div>
            </>
          }
        </div>
      )}

      {/* CHECKOUT */}
      {view === "checkout" && (
        <div style={{ flex: 1, overflow: "auto", padding: 14 }}>

          {/* Step 4 — success */}
          {checkoutStep === 4 && (
            <div style={{ textAlign: "center", paddingTop: 30 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#00FFB2", marginBottom: 6, ...S }}>Order Placed!</div>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 4, ...S }}>Confirmation: {orderNum}</div>
              <div style={{ fontSize: 10, color: "#555", marginBottom: 24, ...S }}>Sent to {user?.email}</div>
              <div style={{ background: "#111118", border: "1px solid #1E1E2E", borderRadius: 8, padding: 14, textAlign: "left", marginBottom: 20 }}>
                <div style={{ fontSize: 9, color: "#555", marginBottom: 8, ...S, textTransform: "uppercase", letterSpacing: 1 }}>Order Summary</div>
                {cart.length === 0
                  ? <div style={{ fontSize: 11, color: "#555", ...S }}>Items have been processed</div>
                  : cart.map(i => <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#E8E8F0", padding: "3px 0", ...S }}><span>{i.emoji} {i.name} ×{i.qty}</span><span style={{ color: "#FF6B35" }}>${(i.price * i.qty).toFixed(2)}</span></div>)
                }
              </div>
              <button onClick={() => { setView("shop"); setCheckoutStep(1); }} style={{ background: "#FF6B35", color: "#000", border: "none", padding: "10px 24px", borderRadius: 6, cursor: "pointer", ...S, fontWeight: 700, fontSize: 12 }}>← Back to Shop</button>
            </div>
          )}

          {checkoutStep < 4 && (
            <>
              {/* Progress bar */}
              <div style={{ display: "flex", gap: 0, marginBottom: 20 }}>
                {[["1", "Review"], ["2", "Shipping"], ["3", "Payment"]].map(([n, lbl], i) => (
                  <div key={n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: checkoutStep >= parseInt(n) ? "#FF6B35" : "#1E1E2E", border: `1px solid ${checkoutStep >= parseInt(n) ? "#FF6B35" : "#2A2A3E"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: checkoutStep >= parseInt(n) ? "#000" : "#555", ...S }}>{n}</div>
                    <div style={{ fontSize: 8, color: checkoutStep >= parseInt(n) ? "#FF6B35" : "#555", ...S }}>{lbl}</div>
                    {i < 2 && <div style={{ position: "absolute", marginTop: 11, marginLeft: 80, width: 60, height: 1, background: checkoutStep > parseInt(n) ? "#FF6B35" : "#1E1E2E" }} />}
                  </div>
                ))}
              </div>

              {/* Step 1 — Review */}
              {checkoutStep === 1 && (
                <div>
                  <div style={{ fontSize: 11, color: "#FF6B35", fontWeight: 700, marginBottom: 12, ...S }}>Review Your Order</div>
                  <div style={{ background: "#111118", border: "1px solid #1E1E2E", borderRadius: 8, padding: 12, marginBottom: 12 }}>
                    <div style={{ fontSize: 9, color: "#555", marginBottom: 8, ...S, textTransform: "uppercase", letterSpacing: 1 }}>Signed in as: {user?.name} ({user?.email})</div>
                    {cart.map(i => (
                      <div key={i.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #1A1A2E" }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span style={{ fontSize: 18 }}>{i.emoji}</span>
                          <span style={{ fontSize: 11, color: "#E8E8F0", ...S }}>{i.name} ×{i.qty}</span>
                        </div>
                        <span style={{ fontSize: 11, color: "#FF6B35", ...S }}>${(i.price * i.qty).toFixed(2)}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, fontSize: 13, fontWeight: 700 }}><span>Total</span><span style={{ color: "#00FFB2", ...S }}>${cartTotal.toFixed(2)}</span></div>
                  </div>
                  <button onClick={() => setCheckoutStep(2)} style={{ width: "100%", background: "#FF6B35", color: "#000", border: "none", padding: "11px", borderRadius: 6, cursor: "pointer", ...S, fontWeight: 700, fontSize: 12 }}>Continue to Shipping →</button>
                  <button onClick={() => setView("cart")} style={{ width: "100%", background: "none", border: "1px solid #2A2A3E", color: "#555", padding: "8px", borderRadius: 6, cursor: "pointer", ...S, fontSize: 11, marginTop: 6 }}>← Back to Cart</button>
                </div>
              )}

              {/* Step 2 — Shipping */}
              {checkoutStep === 2 && (
                <div>
                  <div style={{ fontSize: 11, color: "#FF6B35", fontWeight: 700, marginBottom: 14, ...S }}>Shipping Address</div>
                  {[["Street Address", "address", "123 Main St"], ["City", "city", "Oshawa"], ["Postal Code", "postal", "L1H 1A1"], ["Province", "province", "Ontario"]].map(([label, key, ph]) => (
                    <div key={key} style={{ marginBottom: 10 }}>
                      <label style={labelStyle}>{label}</label>
                      <input value={shipping[key]} onChange={e => setShipping(s => ({ ...s, [key]: e.target.value }))} placeholder={ph} style={inputStyle} />
                    </div>
                  ))}
                  <button onClick={() => { if (!shipping.address || !shipping.city) { notify("Please fill all fields"); return; } setCheckoutStep(3); }} style={{ width: "100%", background: "#FF6B35", color: "#000", border: "none", padding: "11px", borderRadius: 6, cursor: "pointer", ...S, fontWeight: 700, fontSize: 12, marginTop: 4 }}>Continue to Payment →</button>
                  <button onClick={() => setCheckoutStep(1)} style={{ width: "100%", background: "none", border: "1px solid #2A2A3E", color: "#555", padding: "8px", borderRadius: 6, cursor: "pointer", ...S, fontSize: 11, marginTop: 6 }}>← Back</button>
                </div>
              )}

              {/* Step 3 — Payment */}
              {checkoutStep === 3 && (
                <div>
                  <div style={{ fontSize: 11, color: "#FF6B35", fontWeight: 700, marginBottom: 14, ...S }}>Payment Details</div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={labelStyle}>Name on Card</label>
                    <input value={payment.name} onChange={e => setPayment(p => ({ ...p, name: e.target.value }))} placeholder="Deodato Sozinho" style={inputStyle} />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={labelStyle}>Card Number</label>
                    <input value={payment.card} onChange={e => setPayment(p => ({ ...p, card: e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim() }))} placeholder="1234 5678 9012 3456" style={inputStyle} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
                    <div>
                      <label style={labelStyle}>Expiry</label>
                      <input value={payment.expiry} onChange={e => setPayment(p => ({ ...p, expiry: e.target.value.replace(/\D/g, "").slice(0, 4).replace(/(.{2})/, "$1/").replace(/\/$/, "") }))} placeholder="MM/YY" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>CVV</label>
                      <input value={payment.cvv} onChange={e => setPayment(p => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) }))} placeholder="123" style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ background: "#00FFB211", border: "1px solid #00FFB233", borderRadius: 6, padding: "7px 10px", marginBottom: 12, fontSize: 9, color: "#00FFB2", ...S }}>
                    🔒 This is a demo — no real charges
                  </div>
                  <button onClick={() => { if (!payment.name || payment.card.length < 19) { notify("Please fill all fields"); return; } placeOrder(); }} style={{ width: "100%", background: "#00FFB2", color: "#000", border: "none", padding: "11px", borderRadius: 6, cursor: "pointer", ...S, fontWeight: 700, fontSize: 12 }}>Place Order ${cartTotal.toFixed(2)} →</button>
                  <button onClick={() => setCheckoutStep(2)} style={{ width: "100%", background: "none", border: "1px solid #2A2A3E", color: "#555", padding: "8px", borderRadius: 6, cursor: "pointer", ...S, fontSize: 11, marginTop: 6 }}>← Back</button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}


export default EcommerceDemo;
