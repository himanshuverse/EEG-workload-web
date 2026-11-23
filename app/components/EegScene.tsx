"use client";

import { useEffect, useRef } from "react";
import type { Level } from "../lib/api";

// A 3D EEG scene: four channel ribbons (TP9, AF7, AF8, TP10) flow through space, an amber "analysis window"
// sweeps across them, and drifting particles hang in the air. The ribbons get taller and warmer as the workload
// level rises. three.js is loaded by a dynamic import, the loop runs only while the hero is on screen, and with
// "reduce motion" a single frame is drawn.

const LEVEL_INTENSITY: Record<Level, number> = { low: 0.35, medium: 0.7, high: 1.1, unusable: 0.15 };

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function EegScene({ level, dark = false }: { level: Level; dark?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const intensityRef = useRef(LEVEL_INTENSITY.medium);
  const darkRef = useRef(dark);
  const applyThemeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    darkRef.current = dark;
    applyThemeRef.current?.();
  }, [dark]);

  useEffect(() => {
    intensityRef.current = LEVEL_INTENSITY[level];
  }, [level]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !supportsWebGL()) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      if (disposed) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      host.appendChild(renderer.domElement);
      renderer.domElement.style.display = "block";

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog("#ffffff", 9, 20);
      const fog = scene.fog as import("three").Fog;
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 60);
      camera.position.set(0, 3.2, 11);
      camera.lookAt(0, 0, 0);

      const root = new THREE.Group();
      root.rotation.set(0.12, -0.35, 0);
      scene.add(root);

      const teal = new THREE.Color("#158472");
      const mint = new THREE.Color("#8eccc2");
      const amber = new THREE.Color("#f5b82e");
      const ink = new THREE.Color("#0f2b27");

      // ── channel ribbons ──
      const SEG = 200;
      const WIDTH = 0.42;
      const X0 = -7.5;
      const X1 = 7.5;
      const channels = [
        { z: -3.3, f: 1.0, ph: 0.0 },
        { z: -1.1, f: 1.25, ph: 1.7 },
        { z: 1.1, f: 0.85, ph: 3.1 },
        { z: 3.3, f: 1.1, ph: 4.6 },
      ].map((c, idx) => {
        const pos = new Float32Array((SEG + 1) * 2 * 3);
        const col = new Float32Array((SEG + 1) * 2 * 3);
        const index: number[] = [];
        for (let i = 0; i < SEG; i++) {
          const a = i * 2;
          index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
        geo.setIndex(index);
        const mesh = new THREE.Mesh(
          geo,
          new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, transparent: true, opacity: 0.85, fog: true }),
        );
        const linePos = new Float32Array((SEG + 1) * 3);
        const lineGeo = new THREE.BufferGeometry();
        lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
        const line = new THREE.Line(lineGeo, new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.55, fog: true }));
        root.add(mesh, line);
        return { ...c, idx, pos, col, linePos, geo, lineGeo, mesh, line };
      });

      const applyTheme = () => {
        const d = darkRef.current;
        fog.color.set(d ? "#1c1c1c" : "#ffffff");
        for (const c of channels) (c.line.material as import("three").LineBasicMaterial).color.set(d ? "#e5e5e5" : "#0f2b27");
        renderer.render(scene, camera);
      };
      applyThemeRef.current = applyTheme;

      // ── scanning analysis window ──
      const winW = 3.1;
      const winGeo = new THREE.BoxGeometry(winW, 3.4, 9.6);
      const win = new THREE.Mesh(
        winGeo,
        new THREE.MeshBasicMaterial({ color: amber, transparent: true, opacity: 0.12, depthWrite: false }),
      );
      const winEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(winGeo),
        new THREE.LineBasicMaterial({ color: amber, transparent: true, opacity: 0.9 }),
      );
      win.add(winEdges);
      root.add(win);

      // ── particles ──
      const COUNT = window.innerWidth < 700 ? 220 : 480;
      const pPos = new Float32Array(COUNT * 3);
      const pSeed = new Float32Array(COUNT);
      for (let i = 0; i < COUNT; i++) {
        pPos[i * 3] = (Math.random() - 0.5) * 17;
        pPos[i * 3 + 1] = (Math.random() - 0.3) * 7;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 11;
        pSeed[i] = Math.random() * 10;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const dots = new THREE.Points(
        pGeo,
        new THREE.PointsMaterial({ color: teal, size: 0.05, transparent: true, opacity: 0.7, sizeAttenuation: true }),
      );
      root.add(dots);

      // ── sizing ──
      const resize = () => {
        const w = host.clientWidth || 1;
        const h = host.clientHeight || 1;
        renderer.setSize(w, h, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        camera.aspect = w / h;
        camera.position.z = w / h < 0.9 ? 15 : 11;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      // ── pointer ──
      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const onMove = (e: PointerEvent) => {
        mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("pointermove", onMove, { passive: true });

      // ── frame ──
      const damp = (a: number, b: number, l: number, dt: number) => a + (b - a) * (1 - Math.exp(-l * dt));
      const tmp = new THREE.Color();
      let amp = intensityRef.current;
      let t = 0;
      let raf = 0;
      let last = performance.now();

      const waveAt = (x: number, time: number, f: number, ph: number, a: number) =>
        a *
        (0.55 * Math.sin(x * 0.9 * f + time * 1.1 + ph) + // alpha-ish: slow, large
          0.3 * Math.sin(x * 1.9 + time * 1.9 + ph * 1.3) + // theta/beta mix
          0.18 * Math.sin(x * 4.6 * f - time * 3.1 + ph * 0.6) + // beta: fast, small
          0.07 * Math.sin(x * 11 + time * 5 + ph)); // fine texture

      const frame = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        t += dt;
        amp = damp(amp, intensityRef.current, 2.2, dt);
        mouse.x = damp(mouse.x, mouse.tx, 3, dt);
        mouse.y = damp(mouse.y, mouse.ty, 3, dt);
        // warmth: 0 (teal) → 1 (amber) as the level rises
        const warm = Math.min(1, Math.max(0, (amp - 0.3) / 0.8));

        root.rotation.y = -0.35 + mouse.x * 0.22;
        root.rotation.x = 0.12 + mouse.y * 0.1;

        for (const c of channels) {
          for (let i = 0; i <= SEG; i++) {
            const u = i / SEG;
            const x = X0 + (X1 - X0) * u;
            const env = Math.sin(Math.PI * u) ** 0.6; // fade out toward both ends
            const y = waveAt(x, t, c.f, c.ph, 1.05 * amp) * env;
            const k = i * 6;
            c.pos[k] = x; c.pos[k + 1] = y; c.pos[k + 2] = c.z - WIDTH / 2;
            c.pos[k + 3] = x; c.pos[k + 4] = y; c.pos[k + 5] = c.z + WIDTH / 2;
            c.linePos[i * 3] = x; c.linePos[i * 3 + 1] = y; c.linePos[i * 3 + 2] = c.z;
            // colour by height: troughs mint → crests teal, blended toward amber with workload
            const h = Math.min(1, Math.abs(y) / (1.1 * amp + 0.001));
            tmp.copy(mint).lerp(teal, h).lerp(amber, warm * (0.25 + 0.6 * h));
            c.col[k] = c.col[k + 3] = tmp.r;
            c.col[k + 1] = c.col[k + 4] = tmp.g;
            c.col[k + 2] = c.col[k + 5] = tmp.b;
          }
          c.geo.attributes.position.needsUpdate = true;
          c.geo.attributes.color.needsUpdate = true;
          c.lineGeo.attributes.position.needsUpdate = true;
        }

        // the window sweeps left → right, pauses, repeats
        const cycle = (t * 0.11) % 1;
        const eased = cycle < 0.85 ? cycle / 0.85 : 1;
        win.position.x = X0 + winW / 2 + (X1 - X0 - winW) * eased;
        win.position.y = 0.15;
        (win.material as import("three").MeshBasicMaterial).opacity = 0.07 + 0.09 * Math.sin(Math.PI * Math.min(1, eased));

        const arr = pGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < COUNT; i++) {
          arr[i * 3 + 1] += Math.sin(t * 0.5 + pSeed[i]) * 0.0022;
          arr[i * 3] += Math.cos(t * 0.3 + pSeed[i]) * 0.0016;
        }
        pGeo.attributes.position.needsUpdate = true;
        (dots.material as import("three").PointsMaterial).color.copy(teal).lerp(amber, warm * 0.8);

        renderer.render(scene, camera);
        if (!reduce) raf = requestAnimationFrame(frame);
      };

      const start = () => {
        if (reduce || raf) return;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      };
      const stop = () => {
        cancelAnimationFrame(raf);
        raf = 0;
      };

      applyTheme();
      frame(performance.now());
      host.style.opacity = "1";
      let io: IntersectionObserver | undefined;
      if (!reduce) {
        io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
        io.observe(host);
      }

      cleanup = () => {
        applyThemeRef.current = null;
        stop();
        io?.disconnect();
        ro.disconnect();
        window.removeEventListener("pointermove", onMove);
        for (const c of channels) {
          c.geo.dispose();
          c.lineGeo.dispose();
          (c.mesh.material as import("three").Material).dispose();
          (c.line.material as import("three").Material).dispose();
        }
        winGeo.dispose();
        pGeo.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return <div ref={hostRef} aria-hidden="true" className="absolute inset-0 opacity-0 transition-opacity duration-1000" />;
}
