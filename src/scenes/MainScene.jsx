import { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Fog, Stars } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import Car from '../components/Car'
import CameraController from '../components/CameraController'
import Track from '../components/Track'
import UIOverlay from '../components/UIOverlay'
import Zones from '../components/Zones'

export default function MainScene() {
  const [carPosition, setCarPosition] = useState([0, 0.6, 24])
  const [activeZoneId, setActiveZoneId] = useState(null)
  const [finale, setFinale] = useState(false)
  const [joystick, setJoystick] = useState({ x: 0, y: 0 })
  const [speed, setSpeed] = useState(0)

  const finaleDistance = useMemo(() => Math.hypot(carPosition[0], carPosition[2]), [carPosition])

  useEffect(() => {
    if (!finale && finaleDistance < 3.2) setFinale(true)
  }, [finale, finaleDistance])

  return (
    <div className="relative h-full w-full">
      <Canvas shadows camera={{ position: [0, 6, 12], fov: 55 }}>
        <color attach="background" args={['#030207']} />
        <Fog attach="fog" args={['#06030f', 24, 95]} />

        <ambientLight intensity={0.4} color="#8a5bd8" />
        <directionalLight
          castShadow
          position={[6, 10, 7]}
          intensity={1.3}
          color="#d8c7ff"
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[0, 5, 0]} intensity={finale ? 26 : 12} distance={30} color="#a100ff" />

        <Stars radius={140} depth={35} count={850} factor={2.2} saturation={0} fade speed={0.6} />
        <Environment preset="night" />

        <Physics gravity={[0, -8, 0]}>
          <Track />
          <Zones carPosition={carPosition} activeZoneId={activeZoneId} onZoneEnter={setActiveZoneId} />
          <Car joystick={joystick} onPositionChange={setCarPosition} onSpeedChange={setSpeed} />
        </Physics>

        <CameraController targetPosition={carPosition} finale={finale} />

        <EffectComposer>
          <Bloom intensity={finale ? 1.6 : 0.95} luminanceThreshold={0.2} luminanceSmoothing={0.3} mipmapBlur />
        </EffectComposer>
      </Canvas>

      <UIOverlay finale={finale} speed={speed} onJoystick={setJoystick} />
    </div>
  )
}
