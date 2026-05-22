export const fullscreenVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`

const simplexNoise = `
  vec4 permute(vec4 x) {
    return mod(((x * 34.0) + 1.0) * x, 289.0);
  }

  vec4 taylorInvSqrt(vec4 r) {
    return 1.79284291400159 - 0.85373472095314 * r;
  }

  float snoise(vec3 v) {
    const vec2 c = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 d = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, c.yyy));
    vec3 x0 = v - i + dot(i, c.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + c.xxx;
    vec3 x2 = x0 - i2 + c.yyy;
    vec3 x3 = x0 - d.yyy;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * d.wyz - d.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  vec3 curlNoise(vec3 p) {
    float e = 0.16;
    float n1 = snoise(vec3(p.x, p.y + e, p.z));
    float n2 = snoise(vec3(p.x, p.y - e, p.z));
    float a = (n1 - n2) / (2.0 * e);

    n1 = snoise(vec3(p.x, p.y, p.z + e));
    n2 = snoise(vec3(p.x, p.y, p.z - e));
    float b = (n1 - n2) / (2.0 * e);

    n1 = snoise(vec3(p.x + e, p.y, p.z));
    n2 = snoise(vec3(p.x - e, p.y, p.z));
    float c = (n1 - n2) / (2.0 * e);

    return normalize(vec3(a - b, b - c, c - a) + vec3(0.0001));
  }
`

export const velocityFragmentShader = `
  precision highp float;

  uniform sampler2D uPositionTexture;
  uniform sampler2D uVelocityTexture;
  uniform sampler2D uInitialVelocityTexture;
  uniform float uTime;
  uniform float uDelta;
  uniform float uFrame;
  uniform float uDamping;
  uniform float uDebugMotion;
  uniform float uFlowStrength;
  uniform float uMotionScale;
  uniform float uStateEnergy;

  varying vec2 vUv;

  ${simplexNoise}

  void main() {
    vec4 positionSample = texture2D(uPositionTexture, vUv);
    vec3 position = positionSample.xyz;
    float layer = positionSample.w;
    vec3 velocity = uFrame < 1.0 ? texture2D(uInitialVelocityTexture, vUv).xyz : texture2D(uVelocityTexture, vUv).xyz;

    vec3 domain = position * (0.34 + layer * 0.06) + vec3(vUv * 4.0, uTime * 0.08);
    vec3 flow = curlNoise(domain);
    vec3 slowFlow = curlNoise(domain * 0.68 + vec3(2.1, -1.4, uTime * 0.032));
    vec3 blendedFlow = normalize(mix(flow, slowFlow, 0.38) + vec3(0.0001));
    vec3 inward = -normalize(position + vec3(0.0001)) * (0.006 + uStateEnergy * 0.004);
    vec3 tangent = normalize(vec3(-position.y, position.x, 0.0) + vec3(0.0001));
    vec3 debugSwirl = tangent * uDebugMotion * (0.115 + layer * 0.018);
    vec3 softSwirl = tangent * (0.018 + uStateEnergy * 0.018) * (1.0 - layer * 0.08);
    vec3 verticalDrift = vec3(0.0, 0.0, sin(uTime * 0.24 + vUv.x * 6.2831) * 0.012);
    float layerScale = 0.65 + layer * 0.22;

    velocity += (blendedFlow * uFlowStrength * layerScale + inward + softSwirl + debugSwirl + verticalDrift) * uDelta * uMotionScale;
    velocity *= uDamping;
    velocity = clamp(velocity, vec3(-0.34), vec3(0.34));

    gl_FragColor = vec4(velocity, 1.0);
  }
`

export const positionFragmentShader = `
  precision highp float;

  uniform sampler2D uPositionTexture;
  uniform sampler2D uVelocityTexture;
  uniform sampler2D uInitialPositionTexture;
  uniform float uDelta;
  uniform float uDebugMotion;
  uniform float uFrame;
  uniform float uBoundsRadius;
  uniform float uTime;
  uniform float uMotionScale;

  varying vec2 vUv;

  mat2 rotate2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
  }

  void main() {
    vec4 current = uFrame < 1.0 ? texture2D(uInitialPositionTexture, vUv) : texture2D(uPositionTexture, vUv);
    vec3 position = current.xyz;
    float layer = current.w;
    vec3 velocity = texture2D(uVelocityTexture, vUv).xyz;

    position += velocity * uDelta * uMotionScale;

    float radius = length(position.xy);
    float debugWave = 0.72 + sin(uTime * 0.42 + radius * 1.18 + layer) * 0.28;
    float debugAngle = uDebugMotion * debugWave * (0.042 + layer * 0.006) * uDelta * uMotionScale;
    vec3 debugDrift = vec3(
      sin(uTime * 0.22 + vUv.y * 6.2831),
      cos(uTime * 0.18 + vUv.x * 6.2831),
      sin(uTime * 0.16 + radius)
    ) * uDebugMotion * 0.018 * uDelta * uMotionScale;

    position.xy = rotate2d(debugAngle) * position.xy;
    position += debugDrift;

    float distanceFromCenter = length(position);
    if (distanceFromCenter > uBoundsRadius) {
      vec3 pull = -normalize(position) * (distanceFromCenter - uBoundsRadius) * 0.028;
      position += pull * uDelta;
    }

    gl_FragColor = vec4(position, layer);
  }
