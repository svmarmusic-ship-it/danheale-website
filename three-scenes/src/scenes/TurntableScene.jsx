import { useRef } from 'react';
import { useGLTF, Center, Bounds } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

// Selected Work section: continuous rotation of the whole
// reconstructed mesh to read as "the vinyl is spinning". The tonearm
// rotating along with it is a deliberate simplification — image-to-3D
// output is one fused mesh, not separable platter/tonearm parts.
export default function TurntableScene() {
  const { scene } = useGLTF('/models/turntable.glb');
  const spin = useRef();

  useFrame((_, delta) => {
    if (spin.current) spin.current.rotation.y += delta * 0.6;
  });

  return (
    <>
      <Bounds fit clip observe margin={1.3}>
        <group ref={spin}>
          <Center>
            <primitive object={scene} />
          </Center>
        </group>
      </Bounds>
      <ambientLight intensity={0.65} />
      <directionalLight position={[2, 4, 3]} intensity={1.8} color="#c4a265" />
      <directionalLight position={[0, 1, 4]} intensity={0.7} color="#f5f5f2" />
      <directionalLight position={[-3, 1, -2]} intensity={0.4} color="#5a6a7a" />
    </>
  );
}

useGLTF.preload('/models/turntable.glb');
