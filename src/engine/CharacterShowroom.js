import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { DetailedHumanModel } from './DetailedHumanModel.js';

export class CharacterShowroom {
  constructor(canvas, onCharacterLoaded) {
    this.canvas = canvas;
    this.onCharacterLoaded = onCharacterLoaded;

    // 1. Scene & Camera Setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0f1d, 0.015);

    this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 1.8, 5.2);
    this.targetLookAt = new THREE.Vector3(0, 1.5, 0);
    this.camera.lookAt(this.targetLookAt);

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.4;

    // Environment map for photorealistic PBR studio reflections (prevents black metal)
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    // 3. Studio Lighting & Pedestal Altar
    this.setupLighting();
    this.setupPedestal();
    this.setupParticles();

    // 4. Orbit Controls (Manual implementation for zero dependency bugs)
    this.setupControls();

    // 5. Clock & Render loop
    this.clock = new THREE.Clock();
    this.autoRotate = false;
    this.currentTribe = null;
    this.humanModel = null;
    this.gltfModel = null;
    this.mixer = null;
    this.gltfLoader = new GLTFLoader();

    // 6. Setup Drag & Drop .GLB File Import
    this.setupDragAndDrop();

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupDragAndDrop() {
    window.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    window.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        this.loadGLBFromFile(files[0]);
      }
    });
  }

  loadGLBFromFile(file) {
    if (!file.name.toLowerCase().endsWith('.glb') && !file.name.toLowerCase().endsWith('.gltf')) {
      alert('Por favor, envie um arquivo .glb ou .gltf!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result;
      this.gltfLoader.parse(contents, '', (gltf) => {
        this.displayGLTF(gltf);
      }, (err) => {
        console.error('Erro ao processar GLB:', err);
      });
    };
    reader.readAsArrayBuffer(file);
  }

  displayGLTF(gltf) {
    // Remove previous models
    if (this.humanModel) {
      this.scene.remove(this.humanModel.group);
      this.humanModel = null;
    }
    if (this.gltfModel) {
      this.scene.remove(this.gltfModel);
      this.gltfModel = null;
    }

    this.gltfModel = gltf.scene;

    // Enable shadows and adjust materials for vibrant studio presentation
    this.gltfModel.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        if (node.material) {
          const mat = node.material;
          mat.side = THREE.DoubleSide; // Render both sides of polygons

          // AI models often set metalness to 1.0 which makes them look black if no intense reflection is available
          if (mat.metalness > 0.4) {
            mat.metalness = 0.15;
          }
          if (mat.roughness < 0.3) {
            mat.roughness = 0.55;
          }

          // Ensure correct sRGB color encoding on texture maps
          if (mat.map) {
            mat.map.colorSpace = THREE.SRGBColorSpace;
          }
          mat.needsUpdate = true;
        }
      }
    });

    // Auto-scale and center on pedestal
    const box = new THREE.Box3().setFromObject(this.gltfModel);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const targetHeight = 2.4;
    const scale = targetHeight / (maxDim || 1);
    this.gltfModel.scale.set(scale, scale, scale);

    // Re-center on pedestal
    const newBox = new THREE.Box3().setFromObject(this.gltfModel);
    const center = newBox.getCenter(new THREE.Vector3());
    this.gltfModel.position.x -= center.x;
    this.gltfModel.position.z -= center.z;
    this.gltfModel.position.y = 0.25 - newBox.min.y;

    this.scene.add(this.gltfModel);

    // Setup Animations if available
    if (gltf.animations && gltf.animations.length > 0) {
      this.mixer = new THREE.AnimationMixer(this.gltfModel);
      const action = this.mixer.clipAction(gltf.animations[0]);
      action.play();
    }
  }

  setupLighting() {
    // Hemisphere Light for natural 360-degree ambient brightness
    const hemiLight = new THREE.HemisphereLight(0xfff7ed, 0x334155, 1.8);
    hemiLight.position.set(0, 15, 0);
    this.scene.add(hemiLight);

    // Ambient Soft Fill
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.85);
    this.scene.add(ambientLight);

    // Key Light (Main Gold Studio Light)
    this.keyLight = new THREE.DirectionalLight(0xffedd5, 1.8);
    this.keyLight.position.set(3.5, 5.5, 4.0);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.bias = -0.0003;
    this.scene.add(this.keyLight);

    // Rim Light (Crucial for anime/warrior silhouette definition)
    this.rimLight = new THREE.DirectionalLight(0x60a5fa, 1.2);
    this.rimLight.position.set(-3.5, 3.5, -4.0);
    this.scene.add(this.rimLight);

    // Front Warm Fill Light
    const fillLight = new THREE.DirectionalLight(0xfef08a, 0.6);
    fillLight.position.set(0, 1.5, 4.5);
    this.scene.add(fillLight);

    // Upward Pedestal Spot (Underglow)
    this.pedestalLight = new THREE.PointLight(0xf59e0b, 2.5, 7);
    this.pedestalLight.position.set(0, 0.4, 0);
    this.scene.add(this.pedestalLight);
  }

  setupPedestal() {
    this.pedestalGroup = new THREE.Group();

    // Base Tier (Dark Slate)
    const baseGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.25, 48);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.5,
      metalness: 0.3
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.125;
    base.receiveShadow = true;
    this.pedestalGroup.add(base);

    // Upper Tier (Polished Marble with Gold Inlay)
    const upperGeo = new THREE.CylinderGeometry(2.1, 2.3, 0.25, 48);
    const upperMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.25,
      metalness: 0.6
    });
    const upper = new THREE.Mesh(upperGeo, upperMat);
    upper.position.y = 0.125;
    upper.receiveShadow = true;
    this.pedestalGroup.add(upper);

    // Gold Outer Rim
    const goldRim = new THREE.Mesh(
      new THREE.TorusGeometry(2.15, 0.04, 8, 48),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.9, roughness: 0.15 })
    );
    goldRim.rotation.x = Math.PI / 2;
    goldRim.position.y = 0.25;
    this.pedestalGroup.add(goldRim);

    // Glowing Sacred Hebrew Inscription Ring
    const ringGeo = new THREE.RingGeometry(1.6, 1.85, 48);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.252;
    this.pedestalGroup.add(ringMesh);

    this.scene.add(this.pedestalGroup);

    // Background Studio Wall / Infinity Curve
    const bgGeo = new THREE.CylinderGeometry(18, 18, 18, 32, 1, true, -Math.PI * 0.5, Math.PI);
    const bgMat = new THREE.MeshStandardMaterial({
      color: 0x070b14,
      roughness: 0.85,
      side: THREE.BackSide
    });
    const bg = new THREE.Mesh(bgGeo, bgMat);
    bg.position.y = 8;
    this.scene.add(bg);
  }

  setupParticles() {
    // Sacred Floating Embers / Dust Motes
    this.particleCount = 60;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 1] = Math.random() * 4.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color: 0xfde047,
      size: 0.06,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  setupControls() {
    this.isDragging = false;
    this.prevMousePos = { x: 0, y: 0 };
    this.cameraAngle = { theta: 0, phi: Math.PI / 2 - 0.05, radius: 5.2 };

    const dom = this.canvas;

    dom.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.prevMousePos.x;
      const dy = e.clientY - this.prevMousePos.y;

      this.cameraAngle.theta -= dx * 0.007;
      this.cameraAngle.phi = THREE.MathUtils.clamp(
        this.cameraAngle.phi + dy * 0.007,
        0.2,
        Math.PI / 2 + 0.15
      );

      this.prevMousePos = { x: e.clientX, y: e.clientY };
      this.updateCameraOrbit();
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Zoom (Wheel)
    dom.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.cameraAngle.radius = THREE.MathUtils.clamp(
        this.cameraAngle.radius + e.deltaY * 0.005,
        1.8,
        7.5
      );
      this.updateCameraOrbit();
    });
  }

  updateCameraOrbit() {
    const { theta, phi, radius } = this.cameraAngle;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi) + this.targetLookAt.y;
    const z = radius * Math.sin(phi) * Math.cos(theta);

    this.camera.position.set(x, y, z);
    this.camera.lookAt(this.targetLookAt);
  }

  // Focus presets: 'full', 'face', 'weapon'
  setCameraPreset(preset) {
    if (preset === 'face') {
      this.targetLookAt.set(0, 2.3, 0);
      this.cameraAngle.radius = 2.0;
      this.cameraAngle.phi = Math.PI / 2 - 0.02;
    } else if (preset === 'weapon') {
      this.targetLookAt.set(0.65, 1.8, 0.2);
      this.cameraAngle.radius = 2.4;
      this.cameraAngle.phi = Math.PI / 2;
    } else {
      // Full body
      this.targetLookAt.set(0, 1.5, 0);
      this.cameraAngle.radius = 5.2;
      this.cameraAngle.phi = Math.PI / 2 - 0.05;
      this.cameraAngle.theta = 0;
    }
    this.updateCameraOrbit();
  }

  // Load and Display a Tribe Warrior
  loadTribe(tribeData) {
    this.currentTribe = tribeData;

    // Remove previous model
    if (this.humanModel) {
      this.scene.remove(this.humanModel.group);
    }

    // Build Detailed Human Model
    this.humanModel = new DetailedHumanModel(tribeData);
    this.humanModel.group.position.set(0, 0.25, 0);
    this.scene.add(this.humanModel.group);

    // Adjust light colors to match tribe theme
    if (this.pedestalLight) {
      this.pedestalLight.color.set(tribeData.colors.primary);
    }

    if (this.onCharacterLoaded) {
      this.onCharacterLoaded(tribeData);
    }
  }

  setAnimation(animName) {
    if (this.humanModel) {
      this.humanModel.setAnimation(animName);
    }
  }

  toggleAutoRotate() {
    this.autoRotate = !this.autoRotate;
    return this.autoRotate;
  }

  animate() {
    requestAnimationFrame(this.animate);
    const dt = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Auto Rotate
    if (this.autoRotate) {
      this.cameraAngle.theta += 0.4 * dt;
      this.updateCameraOrbit();
    }

    // Update Model Rig Animation
    if (this.humanModel) {
      this.humanModel.update(dt);
    }
    if (this.mixer) {
      this.mixer.update(dt);
    }

    // Animate Floating Sacred Particles
    if (this.particles) {
      const pos = this.particles.geometry.attributes.position.array;
      for (let i = 0; i < this.particleCount; i++) {
        pos[i * 3 + 1] += 0.4 * dt;
        if (pos[i * 3 + 1] > 4.5) {
          pos[i * 3 + 1] = 0.3;
        }
      }
      this.particles.geometry.attributes.position.needsUpdate = true;
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
