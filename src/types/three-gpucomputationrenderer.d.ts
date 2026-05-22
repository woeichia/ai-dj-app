declare module 'three/examples/jsm/misc/GPUComputationRenderer.js' {
  import type { DataTexture, ShaderMaterial, Texture, WebGLRenderTarget, WebGLRenderer } from 'three'

  export interface GPUComputationVariable {
    name: string
    initialValueTexture: Texture
    material: ShaderMaterial
    dependencies: GPUComputationVariable[] | null
    renderTargets: WebGLRenderTarget[]
  }

  export class GPUComputationRenderer {
    constructor(sizeX: number, sizeY: number, renderer: WebGLRenderer)
    createTexture(): DataTexture
    addVariable(
      variableName: string,
      computeFragmentShader: string,
      initialValueTexture: Texture,
    ): GPUComputationVariable
    setVariableDependencies(variable: GPUComputationVariable, dependencies: GPUComputationVariable[]): void
    init(): string | null
    compute(): void
    getCurrentRenderTarget(variable: GPUComputationVariable): WebGLRenderTarget
    dispose(): void
  }
}
