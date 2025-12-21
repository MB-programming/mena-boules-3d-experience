import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, MeshDistortMaterial, Icosahedron, Torus, Octahedron } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

const AnimatedSphere = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Icosahedron ref={meshRef} args={[1, 1]} position={position}>
        <MeshDistortMaterial
          color="#00ffff"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.8}
        />
      </Icosahedron>
    </Float>
  );
};

const AnimatedTorus = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <Torus ref={meshRef} args={[1, 0.3, 16, 32]} position={position}>
        <meshStandardMaterial
          color="#9f7aea"
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.7}
        />
      </Torus>
    </Float>
  );
};

const AnimatedOctahedron = ({ position }: { position: [number, number, number] }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
      <Octahedron ref={meshRef} args={[0.8]} position={position}>
        <meshStandardMaterial
          color="#00d4aa"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.6}
          wireframe
        />
      </Octahedron>
    </Float>
  );
};

const ParticleField = () => {
  const points = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      points.current.rotation.x = state.clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00ffff"
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
};

const Scene3D = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9f7aea" />
        <spotLight position={[0, 10, 0]} intensity={0.8} color="#ffffff" angle={0.5} />
        
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />
        
        <AnimatedSphere position={[-4, 2, -2]} />
        <AnimatedSphere position={[4, -1, -3]} />
        <AnimatedTorus position={[3, 2, -4]} />
        <AnimatedTorus position={[-3, -2, -2]} />
        <AnimatedOctahedron position={[0, 3, -5]} />
        <AnimatedOctahedron position={[-2, 0, -3]} />
        <AnimatedOctahedron position={[2, -2, -4]} />
        
        <ParticleField />
      </Canvas>
    </div>
  );
};

export default Scene3D;
