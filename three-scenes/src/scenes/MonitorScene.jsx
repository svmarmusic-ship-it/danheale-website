import { useRef } from 'react';
import { useGLTF, Center, Bounds } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// About section: slow constant idle rotation, no scroll dependency.
export default function MonitorScene() {
  const { scene } = useGLTF('/models/monitor.glb');
  const group = useRef();

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15;
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
      <ambientLight intensity={0.65} />
      <directionalLight position={[3, 3, 3]} intensity={1.5} color="#c4a265" />
      <directionalLight position={[0, 1, 4]} intensity={0.6} color="#f5f5f2" />
      <directionalLight position={[-3, 1, -2]} intensity={0.4} color="#5a6a7a" />
    </>
  );
}

useGLTF.preload('/models/monitor.glb');
