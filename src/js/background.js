import * as THREE from "three";

export default class Background {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.speed = options.speed || 0.05;

    // Make these global to the class
    this.roadGeometry = new THREE.PlaneGeometry(10, 100);
    this.roadMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
      },
      vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
      fragmentShader: `
                uniform float time;
                varying vec2 vUv;
                void main() {
                    // Road base color
                    vec3 roadColor = vec3(0.1, 0.1, 0.1);

                    // Lane markings
                    float lane = step(0.48, abs(vUv.x - 0.5)) * step(abs(mod(vUv.y + time, 0.2) - 0.1), 0.02);
                    vec3 laneColor = mix(roadColor, vec3(1.0, 1.0, 0.8), lane);

                    // Center dashed line
                    float centerLine = step(abs(vUv.x - 0.5), 0.05) * step(abs(mod(vUv.y + time, 0.1) - 0.05), 0.02);
                    laneColor = mix(laneColor, vec3(1.0, 1.0, 1.0), centerLine);

                    gl_FragColor = vec4(laneColor, 1.0);
                }
            `,
    });

    this.road = new THREE.Mesh(this.roadGeometry, this.roadMaterial);
    this.road.rotation.x = -Math.PI / 2;
    this.road.position.y = 0;
    this.road.position.z = 0;
    this.scene.add(this.road);

    this.material = this.roadMaterial;

    // Tree geometry/materials global to class
    this.trunkGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.6, 8);
    this.trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b5a2b });
    this.foliageGeometry = new THREE.SphereGeometry(0.4, 8, 8);
    this.foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });

    // Add trees
    this.trees = [];
    this.treeCount = 30;
    this.roadLength = 100;
    this.spawnTrees();
  }

  update(delta) {
    // Animate the road lines to simulate movement
    this.material.uniforms.time.value += this.speed * delta;

    // Move trees toward the camera
    for (let tree of this.trees) {
      tree.position.z += this.speed * 80 * delta;
      if (tree.position.z > 5) {
        // Reset tree to far end and place further from road
        tree.position.z = -this.roadLength / 2 + Math.random() * 10;
        tree.position.x =
          (Math.random() < 0.5 ? -1 : 1) * (10 + Math.random() * 2);
      }
    }
  }

  spawnTrees() {
    for (let i = 0; i < this.treeCount; i++) {
      const tree = this.createTree();
      tree.position.z = -this.roadLength / 2 + Math.random() * this.roadLength;
      // Place trees further from the road (e.g., 4 to 6 units from center)
      tree.position.x =
        (Math.random() < 0.5 ? -1 : 1) * (10 + Math.random() * 2);
      tree.position.y = 0.5;
      this.scene.add(tree);
      this.trees.push(tree);
    }
  }

  createTree() {
    const group = new THREE.Group();
    // Trunk
    const trunk = new THREE.Mesh(this.trunkGeometry, this.trunkMaterial);
    trunk.position.y = 0.3;
    group.add(trunk);
    // Foliage
    const foliage = new THREE.Mesh(this.foliageGeometry, this.foliageMaterial);
    foliage.position.y = 0.8;
    group.add(foliage);
    return group;
  }
}
