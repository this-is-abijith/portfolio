import { useEffect, useRef } from "react";
import * as THREE from "three";

/* ── All tech stack labels ── */
const TECHS = [
  "Python", "React", "TensorFlow", "OpenCV",
  "MediaPipe", "Flask", "scikit-learn", "NumPy",
  "YOLO", "LSTM", "Node.js", "MySQL",
  "Git", "Linux", "Vulkan", "Pillow",
  "Real-ESRGAN", "Machine Learning","Bootstrap 5","EasyOCR",
];

/* ── Evenly distribute points on sphere (Fibonacci lattice) ── */
function fibonacciSphere(count, radius) {
  const points = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    points.push(new THREE.Vector3(
      Math.cos(theta) * r * radius,
      y * radius,
      Math.sin(theta) * r * radius
    ));
  }
  return points;
}

/* ── Canvas texture with a tech label ── */
function makeLabelTexture(text) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.fillRect(0, 0, 256, 64);
  ctx.strokeStyle = "#00ff87";
  ctx.lineWidth = 2;
  ctx.roundRect(4, 4, 248, 56, 6);
  ctx.stroke();
  ctx.fillStyle = "#00ff87";
  ctx.font = "bold 22px 'Space Mono', monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, 128, 32);
  return new THREE.CanvasTexture(canvas);
}

export default function TechGlobe() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const W = el.clientWidth;
    const H = el.clientHeight;

    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    /* ── Scene + Camera ── */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.z = 3.2;

    /* ── Globe wireframe ── */
    const globeGeo = new THREE.SphereGeometry(1, 32, 32);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x00ff87, wireframe: true, transparent: true, opacity: 0.08,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);

    /* ── Equator ring ── */
    const ringGeo = new THREE.TorusGeometry(1.01, 0.004, 2, 128);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00ff87, transparent: true, opacity: 0.25 });
    const ring    = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;

    /* ── Dot particles on surface ── */
    const dotPositions = fibonacciSphere(180, 1.01);
    const dotGeo = new THREE.BufferGeometry();
    const dotVerts = [];
    dotPositions.forEach(p => dotVerts.push(p.x, p.y, p.z));
    dotGeo.setAttribute("position", new THREE.Float32BufferAttribute(dotVerts, 3));
    const dotMat  = new THREE.PointsMaterial({ color: 0x00ff87, size: 0.012, transparent: true, opacity: 0.5 });
    const dots    = new THREE.Points(dotGeo, dotMat);

    /* ── Floating label sprites ── */
    const labelPositions = fibonacciSphere(TECHS.length, 1.22);
    const sprites = [];
    TECHS.forEach((label, i) => {
      const tex    = makeLabelTexture(label);
      const mat    = new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.9 });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(0.7, 0.175, 1);
      sprite.position.copy(labelPositions[i]);
      sprites.push(sprite);
    });

    /* ── Group everything ── */
    const group = new THREE.Group();
    group.add(globe, ring, dots);
    sprites.forEach(s => group.add(s));
    scene.add(group);

    /* ── Drag interaction ── */
    let isDragging = false;
    let prevX = 0, prevY = 0;
    let velX  = 0, velY  = 0;
    let autoRotate = true;
    let autoTimer  = null;

    const onDown = (e) => {
      isDragging = true;
      autoRotate = false;
      clearTimeout(autoTimer);
      const c = e.touches ? e.touches[0] : e;
      prevX = c.clientX; prevY = c.clientY;
      velX = velY = 0;
    };
    const onMove = (e) => {
      if (!isDragging) return;
      const c = e.touches ? e.touches[0] : e;
      velY = (c.clientX - prevX) * 0.005;
      velX = (c.clientY - prevY) * 0.005;
      group.rotation.y += velY;
      group.rotation.x += velX;
      prevX = c.clientX; prevY = c.clientY;
    };
    const onUp = () => {
      isDragging = false;
      autoTimer = setTimeout(() => { autoRotate = true; }, 2000);
    };

    renderer.domElement.addEventListener("mousedown",  onDown);
    renderer.domElement.addEventListener("mousemove",  onMove);
    renderer.domElement.addEventListener("mouseup",    onUp);
    renderer.domElement.addEventListener("mouseleave", onUp);
    renderer.domElement.addEventListener("touchstart", onDown, { passive: true });
    renderer.domElement.addEventListener("touchmove",  onMove, { passive: true });
    renderer.domElement.addEventListener("touchend",   onUp);

    /* ── Resize ── */
    const onResize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    /* ── Animate ── */
    let frame;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      if (autoRotate) {
        group.rotation.y += 0.003;
        group.rotation.x += 0.0005;
      } else if (!isDragging) {
        velX *= 0.95; velY *= 0.95;
        group.rotation.y += velY;
        group.rotation.x += velX;
      }
      sprites.forEach(s => s.quaternion.copy(camera.quaternion));
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(autoTimer);
      window.removeEventListener("resize", onResize);
      renderer.domElement.removeEventListener("mousedown",  onDown);
      renderer.domElement.removeEventListener("mousemove",  onMove);
      renderer.domElement.removeEventListener("mouseup",    onUp);
      renderer.domElement.removeEventListener("mouseleave", onUp);
      renderer.domElement.removeEventListener("touchstart", onDown);
      renderer.domElement.removeEventListener("touchmove",  onMove);
      renderer.domElement.removeEventListener("touchend",   onUp);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{ width: "100%", height: "clamp(280px, 60vw, 420px)", userSelect: "none", touchAction: "none" }}
    />
  );
}