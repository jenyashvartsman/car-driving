import * as THREE from "three";
import Car from "./js/car.js";
import Background from "./js/background.js";

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
  camera.position.x = 5;
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
    renderer.render(scene, camera);
  }
  animate();

  // animate background
  const clock = new THREE.Clock();
  function animateBackground() {
    requestAnimationFrame(animateBackground);
    const delta = clock.getDelta();
    background.update(delta);
  }
  animateBackground();

  // handle window resize
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}
