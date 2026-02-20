import { Float, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { ZONES } from '../utils/physics'

export default function Zones({ carPosition, activeZoneId, onZoneEnter }) {
  const entered = useRef(null)

  useFrame(() => {
    if (!carPosition) return

    let detected = null
    ZONES.forEach((zone) => {
      const distance = Math.hypot(carPosition[0] - zone.position[0], carPosition[2] - zone.position[2])
      if (distance < zone.radius) detected = zone.id
    })

    if (entered.current !== detected) {
      entered.current = detected
      onZoneEnter?.(detected)
    }
  })

  return (
    <group>
      {ZONES.map((zone) => {
        const active = activeZoneId === zone.id
        return (
          <group key={zone.id} position={zone.position}>
            <Float speed={1} rotationIntensity={0.2} floatIntensity={1.2}>
              <mesh position={[0, 1.2, 0]}>
                <icosahedronGeometry args={[0.6, 0]} />
                <meshStandardMaterial color={active ? '#d5b0ff' : '#8142d9'} emissive="#6d17ca" emissiveIntensity={active ? 1.3 : 0.6} />
              </mesh>
            </Float>
            <Text
              position={[0, 2.5, 0]}
              maxWidth={8}
              textAlign="center"
              fontSize={0.5}
              color={active ? '#ffffff' : '#b89cff'}
              outlineColor="#23003a"
              outlineWidth={0.03}
            >
              {zone.title}
            </Text>
            {active && (
              <Text
                position={[0, 3.7, 0]}
                maxWidth={9}
                textAlign="center"
                fontSize={0.45}
                color="#f4e9ff"
                anchorX="center"
              >
                {zone.message}
              </Text>
            )}
          </group>
        )
      })}

      <mesh position={[0, 1.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusKnotGeometry args={[1.35, 0.28, 120, 14, 2, 5]} />
        <meshStandardMaterial color="#d7beff" emissive="#a200ff" emissiveIntensity={2.2} roughness={0.2} metalness={0.35} />
      </mesh>
      <Text position={[0, 4, 0]} fontSize={0.7} color="#e7d6ff">
        Goat Horn Core
      </Text>
    </group>
  )
}
