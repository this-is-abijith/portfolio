import { motion, useScroll, useTransform } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import TechGlobe from "./TechGlobe";

/* ─── Glitch Text ──────────────────────────────────────────────────── */
function GlitchText({ text }) {
  const [glitching, setGlitching] = useState(false);
  useEffect(() => {
    const glitch = () => { setGlitching(true); setTimeout(() => setGlitching(false), 200); };
    const id = setInterval(glitch, 3000 + Math.random() * 2000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="glitch-wrapper">
      <span className={glitching ? "glitch-active" : ""}>{text}</span>
    </span>
  );
}

/* ─── Typewriter ───────────────────────────────────────────────────── */
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
        if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), 1400);
        else setCharIdx(c => c + 1);
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx === 0) { setDeleting(false); setIdx(i => (i + 1) % strings.length); }
        else setCharIdx(c => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, idx, strings, speed]);
  return (
    <span style={{ display: "inline-block", minWidth: 260 }}>
      {display}<span className="caret">▮</span>
    </span>
  );
}

/* ─── Custom Cursor (mouse only) ──────────────────────────────────── */
function Cursor() {
  const dot  = useRef(null);
  const ring = useRef(null);
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) { setIsTouch(true); return; }
    const move = (e) => {
      if (dot.current)  { dot.current.style.left  = e.clientX - 6 + "px"; dot.current.style.top  = e.clientY - 6 + "px"; }
      if (ring.current) { ring.current.style.left = e.clientX     + "px"; ring.current.style.top = e.clientY     + "px"; }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  if (isTouch) return null;
  return (
    <>
      <div ref={dot}  className="cursor" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}

/* ─── Data ─────────────────────────────────────────────────────────── */
const skillData = [
  { name: "Python",           tag: "LANG"  },
  { name: "Machine Learning", tag: "AI"    },
  { name: "TensorFlow",       tag: "AI"    },
  { name: "React",            tag: "WEB"   },
  { name: "Node.js",          tag: "WEB"   },
  { name: "MySQL",            tag: "DB"    },
  { name: "Git",              tag: "TOOLS" },
  { name: "Linux",            tag: "TOOLS" },
];

const projects = [
  {
    id: "01", name: "Brain Tumor Detection",
    desc: "CNN model detecting brain tumors from MRI images with high accuracy using deep learning classification.",
    stack: ["Python", "TensorFlow", "CNN", "OpenCV"],
    href: "https://github.com/this-is-abijith/brain-tumor-detection-ai",
  },
  {
    id: "02", name: "Number Plate Detection",
    desc: "Real-time number plate detection and recognition system built with YOLO model.",
    stack: ["Python", "YOLO", "OpenCV", "OCR"],
    href: "https://github.com/this-is-abijith/ai-number-plate-detector",
  },
  {
    id: "03", name: "Bitcoin Price Prediction",
    desc: "ML model forecasting cryptocurrency price trends using LSTM and time-series analysis.",
    stack: ["Python", "LSTM", "Pandas", "scikit-learn"],
    href: "https://github.com/this-is-abijith/bitcoin-price-prediction-ai",
  },
  {
    id: "04", name: "Rainfall Prediction App",
    desc: "Ensemble ML model (Random Forest + Gradient Boosting) predicting rain probability from weather inputs via a Flask web interface.",
    stack: ["Python", "Flask", "scikit-learn", "Random Forest"],
    href: "https://github.com/this-is-abijith/rainfall-prediction-app",
  },
  {
    id: "05", name: "Hand Gesture Particle System",
    desc: "Real-time hand gesture controlled particle system using computer vision and MediaPipe for gesture recognition.",
    stack: ["Python", "MediaPipe", "OpenCV", "NumPy"],
    href: "https://github.com/this-is-abijith/hand-gesture-particle-system",
  },
  {
    id: "06", name: "AI Image Upscaler",
    desc: "Real-ESRGAN neural network upscaling images up to 4× with GPU acceleration via Vulkan. Batch processing, before/after comparison slider, and fallback chain to Pillow LANCZOS.",
    stack: ["Python", "Real-ESRGAN", "Vulkan", "Pillow"],
    href: "https://github.com/this-is-abijith",
  },
];

const INITIAL_SHOW = 4;
const NAV_LINKS    = ["about", "skills", "projects", "contact"];

/* ─── App ──────────────────────────────────────────────────────────── */
export default function App() {
  const [menuOpen,      setMenuOpen]      = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showAll,       setShowAll]       = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const visibleProjects = showAll ? projects : projects.slice(0, INITIAL_SHOW);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActiveSection(e.target.id)),
      { threshold: 0.3 }
    );
    NAV_LINKS.forEach((id) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;700;800&display=swap');

        :root {
          --black:     #080808;
          --white:     #f0ede6;
          --green:     #00ff87;
          --green-dim: #00cc6a;
          --red:       #ff3b30;
          --border:    #2a2a2a;
          --pad:       clamp(16px, 5vw, 24px);
          --max:       1200px;
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: var(--black); color: var(--white); font-family: 'Space Mono', monospace; overflow-x: hidden; }

        @media (pointer: fine) { body, a, button { cursor: none; } }

        .cursor {
          position: fixed; width: 12px; height: 12px;
          background: var(--green); border-radius: 50%;
          pointer-events: none; z-index: 9999; mix-blend-mode: difference;
        }
        .cursor-ring {
          position: fixed; width: 36px; height: 36px;
          border: 1px solid var(--green); border-radius: 50%;
          pointer-events: none; z-index: 9998;
          transform: translate(-50%, -50%);
          transition: left 0.12s ease, top 0.12s ease;
        }

        .progress-bar {
          position: fixed; top: 0; left: 0; right: 0; height: 2px;
          background: var(--green); transform-origin: left; z-index: 200;
        }

        .glitch-wrapper { position: relative; display: inline-block; }
        .glitch-active  { animation: glitch 0.2s steps(2) forwards; }
        @keyframes glitch {
          0%   { text-shadow: 3px 0 var(--red), -3px 0 var(--green); clip-path: inset(10% 0 80% 0); }
          25%  { text-shadow:-3px 0 var(--red),  3px 0 var(--green); clip-path: inset(50% 0 30% 0); }
          50%  { text-shadow: 3px 0 var(--green),-3px 0 var(--red);  clip-path: inset(20% 0 60% 0); }
          75%  { text-shadow:-3px 0 var(--green);                    clip-path: inset(70% 0 10% 0); }
          100% { text-shadow: none; clip-path: inset(0); }
        }

        .caret { animation: blink 1s step-end infinite; color: var(--green); }
        @keyframes blink { 50% { opacity: 0; } }

        body::after {
          content: ''; position: fixed; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.025) 2px, rgba(0,0,0,0.025) 4px);
          pointer-events: none; z-index: 9990;
        }

        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: var(--black); }
        ::-webkit-scrollbar-thumb { background: var(--green); }
        ::selection { background: var(--green); color: var(--black); }

        .mono  { font-family: 'Space Mono', monospace; }
        .syne  { font-family: 'Syne', sans-serif; }
        .green { color: var(--green); }
        .dim   { color: #666; }
        .muted { color: #444; }
        .dash-rule { border: none; border-top: 1px dashed var(--border); }
        .sec-num   { font-size: 11px; color: var(--green); letter-spacing: 0.25em; }

        .tag {
          font-family: 'Space Mono', monospace; font-size: 10px; padding: 2px 8px;
          border: 1px solid var(--green); color: var(--green);
          letter-spacing: 0.1em; white-space: nowrap; display: inline-block;
        }

        .btn-primary {
          display: inline-block; background: var(--green); color: var(--black);
          padding: 12px 24px; font-family: 'Space Mono', monospace;
          font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
          border: none; text-decoration: none;
          transition: background 0.2s, transform 0.15s;
        }
        .btn-primary:hover { background: var(--green-dim); transform: translateY(-2px); }

        .btn-outline {
          display: inline-block; background: transparent; color: var(--white);
          padding: 12px 24px; font-family: 'Space Mono', monospace;
          font-size: 11px; letter-spacing: 0.12em;
          border: 1px solid var(--border); text-decoration: none;
          transition: border-color 0.2s, color 0.2s;
        }
        .btn-outline:hover { border-color: var(--green); color: var(--green); }

        .btn-show-more {
          display: flex; align-items: center; gap: 12px;
          background: none; border: 1px dashed var(--border); color: #555;
          font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.15em;
          padding: 16px 32px; margin: 24px auto 0;
          transition: border-color 0.2s, color 0.2s;
          width: 100%; justify-content: center;
        }
        .btn-show-more:hover { border-color: var(--green); color: var(--green); }
        .btn-show-more .arrow { transition: transform 0.3s; display: inline-block; }
        .btn-show-more.open .arrow { transform: rotate(180deg); }

        .link-grow { position: relative; text-decoration: none; }
        .link-grow::after {
          content: ''; position: absolute; left: 0; bottom: -2px;
          width: 0; height: 1px; background: var(--green); transition: width 0.3s ease;
        }
        .link-grow:hover::after { width: 100%; }

        .skill-bar-bg   { height: 2px; background: var(--border); overflow: hidden; flex-shrink: 0; }
        .skill-bar-fill { height: 100%; background: var(--green); transform-origin: left; }

        .proj-card { position: relative; }
        .proj-card::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 2px; background: var(--green);
          transform: scaleY(0); transform-origin: top; transition: transform 0.3s ease;
        }
        .proj-card:hover::before { transform: scaleY(1); }

        .section { max-width: var(--max); margin: 0 auto; padding: 100px var(--pad); }

        /* Navbar */
        .navbar {
          position: fixed; top: 0; width: 100%;
          border-bottom: 1px solid var(--border);
          background: rgba(8,8,8,0.92); backdrop-filter: blur(12px); z-index: 100;
        }
        .navbar-inner {
          max-width: var(--max); margin: 0 auto;
          display: flex; justify-content: space-between; align-items: center;
          padding: 0 var(--pad); height: 56px;
        }
        .nav-links { display: flex; gap: 32px; align-items: center; }
        .nav-link {
          font-family: 'Space Mono', monospace; font-size: 11px;
          letter-spacing: 0.15em; text-transform: uppercase;
          text-decoration: none; color: #555; transition: color 0.2s;
        }
        .nav-link.active, .nav-link:hover { color: var(--green); }
        .hamburger { display: none; background: none; border: none; color: var(--white); font-size: 20px; padding: 8px; }
        .mobile-menu {
          border-top: 1px solid var(--border); background: var(--black);
          padding: 24px var(--pad); display: flex; flex-direction: column; gap: 20px;
        }
        .mobile-menu a {
          font-family: 'Space Mono', monospace; font-size: 13px;
          letter-spacing: 0.15em; text-transform: uppercase;
          text-decoration: none; color: var(--white);
        }

        /* Hero */
        .hero {
          min-height: 100vh; display: flex; flex-direction: column; justify-content: center;
          padding: 80px var(--pad) 64px; max-width: var(--max); margin: 0 auto; position: relative;
        }
        .hero-status {
          position: absolute; top: 80px; left: var(--pad); right: var(--pad);
          display: flex; justify-content: space-between; flex-wrap: wrap; gap: 8px;
        }
        .hero-name {
          font-family: 'Syne', sans-serif; font-size: clamp(52px, 13vw, 140px);
          font-weight: 800; line-height: 0.9; letter-spacing: -0.03em;
        }
        .hero-name-outline {
          font-family: 'Syne', sans-serif; font-size: clamp(52px, 13vw, 140px);
          font-weight: 800; line-height: 0.9; letter-spacing: -0.03em;
          -webkit-text-stroke: 1px var(--white); color: transparent;
        }
        .hero-bottom { display: flex; flex-direction: column; align-items: flex-start; gap: 20px; margin-top: 40px; }
        .hero-btns   { display: flex; gap: 12px; flex-wrap: wrap; }
        .scroll-hint {
          position: absolute; right: var(--pad); bottom: 64px;
          font-size: 11px; color: #444; letter-spacing: 0.15em;
          writing-mode: vertical-rl; display: flex; align-items: center; gap: 12px;
        }

        /* About */
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }

        /* Skills */
        .skill-row {
          display: grid; grid-template-columns: 64px 1fr 120px;
          gap: 20px; align-items: center;
          padding: 18px 0; border-bottom: 1px solid var(--border);
        }

        /* Projects */
        .proj-row {
          display: grid; grid-template-columns: 56px 1fr auto;
          gap: 24px; align-items: center;
          padding: 28px 16px; border: 1px solid var(--border);
          margin-bottom: 1px; overflow: hidden;
        }

        /* Contact */
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }

        /* Footer */
        .footer {
          border-top: 1px solid var(--border); padding: 24px var(--pad);
          max-width: var(--max); margin: 0 auto;
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
        }

        /* ════════ TABLET ≤ 900px ════════ */
        @media (max-width: 900px) {
          .about-grid   { grid-template-columns: 1fr; gap: 48px; }
          .contact-grid { grid-template-columns: 1fr; gap: 48px; }
          .skill-row    { grid-template-columns: 56px 1fr 80px; gap: 14px; }
        }

        /* ════════ MOBILE ≤ 640px ════════ */
        @media (max-width: 640px) {
          .nav-links { display: none; }
          .hamburger { display: block; }
          .section   { padding: 72px var(--pad); }

          .hero {
            justify-content: center;
            padding-top: 100px;
            padding-bottom: 48px;
            gap: 12px;
          }
          .hero-status {
            position: relative; top: auto; left: auto; right: auto; margin-bottom: 8px;
          }

          .skill-row    { grid-template-columns: 52px 1fr; gap: 12px; }
          .skill-bar-bg { display: none; }

          .proj-row  { grid-template-columns: 1fr; gap: 10px; }
          .proj-num  { display: none; }
          .scroll-hint { display: none; }
        }

        /* ════════ SMALL PHONE ≤ 400px ════════ */
        @media (max-width: 400px) {
          .hero-btns > * { width: 100%; text-align: center; }
        }
      `}</style>

      <Cursor />
      <motion.div className="progress-bar" style={{ scaleX }} />

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <span className="mono green" style={{ fontSize: 13, letterSpacing: "0.15em" }}>
            ABIJITH<span style={{ color: "var(--white)" }}>.DEV</span>
          </span>
          <div className="nav-links">
            {NAV_LINKS.map((s) => (
              <a key={s} href={`#${s}`} className={`nav-link${activeSection === s ? " active" : ""}`}>{s}</a>
            ))}
            <a href="/resume.pdf" className="btn-primary" style={{ padding: "8px 18px" }}>RESUME ↗</a>
          </div>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
        {menuOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
            {NAV_LINKS.map((s) => (
              <a key={s} href={`#${s}`} onClick={() => setMenuOpen(false)}>{s}</a>
            ))}
            <a href="/resume.pdf" className="btn-primary" style={{ textAlign: "center" }}>RESUME ↗</a>
          </motion.div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="home" style={{ position: "relative" }}>
        <div className="hero">
          <motion.div className="hero-status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <span className="mono muted" style={{ fontSize: 11, letterSpacing: "0.1em" }}>SYS:ONLINE // KERALA, IN</span>
            <span className="mono muted" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
              <span className="green">●</span> AVAILABLE FOR WORK
            </span>
          </motion.div>

          <motion.p className="mono sec-num" style={{ marginBottom: 16 }}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            001 // PORTFOLIO
          </motion.p>

          <motion.div className="hero-name"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <GlitchText text="ABIJITH" />
          </motion.div>

          <motion.div className="hero-name-outline"
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            BINU
          </motion.div>

          <motion.div className="hero-bottom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
            <p className="mono dim" style={{ fontSize: 13 }}>
              <Typewriter strings={["AI / ML Developer", "React Developer", "MSc Student", "Building the future"]} />
            </p>
            <div className="hero-btns">
              <a href="https://github.com/this-is-abijith" target="_blank" rel="noreferrer" className="btn-primary">GITHUB ↗</a>
              <a href="https://www.linkedin.com/in/abijith-binu/" target="_blank" rel="noreferrer" className="btn-outline">LINKEDIN</a>
            </div>
          </motion.div>

          <motion.div className="scroll-hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            SCROLL
            <motion.div style={{ width: 1, height: 40, background: "var(--green)" }}
              animate={{ scaleY: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <motion.section id="about" className="section"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }} viewport={{ once: true }}>
        <div className="about-grid">
          <div>
            <p className="mono sec-num" style={{ marginBottom: 16 }}>002 // ABOUT</p>
            <h2 className="syne" style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 800, lineHeight: 1.05, marginBottom: 28 }}>
              BUILDING<br />
              <span style={{ WebkitTextStroke: "1px var(--white)", color: "transparent" }}>INTELLIGENT</span><br />
              SYSTEMS
            </h2>
            <p className="mono dim" style={{ lineHeight: 1.9, fontSize: 12, marginBottom: 20 }}>
              MSc student passionate about Artificial Intelligence, Machine Learning and modern web development.
              I build AI-powered applications that bridge the gap between research and real-world impact.
            </p>
            <p className="mono dim" style={{ lineHeight: 1.9, fontSize: 12 }}>
              From CNN-based medical imaging to YOLO object detection — precision and obsessive attention to detail in every project.
            </p>
          </div>

          {/* Globe replaces stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p className="mono muted" style={{ fontSize: 10, letterSpacing: "0.2em" }}>DRAG TO ROTATE</p>
            <TechGlobe />
          </div>
        </div>
      </motion.section>

      <hr className="dash-rule" />

      {/* ── SKILLS ── */}
      <motion.section id="skills" className="section"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }} viewport={{ once: true }}>
        <p className="mono sec-num" style={{ marginBottom: 16 }}>003 // SKILLS</p>
        <h2 className="syne" style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 800, marginBottom: 56 }}>TECH STACK</h2>
        {skillData.map((skill, i) => (
          <motion.div key={i} className="skill-row"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            viewport={{ once: true }}>
            <span className="tag" style={{ textAlign: "center" }}>{skill.tag}</span>
            <span className="syne" style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.04em" }}>{skill.name}</span>
            <div className="skill-bar-bg" style={{ width: "100%" }}>
              <motion.div className="skill-bar-fill"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
              />
            </div>
          </motion.div>
        ))}
      </motion.section>

      <hr className="dash-rule" />

      {/* ── PROJECTS ── */}
      <motion.section id="projects" className="section"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }} viewport={{ once: true }}>
        <p className="mono sec-num" style={{ marginBottom: 16 }}>004 // PROJECTS</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56, flexWrap: "wrap", gap: 16 }}>
          <h2 className="syne" style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 800 }}>SELECTED WORK</h2>
          <span className="mono muted" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
            {showAll ? projects.length : Math.min(INITIAL_SHOW, projects.length)} / {projects.length} PROJECTS
          </span>
        </div>

        {visibleProjects.map((proj, i) => (
          <motion.div key={proj.id} className="proj-card proj-row"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
            whileHover={{ backgroundColor: "rgba(0,255,135,0.03)" }}>
            <span className="syne proj-num" style={{ fontSize: 32, fontWeight: 800, color: "var(--border)", lineHeight: 1 }}>
              {proj.id}
            </span>
            <div>
              <h3 className="syne" style={{ fontSize: "clamp(16px, 3vw, 22px)", fontWeight: 700, marginBottom: 8 }}>{proj.name}</h3>
              <p className="mono dim" style={{ fontSize: 12, lineHeight: 1.7, marginBottom: 14, maxWidth: 560 }}>{proj.desc}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {proj.stack.map((s, j) => <span key={j} className="tag">{s}</span>)}
              </div>
            </div>
            <a href={proj.href} target="_blank" rel="noreferrer"
              className="mono link-grow green" style={{ fontSize: 11, letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
              VIEW ↗
            </a>
          </motion.div>
        ))}

        {projects.length > INITIAL_SHOW && (
          <motion.button
            className={`btn-show-more${showAll ? " open" : ""}`}
            onClick={() => setShowAll(!showAll)}
            whileTap={{ scale: 0.98 }}>
            <span>{showAll ? "SHOW LESS" : `SHOW MORE  (+${projects.length - INITIAL_SHOW})`}</span>
            <span className="arrow">▼</span>
          </motion.button>
        )}
      </motion.section>

      <hr className="dash-rule" />

      {/* ── CONTACT ── */}
      <motion.section id="contact" className="section"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }} viewport={{ once: true }}>
        <p className="mono sec-num" style={{ marginBottom: 16 }}>005 // CONTACT</p>
        <div className="contact-grid">
          <div>
            <h2 className="syne" style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 800, lineHeight: 1.05, marginBottom: 20 }}>
              LET'S<br />
              <span style={{ WebkitTextStroke: "1px var(--white)", color: "transparent" }}>WORK</span><br />
              TOGETHER
            </h2>
            <p className="mono dim" style={{ fontSize: 12, lineHeight: 1.9 }}>
              Open to collaborations, internships, and full-time opportunities in AI/ML and web development.
            </p>
          </div>
          <div>
            <div style={{ marginBottom: 28 }}>
              <p className="mono green" style={{ fontSize: 10, letterSpacing: "0.25em", marginBottom: 8 }}>EMAIL</p>
              <a href="mailto:abijithbinu654@gmail.com"
                className="syne link-grow"
                style={{ fontSize: "clamp(14px, 2.5vw, 20px)", fontWeight: 700, color: "var(--white)", textDecoration: "none" }}>
                abijithbinu654@gmail.com
              </a>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
              <a href="https://github.com/this-is-abijith" target="_blank" rel="noreferrer" className="btn-outline">GITHUB ↗</a>
              <a href="https://www.linkedin.com/in/abijith-binu/" target="_blank" rel="noreferrer" className="btn-outline">LINKEDIN ↗</a>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 28 }}>
              <a href="mailto:abijithbinu654@gmail.com" className="btn-primary">SEND MESSAGE ↗</a>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <span className="mono muted" style={{ fontSize: 11, letterSpacing: "0.1em" }}>© 2026 ABIJITH BINU</span>
        <span className="mono muted" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
          BUILT WITH REACT // <span className="green">ABIJITH-DEV.VERCEL.APP</span>
        </span>
      </footer>
    </>
  );
}