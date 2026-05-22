import * as THREE from 'three'

export const GPGPU_TEXTURE_SIZE = 128
export const GPGPU_PARTICLE_COUNT = GPGPU_TEXTURE_SIZE * GPGPU_TEXTURE_SIZE

export interface SimulationTextures {
  initialPositionTexture: THREE.DataTexture
  initialVelocityTexture: THREE.DataTexture
  particleReferences: Float32Array
  particleSeeds: Float32Array
  particleSizes: Float32Array
}

export function createSimulationTextures(size = GPGPU_TEXTURE_SIZE): SimulationTextures {
  const count = size * size
  const positionData = new Float32Array(count * 4)
  const velocityData = new Float32Array(count * 4)
  const particleReferences = new Float32Array(count * 2)
  const particleSeeds = new Float32Array(count)
  const particleSizes = new Float32Array(count)

  for (let index = 0; index < count; index += 1) {
    const x = index % size
    const y = Math.floor(index / size)
    const seedA = pseudoRandom(index * 7 + 11)
    const seedB = pseudoRandom(index * 13 + 17)
    const seedC = pseudoRandom(index * 19 + 23)
    const seedD = pseudoRandom(index * 29 + 31)
    const layer = seedA < 0.2 ? 0 : seedA < 0.78 ? 1 : 2
    const angle = index * 2.399963 + (seedB - 0.5) * 1.3
    const radiusBase = layer === 0 ? 1.05 : layer === 1 ? 2.62 : 3.78
    const radiusPower = layer === 0 ? 0.58 : layer === 1 ? 0.42 : 0.22
    const radius = Math.pow(seedC, radiusPower) * radiusBase + (seedD - 0.5) * 0.46
    const oval = 0.9 + pseudoRandom(index * 37 + 5) * 0.5
    const depth = (pseudoRandom(index * 41 + 9) - 0.5) * (layer === 0 ? 1.3 : layer === 1 ? 3.0 : 4.3)
    const offset = index * 4
    const uvOffset = index * 2

    positionData[offset] = Math.cos(angle) * radius * oval
    positionData[offset + 1] = Math.sin(angle) * radius * (layer === 2 ? 0.58 : 0.86)
    positionData[offset + 2] = depth + (layer === 0 ? 0.36 : layer === 1 ? 0 : -0.45)
    positionData[offset + 3] = layer

    velocityData[offset] = (pseudoRandom(index * 43 + 3) - 0.5) * 0.012
    velocityData[offset + 1] = (pseudoRandom(index * 47 + 7) - 0.5) * 0.012
    velocityData[offset + 2] = (pseudoRandom(index * 53 + 13) - 0.5) * 0.012
    velocityData[offset + 3] = 1

    particleReferences[uvOffset] = (x + 0.5) / size
    particleReferences[uvOffset + 1] = (y + 0.5) / size
    particleSeeds[index] = seedA
    particleSizes[index] = layer === 0 ? 2.7 + seedC * 3.8 : layer === 1 ? 1.55 + seedC * 3.1 : 0.95 + seedC * 2.2
  }

  const initialPositionTexture = new THREE.DataTexture(positionData, size, size, THREE.RGBAFormat, THREE.FloatType)
  initialPositionTexture.needsUpdate = true
  initialPositionTexture.minFilter = THREE.NearestFilter
  initialPositionTexture.magFilter = THREE.NearestFilter
  initialPositionTexture.wrapS = THREE.ClampToEdgeWrapping
  initialPositionTexture.wrapT = THREE.ClampToEdgeWrapping

  const initialVelocityTexture = new THREE.DataTexture(velocityData, size, size, THREE.RGBAFormat, THREE.FloatType)
  initialVelocityTexture.needsUpdate = true
  initialVelocityTexture.minFilter = THREE.NearestFilter
  initialVelocityTexture.magFilter = THREE.NearestFilter
  initialVelocityTexture.wrapS = THREE.ClampToEdgeWrapping
  initialVelocityTexture.wrapT = THREE.ClampToEdgeWrapping

  return {
    initialPositionTexture,
    initialVelocityTexture,
    particleReferences,
    particleSeeds,
    particleSizes,
  }
}

export function pseudoRandom(seed: number): number {
  return Math.abs(Math.sin(seed * 12.9898) * 43758.5453) % 1
}
