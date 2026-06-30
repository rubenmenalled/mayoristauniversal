'use client'

import React, { useRef, useEffect } from 'react'

// Fondo WebGL animado (nubes cósmicas) contenido al tamaño de su contenedor.
// Liviano: baja resolución, se pausa cuando no está visible y respeta reduce-motion.

const VERT = `#version 300 es
precision highp float;
in vec4 position;
void main(){gl_Position=position;}`

const FRAG = `#version 300 es
precision highp float;
out vec4 O;
uniform vec2 resolution;
uniform float time;
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(in vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);
  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;mat2 m=mat2(1.,-.5,.2,1.2);
  for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}return t;}
float clouds(vec2 p){float d=1.,t=.0;
  for(float i=.0;i<3.;i++){float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);t=mix(t,d,a);d=a;p*=2./(i+1.);}return t;}
void main(void){
  vec2 uv=(FC-.5*R)/MN,st=uv*vec2(2,1);
  vec3 col=vec3(0);
  float bg=clouds(vec2(st.x+T*.4,-st.y));
  uv*=1.-.3*(sin(T*.2)*.5+.5);
  for(float i=1.;i<10.;i++){
    uv+=.1*cos(i*vec2(.1+.01*i,.8)+i*i+T*.4+.1*uv.x);
    vec2 p=uv;float d=length(p);
    col+=.0014/d*(cos(sin(i)*vec3(1,2,3))+1.);
    float b=noise(i+p+bg*1.731);
    col+=.002*b/length(max(p,vec2(b*p.x*.02,p.y)));
    col=mix(col,vec3(bg*.25,bg*.137,bg*.05),d);
  }
  O=vec4(col,1);
}`

export default function ShaderBg({ style }: { style?: React.CSSProperties }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const gl = canvas.getContext('webgl2')
    if (!gl) return

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    const mkShader = (type: number, src: string) => {
      const s = gl.createShader(type)!
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return s
    }
    const program = gl.createProgram()!
    gl.attachShader(program, mkShader(gl.VERTEX_SHADER, VERT))
    gl.attachShader(program, mkShader(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(program)
    gl.useProgram(program)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]), gl.STATIC_DRAW)
    const pos = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(program, 'resolution')
    const uTime = gl.getUniformLocation(program, 'time')

    const dpr = Math.min(1.5, Math.max(1, 0.6 * (window.devicePixelRatio || 1)))
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      const w = Math.max(1, Math.floor(r.width * dpr))
      const h = Math.max(1, Math.floor(r.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }
    resize()

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    let raf = 0
    let visible = true
    const io = new IntersectionObserver((es) => { visible = es[0]?.isIntersecting ?? true }, { threshold: 0 })
    io.observe(canvas)

    const drawOnce = (t: number) => {
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, t * 1e-3)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    }

    const render = (t: number) => {
      if (visible && !document.hidden) drawOnce(t)
      raf = requestAnimationFrame(render)
    }

    if (reduce) {
      drawOnce(8000) // un cuadro fijo, sin animar
    } else {
      render(0)
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={ref}
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', ...style }}
    />
  )
}
