import { useState, useRef, Suspense, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import { useGLTF } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Sushi } from "./Sushi";
import { House } from "./House";
import gsap from "gsap";
import { Trump } from "./Trump";

// Intro Overlay Component
const IntroOverlay = ({ onLoadComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onLoadComplete();
          }, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="intro-overlay">
      <div className="intro-content">
        <div className="crypto-loader">
          <div className="crypto-coin"></div>
        </div>
        <h1 className="glitch" data-text="House of Solana">$WHouse of Solana</h1>
        <p className="typewriter">Welcome to the future of Solana...</p>
        <div className="loading-progress">
          <div 
            className="progress-bar" 
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
        <div className="loading-percentage">{progress}%</div>
      </div>
    </div>
  );
};

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const cameraRef = useRef();

  const handleLoadComplete = () => {
    const intro = document.querySelector('.intro-overlay');
    const content = document.querySelector('.intro-content');
    
    // Sequence of animations
    gsap.timeline()
      .to(content, {
        scale: 1.1,
        duration: 0.5,
        ease: "power2.in"
      })
      .to(content, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out"
      })
      .to(intro, {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
        onComplete: () => {
          setShowIntro(false);
        }
      });
  };

  const moveCamera = () => {
    gsap.to(cameraRef.current.position, {
      x: 3,
      y: 0,
      z: 0,
      duration: 2,
      ease: "power3.inOut",
    });
  };

  return (
    <div className="App">
      {showIntro && <IntroOverlay onLoadComplete={handleLoadComplete} />}
      <Canvas
        onCreated={(state) => {
          cameraRef.current = state.camera;
          state.camera.position.z = 30;
          state.camera.position.x = 0;
          state.camera.position.y = 10;
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={8} />
          <pointLight intensity={2} position={[-1, 2, -2]} />
          <OrbitControls />
          <Environment files="./bl.exr" background />
          <House position={[0, 0, 0]} />
          <Trump scale={.5} position={[0,-1,-2]} rotation={[0,1.6,0]}/>
        </Suspense>
      </Canvas>
      <button className="bottom-button" onClick={moveCamera}>
        Join Us
      </button>
    </div>
  );
}

export default App;
