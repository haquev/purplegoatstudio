import { useEffect, useMemo, useRef } from 'react'
import { RigidBody } from '@react-three/rapier'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CAR_BASE_SPEED, CAR_TURN_SPEED, TRACK_HALF } from '../utils/physics'

const keys = { up: false, down: false, left: false, right: false }

const mapKey = (key, isDown) => {
  if (key === 'w' || key === 'ArrowUp') keys.up = isDown
  if (key === 's' || key === 'ArrowDown') keys.down = isDown
  if (key === 'a' || key === 'ArrowLeft') keys.left = isDown
  if (key === 'd' || key === 'ArrowRight') keys.right = isDown
}

export default function Car({ joystick, onPositionChange, onSpeedChange }) {
  const body = useRef()
  const heading = useRef(0)
  const vec = useMemo(() => new THREE.Vector3(), [])

  useEffect(() => {
    const down = (event) => mapKey(event.key, true)
    const up = (event) => mapKey(event.key, false)
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  useFrame((_, delta) => {
    if (!body.current) return

    const forwardInput = (keys.up ? 1 : 0) - (keys.down ? 1 : 0) + joystick.y
    const turnInput = (keys.left ? 1 : 0) - (keys.right ? 1 : 0) + joystick.x

    heading.current += turnInput * CAR_TURN_SPEED * delta

    const speed = THREE.MathUtils.clamp(forwardInput, -1, 1) * CAR_BASE_SPEED
    vec.set(Math.sin(heading.current) * speed, 0, Math.cos(heading.current) * speed)

    const next = body.current.translation()
    next.x = THREE.MathUtils.clamp(next.x, -TRACK_HALF + 2, TRACK_HALF - 2)
    next.z = THREE.MathUtils.clamp(next.z, -TRACK_HALF + 2, TRACK_HALF - 2)

    body.current.setLinvel({ x: vec.x, y: 0, z: vec.z }, true)
    body.current.setTranslation(next, true)
    body.current.setRotation({ x: 0, y: Math.sin(heading.current / 2), z: 0, w: Math.cos(heading.current / 2) }, true)

    onPositionChange?.([next.x, 0.6, next.z])
    onSpeedChange?.(Math.abs(speed))
  })

  return (
    <RigidBody ref={body} colliders="cuboid" linearDamping={4} angularDamping={8} friction={2} position={[0, 0.7, 24]}>
      <mesh castShadow>
        <boxGeometry args={[1.3, 0.5, 2.2]} />
        <meshStandardMaterial color="#e8e0ff" metalness={0.55} roughness={0.25} emissive="#4a0076" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0.25, -0.1]}>
        <boxGeometry args={[1, 0.25, 1]} />
        <meshStandardMaterial color="#2a1736" />
      </mesh>
    </RigidBody>
  )
}
