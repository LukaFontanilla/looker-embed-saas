import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, SSAO } from "@react-three/postprocessing";
import { useState, Suspense } from "react";

const MODELS = {
  PLANET: "/scene.gltf",
};

// Silently pre-load all models
useGLTF.preload(MODELS["PLANET"]);

function Model({ url, ...props }) {
  const { scene } = useGLTF(url);

  return (
    <primitive
      object={scene}
      {...props}
      emissiveIntensity={4}
      emissive={"yellow"}
    />
  );
}

const LoginAnimation = ({ children }) => {
  const [dpr, setDpr] = useState(1.5);

  return (
    <div className="opacity-100 w-full h-full cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 3, 1000], near: 0.08, far: 1200 }}
        dpr={dpr}
        performance={{ min: 0.4 }}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(2)}
          onDecline={() => setDpr(1)}
        />
        <group>
          <Suspense fallback={null}>
            <Model url={MODELS["PLANET"]} />
          </Suspense>
          {/* <ambientLight /> */}
          <ambientLight intensity={0.1} />
          {/* <pointLight position={[0, 10, 2000]} color="#d19" intensity={1.5} /> */}
          <directionalLight position={[0, 10, 20]} color="#d19" intensity={1} />
          {/* <hemisphereLight color="#d19" /> */}
          <Suspense fallback={null}>
            <EffectComposer smaa>
              <Bloom mipmapBlur luminanceThreshold={0.4} />
              <SSAO />
            </EffectComposer>
          </Suspense>
          <OrbitControls autoRotate />
        </group>
      </Canvas>
    </div>
  );
};

export default LoginAnimation;
