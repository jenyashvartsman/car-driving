// Car.js - defines a Car class using three.js
import * as THREE from "three";

export default class Car {
  constructor() {
    this.group = new THREE.Group();
    this.createBody();
    this.createWheels();

    // Listen to multiple keys pressed simultaneously
    this.keysPressed = {};
    window.addEventListener("keydown", (event) => {
      this.keysPressed[event.key.toLowerCase()] = true;
    });
    window.addEventListener("keyup", (event) => {
      this.keysPressed[event.key.toLowerCase()] = false;
    });
  }

  createBody() {
    // Simple car body: a box
    const geometry = new THREE.BoxGeometry(1, 0.5, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const body = new THREE.Mesh(geometry, material);
    body.position.y = 0.5;
    this.group.add(body);
  }

  createWheels() {
    // Simple that can be rotated: cylinders
    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0xbbbbb });
    const positions = [
      [-0.5, 0.2, 0.7],
      [0.5, 0.2, 0.7],
      [-0.5, 0.2, -0.7],
      [0.5, 0.2, -0.7],
    ];
    positions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(...pos);
      this.group.add(wheel);
    });
  }

  getObject3D() {
    return this.group;
  }

  updateMovement() {
    const step = 0.1;
    if (this.keysPressed["w"]) {
      this.group.position.z -= step;
    }
    if (this.keysPressed["s"]) {
      this.group.position.z += step;
    }
    if (this.keysPressed["a"]) {
      this.group.position.x -= step;
    }
    if (this.keysPressed["d"]) {
      this.group.position.x += step;
    }
    // Clamp position to road width (-5 to 5)
    this.group.position.x = Math.max(-5, Math.min(5, this.group.position.x));
  }
}
