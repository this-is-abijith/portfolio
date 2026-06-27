import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
import TechGlobe from "./TechGlobe";

/* ─── Background Blobs (make glass visible) ───────────────────────── */
function BackgroundBlobs() {
  return (
    <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none", overflow:"hidden" }}>
      <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", top:"-150px", left:"-100px",
        background:"radial-gradient(circle, rgba(0,255,135,0.13) 0%, transparent 70%)", filter:"blur(70px)",
        animation:"blobA 9s ease-in-out infinite" }} />
      <div style={{ position:"absolute", width:450, height:450, borderRadius:"50%", top:"35%", right:"-80px",
        background:"radial-gradient(circle, rgba(0,210,160,0.10) 0%, transparent 70%)", filter:"blur(80px)",
        animation:"blobB 11s ease-in-out infinite" }} />
      <div style={{ position:"absolute", width:380, height:380, borderRadius:"50%", bottom:"8%", left:"18%",
        background:"radial-gradient(circle, rgba(0,255,135,0.09) 0%, transparent 70%)", filter:"blur(90px)",
        animation:"blobC 13s ease-in-out infinite" }} />
      <div style={{ position:"absolute", width:220, height:220, borderRadius:"50%", top:"8%", right:"28%",
        background:"radial-gradient(circle, rgba(0,255,135,0.12) 0%, transparent 70%)", filter:"blur(55px)",
        animation:"blobA 7s ease-in-out infinite reverse" }} />
    </div>
  );
}

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

/* ─── Custom Cursor ────────────────────────────────────────────────── */
function Cursor() {
  const dot  = useRef(null);
  const ring = useRef(null);
  const [isTouch, setIsTouch] = useState(false);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) { setIsTouch(true); return; }
    const move = (e) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (dot.current) {
        dot.current.style.left = e.clientX - 6 + "px";
        dot.current.style.top  = e.clientY - 6 + "px";
      }
    };

    let raf;
    const smoothRing = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.1;
      pos.current.y += (target.current.y - pos.current.y) * 0.1;
      if (ring.current) {
        ring.current.style.left = pos.current.x + "px";
        ring.current.style.top  = pos.current.y + "px";
      }
      raf = requestAnimationFrame(smoothRing);
    };
    smoothRing();

    const onEnterInteractive = () => { if (ring.current) ring.current.classList.add("cursor-ring--hover"); };
    const onLeaveInteractive = () => { if (ring.current) ring.current.classList.remove("cursor-ring--hover"); };
    document.querySelectorAll("a, button").forEach(el => {
      el.addEventListener("mouseenter", onEnterInteractive);
      el.addEventListener("mouseleave", onLeaveInteractive);
    });

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (isTouch) return null;
  return (
    <>
      <div ref={dot}  className="cursor" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}

