/**
 * JellySwitch — WebGL 3D Jelly Toggle for Dark/Light Mode
 *
 * The blob is a SPHERE (not a box) — perfectly round in the slot track.
 * Uses SDF ray marching with:
 *   - Sphere SDF (round, not square)
 *   - Fresnel reflections
 *   - Beer-Lambert absorption
 *   - Subsurface scattering
 *   - Specular highlights
 *   - Spring physics for squash/stretch/wiggle
 *
 * Position is animated via spring physics (not CSS transition) to avoid glitches.
 */
import { useRef, useEffect, useCallback, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

/* ───────── Spring Physics ───────── */
class Spring {
  value = 0;
  target = 0;
  velocity = 0;
  constructor(public mass: number, public stiffness: number, public damping: number) {}
  update(dt: number) {
    const F = -this.stiffness * (this.value - this.target) - this.damping * this.velocity;
    this.velocity += (F / this.mass) * dt;
    this.value += this.velocity * dt;
  }
  atRest() {
    return Math.abs(this.value - this.target) < 0.0005 && Math.abs(this.velocity) < 0.005;
  }
}

/* ───────── GLSL Fragment Shader — SPHERE SDF ───────── */
const FRAG = `#version 300 es
precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
uniform float u_squashX;
uniform float u_squashY;
uniform float u_wiggle;
uniform float u_darkMode;
uniform vec3  u_jellyColor;

out vec4 fragColor;

#define STEPS 48
#define FAR   5.0
#define EPS   0.002
#define IOR   1.45

float sdSphere(vec3 p, float r){
  return length(p) - r;
}

float scene(vec3 p){
  // Apply squash/stretch deformation
  vec3 s = p * vec3(
    1.0 / (1.0 + u_squashX * 0.25),
    1.0 / (1.0 - u_squashY * 0.2),
    1.0
  );
  // Apply wiggle bend
  float k = u_wiggle * 0.4;
  float c = cos(k * s.x), sn = sin(k * s.x);
  vec3 b = vec3(c * s.x - sn * s.y, sn * s.x + c * s.y, s.z);
  return sdSphere(b, 0.62);
}

vec3 normal(vec3 p){
  float e = 0.001, d = scene(p);
  return normalize(vec3(
    scene(p + vec3(e,0,0)) - d,
    scene(p + vec3(0,e,0)) - d,
    scene(p + vec3(0,0,e)) - d
  ));
}

float fresnel(float c){
  float r0 = pow((1.0 - IOR) / (1.0 + IOR), 2.0);
  return r0 + (1.0 - r0) * pow(clamp(1.0 - c, 0.0, 1.0), 5.0);
}

void main(){
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 ndc = uv * 2.0 - 1.0;
  ndc.x *= u_resolution.x / u_resolution.y;

  vec3 ro = vec3(0.0, 0.08, 2.4);
  vec3 rd = normalize(vec3(ndc * 0.45, -1.0));
  vec3 L1 = normalize(vec3(0.4, 0.6, 0.8));
  vec3 L2 = normalize(vec3(-0.3, 0.4, -0.6));

  float t = 0.0;
  bool hit = false;
  vec3 hp;
  for(int i = 0; i < STEPS; i++){
    hp = ro + rd * t;
    float d = scene(hp);
    if(d < EPS){ hit = true; break; }
    t += d;
    if(t > FAR) break;
  }
  if(!hit){ fragColor = vec4(0); return; }

  vec3 N = normal(hp), V = -rd;
  float NdV = clamp(dot(N, V), 0.0, 1.0);
  float F = fresnel(NdV);

  // Reflection
  vec3 rfl = reflect(rd, N);
  float eB = mix(0.30, 0.15, u_darkMode);
  vec3 env = mix(vec3(0.9, 0.92, 0.95) * eB, vec3(0.1, 0.12, 0.15) * eB, u_darkMode);
  vec3 refl = env + vec3(0.15) * max(rfl.y, 0.0);

  // Refraction + Beer-Lambert
  float eta = 1.0 / IOR;
  float k2 = 1.0 - eta * eta * (1.0 - NdV * NdV);
  vec3 rfr = u_jellyColor * 0.3;
  if(k2 > 0.0){
    vec3 rD = normalize(rd * eta + N * (eta * NdV - sqrt(k2)));
    vec3 ip = hp + rD * 0.01;
    float th = 0.0;
    for(int i = 0; i < 16; i++){
      float d = -scene(ip + rD * th);
      th += max(d, 0.01);
      if(d > 0.0 || th > 3.0) break;
    }
    th = clamp(th, 0.1, 2.0);
    vec3 ab = (1.0 - u_jellyColor) * 3.5;
    vec3 T = exp(-ab * th);
    vec3 bg = mix(vec3(0.85, 0.87, 0.9), vec3(0.12, 0.13, 0.15), u_darkMode);
    float ss1 = pow(max(0.0, dot(L1, rD)), 4.0);
    float ss2 = pow(max(0.0, dot(L2, rD)), 3.0);
    vec3 sc = u_jellyColor * (ss1 * 2.5 + ss2 * 1.2);
    vec3 gw = u_jellyColor * 0.15 * (1.0 - NdV);
    rfr = bg * T + sc + gw;
  }

  vec3 col = refl * F + rfr * (1.0 - F);

  // Specular
  vec3 H1 = normalize(L1 + V);
  float sp1 = pow(max(dot(N, H1), 0.0), 64.0) * 1.2;
  vec3 H2 = normalize(L2 + V);
  float sp2 = pow(max(dot(N, H2), 0.0), 32.0) * 0.4;
  col += vec3(sp1 + sp2);

  // Rim + edge glow
  col += u_jellyColor * pow(1.0 - NdV, 3.0) * 0.25;
  col += vec3(pow(1.0 - NdV, 5.0) * 0.15);

  col = col / (col + vec3(1));
  col = pow(col, vec3(1.0 / 2.2));
  float a = smoothstep(0.0, 0.12, NdV) * 0.92 + 0.08;
  fragColor = vec4(col * a, a);
}`;

const VERT = `#version 300 es
in vec2 a_position;
void main(){ gl_Position = vec4(a_position, 0, 1); }`;

/* ───────── Component ───────── */
interface Props {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: number;
}

export default function JellySwitch({ checked, onChange, size = 48 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const progRef = useRef<WebGLProgram | null>(null);
  const rafRef = useRef(0);
  const [webgl, setWebgl] = useState(true);
  const isDark = checked;
  const isDarkRef = useRef(isDark);
  isDarkRef.current = isDark;

  /* Springs — including slide position (no CSS transition!) */
  const springs = useRef({
    squashX: new Spring(0.4, 800, 12),
    squashY: new Spring(0.4, 700, 10),
    wiggle:  new Spring(0.3, 600, 8),
    slide:   Object.assign(new Spring(1, 180, 14), {
      value: checked ? 1 : 0,
      target: checked ? 1 : 0,
    }),
    // Smooth color interpolation
    colorT:  Object.assign(new Spring(1, 120, 12), {
      value: checked ? 1 : 0,
      target: checked ? 1 : 0,
    }),
  });
  const lastT = useRef(0);

  /* ── Sizing ── */
  const trackW = Math.round(size * 1.85);
  const trackH = Math.round(size * 0.92);
  const pad = Math.round(trackH * 0.12);
  const blobD = trackH - pad * 2;              // blob diameter
  const travel = trackW - blobD - pad * 2;     // slide distance
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
  const canvasCss = Math.round(blobD * 1.2);
  const canvasPx = Math.round(canvasCss * dpr);

  /* Refs for DOM elements we animate via spring (no React re-render) */
  const blobWrapRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  /* ── Init WebGL ── */
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const gl = c.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: true, preserveDrawingBuffer: false });
    if (!gl) { setWebgl(false); return; }
    glRef.current = gl;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERT); gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) { setWebgl(false); return; }

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAG); gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(fs)); setWebgl(false); return; }

    const p = gl.createProgram()!;
    gl.attachShader(p, vs); gl.attachShader(p, fs); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { setWebgl(false); return; }
    progRef.current = p;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(p, 'a_position');
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);

    return () => { cancelAnimationFrame(rafRef.current); gl.deleteProgram(p); gl.deleteShader(vs); gl.deleteShader(fs); };
  }, []);

  /* ── Update targets when checked changes ── */
  useEffect(() => {
    springs.current.slide.target = checked ? 1 : 0;
    springs.current.colorT.target = checked ? 1 : 0;
  }, [checked]);

  /* ── Render loop — updates WebGL + DOM positions via springs ── */
  useEffect(() => {
    const gl = glRef.current, p = progRef.current;
    if (!gl || !p || !webgl) return;
    const c = canvasRef.current!;
    c.width = canvasPx; c.height = canvasPx;
    gl.viewport(0, 0, canvasPx, canvasPx);
    gl.useProgram(p);

    const uTime = gl.getUniformLocation(p, 'u_time');
    const uRes  = gl.getUniformLocation(p, 'u_resolution');
    const uSqX  = gl.getUniformLocation(p, 'u_squashX');
    const uSqY  = gl.getUniformLocation(p, 'u_squashY');
    const uWig  = gl.getUniformLocation(p, 'u_wiggle');
    const uDark = gl.getUniformLocation(p, 'u_darkMode');
    const uCol  = gl.getUniformLocation(p, 'u_jellyColor');

    lastT.current = performance.now();

    function frame(ts: number) {
      const dt = Math.min((ts - lastT.current) * 0.001, 0.1);
      lastT.current = ts;
      const sp = springs.current;
      sp.squashX.update(dt);
      sp.squashY.update(dt);
      sp.wiggle.update(dt);
      sp.slide.update(dt);
      sp.colorT.update(dt);

      // Interpolate color smoothly via spring
      const ct = Math.max(0, Math.min(1, sp.colorT.value));
      const jc = [
        1.0 + (0.15 - 1.0) * ct,   // R: 1.0 → 0.15
        0.50 + (0.55 - 0.50) * ct,  // G: 0.50 → 0.55
        0.10 + (1.0 - 0.10) * ct,   // B: 0.10 → 1.0
      ];

      gl!.clearColor(0, 0, 0, 0);
      gl!.clear(gl!.COLOR_BUFFER_BIT);
      gl!.uniform1f(uTime, ts * 0.001);
      gl!.uniform2f(uRes, canvasPx, canvasPx);
      gl!.uniform1f(uSqX, sp.squashX.value);
      gl!.uniform1f(uSqY, sp.squashY.value);
      gl!.uniform1f(uWig, sp.wiggle.value);
      gl!.uniform1f(uDark, ct);
      gl!.uniform3f(uCol, jc[0], jc[1], jc[2]);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);

      // Update DOM positions via spring (no CSS transition glitches)
      const slideVal = Math.max(0, Math.min(1, sp.slide.value));
      const blobLeft = pad + slideVal * travel;
      const canvasLeft = blobLeft + (blobD - canvasCss) / 2;

      if (blobWrapRef.current) {
        blobWrapRef.current.style.transform = `translateX(${canvasLeft}px)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translateX(${blobLeft}px)`;
      }
      if (iconRef.current) {
        iconRef.current.style.transform = `translateX(${blobLeft}px)`;
      }

      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [webgl, canvasPx, pad, travel, blobD, canvasCss]);

  /* ── Click handler ── */
  const handleClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault(); e.stopPropagation();
    const sp = springs.current;
    sp.squashX.velocity = checked ? 5 : -5;
    sp.squashY.velocity = checked ? -4 : 4;
    sp.wiggle.velocity  = checked ? 10 : -10;
    onChange(!checked);
  }, [checked, onChange]);

  const handleDown = useCallback(() => {
    springs.current.squashX.velocity = -2.5;
    springs.current.squashY.velocity = 2;
  }, []);

  /* ── Track styles ── */
  const trackStyle: React.CSSProperties = {
    width: trackW,
    height: trackH,
    borderRadius: trackH / 2,
    position: 'relative',
    zIndex: 101,
  };

  const iconSize = Math.round(blobD * 0.38);
  const iconColor = isDark ? 'oklch(0.95 0.04 230 / 85%)' : 'oklch(0.35 0.12 65 / 85%)';

  /* ── CSS Fallback ── */
  if (!webgl) {
    return (
      <div className="flex items-center gap-2" style={{ position: 'relative', zIndex: 100 }}>
        <span className="text-[11px] font-semibold tracking-widest uppercase select-none hidden sm:block"
          style={{ color: isDark ? 'oklch(0.65 0.04 230)' : 'oklch(0.55 0.03 65)' }}>
          {isDark ? 'Dark' : 'Light'}
        </span>
        <button
          onClick={handleClick}
          className="cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
          style={trackStyle}
          aria-label={checked ? 'Switch to light mode' : 'Switch to dark mode'}
          role="switch" aria-checked={checked}
        >
          {/* Track background */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: trackH / 2,
            background: isDark
              ? 'linear-gradient(180deg, oklch(0.18 0.02 230 / 35%), oklch(0.14 0.025 230 / 40%))'
              : 'linear-gradient(180deg, oklch(0.50 0.005 80 / 8%), oklch(0.50 0.008 80 / 12%))',
            border: 'none',
            backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
            boxShadow: isDark
              ? '0 0 1px oklch(1 0 0 / 4%)'
              : '0 0 1px oklch(0 0 0 / 6%)',
            transition: 'background 0.5s, box-shadow 0.5s',
          }} />
          {/* CSS round blob */}
          <div style={{
            position: 'absolute',
            top: pad,
            left: isDark ? pad + travel : pad,
            width: blobD, height: blobD, borderRadius: '50%',
            transition: 'left 0.5s cubic-bezier(0.34,1.56,0.64,1), background 0.5s, box-shadow 0.5s',
            background: isDark
              ? 'radial-gradient(ellipse at 35% 28%, oklch(0.80 0.10 230 / 95%), oklch(0.50 0.22 230 / 88%))'
              : 'radial-gradient(ellipse at 35% 28%, oklch(0.96 0.05 65 / 95%), oklch(0.74 0.16 65 / 88%))',
            boxShadow: isDark
              ? '0 4px 16px oklch(0.52 0.20 230 / 45%), inset 0 3px 4px oklch(0.88 0.06 230 / 45%)'
              : '0 4px 16px oklch(0.74 0.14 65 / 40%), inset 0 3px 4px oklch(1 0 0 / 55%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ color: iconColor, transition: 'color 0.5s' }}>
              {isDark ? <Moon size={iconSize} /> : <Sun size={iconSize} />}
            </div>
          </div>
        </button>
      </div>
    );
  }

  /* ── WebGL Version ── */
  return (
    <div className="flex items-center gap-2" style={{ position: 'relative', zIndex: 100 }}>
      <span className="text-[11px] font-semibold tracking-widest uppercase select-none hidden sm:block"
        style={{ color: isDark ? 'oklch(0.65 0.04 230)' : 'oklch(0.55 0.03 65)', transition: 'color 0.5s' }}>
        {isDark ? 'Dark' : 'Light'}
      </span>
      <button
        onClick={handleClick}
        onMouseDown={handleDown}
        onTouchStart={handleDown}
        className="cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={trackStyle}
        aria-label={checked ? 'Switch to light mode' : 'Switch to dark mode'}
        role="switch" aria-checked={checked}
      >
        {/* Frosted glass track — smooth transition */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: trackH / 2,
          background: isDark
            ? 'linear-gradient(180deg, oklch(0.18 0.02 230 / 35%), oklch(0.14 0.025 230 / 40%))'
            : 'linear-gradient(180deg, oklch(0.50 0.005 80 / 8%), oklch(0.50 0.008 80 / 12%))',
          border: 'none',
          backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
          boxShadow: isDark
            ? '0 0 1px oklch(1 0 0 / 4%)'
            : '0 0 1px oklch(0 0 0 / 6%)',
          transition: 'background 0.5s, box-shadow 0.5s',
        }} />

        {/* Glow under blob — positioned via spring */}
        <div
          ref={glowRef}
          style={{
            position: 'absolute',
            top: trackH - 4,
            left: 0, // will be set by spring via translateX
            width: blobD, height: 8,
            borderRadius: '50%',
            background: isDark
              ? 'radial-gradient(ellipse, oklch(0.55 0.25 230 / 15%) 0%, transparent 70%)'
              : 'radial-gradient(ellipse, oklch(0.75 0.18 65 / 15%) 0%, transparent 70%)',
            filter: 'blur(4px)',
            pointerEvents: 'none',
            transition: 'background 0.5s',
          }}
        />

        {/* WebGL canvas — positioned via spring translateX */}
        <div
          ref={blobWrapRef}
          style={{
            position: 'absolute',
            top: pad + (blobD - canvasCss) / 2,
            left: 0, // will be set by spring via translateX
            width: canvasCss,
            height: canvasCss,
            pointerEvents: 'none',
          }}
        >
          <canvas ref={canvasRef} style={{ width: canvasCss, height: canvasCss, display: 'block' }} />
        </div>

        {/* Icon overlay — positioned via spring */}
        <div
          ref={iconRef}
          style={{
            position: 'absolute',
            top: pad,
            left: 0, // will be set by spring via translateX
            width: blobD,
            height: blobD,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
            filter: 'drop-shadow(0 1px 2px oklch(0 0 0 / 30%))',
            pointerEvents: 'none',
            transition: 'color 0.5s',
          }}
        >
          {isDark ? <Moon size={iconSize} /> : <Sun size={iconSize} />}
        </div>
      </button>
    </div>
  );
}
