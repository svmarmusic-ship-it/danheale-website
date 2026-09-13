import { useRef } from 'react';
import { useGLTF, Center, Bounds } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// Services section: subtle console pan driven by scroll progress
// (0 -> 1 across the services list). Individual faders aren't
// independently animatable — image-to-3D reconstruction yields one
// fused mesh — so the "per-service" motion is a whole-console pan;
// the DOM overlay in index.html supplies the fader-bar illusion on
// top of this canvas. Bounds auto-fits the camera to the reconstructed
// mesh's native (arbitrary) scale/position; Center re-origins it so
// the pan rotates around the model's own center, not world origin.
export default function ConsoleScene({ progressRef }) {
  const { scene } = useGLTF('/models/console.glb');
  const group = useRef();

  useFrame(() => {
    const p = progressRef?.current ?? 0;
    if (group.current) {
      group.current.rotation.y = -0.18 + p * 0.36;
    }
  });

  return (
    <>
      <Bounds fit clip observe margin={1.3}>
        <group ref={group}>
          <Center>
            <primitive object={scene} />
          </Center>
        </group>
      </Bounds>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 2]} intensity={1.6} color="#c4a265" />
      <directionalLight position={[0, 1, 4]} intensity={0.6} color="#f5f5f2" />
      <directionalLight position={[-4, 2, -3]} intensity={0.4} color="#5a6a7a" />
    </>
  );
}

useGLTF.preload('/models/console.glb');
