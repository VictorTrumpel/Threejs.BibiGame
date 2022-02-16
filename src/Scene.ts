import * as THREE from 'three';
import { PerspectiveCamera, WebGLRenderer, Scene as BaseScene, Object3D, Color } from 'three';

export class Scene {
  private canvas: HTMLCanvasElement;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  public scene: BaseScene;

  constructor() {
    this.canvas = document.querySelector('#root') as HTMLCanvasElement;

    this.camera = new THREE.PerspectiveCamera(75, 2, 0.1, 5);
    this.camera.position.z = 4;

    this.renderer = this.createRenderer(this.canvas);

    this.scene = this.createScene();
  }

  public add(...object: Object3D[]) {
    this.scene.add(...object);
  }

  public render() {
    this.updateMatrix();
    this.resizeWindow();
    this.renderer.render(this.scene, this.camera);
  }

  private updateMatrix() {
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
  }

  private resizeWindow() {
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    const needResize = this.canvas.width !== width || this.canvas.height !== height;
    if (needResize) {
      this.renderer.setSize(width, height, false);
    }
  }

  private createScene() {
    const scene = new THREE.Scene();
    scene.background = new Color('skyblue');
    return scene;
  }

  private createRenderer(canvas: HTMLCanvasElement) {
    const renderer = new THREE.WebGLRenderer({ canvas });
    renderer.shadowMap.enabled = true;
    return renderer;
  }
}
