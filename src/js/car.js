// Car.js - defines a Car class using three.js
import * as THREE from "three";

export default class Car {
  constructor() {
    this.group = new THREE.Group();
    this.createBody();
    this.createWheels();

    // Listen for key presses to move the car
    window.addEventListener("keydown", (event) => this.onKeyPress(event));
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

  onKeyPress(event) {
    const key = event.key.toLowerCase();
    const step = 0.3;
    if (key === "w") {
      this.group.position.z -= step; // Move forward
    } else if (key === "s") {
      this.group.position.z += step; // Move backward
    } else if (key === "a") {
      this.group.position.x -= step; // Move left
    } else if (key === "d") {
      this.group.position.x += step; // Move right
    }
  }
}
