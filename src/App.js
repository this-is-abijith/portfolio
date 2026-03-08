import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";

/* ─── Glitch Text Component ─────────────────────────────────────── */
function GlitchText({ text, className = "" }) {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const glitch = () => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    };
    const id = setInterval(glitch, 3000 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={`glitch-wrapper ${className}`} data-text={text}>
      <span className={glitching ? "glitch-active" : ""}>{text}</span>
    </span>
  );
}

/* ─── Typewriter Component ───────────────────────────────────────── */
function Typewriter({ strings, speed = 80 }) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  useEffect(() => {
    const current = strings[idx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1400);
        } else {
          setCharIdx((c) => c + 1);
        }
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx === 0) {
          setDeleting(false);
          setIdx((i) => (i + 1) % strings.length);
        } else {
          setCharIdx((c) => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, strings, speed]);
  return (
    <span>
      {display}
      <span className="caret">▮</span>
    </span>
  );
}

/* ─── Counter ────────────────────────────────────────────────────── */
function Counter({ to, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = () => {
          start += Math.ceil(to / 40);
          if (start >= to) { setVal(to); return; }
          setVal(start);
          requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.disconnect();
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [to]);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─── Skill Badge ────────────────────────────────────────────────── */
const skillData = [
  { name: "Python", level: 90, tag: "LANG" },
  { name: "Machine Learning", level: 85, tag: "AI" },
  { name: "TensorFlow", level: 80, tag: "AI" },
  { name: "React", level: 88, tag: "WEB" },
  { name: "Node.js", level: 75, tag: "WEB" },
  { name: "MySQL", level: 72, tag: "DB" },
  { name: "Git", level: 85, tag: "TOOLS" },
  { name: "Linux", level: 78, tag: "TOOLS" },
];

const projects = [
  {
    id: "01",
    name: "Brain Tumor Detection",
    desc: "CNN model detecting brain tumors from MRI images with high accuracy using deep learning classification.",
    stack: ["Python", "TensorFlow", "CNN", "OpenCV"],
    href: "https://github.com/this-is-abijith/brain-tumor-detection-ai",
    img: "/images/brain-tumor.png",
  },
  {
    id: "02",
    name: "Number Plate Detection",
    desc: "Real-time number plate detection and recognition system built with YOLO model.",
    stack: ["Python", "YOLO", "OpenCV", "OCR"],
    href: "https://github.com/this-is-abijith/ai-number-plate-detector",
    img: "/images/number-plate-detection.png",
  },
  {
    id: "03",
    name: "Bitcoin Price Prediction",
    desc: "ML model forecasting cryptocurrency price trends using LSTM and time-series analysis.",
    stack: ["Python", "LSTM", "Pandas", "scikit-learn"],
    href: "https://github.com/this-is-abijith/bitcoin-price-prediction-ai",
    img: "/images/bitcoin.png",
  },
];

/* ─── Main App ───────────────────────────────────────────────────── */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useEffect(() => {
    const sections = ["about", "skills", "projects", "contact"];
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id)),
      { threshold: 0.4 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;700;800&display=swap');

        :root {
          --black: #080808;
          --white: #f0ede6;
          --green: #00ff87;
          --green-dim: #00cc6a;
          --red: #ff3b30;
          --border: #2a2a2a;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html { scroll-behavior: smooth; }

        body {
          background: var(--black);
          color: var(--white);
          font-family: 'Space Mono', monospace;
          overflow-x: hidden;
          cursor: none;
        }

        /* Custom cursor */
        .cursor {
          position: fixed;
          width: 12px; height: 12px;
          background: var(--green);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: difference;
          transition: transform 0.1s;
        }
        .cursor-ring {
          position: fixed;
          width: 36px; height: 36px;
          border: 1px solid var(--green);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transition: all 0.15s ease;
          transform: translate(-50%, -50%);
        }

        /* Progress bar */
        .progress-bar {
          position: fixed; top: 0; left: 0; right: 0; height: 2px;
          background: var(--green); transform-origin: left; z-index: 100;
        }

        /* Glitch */
        .glitch-wrapper { position: relative; display: inline-block; }
        .glitch-active {
          animation: glitch 0.2s steps(2) forwards;
        }
        @keyframes glitch {
          0%   { text-shadow: 3px 0 var(--red), -3px 0 var(--green); clip-path: inset(10% 0 80% 0); }
          20%  { text-shadow: -3px 0 var(--red), 3px 0 var(--green); clip-path: inset(50% 0 30% 0); }
          40%  { text-shadow: 3px 0 var(--green), -3px 0 var(--red); clip-path: inset(70% 0 10% 0); }
          60%  { text-shadow: -3px 0 var(--green); clip-path: inset(20% 0 60% 0); }
          80%  { text-shadow: 3px 0 var(--red); clip-path: inset(40% 0 40% 0); }
          100% { text-shadow: none; clip-path: inset(0); }
        }

        /* Caret blink */
        .caret { animation: blink 1s step-end infinite; color: var(--green); }
        @keyframes blink { 50% { opacity: 0; } }

        /* Scan lines overlay */
        body::after {
          content: '';
          position: fixed; inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
          pointer-events: none;
          z-index: 9997;
        }

        /* Noise texture */
        .noise::before {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: 0.4;
          pointer-events: none;
          z-index: 0;
        }

        /* Horizontal rule dashes */
        .dash-rule {
          border: none;
          border-top: 1px dashed var(--border);
          margin: 0;
        }

        /* Tag pill */
        .tag {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          padding: 2px 8px;
          border: 1px solid var(--green);
          color: var(--green);
          letter-spacing: 0.1em;
        }

        /* Skill bar */
        .skill-bar-fill {
          height: 2px;
          background: var(--green);
          transform-origin: left;
        }

        /* Project card hover line */
        .proj-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: var(--green);
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 0.3s ease;
        }
        .proj-card:hover::before { transform: scaleY(1); }

        /* Section number */
        .sec-num {
          font-size: 11px;
          color: var(--green);
          letter-spacing: 0.2em;
          font-family: 'Space Mono', monospace;
        }

        /* Big heading font */
        .syne { font-family: 'Syne', sans-serif; }

        /* Link underline grow */
        .link-grow {
          position: relative;
          text-decoration: none;
        }
        .link-grow::after {
          content: '';
          position: absolute;
          left: 0; bottom: -2px;
          width: 0; height: 1px;
          background: var(--green);
          transition: width 0.3s ease;
        }
        .link-grow:hover::after { width: 100%; }

        /* Marquee */
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-inner {
          display: flex;
          animation: marquee 20s linear infinite;
          width: max-content;
        }

        /* Btn */
        .btn-primary {
          background: var(--green);
          color: var(--black);
          padding: 12px 28px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          border: none;
          cursor: none;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-primary:hover { background: var(--green-dim); transform: translateY(-2px); }

        .btn-outline {
          background: transparent;
          color: var(--white);
          padding: 12px 28px;
          font-family: 'Space Mono', monospace;
          font-size: 12px;
          letter-spacing: 0.1em;
          border: 1px solid var(--border);
          cursor: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-outline:hover { border-color: var(--green); color: var(--green); }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: var(--black); }
        ::-webkit-scrollbar-thumb { background: var(--green); }

        /* Selection */
        ::selection { background: var(--green); color: var(--black); }
      `}</style>

      {/* Custom Cursor */}
      <Cursor />

      {/* Progress bar */}
      <motion.div className="progress-bar" style={{ scaleX }} />

      {/* ── NAVBAR ── */}
      <nav style={{
        position: "fixed", top: 0, width: "100%",
        borderBottom: "1px solid var(--border)",
        background: "rgba(8,8,8,0.92)",
        backdropFilter: "blur(12px)",
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "0 24px", height: 56,
        }}>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "var(--green)", letterSpacing: "0.15em" }}>
            ABIJITH<span style={{ color: "var(--white)" }}>.DEV</span>
          </span>

          <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden-mobile">
            {["about", "skills", "projects", "contact"].map((s) => (
              <a key={s} href={`#${s}`}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: activeSection === s ? "var(--green)" : "#666",
                  transition: "color 0.2s",
                }}
                className="link-grow"
              >{s}</a>
            ))}
            <a href="/resume.pdf"
              style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, letterSpacing: "0.1em" }}
              className="btn-primary"
            >RESUME ↗</a>
          </div>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{ background: "none", border: "none", color: "var(--white)", fontSize: 18, cursor: "none", display: "none" }}
            className="mobile-menu-btn"
            aria-label="Toggle menu"
          >{menuOpen ? "✕" : "☰"}</button>
        </div>

        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: "var(--black)",
              borderTop: "1px solid var(--border)",
              padding: "24px",
              display: "flex", flexDirection: "column", gap: 20,
            }}
          >
            {["about", "skills", "projects", "contact"].map((s) => (
              <a key={s} href={`#${s}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: 13, letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: "var(--white)",
                }}
              >{s}</a>
            ))}
          </motion.div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="home" style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "0 24px 64px",
        maxWidth: 1200, margin: "0 auto",
        position: "relative",
      }}>
        {/* Top status bar */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{
            position: "absolute", top: 80, left: 24, right: 24,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}
        >
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#444", letterSpacing: "0.1em" }}>
            SYS:ONLINE // KERALA, IN
          </span>
          <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#444", letterSpacing: "0.1em" }}>
            <span style={{ color: "var(--green)" }}>●</span> AVAILABLE FOR WORK
          </span>
        </motion.div>

        {/* Giant name */}
        <div>
          <motion.p
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            style={{ fontFamily: "'Space Mono', monospace", fontSize: 12, color: "var(--green)", letterSpacing: "0.3em", marginBottom: 16 }}
          >
            001 // PORTFOLIO
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="syne"
            style={{ fontSize: "clamp(56px, 12vw, 140px)", fontWeight: 800, lineHeight: 0.9, letterSpacing: "-0.03em", marginBottom: 8 }}
          >
            <GlitchText text="ABIJITH" />
          </motion.h1>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="syne"
            style={{
              fontSize: "clamp(56px, 12vw, 140px)", fontWeight: 800, lineHeight: 0.9,
              letterSpacing: "-0.03em", marginBottom: 40,
              WebkitTextStroke: "1px var(--white)",
              color: "transparent",
            }}
          >
            BINU
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
            style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}
          >
            <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, color: "#666" }}>
              <Typewriter strings={["AI / ML Developer", "React Developer", "MSc Student", "Building the future"]} />
            </p>
            <div style={{ height: 1, width: 60, background: "var(--border)" }} />
            <div style={{ display: "flex", gap: 12 }}>
              <a href="https://github.com/this-is-abijith" target="_blank" rel="noreferrer" className="btn-primary">
                GITHUB ↗
              </a>
              <a href="https://www.linkedin.com/in/abijith-binu/" target="_blank" rel="noreferrer" className="btn-outline">
                LINKEDIN
              </a>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{
            position: "absolute", right: 24, bottom: 64,
            fontFamily: "'Space Mono', monospace", fontSize: 11,
            color: "#444", letterSpacing: "0.15em",
            writingMode: "vertical-rl",
            display: "flex", alignItems: "center", gap: 12,
          }}
        >
          SCROLL
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ width: 1, height: 40, background: "var(--green)" }}
          />
        </motion.div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", overflow: "hidden", padding: "12px 0" }}>
        <div className="marquee-inner">
          {Array(4).fill(["MACHINE LEARNING", "REACT", "PYTHON", "TENSORFLOW", "NODE.JS", "COMPUTER VISION", "DEEP LEARNING", "YOLO", "LSTM"]).flat().map((t, i) => (
            <span key={i} style={{
              fontFamily: "'Space Mono', monospace", fontSize: 11,
              letterSpacing: "0.2em", color: i % 3 === 0 ? "var(--green)" : "#333",
              marginRight: 40, whiteSpace: "nowrap",
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <motion.section id="about"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }} viewport={{ once: true }}
        style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px" }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div>
            <p className="sec-num" style={{ marginBottom: 16 }}>002 // ABOUT</p>
            <h2 className="syne" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 32 }}>
              BUILDING<br />
              <span style={{ WebkitTextStroke: "1px var(--white)", color: "transparent" }}>INTELLIGENT</span><br />
              SYSTEMS
            </h2>
            <p style={{ color: "#888", lineHeight: 1.8, fontSize: 13, marginBottom: 24 }}>
              MSc student passionate about Artificial Intelligence, Machine Learning and
              modern web development. I build AI-powered applications that bridge the gap
              between research and real-world impact.
            </p>
            <p style={{ color: "#888", lineHeight: 1.8, fontSize: 13 }}>
              From CNN-based medical imaging to YOLO object detection — I approach
              every project with precision and obsessive attention to detail.
            </p>
          </div>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, border: "1px solid var(--border)" }}>
            {[
              { n: 3, s: "+", label: "AI Projects" },
              { n: 2, s: "+", label: "Years Coding" },
              { n: 8, s: "+", label: "Technologies" },
              { n: 100, s: "%", label: "Committed" },
            ].map((stat, i) => (
              <div key={i} style={{
                padding: "32px 24px",
                borderRight: i % 2 === 0 ? "1px solid var(--border)" : "none",
                borderBottom: i < 2 ? "1px solid var(--border)" : "none",
              }}>
                <p className="syne" style={{ fontSize: 48, fontWeight: 800, color: "var(--green)", lineHeight: 1 }}>
                  <Counter to={stat.n} suffix={stat.s} />
                </p>
                <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#555", marginTop: 8, letterSpacing: "0.1em" }}>
                  {stat.label.toUpperCase()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      <hr className="dash-rule" />

      {/* ── SKILLS ── */}
      <motion.section id="skills"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }} viewport={{ once: true }}
        style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px" }}
      >
        <p className="sec-num" style={{ marginBottom: 16 }}>003 // SKILLS</p>
        <h2 className="syne" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, marginBottom: 64 }}>
          TECH STACK
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {skillData.map((skill, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              viewport={{ once: true }}
              style={{
                display: "grid", gridTemplateColumns: "80px 1fr 60px 80px",
                gap: 24, alignItems: "center",
                padding: "20px 0",
                borderBottom: "1px solid var(--border)",
                cursor: "default",
              }}
            >
              <span className="tag" style={{ textAlign: "center" }}>{skill.tag}</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, letterSpacing: "0.05em" }}>
                {skill.name}
              </span>
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--green)", textAlign: "right" }}>
                {skill.level}%
              </span>
              <div style={{ background: "var(--border)", height: 2, overflow: "hidden" }}>
                <motion.div
                  className="skill-bar-fill"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: skill.level / 100 }}
                  transition={{ duration: 1, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <hr className="dash-rule" />

      {/* ── PROJECTS ── */}
      <motion.section id="projects"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }} viewport={{ once: true }}
        style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px" }}
      >
        <p className="sec-num" style={{ marginBottom: 16 }}>004 // PROJECTS</p>
        <h2 className="syne" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, marginBottom: 64 }}>
          SELECTED WORK
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {projects.map((proj, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="proj-card"
              style={{
                position: "relative",
                display: "grid", gridTemplateColumns: "64px 1fr auto",
                gap: 32, alignItems: "center",
                padding: "32px 24px",
                border: "1px solid var(--border)",
                marginBottom: 1,
                overflow: "hidden",
                transition: "background 0.2s",
              }}
              whileHover={{ backgroundColor: "rgba(0,255,135,0.03)" }}
            >
              <span className="syne" style={{ fontSize: 36, fontWeight: 800, color: "var(--border)", letterSpacing: "-0.03em" }}>
                {proj.id}
              </span>

              <div>
                <h3 className="syne" style={{ fontSize: 22, fontWeight: 700, marginBottom: 8, letterSpacing: "0.02em" }}>
                  {proj.name}
                </h3>
                <p style={{ color: "#666", fontSize: 12, lineHeight: 1.7, marginBottom: 16, maxWidth: 600 }}>
                  {proj.desc}
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {proj.stack.map((s, j) => (
                    <span key={j} className="tag">{s}</span>
                  ))}
                </div>
              </div>

              <a href={proj.href} target="_blank" rel="noreferrer"
                style={{
                  fontFamily: "'Space Mono', monospace", fontSize: 11,
                  color: "var(--green)", textDecoration: "none", letterSpacing: "0.1em",
                  whiteSpace: "nowrap",
                }}
                className="link-grow"
              >
                VIEW ↗
              </a>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <hr className="dash-rule" />

      {/* ── CONTACT ── */}
      <motion.section id="contact"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }} viewport={{ once: true }}
        style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px" }}
      >
        <p className="sec-num" style={{ marginBottom: 16 }}>005 // CONTACT</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }}>
          <div>
            <h2 className="syne" style={{ fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 800, lineHeight: 1.1, marginBottom: 24 }}>
              LET'S<br />
              <span style={{ WebkitTextStroke: "1px var(--white)", color: "transparent" }}>WORK</span><br />
              TOGETHER
            </h2>
            <p style={{ color: "#666", fontSize: 13, lineHeight: 1.8 }}>
              Open to collaborations, internships, and full-time opportunities in AI/ML and web development.
            </p>
          </div>

          <div style={{ paddingTop: 8 }}>
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "var(--green)", letterSpacing: "0.2em", marginBottom: 8 }}>
                EMAIL
              </p>
              <a href="mailto:abijithbinu654@gmail.com"
                style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 700,
                  color: "var(--white)", textDecoration: "none",
                }}
                className="link-grow"
              >
                abijithbinu654@gmail.com
              </a>
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
              <a href="https://github.com/this-is-abijith" target="_blank" rel="noreferrer" className="btn-outline">GITHUB ↗</a>
              <a href="https://www.linkedin.com/in/abijith-binu/" target="_blank" rel="noreferrer" className="btn-outline">LINKEDIN ↗</a>
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 32 }}>
              <a href="mailto:abijithbinu654@gmail.com" className="btn-primary" style={{ display: "inline-block", textDecoration: "none" }}>
                SEND MESSAGE ↗
              </a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: "1px solid var(--border)",
        padding: "24px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        maxWidth: 1200, margin: "0 auto",
        flexWrap: "wrap", gap: 12,
      }}>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#444", letterSpacing: "0.1em" }}>
          © 2026 ABIJITH BINU
        </span>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: "#444", letterSpacing: "0.1em" }}>
          BUILT WITH REACT // <span style={{ color: "var(--green)" }}>ABIJITH-AI.VERCEL.APP</span>
        </span>
      </footer>

      {/* Responsive overrides */}
      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: block !important; }
          [style*="gridTemplateColumns: 1fr 1fr"] { grid-template-columns: 1fr !important; gap: 48px !important; }
          [style*="gridTemplateColumns: 64px 1fr auto"] { grid-template-columns: 1fr !important; }
          [style*="gridTemplateColumns: 80px 1fr 60px 80px"] { grid-template-columns: 60px 1fr 50px !important; }
        }
      `}</style>
    </>
  );
}

/* ─── Cursor ─────────────────────────────────────────────────────── */
function Cursor() {
  const dot = useRef(null);
  const ring = useRef(null);
  useEffect(() => {
    const move = (e) => {
      if (dot.current) {
        dot.current.style.left = e.clientX - 6 + "px";
        dot.current.style.top = e.clientY - 6 + "px";
      }
      if (ring.current) {
        ring.current.style.left = e.clientX + "px";
        ring.current.style.top = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <>
      <div ref={dot} className="cursor" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}
