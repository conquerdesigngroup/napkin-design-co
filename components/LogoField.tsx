'use client';

import { useEffect, useRef } from 'react';
import { INTRO_MARK_D } from './logo-paths';

/* A relief of extruded logomarks behind the receipts, lit from both sides,
   rising toward the pointer. Adapted from the classic Codrops-style Three.js
   glyph grid, with three changes: the glyph is our logomark path instead of a
   font character, the tweens are damped lerps instead of GSAP, and the whole
   module is a lazy chunk that only loads when the section approaches the
   viewport, so First Load JS does not move.

   Reduced motion gets the completed relief, statically lit, no loop. Touch
   gets the same. No JS, no WebGL, or any failure: the section looks exactly
   as it did before, the layer is pure decoration behind the glass cards. */

const GRID_COLS = 6;
const GRID_ROWS = 4;
const SPACING = 7; // glyph size ~3 + gutter 4, in scene units
const BASE_Z = -1.5;
const LIFT = 3.2; // how far a glyph rises under the pointer
const FALLOFF = 11; // scene-unit radius of the lift

export default function LogoField() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const section = el.closest('section');
    if (!section) return;

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = matchMedia('(pointer: fine)').matches;

    let disposed = false;
    let started = false;
    let visible = false;
    let raf = 0;
    let cleanupScene: (() => void) | null = null;
    let renderOnce: (() => void) | null = null;
    let setVisible: ((v: boolean) => void) | null = null;

    /* Load three only when the section is near. The observer below flips
       visible; start() runs the first time it does. */
    async function start() {
      if (started || disposed) return;
      started = true;

      let THREE: typeof import('three');
      let SVGLoaderMod: typeof import('three/examples/jsm/loaders/SVGLoader.js');
      let RoomEnvironmentMod: typeof import('three/examples/jsm/environments/RoomEnvironment.js');
      try {
        [THREE, SVGLoaderMod, RoomEnvironmentMod] = await Promise.all([
          import('three'),
          import('three/examples/jsm/loaders/SVGLoader.js'),
          import('three/examples/jsm/environments/RoomEnvironment.js'),
        ]);
      } catch {
        return; // no chunk, no effect, section stays as it was
      }
      if (disposed || !el) return;

      let renderer: import('three').WebGLRenderer;
      try {
        // preserveDrawingBuffer keeps the canvas readable after the frame, which
        // costs nothing measurable at this scene size and keeps it inspectable.
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      } catch {
        return; // no WebGL, decoration quietly absent
      }

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x0a0a0b, 30, 46);

      /* Metals are black without an environment to reflect. The generated room
         is what gives the relief its sheen; intensity kept low to stay moody. */
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTex = pmrem.fromScene(new RoomEnvironmentMod.RoomEnvironment(), 0.04).texture;
      scene.environment = envTex;

      const camera = new THREE.PerspectiveCamera(30, 1, 1, 120);
      camera.position.set(9, -5, 40);
      camera.lookAt(-3, 0, 0);

      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
      renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
      el.appendChild(renderer.domElement);

      /* The logomark path, extruded. SVG y points down, the scene y points up,
         so the geometry is flipped and re-centered. */
      const svg = new SVGLoaderMod.SVGLoader().parse(
        `<svg xmlns="http://www.w3.org/2000/svg"><path d="${INTRO_MARK_D}"/></svg>`,
      );
      const shapes = svg.paths.flatMap((p) => SVGLoaderMod.SVGLoader.createShapes(p));
      const geometry = new THREE.ExtrudeGeometry(shapes, {
        depth: 60,
        curveSegments: 4,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 1.4,
        bevelOffset: -1.4,
        bevelSegments: 3,
      });
      geometry.center();
      const s = 3.4 / 175; // logomark viewBox is 175 units wide, glyph ~3.4 scene units
      geometry.scale(s, -s, s);

      const material = new THREE.MeshPhysicalMaterial({
        color: 0x8a8a94, // --smoke
        metalness: 0.9,
        roughness: 0.24,
        emissive: 0x08080c,
        envMapIntensity: 0.55,
      });

      const group = new THREE.Object3D();
      const meshes: { mesh: import('three').Mesh; speed: number }[] = [];
      for (let row = 0; row < GRID_ROWS; row++) {
        for (let col = 0; col < GRID_COLS; col++) {
          const mesh = new THREE.Mesh(geometry, material);
          mesh.position.set(col * SPACING, row * SPACING, BASE_Z);
          // alternate glyph tilt slightly so the field is not a stamp sheet
          mesh.rotation.z = ((row + col) % 2 === 0 ? -1 : 1) * 0.06;
          group.add(mesh);
          meshes.push({ mesh, speed: 0.06 + ((row * GRID_COLS + col) % 5) * 0.012 });
        }
      }
      group.position.set((-(GRID_COLS - 1) * SPACING) / 2, (-(GRID_ROWS - 1) * SPACING) / 2, 0);
      scene.add(group);

      const white = new THREE.SpotLight(0xffffff, 900, 1000, 1);
      white.position.set(20, 0, 14);
      scene.add(white);
      const blue = new THREE.SpotLight(0x7a93ff, 700, 1000, 1); // --ballpoint-lite
      blue.position.set(-20, -4, 10);
      scene.add(blue);
      scene.add(new THREE.AmbientLight(0x1b1b22, 2));

      /* Pointer, in scene space: cast onto the z 0 plane. */
      const raycaster = new THREE.Raycaster();
      const ndc = new THREE.Vector2(-2, -2); // parked offscreen until a real move
      const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
      const hit = new THREE.Vector3();
      let lightTargetY = 0;

      const onMove = (e: PointerEvent) => {
        const r = renderer.domElement.getBoundingClientRect();
        if (!r.width || !r.height) return;
        ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
        lightTargetY = ndc.y * 12;
      };
      if (fine && !reduce) addEventListener('pointermove', onMove, { passive: true });

      const size = () => {
        const r = el.getBoundingClientRect();
        if (r.width < 1 || r.height < 1) return;
        renderer.setSize(r.width, r.height, false);
        camera.aspect = r.width / r.height;
        camera.updateProjectionMatrix();
        if (reduce || !fine) renderer.render(scene, camera);
      };
      const ro = new ResizeObserver(size);
      ro.observe(el);
      size();

      const frame = () => {
        if (disposed) return;
        // lights drift toward the pointer height, damped
        white.position.y += (lightTargetY - white.position.y) * 0.04;
        blue.position.y += (lightTargetY * 0.6 - blue.position.y) * 0.04;

        raycaster.setFromCamera(ndc, camera);
        const found = raycaster.ray.intersectPlane(plane, hit);
        for (const { mesh, speed } of meshes) {
          let target = BASE_Z;
          if (found) {
            const dx = hit.x - (mesh.position.x + group.position.x);
            const dy = hit.y - (mesh.position.y + group.position.y);
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < FALLOFF) {
              const t = 1 - d / FALLOFF;
              target = BASE_Z + LIFT * t * t; // quadratic falloff, soft shoulder
            }
          }
          mesh.position.z += (target - mesh.position.z) * speed;
        }
        renderer.render(scene, camera);
        raf = visible ? requestAnimationFrame(frame) : 0;
      };

      renderOnce = () => renderer.render(scene, camera);
      setVisible = (v: boolean) => {
        if (reduce || !fine) {
          if (v) renderOnce?.(); // static relief, no loop
          return;
        }
        if (v && !raf) raf = requestAnimationFrame(frame);
      };
      setVisible(visible);

      cleanupScene = () => {
        cancelAnimationFrame(raf);
        raf = 0;
        removeEventListener('pointermove', onMove);
        ro.disconnect();
        geometry.dispose();
        material.dispose();
        envTex.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting;
        if (visible && !started) start();
        else setVisible?.(visible);
        if (!visible && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: '25% 0px' },
    );
    io.observe(section);

    return () => {
      disposed = true;
      io.disconnect();
      cleanupScene?.();
    };
  }, []);

  return <div className="logo-field" ref={host} aria-hidden="true" />;
}