/* ─── Magnetic Button ──────────────────────────────────────────────── */
function MagneticBtn({ children, className, href, style, onClick, target, rel }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = useCallback((e) => {
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  }, [x, y]);

  const handleMouseLeave = useCallback(() => {
    x.set(0); y.set(0);
  }, [x, y]);

  const Tag = href ? motion.a : motion.button;

  return (
    <Tag
      ref={ref}
      href={href}
      className={className}
      style={{ ...style, x: springX, y: springY, display: "inline-block" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      target={target}
      rel={rel}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </Tag>
  );
}

/* ─── 3D Tilt Card ─────────────────────────────────────────────────── */
function TiltCard({ children, className, style, ...rest }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top)  / rect.height;
    setTilt({ x: (py - 0.5) * -10, y: (px - 0.5) * 10 });
    setGlowPos({ x: px * 100, y: py * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        ...style,
        transformStyle: "preserve-3d",
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease",
        position: "relative",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {isHovered && (
        <div
          style={{
            position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
            background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(0,255,135,0.06) 0%, transparent 60%)`,
            borderRadius: "inherit",
          }}
        />
      )}
      {children}
    </motion.div>
  );
}

/* HeroParallax removed — mouseX/mouseY now live at App() top level */

/* ─── Floating Orb ─────────────────────────────────────────────────── */
function FloatingOrb({ size, x, y, delay, opacity }) {
  return (
    <motion.div
      style={{
        position: "absolute", width: size, height: size,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,255,135,0.15) 0%, transparent 70%)",
        left: x, top: y, pointerEvents: "none", zIndex: 0,
        filter: "blur(40px)",
      }}
      animate={{ y: [0, -20, 0], scale: [1, 1.05, 1], opacity: [opacity, opacity * 1.3, opacity] }}
      transition={{ duration: 6 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
}

/* ─── Skill Category Row ───────────────────────────────────────────── */
function SkillCategory({ category, skills, i }) {
  return (
    <motion.div
      className="skill-category"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
    >
      <span className="skill-category-label">{category}</span>
      <div className="skill-tags">
        {skills.map((s, j) => (
          <motion.span
            key={j}
            className="skill-tag"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 + j * 0.03 }}
            viewport={{ once: true }}
          >
            {s}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Data ─────────────────────────────────────────────────────────── */
const skillData = [
  {
    category: "LANGUAGES",
    skills: ["Python", "JavaScript", "SQL"],
  },
  {
    category: "AI / ML",
    skills: ["Machine Learning", "TensorFlow", "PyTorch", "scikit-learn", "OpenCV", "MediaPipe", "YOLOv8", "EasyOCR", "Real-ESRGAN", "LSTM", "CNN", "DCGAN"],
  },
  {
    category: "WEB & BACKEND",
    skills: ["React", "Flask", "Node.js", "Bootstrap 5", "HTML/CSS"],
  },
  {
    category: "DATABASES",
    skills: ["MySQL", "SQLite", "Supabase"],
  },
  {
    category: "TOOLS & INFRA",
    skills: ["Git", "Linux", "Vulkan / ncnn", "Vercel", "Roboflow", "Miniconda", "VS Code"],
  },
];

const projects = [
   {
    id: "01", name: "Pixelarc",
    desc: "Pixelarc is an AI-powered image upscaler available as a native Android app. Pick any photo, choose your upscale factor (2×, 3×, or 4×), and let Real-ESRGAN reconstruct fine detail that bicubic resizing can't recover.",
    stack: ["React Native", "Expo" , "Flask" , "Real-ESRGAN (ncnn-Vulkan)" , "PyTorch" , "Render" , "EAS Build"],
    href: "https://github.com/this-is-abijith/pixelarc",
  },
  {
    id: "02", name: "Brain Tumor Detection",
    desc: "CNN model detecting brain tumors from MRI images with high accuracy using deep learning classification.",
    stack: ["Python", "TensorFlow", "CNN", "OpenCV"],
    href: "https://github.com/this-is-abijith/brain-tumor-detection-ai",
  },
  {
    id: "03", name: "Number Plate Detection",
    desc: "Real-time number plate detection and recognition system built with YOLO model.",
    stack: ["Python", "YOLO", "OpenCV", "OCR"],
    href: "https://github.com/this-is-abijith/ai-number-plate-detector",
  },
  {
    id: "04", name: "Bitcoin Price Prediction",
    desc: "ML model forecasting cryptocurrency price trends using LSTM and time-series analysis.",
    stack: ["Python", "LSTM", "Pandas", "scikit-learn"],
    href: "https://github.com/this-is-abijith/bitcoin-price-prediction-ai",
  },
  {
    id: "05", name: "Rainfall Prediction App",
    desc: "Ensemble ML model (Random Forest + Gradient Boosting) predicting rain probability from weather inputs via a Flask web interface.",
    stack: ["Python", "Flask", "scikit-learn", "Random Forest"],
    href: "https://github.com/this-is-abijith/rainfall-prediction-app",
  },
  {
    id: "06", name: "Hand Gesture Particle System",
    desc: "Real-time hand gesture controlled particle system using computer vision and MediaPipe for gesture recognition.",
    stack: ["Python", "MediaPipe", "OpenCV", "NumPy"],
    href: "https://github.com/this-is-abijith/hand-gesture-particle-system",
  },
  {
    id: "07", name: "AI Waste Classifier",
    desc: "A deep learning-based web application that classifies waste into categories using a trained CNN model.",
    stack: ["Python", "PyTorch", "Flask", "HTML/CSS"],
    href: "https://github.com/this-is-abijith/ai-waste-classifier",
  },
  {
    id: "08", name: "AI Indian Plate Detector V2",
    desc: "An AI-powered number plate detection system built with YOLOv8 and EasyOCR, designed specifically for Indian number plates.",
    stack: ["Python", "YOLOv8 (Ultralytics)", "Flask", "EasyOCR","OpenCV","Bootstrap 5","SQLite"],
    href: "https://github.com/this-is-abijith/indian-plate-detector",
  },
  {
    id: "09", name: "Multi-Modal Fashion Product Classifier",
    desc: "A hybrid deep learning system that classifies fashion products into 10 categories by combining ANN and CNN.",
    stack: ["Python","PyTorch" ],
    href: "https://github.com/this-is-abijith/multimodal-fashion-classifier",
  }
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

  // Scroll-driven parallax for hero layers
  const { scrollY } = useScroll();
  const heroNameY     = useTransform(scrollY, [0, 400], [0, -60]);
  const heroOutlineY  = useTransform(scrollY, [0, 400], [0, -40]);

  const heroOpacity   = useTransform(scrollY, [0, 300], [1, 0]);

  // Mouse parallax — motion values live here, never inside callbacks
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Derived springs for ABIJITH (shallow depth)
  const nameSpringX = useSpring(useTransform(mouseX, [-1, 1], [-8,  8]),  { stiffness: 100, damping: 20 });
  const nameSpringY = useSpring(useTransform(mouseY, [-1, 1], [-4,  4]),  { stiffness: 100, damping: 20 });
  // Derived springs for BINU (deeper depth)
  const outlineSpringX = useSpring(useTransform(mouseX, [-1, 1], [-14, 14]), { stiffness: 80, damping: 20 });
  const outlineSpringY = useSpring(useTransform(mouseY, [-1, 1], [-8,  8]),  { stiffness: 80, damping: 20 });

  useEffect(() => {
    const handleMove = (e) => {
      mouseX.set((e.clientX / window.innerWidth  - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

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

        /* ── Cursor ── */
        .cursor {
          position: fixed; width: 12px; height: 12px;
          background: var(--green); border-radius: 50%;
          pointer-events: none; z-index: 9999; mix-blend-mode: difference;
          transition: transform 0.1s ease, width 0.2s ease, height 0.2s ease;
        }
        .cursor-ring {
          position: fixed; width: 36px; height: 36px;
          border: 1px solid rgba(0,255,135,0.6); border-radius: 50%;
          pointer-events: none; z-index: 9998;
          transform: translate(-50%, -50%);
          transition: width 0.3s ease, height 0.3s ease, border-color 0.3s ease, background 0.3s ease;
        }
        .cursor-ring--hover {
          width: 56px; height: 56px;
          border-color: var(--green);
          background: rgba(0,255,135,0.04);
        }

        /* ── Progress bar ── */
        .progress-bar {
          position: fixed; top: 0; left: 0; right: 0; height: 2px;
          background: var(--green); transform-origin: left; z-index: 200;
        }

        /* ── Glitch ── */
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

        /* ── Scanlines ── */
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

        /* ── Tag with hover ── */
        .tag {
          font-family: 'Space Mono', monospace; font-size: 10px; padding: 2px 8px;
          border: 1px solid var(--green); color: var(--green);
          letter-spacing: 0.1em; white-space: nowrap; display: inline-block;
          transition: background 0.2s ease, color 0.2s ease, transform 0.15s ease;
        }
        .tag:hover { background: var(--green); color: var(--black); transform: translateY(-1px); }

        /* ── Buttons ── */
        .btn-primary {
          display: inline-block;
          background: rgba(0,255,135,0.15);
          color: var(--green);
          padding: 12px 24px; font-family: 'Space Mono', monospace;
          font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
          border: 1px solid rgba(0,255,135,0.45); text-decoration: none;
          position: relative; overflow: hidden;
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          transition: background 0.25s, box-shadow 0.25s, border-color 0.25s;
        }
        .btn-primary::before {
          content: ''; position: absolute; inset: 0;
          background: rgba(255,255,255,0.08);
          transform: translateX(-100%) skewX(-15deg);
          transition: transform 0.4s ease;
        }
        .btn-primary:hover::before { transform: translateX(200%) skewX(-15deg); }
        .btn-primary:hover {
          background: rgba(0,255,135,0.25);
          border-color: var(--green);
          box-shadow: 0 0 28px rgba(0,255,135,0.25), inset 0 0 20px rgba(0,255,135,0.05);
        }

        .btn-outline {
          display: inline-block;
          background: rgba(255,255,255,0.03);
          color: rgba(240,237,230,0.65);
          padding: 12px 24px; font-family: 'Space Mono', monospace;
          font-size: 11px; letter-spacing: 0.12em;
          border: 1px solid rgba(255,255,255,0.1); text-decoration: none;
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          transition: border-color 0.25s, color 0.25s, background 0.25s, box-shadow 0.25s;
        }
        .btn-outline:hover {
          border-color: rgba(0,255,135,0.45); color: var(--green);
          background: rgba(0,255,135,0.06);
          box-shadow: 0 0 16px rgba(0,255,135,0.1);
        }

        .btn-show-more {
          display: flex; align-items: center; gap: 12px;
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          border: 1px dashed rgba(255,255,255,0.12); color: #555;
          font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.15em;
          padding: 16px 32px; margin: 24px auto 0;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          width: 100%; justify-content: center;
        }
        .btn-show-more:hover { border-color: rgba(0,255,135,0.4); color: var(--green); background: rgba(0,255,135,0.04); }
        .btn-show-more .arrow { transition: transform 0.3s; display: inline-block; }
        .btn-show-more.open .arrow { transform: rotate(180deg); }

        /* ── Link underline grow ── */
        .link-grow { position: relative; text-decoration: none; }
        .link-grow::after {
          content: ''; position: absolute; left: 0; bottom: -2px;
          width: 0; height: 1px; background: var(--green); transition: width 0.3s ease;
        }
        .link-grow:hover::after { width: 100%; }

        /* ── Skills grid ── */
        .skills-categories { display: flex; flex-direction: column; gap: 8px; }
        .skill-category {
          background: rgba(255,255,255,0.025);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.07); padding: 20px 24px;
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .skill-category:hover {
          border-color: rgba(0,255,135,0.2);
          background: rgba(0,255,135,0.035);
        }
        .skill-category-label {
          font-family: 'Space Mono', monospace; font-size: 9px;
          letter-spacing: 0.3em; color: var(--green); margin-bottom: 14px; display: block;
        }
        .skill-tags { display: flex; flex-wrap: wrap; gap: 8px; }
        .skill-tag {
          font-family: 'Space Mono', monospace; font-size: 10px;
          padding: 5px 12px;
          background: rgba(0,255,135,0.04);
          backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);
          border: 1px solid rgba(0,255,135,0.18);
          color: rgba(0,255,135,0.65); letter-spacing: 0.06em; white-space: nowrap;
          transition: border-color 0.2s, color 0.2s, background 0.2s, transform 0.15s;
          cursor: default;
        }
        .skill-tag:hover {
          border-color: var(--green); color: var(--green);
          background: rgba(0,255,135,0.1); transform: translateY(-2px);
        }

        /* ── Project cards ── */
        .proj-card { position: relative; }
        .proj-card::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 2px; background: var(--green);
          transform: scaleY(0); transform-origin: top; transition: transform 0.3s ease;
        }
        .proj-card:hover::before { transform: scaleY(1); }

        /* ── VIEW link pulse on card hover ── */
        .proj-row:hover .proj-view-link {
          color: var(--green) !important;
          text-shadow: 0 0 12px rgba(0,255,135,0.5);
        }
        .proj-view-link { transition: color 0.2s, text-shadow 0.2s; }

        /* ── Sections ── */
        .section { max-width: var(--max); margin: 0 auto; padding: 100px var(--pad); }
        #about { padding-top: 48px; }

        /* ── Navbar ── */
        .navbar {
          position: fixed; top: 0; width: 100%;
          border-bottom: 1px solid rgba(0,255,135,0.1);
          background: rgba(8,8,8,0.45);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          z-index: 100;
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
          text-decoration: none; color: #555; transition: color 0.2s, letter-spacing 0.2s;
          position: relative;
        }
        .nav-link::after {
          content: ''; position: absolute; bottom: -4px; left: 0;
          width: 0; height: 1px; background: var(--green);
          transition: width 0.25s ease;
        }
        .nav-link:hover::after, .nav-link.active::after { width: 100%; }
        .nav-link.active, .nav-link:hover { color: var(--green); }
        .hamburger { display: none; background: none; border: none; color: var(--white); font-size: 20px; padding: 8px; }
        .mobile-menu {
          border-top: 1px solid rgba(0,255,135,0.1);
          background: rgba(8,8,8,0.6);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          padding: 24px var(--pad); display: flex; flex-direction: column; gap: 20px;
        }
        .mobile-menu a {
          font-family: 'Space Mono', monospace; font-size: 13px;
          letter-spacing: 0.15em; text-transform: uppercase;
          text-decoration: none; color: var(--white);
        }

        /* ── Hero ── */
        .hero {
          min-height: 85vh; display: flex; flex-direction: column; justify-content: center;
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

        /* ── Scroll hint bounce ── */
        @keyframes bounce-v {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        .scroll-hint-arrow { animation: bounce-v 1.8s ease-in-out infinite; }

        /* ── About ── */
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }



        /* ── Projects ── */
        .proj-row {
          display: grid; grid-template-columns: 56px 1fr auto;
          gap: 24px; align-items: center;
          padding: 28px 20px;
          background: rgba(255,255,255,0.02);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 2px; overflow: hidden;
          transition: border-color 0.25s ease, background 0.25s ease;
        }
        .proj-row:hover {
          border-color: rgba(0,255,135,0.18);
          background: rgba(0,255,135,0.03);
        }

        /* ── Contact ── */
        .contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }

        /* ── Footer ── */
        .footer {
          border-top: 1px solid rgba(255,255,255,0.06);
          background: rgba(8,8,8,0.4);
          backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);
          padding: 24px var(--pad);
          max-width: 100%; margin: 0;
          display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
        }

        /* ── Dividers ── */
        .dash-rule { border: none; border-top: 1px solid rgba(255,255,255,0.06); }

        /* ── Blob keyframes ── */
        @keyframes blobA { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-28px) scale(1.04)} }
        @keyframes blobB { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(22px) scale(0.97)} }
        @keyframes blobC { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-16px) scale(1.03)} }

        /* ── Floating micro-animation for section numbers ── */
        @keyframes float-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .sec-num { animation: float-x 4s ease-in-out infinite; }

        /* ── TABLET ≤ 900px ── */
        @media (max-width: 900px) {
          .about-grid   { grid-template-columns: 1fr; gap: 48px; }
          .contact-grid { grid-template-columns: 1fr; gap: 48px; }
        }

        /* ── MOBILE ≤ 640px ── */
        @media (max-width: 640px) {
          .nav-links { display: none; }
          .hamburger { display: block; }
          .section   { padding: 72px var(--pad); }
          .hero {
            justify-content: center;
            padding-top: 100px;
            padding-bottom: 0px;
            min-height: auto;
            gap: 12px;
          }
          #about { padding-top: 24px; }
          .hero-status {
            position: relative; top: auto; left: auto; right: auto; margin-bottom: 8px;
          }
          .proj-row  { grid-template-columns: 1fr; gap: 10px; }
          .proj-num  { display: none; }
          .scroll-hint { display: none; }
        }

        /* ── SMALL PHONE ≤ 400px ── */
        @media (max-width: 400px) {
          .hero-btns > * { width: 100%; text-align: center; }
        }
      `}</style>

      <BackgroundBlobs />
      <Cursor />
      <motion.div className="progress-bar" style={{ scaleX }} />

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="navbar-inner">
          <motion.span
            className="mono green"
            style={{ fontSize: 13, letterSpacing: "0.15em" }}
            whileHover={{ letterSpacing: "0.2em" }}
            transition={{ duration: 0.3 }}
          >
            ABIJITH<span style={{ color: "var(--white)" }}>.DEV</span>
          </motion.span>
          <div className="nav-links">
            {NAV_LINKS.map((s) => (
              <a key={s} href={`#${s}`} className={`nav-link${activeSection === s ? " active" : ""}`}>{s}</a>
            ))}
            <MagneticBtn href="/resume.pdf" className="btn-primary" style={{ padding: "8px 18px" }}>
              RESUME ↗
            </MagneticBtn>
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
      <section id="home" style={{ position: "relative", overflow: "hidden" }}>
            {/* Ambient parallax orbs */}
            <FloatingOrb size={300} x="10%"  y="20%"  delay={0}   opacity={0.4} />
            <FloatingOrb size={200} x="70%"  y="10%"  delay={1.5} opacity={0.25} />
            <FloatingOrb size={150} x="85%"  y="60%"  delay={3}   opacity={0.2} />

            <div className="hero">
              <motion.div
                className="hero-status"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              >
                <span className="mono muted" style={{ fontSize: 11, letterSpacing: "0.1em" }}>SYS:ONLINE // KERALA, IN</span>
                <motion.span
                  className="mono muted"
                  style={{ fontSize: 11, letterSpacing: "0.1em" }}
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="green">●</span> AVAILABLE FOR WORK
                </motion.span>
              </motion.div>

              <motion.p className="mono sec-num" style={{ marginBottom: 16 }}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                001 // PORTFOLIO
              </motion.p>

              {/* Hero name — scroll parallax + mouse parallax via top-level springs */}
              <motion.div
                className="hero-name"
                style={{ y: heroNameY, opacity: heroOpacity }}
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.span style={{ display: "inline-block", x: nameSpringX, y: nameSpringY }}>
                  <GlitchText text="ABIJITH" />
                </motion.span>
              </motion.div>

              {/* Outlined name — deeper parallax layer */}
              <motion.div
                className="hero-name-outline"
                style={{ y: heroOutlineY, opacity: heroOpacity }}
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.span style={{ display: "inline-block", x: outlineSpringX, y: outlineSpringY }}>
                  BINU
                </motion.span>
              </motion.div>

              <motion.div className="hero-bottom" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                <p className="mono dim" style={{ fontSize: 13 }}>
                  <Typewriter strings={["AI / ML Developer", "React Developer", "MSc Student", "Building the future"]} />
                </p>
                <div className="hero-btns">
                  <MagneticBtn
                    href="https://github.com/this-is-abijith"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-primary"
                  >
                    GITHUB ↗
                  </MagneticBtn>
                  <MagneticBtn
                    href="https://www.linkedin.com/in/abijith-binu/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn-outline"
                  >
                    LINKEDIN
                  </MagneticBtn>
                </div>
              </motion.div>

              {/* Scroll hint */}
              <motion.div
                className="scroll-hint"
                style={{ opacity: heroOpacity }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
              >
                <span className="scroll-hint-arrow">↓</span>
                <span>SCROLL</span>
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
              <motion.span
                style={{ display: "block" }}
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }} viewport={{ once: true }}
              >BUILDING</motion.span>
              <motion.span
                style={{ display: "block", WebkitTextStroke: "1px var(--white)", color: "transparent" }}
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }} viewport={{ once: true }}
              >INTELLIGENT</motion.span>
              <motion.span
                style={{ display: "block" }}
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }} viewport={{ once: true }}
              >SYSTEMS</motion.span>
            </h2>
            <p className="mono dim" style={{ lineHeight: 1.9, fontSize: 12, marginBottom: 20 }}>
              MSc student passionate about Artificial Intelligence, Machine Learning and modern web development.
              I build AI-powered applications that bridge the gap between research and real-world impact.
            </p>
            <p className="mono dim" style={{ lineHeight: 1.9, fontSize: 12 }}>
              From CNN-based medical imaging to YOLO object detection — precision and obsessive attention to detail in every project.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <p className="mono muted" style={{ fontSize: 10, letterSpacing: "0.2em" }}></p>
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
        <div className="skills-categories">
          {skillData.map((group, i) => (
            <SkillCategory key={i} category={group.category} skills={group.skills} i={i} />
          ))}
        </div>
      </motion.section>

      <hr className="dash-rule" />

      {/* ── PROJECTS ── */}
      <motion.section id="projects" className="section"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7 }} viewport={{ once: true }}>
        <p className="mono sec-num" style={{ marginBottom: 16 }}>004 // PROJECTS</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56, flexWrap: "wrap", gap: 16 }}>
          <h2 className="syne" style={{ fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 800 }}>SELECTED WORK</h2>
          <motion.span
            className="mono muted"
            style={{ fontSize: 11, letterSpacing: "0.1em" }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {showAll ? projects.length : Math.min(INITIAL_SHOW, projects.length)} / {projects.length} PROJECTS
          </motion.span>
        </div>

        {visibleProjects.map((proj, i) => (
          <TiltCard
            key={proj.id}
            className="proj-card proj-row"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            viewport={{ once: true }}
          >
            <motion.span
              className="syne proj-num"
              style={{ fontSize: 32, fontWeight: 800, color: "var(--border)", lineHeight: 1 }}
              whileHover={{ color: "var(--green)", scale: 1.1, originX: 0 }}
              transition={{ duration: 0.2 }}
            >
              {proj.id}
            </motion.span>
            <div style={{ position: "relative", zIndex: 2 }}>
              <h3 className="syne" style={{ fontSize: "clamp(16px, 3vw, 22px)", fontWeight: 700, marginBottom: 8 }}>{proj.name}</h3>
              <p className="mono dim" style={{ fontSize: 12, lineHeight: 1.7, marginBottom: 14, maxWidth: 560 }}>{proj.desc}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {proj.stack.map((s, j) => (
                  <motion.span
                    key={j} className="tag"
                    initial={{ opacity: 0, y: 4 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: j * 0.04 + i * 0.08 }}
                    viewport={{ once: true }}
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>
            <a href={proj.href} target="_blank" rel="noreferrer"
              className="mono link-grow green proj-view-link"
              style={{ fontSize: 11, letterSpacing: "0.1em", whiteSpace: "nowrap", position: "relative", zIndex: 2 }}>
              VIEW ↗
            </a>
          </TiltCard>
        ))}

        {projects.length > INITIAL_SHOW && (
          <motion.button
            className={`btn-show-more${showAll ? " open" : ""}`}
            onClick={() => setShowAll(!showAll)}
            whileTap={{ scale: 0.98 }}
            whileHover={{ borderStyle: "solid" }}
          >
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
              <motion.span style={{ display: "block" }}
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }} viewport={{ once: true }}>
                LET'S
              </motion.span>
              <motion.span style={{ display: "block", WebkitTextStroke: "1px var(--white)", color: "transparent" }}
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }} viewport={{ once: true }}>
                WORK
              </motion.span>
              <motion.span style={{ display: "block" }}
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }} viewport={{ once: true }}>
                TOGETHER
              </motion.span>
            </h2>
            <p className="mono dim" style={{ fontSize: 12, lineHeight: 1.9 }}>
              Open to collaborations, internships, and full-time opportunities in AI/ML and web development.
            </p>
          </div>
          <div style={{
            background: "rgba(255,255,255,0.025)",
            backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.07)",
            padding: "32px",
          }}>
            <div style={{ marginBottom: 28 }}>
              <p className="mono green" style={{ fontSize: 10, letterSpacing: "0.25em", marginBottom: 8 }}>EMAIL</p>
              <a href="mailto:abijithbinu654@gmail.com"
                className="syne link-grow"
                style={{ fontSize: "clamp(14px, 2.5vw, 20px)", fontWeight: 700, color: "var(--white)", textDecoration: "none" }}>
                abijithbinu654@gmail.com
              </a>
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36 }}>
              <MagneticBtn href="https://github.com/this-is-abijith" target="_blank" rel="noreferrer" className="btn-outline">
                GITHUB ↗
              </MagneticBtn>
              <MagneticBtn href="https://www.linkedin.com/in/abijith-binu/" target="_blank" rel="noreferrer" className="btn-outline">
                LINKEDIN ↗
              </MagneticBtn>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 28 }}>
              <MagneticBtn href="mailto:abijithbinu654@gmail.com" className="btn-primary">
                SEND MESSAGE ↗
              </MagneticBtn>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <motion.span
          className="mono muted"
          style={{ fontSize: 11, letterSpacing: "0.1em" }}
          whileHover={{ color: "var(--green)" }}
          transition={{ duration: 0.2 }}
        >
          © 2026 ABIJITH BINU
        </motion.span>
        <span className="mono muted" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
          BUILT WITH REACT // <span className="green">ABIJITH-DEV.VERCEL.APP</span>
        </span>
      </footer>
    </>
  );
}