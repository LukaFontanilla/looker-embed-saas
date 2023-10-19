import { Canvas, useLoader } from "@react-three/fiber";
import {
  useGLTF,
  OrbitControls,
  ContactShadows,
  PerformanceMonitor,
  Html,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  SSAO,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useControls } from "leva";
import { useState, Suspense } from "react";
// import * as planet from "../assets/scene";

const MODELS = {
  PLANET: "/scene.gltf",
};

// Silently pre-load all models
useGLTF.preload(MODELS["PLANET"]);

function Model({ url, ...props }) {
  const { scene } = useGLTF(url);
  // <primitive object={...} mounts an already existing object
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
  //   const { model } = useControls({
  //     model: { value: "PLANET", options: Object.keys(MODELS) },
  //   });
  return (
    <div className="opacity-100 w-full h-full">
      {/* <header>This is a {model.toLowerCase()} tree.</header> */}
      <Canvas
        camera={{ position: [0, 3, 1000], near: 0.08, far: 1200 }}
        // frameloop="demand"
        dpr={dpr}
        performance={{ min: 0.4 }}
      >
        <PerformanceMonitor
          onIncline={() => setDpr(2)}
          onDecline={() => setDpr(1)}
        />
        {/* <group position={[-2, 1, -0.5]}>
          <Html>{children}</Html>
        </group> */}
        <group>
          {/* <Suspense> */}
          <Model
            // position={[0, 0, 0]}
            url={MODELS["PLANET"]}
            // scale={[0.88, 0.88, 0.88]}
          />
          {/* <ambientLight /> */}
          <ambientLight intensity={0.1} />
          <directionalLight position={[0, 10, 20]} color="#d19" intensity={1} />
          <Suspense fallback={null}>
            <EffectComposer smaa>
              <Bloom mipmapBlur luminanceThreshold={0.4} />
              <SSAO />
            </EffectComposer>
          </Suspense>
          {/* <spotLight
            intensity={8}
            position={[10, 20, 10]}
            color="yellow"
            angle={0.4}
            penumbra={1}
            castShadow
            // shadow-mapS
          /> */}
          <OrbitControls autoRotate />
          {/* </Suspense> */}
        </group>
      </Canvas>
    </div>
  );
};

export default LoginAnimation;
