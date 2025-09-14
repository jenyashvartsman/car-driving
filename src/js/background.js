import * as THREE from "three";

export default class Background {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.speed = options.speed || 0.05;

    // Create a large plane for the road
    const geometry = new THREE.PlaneGeometry(10, 100);

    // Create a procedural road material using a shader
    const material = new THREE.ShaderMaterial({
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

    this.road = new THREE.Mesh(geometry, material);
    this.road.rotation.x = -Math.PI / 2;
    this.road.position.y = 0;
    this.road.position.z = 0;
    this.scene.add(this.road);

    this.material = material;
  }

  update(delta) {
    // Animate the road lines to simulate movement
    this.material.uniforms.time.value += this.speed * delta;
  }
}
