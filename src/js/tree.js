import * as THREE from "three";

export default class Tree {
  constructor() {
    this.group = new THREE.Group();
    this.createTrunk();
    this.createFoliage();
  }
  createTrunk() {
    const geometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const trunk = new THREE.Mesh(geometry, material);
    trunk.position.y = 0.5;
    this.group.add(trunk);
  }
  createFoliage() {
    const geometry = new THREE.ConeGeometry(0.5, 1, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const foliage = new THREE.Mesh(geometry, material);
    foliage.position.y = 1.5;
    this.group.add(foliage);
  }
  getObject3D() {
    return this.group;
  }
}
