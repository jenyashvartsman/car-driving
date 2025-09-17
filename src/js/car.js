// Car.js - defines a Car class using three.js
import * as THREE from "three";

export default class Car {
  constructor() {
    this.group = new THREE.Group();
    this.createBody();
    this.createWheels();

    // Speed properties
    this.speed = 0;
    this.minSpeed = -0.1; // allow reverse, slower
    this.maxSpeed = 0.2; // slower max speed
    this.acceleration = 0.015;
    this.deceleration = 0.01;

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
    // Accelerate/decelerate
    if (this.keysPressed["w"]) {
      this.speed += this.acceleration;
    } else if (this.keysPressed["s"]) {
      this.speed -= this.acceleration;
    } else {
      // Smoothly decelerate to zero
      if (Math.abs(this.speed) > 0) {
        if (this.speed > 0) {
          this.speed -= this.deceleration;
          if (this.speed < 0.01) this.speed = 0;
        } else if (this.speed < 0) {
          this.speed += this.deceleration;
          if (this.speed > -0.01) this.speed = 0;
        }
      }
    }
    // Clamp speed
    this.speed = Math.max(this.minSpeed, Math.min(this.maxSpeed, this.speed));

    // Move forward/backward by speed
    this.group.position.z -= this.speed;

    // Expose stopped state for external use (e.g., background)
    this.stopped = this.speed === 0;

    // Left/right movement (instant, not speed-based)
    const step = 0.08;
    if (this.keysPressed["a"]) {
      this.group.position.x -= step;
    }
    if (this.keysPressed["d"]) {
      this.group.position.x += step;
    }
    // Clamp position to road width (-2.2 to 2.2)
    this.group.position.x = Math.max(
      -2.2,
      Math.min(2.2, this.group.position.x)
    );

    // Update speed display in UI as KPH
    const speedDisplay = document.getElementById("speed");
    if (speedDisplay) {
      speedDisplay.textContent = (this.speed * 500).toFixed(2);
    }
  }
}
