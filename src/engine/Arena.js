import * as THREE from 'three';

export class Arena {
  constructor(scene) {
    this.scene = scene;
    this.radius = 28;
    this.flames = [];
    this.boundaryRipples = [];

    this.createSkyAndLighting();
    this.createPlatform();
    this.createPillars();
    this.createBraziers();
    this.createBoundaryRing();
  }

  createSkyAndLighting() {
    // Ambient light with warm desert tone
    const ambientLight = new THREE.AmbientLight(0xffecd2, 0.7);
    this.scene.add(ambientLight);

    // Directional sunlight casting crisp anime shadows
    const sunLight = new THREE.DirectionalLight(0xfff5e6, 1.4);
    sunLight.position.set(25, 45, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 120;
    const d = 35;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    this.scene.add(sunLight);

    // Rim light from opposite direction (essential for anime cel-shading look)
    const rimLight = new THREE.DirectionalLight(0x60a5fa, 0.6);
    rimLight.position.set(-25, 20, -25);
    this.scene.add(rimLight);

    // Dynamic skydome gradient
    const skyGeo = new THREE.SphereGeometry(150, 32, 16);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(0x1e3a8a) }, // Deep royal twilight blue
        bottomColor: { value: new THREE.Color(0xf59e0b) }, // Warm desert gold horizon
        offset: { value: 15 },
        exponent: { value: 0.6 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
        }
      `,
      side: THREE.BackSide
    });
    this.skyMesh = new THREE.Mesh(skyGeo, skyMat);
    this.scene.add(this.skyMesh);

    // Distant mountain dunes
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const dist = 75 + Math.random() * 20;
      const height = 15 + Math.random() * 20;
      const width = 25 + Math.random() * 20;
      const duneGeo = new THREE.ConeGeometry(width, height, 5);
      const duneMat = new THREE.MeshStandardMaterial({
        color: 0x78350f,
        roughness: 0.9,
        flatShading: true
      });
      const dune = new THREE.Mesh(duneGeo, duneMat);
      dune.position.set(Math.cos(angle) * dist, height / 2 - 4, Math.sin(angle) * dist);
      dune.scale.set(1.5, 1, 1.2);
      this.scene.add(dune);
    }
  }

  createPlatform() {
    // 1. Surrounding desert ground plane
    const groundGeo = new THREE.PlaneGeometry(250, 250);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.95,
      metalness: 0.05
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // 2. Ancient elevated combat platform
    const platformGeo = new THREE.CylinderGeometry(this.radius, this.radius + 1.5, 1.2, 48);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.4,
      metalness: 0.1,
      flatShading: false
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.y = 0;
    platform.receiveShadow = true;
    this.scene.add(platform);

    // 3. Central Sacred Seal (Star of David + 12 Rays emblem)
    const sealGroup = new THREE.Group();
    sealGroup.position.y = 0.61;

    // Outer gold ring
    const ringGeo = new THREE.RingGeometry(8, 8.4, 64);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.8,
      roughness: 0.2,
      emissive: 0x78350f,
      emissiveIntensity: 0.3,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, goldMat);
    ringMesh.rotation.x = -Math.PI / 2;
    sealGroup.add(ringMesh);

    // Inner gold ring
    const innerRingGeo = new THREE.RingGeometry(3.5, 3.8, 64);
    const innerRingMesh = new THREE.Mesh(innerRingGeo, goldMat);
    innerRingMesh.rotation.x = -Math.PI / 2;
    sealGroup.add(innerRingMesh);

    // 12 Sun Rays / Tribal Marks
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const rayGeo = new THREE.PlaneGeometry(0.3, 4.2);
      const ray = new THREE.Mesh(rayGeo, goldMat);
      ray.rotation.x = -Math.PI / 2;
      ray.rotation.z = angle;
      ray.position.set(Math.cos(angle) * 5.8, 0, Math.sin(angle) * 5.8);
      sealGroup.add(ray);
    }

    // Two Interlocking Triangles
    const triShape = new THREE.Shape();
    const r = 3.2;
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) triShape.moveTo(x, y);
      else triShape.lineTo(x, y);
    }
    triShape.closePath();

    const triGeo1 = new THREE.ShapeGeometry(triShape);
    const triMesh1 = new THREE.Mesh(triGeo1, goldMat);
    triMesh1.rotation.x = -Math.PI / 2;
    sealGroup.add(triMesh1);

    const triGeo2 = new THREE.ShapeGeometry(triShape);
    const triMesh2 = new THREE.Mesh(triGeo2, goldMat);
    triMesh2.rotation.x = -Math.PI / 2;
    triMesh2.rotation.z = Math.PI;
    sealGroup.add(triMesh2);

    this.scene.add(sealGroup);
  }

  createPillars() {
    // 12 Ancient Pillars representing the 12 Tribes
    const tribeNames = [
      'JUDAH', 'BENJAMIN', 'DAN', 'NAPHTALI', 'LEVI', 'ZEBULUN',
      'ISSACHAR', 'GAD', 'ASHER', 'REUBEN', 'SIMEON', 'JOSEPH'
    ];

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const pillarDist = this.radius + 3.5;
      const x = Math.cos(angle) * pillarDist;
      const z = Math.sin(angle) * pillarDist;

      const pillarGroup = new THREE.Group();
      pillarGroup.position.set(x, 0, z);

      // Base
      const baseGeo = new THREE.BoxGeometry(2.4, 1.2, 2.4);
      const stoneMat = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        roughness: 0.6,
        metalness: 0.1
      });
      const base = new THREE.Mesh(baseGeo, stoneMat);
      base.castShadow = true;
      base.receiveShadow = true;
      pillarGroup.add(base);

      // Shaft
      const shaftGeo = new THREE.CylinderGeometry(0.8, 0.95, 8.5, 12);
      const shaft = new THREE.Mesh(shaftGeo, stoneMat);
      shaft.position.y = 4.8;
      shaft.castShadow = true;
      shaft.receiveShadow = true;
      pillarGroup.add(shaft);

      // Glowing Tribal Rune band
      const runeGeo = new THREE.CylinderGeometry(0.83, 0.83, 1.2, 12);
      const runeMat = new THREE.MeshStandardMaterial({
        color: i === 0 ? 0xf59e0b : (i === 1 ? 0x9333ea : 0x06b6d4),
        emissive: i === 0 ? 0xf59e0b : (i === 1 ? 0x9333ea : 0x06b6d4),
        emissiveIntensity: 0.9,
        roughness: 0.2
      });
      const rune = new THREE.Mesh(runeGeo, runeMat);
      rune.position.y = 5.5;
      pillarGroup.add(rune);

      // Capital / Top
      const topGeo = new THREE.BoxGeometry(2.2, 0.8, 2.2);
      const top = new THREE.Mesh(topGeo, stoneMat);
      top.position.y = 9.4;
      top.castShadow = true;
      pillarGroup.add(top);

      this.scene.add(pillarGroup);
    }
  }

  createBraziers() {
    // 6 Burning Sacred Fire Braziers along the perimeter
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2 + Math.PI / 12;
      const dist = this.radius - 1.5;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;

      const brazierGroup = new THREE.Group();
      brazierGroup.position.set(x, 0.6, z);

      // Bronze bowl
      const bowlGeo = new THREE.CylinderGeometry(1.2, 0.5, 1.4, 8);
      const bowlMat = new THREE.MeshStandardMaterial({
        color: 0x451a03,
        metalness: 0.8,
        roughness: 0.3
      });
      const bowl = new THREE.Mesh(bowlGeo, bowlMat);
      bowl.position.y = 0.7;
      brazierGroup.add(bowl);

      // Fire Point Light
      const fireLight = new THREE.PointLight(0xf97316, 1.5, 15);
      fireLight.position.set(0, 2.2, 0);
      brazierGroup.add(fireLight);

      // Procedural 3D Fire Flame Mesh
      const flameGeo = new THREE.ConeGeometry(0.7, 1.8, 8);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        wireframe: false
      });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.y = 2.0;
      brazierGroup.add(flame);

      this.flames.push({ mesh: flame, light: fireLight, baseScale: 1.0 });
      this.scene.add(brazierGroup);
    }
  }

  createBoundaryRing() {
    // Energy barrier ring visible when fighters get close to edge
    const barrierGeo = new THREE.CylinderGeometry(this.radius, this.radius, 4, 64, 1, true);
    const barrierMat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        barrierColor: { value: new THREE.Color(0xf59e0b) },
        opacityFactor: { value: 0.15 }
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
        uniform vec3 barrierColor;
        uniform float opacityFactor;
        varying vec2 vUv;
        void main() {
          float grid = sin(vUv.x * 120.0 + time * 3.0) * cos(vUv.y * 30.0);
          float alpha = smoothstep(0.0, 0.8, vUv.y) * (1.0 - smoothstep(0.8, 1.0, vUv.y));
          gl_FragColor = vec4(barrierColor, (alpha * 0.4 + grid * 0.1) * opacityFactor);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    this.barrierMesh = new THREE.Mesh(barrierGeo, barrierMat);
    this.barrierMesh.position.y = 2.5;
    this.scene.add(this.barrierMesh);
  }

  // Clamps player within arena radius
  clampPosition(pos) {
    const len = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
    const maxR = this.radius - 1.2;
    if (len > maxR) {
      pos.x = (pos.x / len) * maxR;
      pos.z = (pos.z / len) * maxR;
      return true; // Hit boundary
    }
    return false;
  }

  update(dt, time) {
    // Animate flames
    for (let f of this.flames) {
      const flicker = 1.0 + Math.sin(time * 12 + Math.random()) * 0.18;
      f.mesh.scale.set(flicker, flicker * (1.0 + Math.cos(time * 15) * 0.15), flicker);
      f.light.intensity = 1.4 + Math.sin(time * 8) * 0.4;
    }

    // Animate barrier shader
    if (this.barrierMesh) {
      this.barrierMesh.material.uniforms.time.value = time;
    }
  }
}
