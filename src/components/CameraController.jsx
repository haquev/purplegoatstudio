import { useFrame, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'

export default function CameraController({ targetPosition, finale }) {
  const { camera } = useThree()
  const lookAt = useMemo(() => new THREE.Vector3(), [])
  const desired = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    if (!targetPosition) return

    const distance = finale ? 6 : 8.5
    desired.set(targetPosition[0], 4.2, targetPosition[2] + distance)
    lookAt.set(targetPosition[0], 1.2, targetPosition[2] - (finale ? 1 : 0))

    camera.position.lerp(desired, 0.08)
    camera.lookAt(lookAt)
  })

  return null
}
