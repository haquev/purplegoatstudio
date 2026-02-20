import { Instances, Instance, Sparkles } from '@react-three/drei'
import { TRACK_HALF } from '../utils/physics'

const edgePositions = Array.from({ length: 28 }, (_, idx) => -TRACK_HALF + 3 + idx * 2.4)

export default function Track() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[TRACK_HALF * 2, TRACK_HALF * 2]} />
        <meshStandardMaterial color="#09090f" metalness={0.2} roughness={0.85} />
      </mesh>

      <Instances limit={120}>
        <boxGeometry args={[0.4, 0.2, 1.8]} />
        <meshStandardMaterial color="#9c2cff" emissive="#8A00FF" emissiveIntensity={0.9} toneMapped={false} />
        {edgePositions.map((x) => (
          <group key={`x-${x}`}>
            <Instance position={[x, 0.12, TRACK_HALF - 1.1]} />
            <Instance position={[x, 0.12, -TRACK_HALF + 1.1]} />
          </group>
        ))}
        {edgePositions.map((z) => (
          <group key={`z-${z}`}>
            <Instance rotation={[0, Math.PI / 2, 0]} position={[TRACK_HALF - 1.1, 0.12, z]} />
            <Instance rotation={[0, Math.PI / 2, 0]} position={[-TRACK_HALF + 1.1, 0.12, z]} />
          </group>
        ))}
      </Instances>

      <Sparkles count={80} scale={[80, 10, 80]} position={[0, 4, 0]} size={1.8} speed={0.18} color="#9e5eff" />
    </group>
  )
}
