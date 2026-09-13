import React, { Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas } from '@react-three/fiber';

export function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

// Gate: reduced-motion, sub-900px viewports, and no-WebGL all keep
// the poster image as the final result instead of mounting a canvas.
export function shouldRender3D() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  if (window.innerWidth < 900) return false;
  return supportsWebGL();
}

// Mounts `element` (an R3F scene, using suspenseful hooks like
// useGLTF) into a NEW div appended inside `container` — deliberately
// not calling createRoot(container) directly, since React 18's
// createRoot takes ownership of a container's existing children and
// would wipe out the poster <img data-poster> sibling instantly
// rather than letting it show through during the GLTF load. The
// fallback stays `null` (transparent, revealing --bg-elevated) while
// the model streams in; the poster itself fades out once the canvas
// is ready to draw, not once the model has fully loaded.
export function mountScene(container, element) {
  if (!container || !shouldRender3D()) return;

  const poster = container.querySelector('[data-poster]');
  const mountPoint = document.createElement('div');
  container.appendChild(mountPoint);

  const root = createRoot(mountPoint);

  root.render(
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      camera={{ fov: 35, position: [0, 0, 5] }}
      onCreated={() => {
        if (poster) poster.style.opacity = '0';
      }}
    >
      <Suspense fallback={null}>{element}</Suspense>
    </Canvas>
  );
}
