/**
 * JellySwitch — WebGL 3D Jelly Toggle for Dark/Light Mode
 *
 * Track: Recessed capsule with rim highlights, contact shadow, visible depth
 * Blob: SDF ray-marched sphere with Fresnel, Beer-Lambert, subsurface scattering
 * Motion: Spring physics for squash/stretch/wiggle (no CSS transition)
 *
 * Batch 2 changes:
 * - Track now has recessed machined appearance (inset shadows, rim highlight)
 * - Contact shadow beneath track
 * - Colored glow beneath blob is stronger and more visible
 * - Removed "DARK"/"Light" text label
 * - CSS fallback improved with better material cues
 */
import { useRef, useEffect, useCallback, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useJellyMode } from '@/contexts/JellyModeContext';
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
  vec3 s = p * vec3(
    1.0 / (1.0 + u_squashX * 0.25),
    1.0 / (1.0 - u_squashY * 0.2),
    1.0
  );
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

  vec3 rfl = reflect(rd, N);
  float eB = mix(0.30, 0.15, u_darkMode);
  vec3 env = mix(vec3(0.9, 0.92, 0.95) * eB, vec3(0.1, 0.12, 0.15) * eB, u_darkMode);
  vec3 refl = env + vec3(0.15) * max(rfl.y, 0.0);

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

  vec3 H1 = normalize(L1 + V);
  float sp1 = pow(max(dot(N, H1), 0.0), 64.0) * 1.2;
  vec3 H2 = normalize(L2 + V);
  float sp2 = pow(max(dot(N, H2), 0.0), 32.0) * 0.4;
  col += vec3(sp1 + sp2);

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
  const { jellyMode } = useJellyMode();

  /* Springs */
  const springs = useRef({
    squashX: new Spring(0.4, 800, 12),
    squashY: new Spring(0.4, 700, 10),
    wiggle:  new Spring(0.3, 600, 8),
    slide:   Object.assign(new Spring(1, 180, 14), {
      value: checked ? 1 : 0,
      target: checked ? 1 : 0,
    }),
    colorT:  Object.assign(new Spring(1, 120, 12), {
      value: checked ? 1 : 0,
      target: checked ? 1 : 0,
    }),
  });
  const lastT = useRef(0);

  /* ── Sizing — generous proportions ── */
  const trackW = Math.round(size * 1.85);
  const trackH = Math.round(size * 0.95);
  const pad = Math.round(trackH * 0.08);
  const blobD = trackH - pad * 2;
  const travel = trackW - blobD - pad * 2;
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
  const canvasCss = Math.round(blobD * 1.2);
  const canvasPx = Math.round(canvasCss * dpr);

  /* Refs for DOM elements animated via spring */
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

  /* ── Render loop ── */
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

      const ct = Math.max(0, Math.min(1, sp.colorT.value));
      const jc = [
        1.0 + (0.15 - 1.0) * ct,
        0.50 + (0.55 - 0.50) * ct,
        0.10 + (1.0 - 0.10) * ct,
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
    // Jelly mode = more dramatic spring impulse
    const mult = jellyMode ? 1.6 : 1;
    sp.squashX.velocity = (checked ? 5 : -5) * mult;
    sp.squashY.velocity = (checked ? -4 : 4) * mult;
    sp.wiggle.velocity  = (checked ? 10 : -10) * mult;
    onChange(!checked);
  }, [checked, onChange, jellyMode]);

  const handleDown = useCallback(() => {
    const mult = jellyMode ? 1.4 : 1;
    springs.current.squashX.velocity = -2.5 * mult;
    springs.current.squashY.velocity = 2 * mult;
  }, [jellyMode]);

  const iconSize = Math.round(blobD * 0.38);
  const iconColor = isDark ? 'oklch(0.95 0.04 230 / 85%)' : 'oklch(0.35 0.12 65 / 85%)';

  /* ── Track styles — recessed capsule with rim highlights ── */
  const trackStyle: React.CSSProperties = {
    width: trackW,
    height: trackH + 10, // Extra space for glow beneath
    borderRadius: trackH / 2,
    position: 'relative',
    zIndex: 101,
  };

  /* Track background — deeply recessed metallic channel */
  const trackBgStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: trackH,
    borderRadius: trackH / 2,
    pointerEvents: 'none' as const,
    background: isDark
      ? 'linear-gradient(180deg, oklch(0.08 0.01 230) 0%, oklch(0.13 0.015 230) 40%, oklch(0.10 0.01 230) 100%)'
      : 'linear-gradient(180deg, oklch(0.82 0.005 80) 0%, oklch(0.87 0.003 80) 40%, oklch(0.84 0.005 80) 100%)',
    boxShadow: isDark
      ? [
          // Deep recess — strong top shadow
          'inset 0 3px 6px oklch(0 0 0 / 65%)',
          'inset 0 1px 2px oklch(0 0 0 / 40%)',
          // Bottom rim highlight — light catching the lower lip
          'inset 0 -1.5px 1px oklch(1 0 0 / 10%)',
          // Outer contact shadow
          '0 2px 8px oklch(0 0 0 / 35%)',
          '0 1px 3px oklch(0 0 0 / 25%)',
        ].join(', ')
      : [
          // Deep recess
          'inset 0 3px 6px oklch(0 0 0 / 22%)',
          'inset 0 1px 2px oklch(0 0 0 / 12%)',
          // Bottom rim highlight
          'inset 0 -1.5px 1px oklch(1 0 0 / 70%)',
          // Top inner rim
          'inset 0 1px 0 oklch(1 0 0 / 35%)',
          // Outer contact shadow
          '0 2px 6px oklch(0 0 0 / 12%)',
          '0 1px 2px oklch(0 0 0 / 8%)',
        ].join(', '),
    border: isDark
      ? '1.5px solid oklch(1 0 0 / 6%)'
      : '1.5px solid oklch(0 0 0 / 10%)',
    transition: 'background 0.5s, box-shadow 0.5s, border-color 0.5s',
  };

  /* Glow style — colored light spill beneath blob */
  const glowStyle: React.CSSProperties = {
    position: 'absolute',
    top: trackH - 1,
    left: 0,
    width: blobD * 1.6,
    height: 14,
    borderRadius: '50%',
    background: isDark
      ? 'radial-gradient(ellipse, oklch(0.55 0.25 230 / 55%) 0%, oklch(0.50 0.20 230 / 25%) 40%, transparent 70%)'
      : 'radial-gradient(ellipse, oklch(0.75 0.18 65 / 45%) 0%, oklch(0.70 0.14 65 / 20%) 40%, transparent 70%)',
    filter: 'blur(5px)',
    pointerEvents: 'none' as const,
    transition: 'background 0.5s',
  };

  /* ── CSS Fallback ── */
  if (!webgl) {
    const fallbackBlobLeft = isDark ? pad + travel : pad;
    return (
      <button
        onClick={handleClick}
        className="cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={trackStyle}
        aria-label={checked ? 'Switch to light mode' : 'Switch to dark mode'}
        role="switch" aria-checked={checked}
      >
        {/* Recessed track */}
        <div style={trackBgStyle} />

        {/* Colored glow beneath blob */}
        <div style={{
          ...glowStyle,
          left: fallbackBlobLeft + (blobD - blobD * 1.4) / 2,
          transform: 'none',
        }} />

        {/* CSS blob with gel material cues */}
        <div style={{
          position: 'absolute',
          top: pad,
          left: fallbackBlobLeft,
          width: blobD,
          height: blobD,
          borderRadius: '50%',
          transition: 'left 0.5s cubic-bezier(0.34,1.56,0.64,1), background 0.5s, box-shadow 0.5s',
          background: isDark
            ? 'radial-gradient(ellipse at 30% 25%, oklch(0.82 0.12 230 / 94%) 0%, oklch(0.58 0.24 230 / 90%) 50%, oklch(0.48 0.26 230 / 87%) 100%)'
            : 'radial-gradient(ellipse at 30% 25%, oklch(0.98 0.04 65 / 96%) 0%, oklch(0.85 0.12 65 / 92%) 50%, oklch(0.76 0.16 65 / 90%) 100%)',
          boxShadow: isDark
            ? [
                '0 0 14px oklch(0.52 0.24 230 / 50%)',
                '0 0 6px oklch(0.55 0.22 230 / 35%)',
                '0 4px 12px oklch(0 0 0 / 35%)',
                '0 2px 4px oklch(0 0 0 / 25%)',
                'inset 0 3px 5px oklch(0.90 0.08 230 / 50%)',
                'inset 0 -2px 4px oklch(0.30 0.15 230 / 35%)',
                'inset 2px 1px 3px oklch(1 0 0 / 20%)',
              ].join(', ')
            : [
                '0 0 12px oklch(0.74 0.16 65 / 40%)',
                '0 0 5px oklch(0.78 0.14 65 / 28%)',
                '0 4px 12px oklch(0 0 0 / 18%)',
                '0 2px 4px oklch(0 0 0 / 12%)',
                'inset 0 3px 5px oklch(1 0 0 / 55%)',
                'inset 0 -2px 4px oklch(0.60 0.10 65 / 25%)',
                'inset 2px 1px 3px oklch(1 0 0 / 30%)',
              ].join(', '),
          border: isDark
            ? '1px solid oklch(0.70 0.10 230 / 25%)'
            : '1px solid oklch(0 0 0 / 6%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
          {/* Caustic highlight */}
          <div style={{
            position: 'absolute',
            top: '8%',
            left: '15%',
            right: '15%',
            height: '35%',
            borderRadius: '50%',
            background: 'linear-gradient(180deg, oklch(1 0 0 / 40%) 0%, oklch(1 0 0 / 12%) 50%, oklch(1 0 0 / 0%) 100%)',
            pointerEvents: 'none',
          }} />
          <div style={{ color: iconColor, transition: 'color 0.5s' }}>
            {isDark ? <Moon size={iconSize} /> : <Sun size={iconSize} />}
          </div>
        </div>
      </button>
    );
  }

  /* ── WebGL Version ── */
  return (
    <button
      onClick={handleClick}
      onMouseDown={handleDown}
      onTouchStart={handleDown}
      className="cursor-pointer bg-transparent border-none outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={trackStyle}
      aria-label={checked ? 'Switch to light mode' : 'Switch to dark mode'}
      role="switch" aria-checked={checked}
    >
      {/* Recessed capsule track */}
      <div style={trackBgStyle} />

      {/* Colored glow beneath blob — positioned via spring */}
      <div
        ref={glowRef}
        style={glowStyle}
      />

      {/* WebGL canvas — positioned via spring translateX */}
      <div
        ref={blobWrapRef}
        style={{
          position: 'absolute',
          top: pad + (blobD - canvasCss) / 2,
          left: 0,
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
          left: 0,
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
  );
}