`

export const particleVertexShader = `
  precision highp float;

  uniform sampler2D uPositionTexture;
  uniform float uPointScale;
  uniform float uBasePointSize;
  uniform float uTime;
  uniform float uInternalMotion;

  attribute vec2 aReference;
  attribute float aSeed;
  attribute float aSize;

  varying float vAlpha;
  varying float vSeed;
  varying float vLayer;

  void main() {
    // Render shader texture sampling: each point reads its computed position texel.
    vec4 positionSample = texture2D(uPositionTexture, aReference);
    vec3 p = positionSample.xyz;
    float layer = positionSample.w;
    float phase = aSeed * 6.283185 + uTime * (0.38 + layer * 0.08);
    float localBreath = sin(phase * 0.7 + length(p.xy) * 0.9) * 0.5 + 0.5;
    vec3 internalFlow = vec3(
      sin(phase + aReference.y * 12.0),
      cos(phase * 0.83 + aReference.x * 10.0),
      sin(phase * 0.47 + aReference.x * 4.0 + aReference.y * 5.0)
    ) * uInternalMotion * mix(0.035, 0.12, localBreath) * (0.7 + layer * 0.18);
    p += internalFlow;

    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depthScale = clamp(7.2 / max(-mvPosition.z, 0.1), 0.55, 1.75);
    gl_PointSize = max(aSize * uBasePointSize * uPointScale * depthScale, 3.2);

    vAlpha = 0.55 + (1.0 - layer * 0.16) * 0.2;
    vSeed = aSeed;
    vLayer = layer;
  }
`

export const particleFragmentShader = `
  precision mediump float;

  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec3 uColorC;
  uniform float uOpacity;

  varying float vAlpha;
  varying float vSeed;
  varying float vLayer;

  void main() {
    vec2 center = gl_PointCoord - vec2(0.5);
    float dist = length(center);
    float core = smoothstep(0.44, 0.08, dist) * 0.9;
    float halo = smoothstep(0.5, 0.28, dist) * 0.13;
    float mask = core + halo;

    if (mask < 0.015) discard;

    vec3 inner = mix(uColorA, uColorB, clamp(vLayer * 0.5, 0.0, 1.0));
    vec3 color = mix(inner, uColorC, smoothstep(0.7, 2.0, vLayer));
    color = mix(color, vec3(1.0), 0.16 + vSeed * 0.04);
    color = min(color, vec3(0.9, 0.88, 0.94));

    gl_FragColor = vec4(color, mask * vAlpha * uOpacity);
  }
`
