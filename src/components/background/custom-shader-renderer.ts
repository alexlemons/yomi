// CODE GEN initial prompt (O3-mini):
// Using Three.js and TypeScript, create a class that renders a custom shader to a canvas element.
// Key requirements:
// 1. It should take a reference to a canvas element as a parameter.
// 2. It should take a string fragment shader as a parameter.
// 3. It should use a default vertex shader.
// 4. It should render the output of the fragment shader to the canvas.
// 5. It should use a frame buffer to store the previous frame that can then be passed to the fragment shader as a uniform.

import * as THREE from 'three';

type CustomShaderRendererConfig = {
  canvas: HTMLCanvasElement;
  fragmentShader: string;
  fps?: number;
};

// A simple default vertex shader that passes through positions and UVs.
const defaultVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

export class CustomShaderRenderer {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private quad: THREE.Mesh;
  private uniforms: {
    uPrevFrame: { value: THREE.Texture | null };
    uResolution: { value: THREE.Vector2 };
    uTime: { value: number };
    uFrameCount: { value: number };
    uMousePosition: { value: [number, number] };
  };

  // Two render targets for ping-pong rendering
  private renderTargetA: THREE.WebGLRenderTarget;
  private renderTargetB: THREE.WebGLRenderTarget;
  private currentTarget: THREE.WebGLRenderTarget;
  private previousTarget: THREE.WebGLRenderTarget;

  // A second scene and camera to copy the current frame to the canvas.
  private copyScene: THREE.Scene;
  private copyCamera: THREE.OrthographicCamera;
  private copyMesh: THREE.Mesh;

  private animationFrameId: number | null;
  private startTime: number;
  private previousFrameTime: number;
  private fps: number;
  private frameCount: number;

  private mousePosition: [number, number];

  /**
   * @param canvas A reference to the HTMLCanvasElement to render to.
   * @param fragmentShader The custom fragment shader as a string.
   */
  constructor(config: CustomShaderRendererConfig) {
    const {
      canvas,
      fragmentShader,
      fps = 60,
    } = config;

    this.canvas = canvas;
    this.animationFrameId = null;
    this.startTime = Date.now();
    this.previousFrameTime = this.startTime;
    this.fps = fps;
    this.frameCount = 0;
    this.mousePosition = [0, 0];

    // Create the WebGL renderer using the provided canvas.
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Create an orthographic camera and scene for our shader pass.
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Setup our uniforms.
    this.uniforms = {
      // This uniform will hold the previous frame’s texture.
      uPrevFrame: { value: null },
      // The resolution of the canvas.
      uResolution: { value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight) },
      // Time in seconds.
      uTime: { value: 0.0 },
      // A count of the number frames that have passed
      uFrameCount: { value: this.frameCount },
      // Position of mouse relative to viewport
      uMousePosition: { value: this.mousePosition },
    };

    // Create our ShaderMaterial using the default vertex shader and provided fragment shader.
    const shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: defaultVertexShader,
      fragmentShader,
      uniforms: this.uniforms,
      glslVersion: THREE.GLSL3,
    });

    // Create a full-screen quad (a plane that covers clip space) and add it to the scene.
    const geometry = new THREE.PlaneGeometry(2, 2);
    this.quad = new THREE.Mesh(geometry, shaderMaterial);
    this.scene.add(this.quad);

    // Create two render targets (off-screen framebuffers) for ping-pong rendering.
    const rtParams = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    };
    this.renderTargetA = new THREE.WebGLRenderTarget(canvas.clientWidth, canvas.clientHeight, rtParams);
    this.renderTargetB = new THREE.WebGLRenderTarget(canvas.clientWidth, canvas.clientHeight, rtParams);
    this.currentTarget = this.renderTargetA;
    this.previousTarget = this.renderTargetB;

    // Setup a second scene to copy the current frame to the actual canvas.
    this.copyScene = new THREE.Scene();
    this.copyCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const copyMaterial = new THREE.MeshBasicMaterial({ map: this.currentTarget.texture });
    this.copyMesh = new THREE.Mesh(geometry, copyMaterial);
    this.copyScene.add(this.copyMesh);

    // Bind the animation loop so that "this" is correct.
    this.animate = this.animate.bind(this);
  }

  public start(): void {
    window.addEventListener('mousemove', this.setMousePosition.bind(this));
    this.animate();
  }

  public stop(): void {
    if (typeof this.animationFrameId === 'number') {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('mousemove', this.setMousePosition.bind(this));
  }

  /**
   * The animation loop.
   */
  private animate(): void {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const now = Date.now();
    const elapsedTime = now - this.previousFrameTime;
    const fpsInterval = 1000 / this.fps;

    if (elapsedTime > fpsInterval) {
      // adjust for your fpsInterval not being a multiple of RAF's interval (16.7ms)
      this.previousFrameTime = now - (elapsedTime % fpsInterval);

      // const elapsedTime = (Date.now() - this.startTime) / 1000;
      this.uniforms.uTime.value = elapsedTime;
      
      this.frameCount++;
      this.uniforms.uFrameCount.value = this.frameCount;
  
      // Pass the texture from the previous frame.
      this.uniforms.uPrevFrame.value = this.previousTarget.texture;

      this.uniforms.uMousePosition.value = this.mousePosition;
  
      // Render our shader scene into the current render target (off-screen).
      this.renderer.setRenderTarget(this.currentTarget);
      this.renderer.render(this.scene, this.camera);
  
      // Render the current render target to the canvas.
      // Update the copy mesh material so it displays the most recent frame.
      (this.copyMesh.material as THREE.MeshBasicMaterial).map = this.currentTarget.texture;
      (this.copyMesh.material as THREE.MeshBasicMaterial).needsUpdate = true;
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.copyScene, this.copyCamera);
  
      // Swap the render targets for ping-pong rendering.
      [this.currentTarget, this.previousTarget] = [this.previousTarget, this.currentTarget];
    }
  }

  private setMousePosition(e: MouseEvent) {
    this.mousePosition = [e.clientX, e.clientY];
  }
}