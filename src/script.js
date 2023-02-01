import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { BufferGeometry } from "three";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//TODO ---> Parameters
const parameters = {};
parameters.count = 10000;
parameters.size = 0.01;
parameters.radius = 5
parameters.brenches = 3
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

//todo--> main variables
let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {//! Main Func <----
  

  //todo--> destroy old galaxy
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  //!geometry
  geometry = new BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  //todo--> colors instances & mix
  const colorInside = new THREE.Color(parameters.insideColor)
  const colorOutside = new THREE.Color(parameters.outsideColor)


  for (let i = 0; i < parameters.count; i++) {
    
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius
    const brenchAngle = (i % parameters.brenches) / parameters.brenches * Math.PI * 2
    const curve = radius *parameters.spin

    const randomY = Math.pow(Math.random(), parameters.randomnessPower) *(Math.random() * parameters < 0.5 ? 1 : -1)
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) *(Math.random() * parameters < 0.5 ? 1 : -1)
    const randomX = Math.pow(Math.random(), parameters.randomnessPower) *(Math.random() * parameters < 0.5 ? 1 : -1)

    //Position array X|Y|Z
    positions[i3    ] = Math.cos(brenchAngle + curve)*radius +randomX 
    positions[i3 + 1] = randomY 
    positions[i3 + 2] = Math.sin(brenchAngle + curve)*radius +randomZ

    //Colors array r|g|b
    const mixedColor = colorInside.clone() //so it wont change for the particle after
    mixedColor.lerp(colorOutside, radius / parameters.radius)

    colors[i3] = mixedColor.r
    colors[i3 +1] = mixedColor.g
    colors[i3+2] = mixedColor.b

    
}

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));


  //!Material
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors : true 
  });

  //! The Actual Particals (points)
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

//debug gui
gui
  .add(parameters, "count")
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy);

gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);

  gui
  .add(parameters, "radius")
  .min(0.01)
  .max(20)
  .step(0.01)
  .onFinishChange(generateGalaxy);

  gui
  .add(parameters, "brenches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);

  gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(0.001)
  .onFinishChange(generateGalaxy);

  gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy);
 
  gui
  .add(parameters, "randomnessPower")
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy);
  
  gui.addColor(parameters , 'insideColor').onFinishChange(generateGalaxy);
  gui.addColor(parameters , 'outsideColor').onFinishChange(generateGalaxy);

  
 

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
