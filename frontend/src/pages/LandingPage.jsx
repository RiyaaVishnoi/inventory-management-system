import React from "react";

export default function LandingPage() {
  const wrap = { maxWidth: 1100, margin: "0 auto", padding: "0 16px" };
  const btn = {
    display: "inline-block",
    padding: "12px 18px",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 600
  };

  return (
    <div style={{ minHeight: "100vh", color: "#0f172a", background: "#fff" }}>
      {/* NAV */}
      <header style={{ borderBottom: "1px solid #eee" }}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: "#f1f5f9", display: "grid", placeItems: "center" }}>📦</div>
            <strong style={{ fontSize: 18 }}>EquipFlow</strong>
          </div>
          <nav style={{ display: "flex", gap: 8 }}>
            <a href="/login" style={{ ...btn, border: "1px solid #e2e8f0", color: "#0f172a" }}>Log in</a>
            <a href="/signup" style={{ ...btn, background: "#2563eb", color: "#fff" }}>Sign up</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <main>
        <section style={{ ...wrap, textAlign: "center", padding: "64px 16px" }}>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", margin: 0, lineHeight: 1.2 }}>
            Manage inventory, bookings & maintenance in one place
          </h1>
          <p style={{ color: "#475569", marginTop: 12, fontSize: 18 }}>
            A clean, fast platform for equipment tracking, reservations, and issue management.
          </p>
          <div style={{ marginTop: 20, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/signup" style={{ ...btn, background: "#2563eb", color: "#fff" }}>Get started</a>
            <a href="/login" style={{ ...btn, border: "1px solid #e2e8f0", color: "#0f172a" }}>Log in</a>
          </div>

          <div style={{ marginTop: 36 }}>
            <img
              src="https://placehold.co/1200x600/png?text=Dashboard+Mock+(replace+with+your+design)"
              alt="Product preview"
              style={{ width: "100%", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }}
            />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #eee", marginTop: 24 }}>
        <div style={{ ...wrap, padding: "20px 16px", textAlign: "center", color: "#64748b", fontSize: 14 }}>
          © {new Date().getFullYear()} EquipFlow — All rights reserved.
        </div>
      </footer>
    </div>
  );
}
