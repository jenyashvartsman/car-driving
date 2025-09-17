import * as THREE from "three";
import Car from "./js/car.js";
import Background from "./js/background.js";
import Tree from "./js/tree.js";

init();

// init
function init() {
  // initialize scene, camera, renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // add background
  const background = new Background(scene, { speed: 0.1 });
  scene.add(background.road);

  // add car
  const car = new Car();
  scene.add(car.getObject3D());

  // add camera
  camera.position.z = 9;
  camera.position.y = 3;
  camera.lookAt(0, 0, 0);

  // view car from the side
  camera.position.y = 5;
  camera.lookAt(car.getObject3D().position);

  // add light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7.5);
  scene.add(directionalLight);

  // render loop
  function animate() {
    requestAnimationFrame(animate);
    car.updateMovement();
    renderer.render(scene, camera);
  }
  animate();

  // animate background only when car is moving
  const clock = new THREE.Clock();
  function animateBackground() {
    requestAnimationFrame(animateBackground);
    const delta = clock.getDelta();
    // Pass car's z position so road follows car
    background.update(delta, car.speed, car.getObject3D().position.z);
  }
  animateBackground();

  // handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // handle camera follow car
  function updateCamera() {
    requestAnimationFrame(updateCamera);
    camera.position.z +=
      (car.getObject3D().position.z + 9 - camera.position.z) * 0.05;
    // Smoothly follow the car's x position
    camera.position.x +=
      (car.getObject3D().position.x - camera.position.x) * 0.05;
    camera.lookAt(car.getObject3D().position);
    // block camera going back too far
  }
  updateCamera();
}
