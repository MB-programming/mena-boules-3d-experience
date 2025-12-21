import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, MeshDistortMaterial, Icosahedron, Torus, Octahedron, OrbitControls, Text3D, Center } from '@react-three/drei';
import { useRef, useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';

const MouseTracker = ({ children }: { children: React.ReactNode }) => {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouse.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.current.x * 0.3,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.current.y * 0.2,
        0.05
      );
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

const InteractiveShape = ({ 
  position, 
  color, 
  shape 
}: { 
  position: [number, number, number]; 
  color: string;
  shape: 'icosahedron' | 'torus' | 'octahedron' | 'sphere';
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      
      const scale = hovered ? 1.3 : clicked ? 1.5 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });

  const renderShape = () => {
    const material = (
      <MeshDistortMaterial
        color={hovered ? '#ffffff' : color}
        attach="material"
        distort={hovered ? 0.6 : 0.3}
        speed={hovered ? 4 : 2}
        roughness={0.2}
        metalness={0.8}
        transparent
        opacity={0.85}
      />
    );

    switch (shape) {
      case 'icosahedron':
        return <Icosahedron args={[0.8, 1]}>{material}</Icosahedron>;
      case 'torus':
        return <Torus args={[0.8, 0.3, 16, 32]}>{material}</Torus>;
      case 'octahedron':
        return <Octahedron args={[0.7]}>{material}</Octahedron>;
      case 'sphere':
        return <mesh><sphereGeometry args={[0.6, 32, 32]} />{material}</mesh>;
      default:
        return null;
    }
  };

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group
        ref={meshRef}
        position={position}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
      >
        {renderShape()}
        {hovered && (
          <pointLight position={[0, 0, 0]} intensity={2} color={color} distance={3} />
        )}
      </group>
    </Float>
  );
};

const FloatingCode = () => {
  const codeLines = ['<div>', '  function()', '  {code}', '</div>'];
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -8]}>
      {codeLines.map((_, index) => (
        <mesh key={index} position={[Math.cos(index * 1.5) * 4, Math.sin(index * 0.8) * 2, Math.sin(index * 1.2) * 3]}>
          <boxGeometry args={[0.1, 0.1, 0.1]} />
          <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} />
        </mesh>
      ))}
    </group>
  );
};

const GlowingRing = ({ radius, color }: { radius: number; color: string }) => {
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, 0.02, 16, 100]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.6} />
    </mesh>
  );
};

const ParticleField = () => {
  const points = useRef<THREE.Points>(null);
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
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
          count={300}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#00ffff"
        sizeAttenuation
        transparent
        opacity={0.7}
      />
    </points>
  );
};

const Interactive3DScene = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#9f7aea" />
        <spotLight position={[0, 15, 0]} intensity={0.8} color="#ffffff" angle={0.5} />
        
        <Stars
          radius={100}
          depth={50}
          count={6000}
          factor={4}
          saturation={0}
          fade
          speed={1}
        />

        <MouseTracker>
          <InteractiveShape position={[-4, 2, -2]} color="#00ffff" shape="icosahedron" />
          <InteractiveShape position={[4, -1, -3]} color="#9f7aea" shape="sphere" />
          <InteractiveShape position={[3, 2.5, -4]} color="#00d4aa" shape="torus" />
          <InteractiveShape position={[-3, -2, -2]} color="#ff6b6b" shape="octahedron" />
          <InteractiveShape position={[0, 3, -5]} color="#ffd93d" shape="icosahedron" />
          <InteractiveShape position={[-2, 0, -3]} color="#6bcbff" shape="torus" />
          <InteractiveShape position={[2, -2.5, -4]} color="#c084fc" shape="octahedron" />
        </MouseTracker>

        <GlowingRing radius={5} color="#00ffff" />
        <GlowingRing radius={6} color="#9f7aea" />
        <GlowingRing radius={7} color="#00d4aa" />

        <FloatingCode />
        <ParticleField />

        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default Interactive3DScene;
