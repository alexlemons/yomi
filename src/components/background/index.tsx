import { useEffect, useRef, useState } from "react";
import { CustomShaderRenderer } from "./custom-shader-renderer";
import './index.css';

type BackgroundProps = {
  stateId: number;
}

/** 
 * Alpha value used to store dead/alive state (0.0/1.0)
*/
const fragmentShader = /*glsl*/`
  precision mediump float;

  const vec2 SCALE = vec2(1200.0, 800.0);

  uniform sampler2D uPrevFrame;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uFrameCount;
  uniform vec2 uMousePosition;
  // varying vec2 vUv;

  //	Classic Perlin 2D Noise 
  //	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
  //
  float random(vec2 st) {return fract(sin(dot(st.xy,vec2(12.9898,78.233)))*43758.5453123);}
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
  
  float cnoise(vec2 P){
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * 
      vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
  }

  // Integer position in a grid defined by SCALE
  vec2 getIpos(vec2 uv) {
    return floor(uv * SCALE);
  }

  // Return uv center point of integer position
  vec2 getUVFromIpos(vec2 iPos) {
    return (iPos + vec2(0.5)) / SCALE;
  }

  out vec4 fragColor;

  void main() {
    vec2 uv = gl_FragCoord.xy/uResolution.xy;
    vec2 mouseUv = uMousePosition.xy/uResolution.xy;
    float time = uTime / 10.0;
    
    vec4 aliveColor = vec4(mix(vec3(0.05), vec3(0.992, 0.984, 0.827) * uv.x / 62.0, uv.y), 1.0);
    // vec4 aliveColor = vec4(vec3(smoothstep(0.8, 0.0, distance(uv, vec2(0.5))) / 25.0), 1.0);
    vec4 deadColor = vec4(vec3(0.0075), 0.0);

    float n = cnoise(uv * 4.0) / 40.0;

    vec2 ipos = getIpos(uv + cos(uv.x * 150.0 + time) / 100.0 + n);
    // vec2 ipos = getIpos(uv);
    
    // Create initial random grid pattern
    vec4 initialColor = random(ipos + time) > 0.5 ? aliveColor : deadColor;
    
    vec4 outColor;
    vec4 prevColor = texture(uPrevFrame, uv);
    
    // Calculate number of alive neighbours iPos has on grid
    float neighbours = 0.0;
    neighbours += ceil(texture(uPrevFrame, getUVFromIpos(ipos + vec2(-1.0, 1.0))).a);
    neighbours += ceil(texture(uPrevFrame, getUVFromIpos(ipos + vec2(-1.0, 0.0))).a);
    neighbours += ceil(texture(uPrevFrame, getUVFromIpos(ipos + vec2(-1.0, -1.0))).a);
    neighbours += ceil(texture(uPrevFrame, getUVFromIpos(ipos + vec2(0.0, 1.0))).a);
    neighbours += ceil(texture(uPrevFrame, getUVFromIpos(ipos + vec2(0.0, -1.0))).a);
    neighbours += ceil(texture(uPrevFrame, getUVFromIpos(ipos + vec2(1.0, 1.0))).a);
    neighbours += ceil(texture(uPrevFrame, getUVFromIpos(ipos + vec2(1.0, 0.0))).a);
    neighbours += ceil(texture(uPrevFrame, getUVFromIpos(ipos + vec2(1.0, -1.0))).a);
    
    // Life Rules
    if (neighbours <= 1.0) {
      outColor = deadColor;
    }
    else if (neighbours == 3.0 && random(ipos + time) > 0.3) {
      outColor = aliveColor;
    } 
    else if (neighbours > 3.0) {
      outColor = deadColor;
    } 
    else {
      outColor = prevColor - 1.0;
    }
    
    // Set initial state then use outColor
    fragColor = uFrameCount > 1.0 ? outColor : initialColor;
  }
`;

export const Background = ({ stateId }: BackgroundProps) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const shaderRenderer = useRef<CustomShaderRenderer>(null);
  const [shaderReady, setShaderReady] = useState<boolean>(false);

  useEffect(() => {
    const startShaderRenderer = async () => {
      if (!canvas.current) {
        return;
      }

      shaderRenderer.current = new CustomShaderRenderer({
        canvas: canvas.current,
        fragmentShader: fragmentShader,
        fps: 4,
      });

      shaderRenderer.current.start();
      setShaderReady(true);
    }

    startShaderRenderer();

    return () => {
      shaderRenderer.current?.stop();
    }
  }, [canvas]);

  const canvasStyle = {
    opacity: shaderReady ? 0.25 : 0.01,
  };

  return (
    <canvas
      ref={canvas}
      style={canvasStyle}
    />
  );
}