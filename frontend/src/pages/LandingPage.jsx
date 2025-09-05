import React, { useState } from "react";

// button hover function
function HoverButton({ style, hoverStyle, children, ...props }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      {...props}
      style={{ ...style, ...(hover ? hoverStyle : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </a>
  );
}

function HoverBox({ style, hoverStyle, children, ...props }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      {...props}
      style={{ ...style, ...(hover ? hoverStyle : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const wrap = {
    width: "100%",
    padding: "0 16px",
    boxSizing: "border-box"
  };
  const btn = {
    display: "inline-block",
    padding: "12px 18px",
    borderRadius: 10,
    textDecoration: "none",
    fontWeight: 600
  };

  return (
    <div style={{ minHeight: "100vh", color: "#0f172a", background: "#fff" }}>
      {/* navbar */}
      <header style={{ borderBottom: "1px solid #eee", margin: "0 100px"}}>
        <div style={{ ...wrap, display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: "#f1f5f9", display: "grid", placeItems: "center" }}>📦</div>
            <strong style={{ fontSize: 18 }}>EquipFlow</strong>
          </div>
          <nav style={{ display: "flex", gap: 8, margin: "0 65px" }}>
            <HoverButton
              href="/login"
              style={{ ...btn, border: "1px solid #e2e8f0", color: "#0f172a" }}
              hoverStyle={{
                background: "#f1f1f1",
                color: "#222"
              }}
            >
              Log in
            </HoverButton>
            <HoverButton
              href="/signup"
              style={{ ...btn, background: "#222222ff", color: "#fff" }}
              hoverStyle={{
                background: "#444"
              }}
            >
              Sign up
            </HoverButton>
          </nav>
        </div>
      </header>

      {/* main content */}
      <main>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "100vw",
            minHeight: "calc(100vh - 64px - 64px)",
            boxSizing: "border-box"
          }}
        >
          {/* left main text */}
          <section
            style={{
              flex: "1 1 50%",
              minWidth: 320,
              padding: "64px 16px",
              background: "#fff",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f9fafb"
            }}
          >
            <div style={{ maxWidth: 600, width: "100%" }}>
              <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", margin: 0, lineHeight: 1.2 }}>
                Manage inventory, bookings & maintenance in one place
              </h1>
              <p style={{ color: "#475569", marginTop: 12, fontSize: 18 }}>
                A clean, fast platform for equipment tracking, reservations, and issue management.
              </p>
              <div style={{ marginTop: 20, display: "flex", float: "left", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
                <HoverButton
                  href="/signup"
                  style={{ ...btn, background: "#222222ff", color: "#fff" }}
                  hoverStyle={{
                    background: "#444"
                  }}
                >
                  Get started
                </HoverButton>
                <HoverButton
                  href="/login"
                  style={{ ...btn, border: "1px solid #e2e8f0", color: "#0f172a" }}
                  hoverStyle={{
                    background: "#f1f1f1",
                    color: "#222"
                  }}
                >
                  Log in
                </HoverButton>
              </div>
            </div>
          </section>

          {/* main image */}
          <section
            style={{
              flex: "1 1 50%",
              minWidth: 320,
              padding: "64px 16px",
              background: "#f9fafb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box"
            }}
          >
            <img
              src="/placeholder.png"
              alt="Product preview"
              style={{
                width: "80%",
                maxWidth: 800,
                height: "auto",
                borderRadius: 16,
                border: "none",
                boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)"
              }}
            />
          </section>
        </div>
        {/* features */}
        <p style={{ fontSize: "42px", marginTop: 150, textAlign: "center", lineHeight: 1.2, fontWeight: 600 }}>
                Everything you need to manage film production inventory
              </p>
              <p style={{ color: "#475569", marginTop: 12, marginBottom: 65, fontSize: 18, textAlign: "center" }}>
                From pre-production planning to wrap, FilmStock Pro provides the tools professional<br></br> filmmakers need to stay organized and efficient.
              </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(2, 200px)",
            gap: 48,
            width: "80vw",
            minHeight: 450,
            boxSizing: "border-box",
            background: "#fff",
            margin: "32px auto",
            justifyItems: "stretch",
            alignItems: "stretch"
          }}
        >
    <HoverBox
  style={{
    padding: 12,
    background: "#fff",
    borderRadius: 12,
    textAlign: "left",
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
    transition: "box-shadow 0.2s"
  }}
  hoverStyle={{
    boxShadow: "0 8px 24px 0 rgba(0,0,0,0.10), 0 12px 32px 0 rgba(0,0,0,0.25)"
  }}
>
  <img
    src="/box.png"
    alt=""
    style={{
      width: 36,
      height: 36,
      objectFit: "scale-down",
      borderRadius: 8,
      marginBottom: 8,
      background: "#e5e7eb",
      display: "block"
    }}
  />
  <p style={{ fontSize: 20 }}>Smart Equipment Tracking</p>
  <p style={{ color: "#475569" }}>
    Track cameras, lenses, lighting, and all production equipment with real-time location updates and availability status.
  </p>
</HoverBox>
  <HoverBox
  style={{
    padding: 12,
    background: "#fff",
    borderRadius: 12,
    textAlign: "left",
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
    transition: "box-shadow 0.2s"
  }}
  hoverStyle={{
    boxShadow: "0 8px 24px 0 rgba(0,0,0,0.10), 0 12px 32px 0 rgba(0,0,0,0.25)"
  }}
>
  <img
    src="/chart.png"
    alt=""
    style={{
      width: 36,
      height: 36,
      objectFit: "scale-down",
      borderRadius: 8,
      marginBottom: 8,
      background: "#e5e7eb",
      display: "block"
    }}
  />
  <p style={{ fontSize: 20 }}>Production Analytics</p>
  <p style={{ color: "#475569" }}>
    Get insights into equipment usage, costs, and production efficiency with detailed reports and dashboards.
  </p>
</HoverBox>
  <HoverBox
  style={{
    padding: 12,
    background: "#fff",
    borderRadius: 12,
    textAlign: "left",
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
    transition: "box-shadow 0.2s"
  }}
  hoverStyle={{
    boxShadow: "0 8px 24px 0 rgba(0,0,0,0.10), 0 12px 32px 0 rgba(0,0,0,0.25)"
  }}
>
  <img
    src="/shield.png"
    alt=""
    style={{
      width: 36,
      height: 36,
      objectFit: "scale-down",
      borderRadius: 8,
      marginBottom: 8,
      background: "#e5e7eb",
      display: "block"
    }}
  />
  <p style={{ fontSize: 20 }}>Secure Asset Management</p>
  <p style={{ color: "#475569" }}>
    Maintain detailed records with insurance info, maintenance schedules, and chain of custody documentation.
  </p>
</HoverBox>
<HoverBox
  style={{
    padding: 12,
    background: "#fff",
    borderRadius: 12,
    textAlign: "left",
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
    transition: "box-shadow 0.2s"
  }}
  hoverStyle={{
    boxShadow: "0 8px 24px 0 rgba(0,0,0,0.10), 0 12px 32px 0 rgba(0,0,0,0.25)"
  }}
>
  <img
    src="/clock.png"
    alt=""
    style={{
      width: 36,
      height: 36,
      objectFit: "scale-down",
      borderRadius: 8,
      marginBottom: 8,
      background: "#e5e7eb",
      display: "block"
    }}
  />
  <p style={{ fontSize: 20 }}>Secure Asset Management</p>
  <p style={{ color: "#475569" }}>
    Check equipment availability instantly, schedule bookings, and avoid conflicts with automated notifications.
  </p>
</HoverBox>
<HoverBox
  style={{
    padding: 12,
    background: "#fff",
    borderRadius: 12,
    textAlign: "left",
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
    transition: "box-shadow 0.2s"
  }}
  hoverStyle={{
    boxShadow: "0 8px 24px 0 rgba(0,0,0,0.10), 0 12px 32px 0 rgba(0,0,0,0.25)"
  }}
>
  <img
    src="/group.png"
    alt=""
    style={{
      width: 36,
      height: 36,
      objectFit: "scale-down",
      borderRadius: 8,
      marginBottom: 8,
      background: "#e5e7eb",
      display: "block"
    }}
  />
  <p style={{ fontSize: 20 }}>Real-time Availability</p>
  <p style={{ color: "#475569" }}>
    Coordinate with your crew, assign equipment responsibilities, and maintain communication throughout production.
  </p>
</HoverBox>
<HoverBox
  style={{
    padding: 12,
    background: "#fff",
    borderRadius: 12,
    textAlign: "left",
    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19)",
    transition: "box-shadow 0.2s"
  }}
  hoverStyle={{
    boxShadow: "0 8px 24px 0 rgba(0,0,0,0.10), 0 12px 32px 0 rgba(0,0,0,0.25)"
  }}
>
  <img
    src="/film.png"
    alt=""
    style={{
      width: 36,
      height: 36,
      objectFit: "scale-down",
      borderRadius: 8,
      marginBottom: 8,
      background: "#e5e7eb",
      display: "block"
    }}
  />
  <p style={{ fontSize: 20 }}>Real-time Availability</p>
  <p style={{ color: "#475569" }}>
    Streamline pre-production planning, shooting schedules, and post-production equipment returns.
  </p>
</HoverBox>
        </div>

        {/* testimonials */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "auto 1fr",
            rowGap: 0,
            columnGap: 50,
            width: "100vw",
            maxWidth: "100vw",
            minHeight: 600,
            boxSizing: "border-box",
            background: "#F9FAFB",
            margin: "100px auto",
            marginBottom: 50,
            justifyItems: "center",
            alignItems: "center",
            paddingLeft: 150,
            paddingRight: 150,
          }}
        >
          <div style={{ gridColumn: "1 / -1", textAlign: "center", marginTop: 100, marginBottom: 0 }}>
            <p style={{ textAlign: "center", fontSize: 42, margin: 0, fontWeight: 600, marginBottom: 0 }}>
              Loved by Professionals Worldwide
            </p>
          </div>
        <div style={{
          padding: 24,
          background: "#fff",
          borderRadius: 12,
          textAlign: "left",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.08), 0 6px 20px 0 rgba(0,0,0,0.09)",
          height: 200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start"
        }}>
          <img
            src="/stars.jpg"
            alt=""
            style={{
              width: 100,
              height: 15,
              objectFit: "cover",
              borderRadius: 8,
              alignSelf: "flex-start",
              background: "#e5e7eb"
            }}
          />
          <p style={{textAlign: "left" }}>"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."</p>
          <p style={{textAlign: "left" , marginBottom: 0}}>Dongju Kim</p>
          <p style={{textAlign: "left", color: "#7c7c7cff" , marginTop: 1}}>Lead Backend Developer at EquipFlow</p>
        </div>
        <div style={{
          padding: 24,
          background: "#fff",
          borderRadius: 12,
          textAlign: "left",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.08), 0 6px 20px 0 rgba(0,0,0,0.09)",
          height: 200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start"
        }}>
          <img
            src="/stars.jpg"
            alt=""
            style={{
              width: 100,
              height: 15,
              objectFit: "cover",
              borderRadius: 8,
              alignSelf: "flex-start",
              background: "#e5e7eb"
            }}
          />
          <p style={{textAlign: "left" }}>"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo."</p>
          <p style={{textAlign: "left" , marginBottom: 0}}>Riya Vishnoi</p>
          <p style={{textAlign: "left", color: "#7c7c7cff" , marginTop: 1}}>Development Team Lead at EquipFlow</p>
        </div>
        <div style={{
          padding: 24,
          background: "#fff",
          borderRadius: 12,
          textAlign: "left",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.08), 0 6px 20px 0 rgba(0,0,0,0.09)",
          height: 200,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start"
        }}>
          <img
            src="/stars.jpg"
            alt=""
            style={{
              width: 100,
              height: 15,
              objectFit: "cover",
              borderRadius: 8,
              alignSelf: "flex-start",
              background: "#e5e7eb"
            }}
          />
          <p style={{textAlign: "left" }}>"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident."</p>
          <p style={{textAlign: "left", marginBottom: 0}}>Lorenzo Glendining</p>
          <p style={{textAlign: "left", color: "#7c7c7cff", marginTop: 1}}>Lead Frontend Developer at EquipFlow</p>
        </div>
        </div>

        {/* bottom */}
        <div style={{
          margin: 65,
          padding: "48px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background: "#fff",
          borderRadius: 16
        }}>
          <p style={{ textAlign: "center", fontSize: 42, margin: 0, fontWeight: 600 }}>
            Ready to streamline your equipment workflow?
          </p>
          <p style={{ textAlign: "center", color: "#475569", fontSize: 18, margin: "18px 0 32px 0", maxWidth: 500 }}>
            Sign up today and experience the fastest way to manage film production inventory, bookings, and maintenance.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <HoverButton
              href="/signup"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                borderRadius: 10,
                background: "#222",
                color: "#fff",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: 18,
                border: "none"
              }}
              hoverStyle={{
                background: "#444"
              }}
            >
              Get Started
            </HoverButton>
            <HoverButton
              href="/login"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                borderRadius: 10,
                border: "1px solid #e2e8f0",
                color: "#0f172a",
                fontWeight: 600,
                textDecoration: "none",
                fontSize: 18,
                background: "#fff"
              }}
              hoverStyle={{
                background: "#f1f1f1",
                color: "#222"
              }}
            >
              Log In
            </HoverButton>
          </div>
        </div>
      </main>


      {/* footer */}
      <footer style={{ borderTop: "1px solid #eee", marginTop: 24 }}>
        <div style={{ ...wrap, padding: "20px 16px", textAlign: "center", color: "#64748b", fontSize: 14 }}>
          © {new Date().getFullYear()} EquipFlow — All rights reserved.
        </div>
      </footer>
    </div>
  );
}
