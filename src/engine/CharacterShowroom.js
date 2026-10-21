import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
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
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 1.0;

    // Environment map for photorealistic PBR studio reflections (prevents black metal)
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.5;

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
    this.animationActions = {};
    this.currentAction = null;
    this.gltfLoader = new GLTFLoader();
    this.fbxLoader = new FBXLoader();

    // 6. Setup Drag & Drop .GLB and .FBX File Import
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
        this.loadModelFromFile(files[0]);
      }
    });
  }

  loadModelFromFile(file) {
    const ext = file.name.toLowerCase().split('.').pop();
    if (!['glb', 'gltf', 'fbx'].includes(ext)) {
      alert('Por favor, envie um arquivo .glb, .gltf ou .fbx!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const contents = e.target.result;
      if (ext === 'fbx') {
        try {
          const fbxObj = this.fbxLoader.parse(contents, '');
          this.displayGLTF({ scene: fbxObj, animations: fbxObj.animations });
        } catch (err) {
          console.error('Erro ao processar FBX:', err);
        }
      } else {
        this.gltfLoader.parse(contents, '', (gltf) => {
          this.displayGLTF(gltf);
        }, (err) => {
          console.error('Erro ao processar GLB:', err);
        });
      }
    };
    reader.readAsArrayBuffer(file);
  }

  loadGLBFromFile(file) {
    this.loadModelFromFile(file);
  }

  attachStaff(model) {
    let rightHand = null;
    model.traverse((node) => {
      if (node.isBone && node.name.toLowerCase().includes('righthand') && !node.name.toLowerCase().includes('thumb') && !node.name.toLowerCase().includes('index')) {
        rightHand = node;
      }
    });

    if (rightHand) {
      // Remove any previously attached staff
      const existingStaff = rightHand.getObjectByName('StaffOfJudah');
      if (existingStaff) rightHand.remove(existingStaff);

      const staffGroup = new THREE.Group();
      staffGroup.name = 'StaffOfJudah';

      // Staff Shaft (Gold and carved wood)
      const shaftGeo = new THREE.CylinderGeometry(0.015, 0.02, 1.8, 16);
      const shaftMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37, // Rich Royal Gold
        metalness: 0.85,
        roughness: 0.25
      });
      const shaft = new THREE.Mesh(shaftGeo, shaftMat);
      shaft.castShadow = true;
      staffGroup.add(shaft);

      // Staff Headpiece (Lion crest / Sceptre Crown)
      const crownGeo = new THREE.CylinderGeometry(0.05, 0.025, 0.16, 8);
      const crownMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.9,
        roughness: 0.2
      });
      const crown = new THREE.Mesh(crownGeo, crownMat);
      crown.position.y = 0.9;
      staffGroup.add(crown);

      // Sacred Gemstone (Glowing Sapphire/Lapis-Lazúli)
      const gemGeo = new THREE.OctahedronGeometry(0.055, 1);
      const gemMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.2
      });
      const gem = new THREE.Mesh(gemGeo, gemMat);
      gem.position.y = 1.02;
      staffGroup.add(gem);

      // Gem subtle point light
      const gemLight = new THREE.PointLight(0x38bdf8, 1.0, 1.8);
      gemLight.position.y = 1.02;
      staffGroup.add(gemLight);

      // Orientation relative to palm
      staffGroup.rotation.x = Math.PI / 2;
      staffGroup.position.set(0, 0, 0);

      rightHand.add(staffGroup);
    }
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
      if (node.isMesh && node.material) {
        node.castShadow = true;
        node.receiveShadow = true;

        const materials = Array.isArray(node.material) ? node.material : [node.material];
        materials.forEach((mat) => {
          mat.side = THREE.DoubleSide; // Render both sides of polygons

          // Neutralize unintended blinding emissive colors often exported by Mixamo / AI tools
          if (mat.emissive) {
            mat.emissive.set(0x000000);
          }

          // Balance HDR environment reflection intensity so cloth & skin stay matte and rich
          if (mat.envMapIntensity !== undefined) {
            mat.envMapIntensity = 0.4;
          }

          // Ensure correct sRGB color encoding on texture maps
          if (mat.map) {
            mat.map.colorSpace = THREE.SRGBColorSpace;
          }
          mat.needsUpdate = true;
        });
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

    // Attach rigid weapon/staff prop to right hand
    this.attachStaff(this.gltfModel);

    // Setup Animations
    this.animationActions = {};
    this.currentAction = null;

    if (gltf.animations && gltf.animations.length > 0) {
      this.mixer = new THREE.AnimationMixer(this.gltfModel);

      gltf.animations.forEach((clip) => {
        const action = this.mixer.clipAction(clip);
        const nameLower = clip.name.toLowerCase();
        this.animationActions[nameLower] = action;
        this.animationActions[clip.name] = action;
      });

      // Map canonical actions
      const findAction = (...keys) => {
        for (const k of keys) {
          const match = Object.keys(this.animationActions).find(name => name.toLowerCase().includes(k.toLowerCase()));
          if (match) return this.animationActions[match];
        }
        return null;
      };

      const idleAction = findAction('idle') || this.mixer.clipAction(gltf.animations[0]);
      const walkAction = findAction('walk', 'run', 'great sword walk') || idleAction;
      const attackAction = findAction('cast', 'attack', 'sword', 'ground') || idleAction;
      const roarAction = findAction('roar', 'taunt', 'victory') || attackAction;

      this.animationActions['idle'] = idleAction;
      this.animationActions['combat'] = walkAction;
      this.animationActions['walk'] = walkAction;
      this.animationActions['attack'] = attackAction;
      this.animationActions['cast'] = attackAction;
      this.animationActions['victory'] = roarAction;
      this.animationActions['awakening'] = roarAction;

      // Start playing idle animation
      this.currentAction = idleAction;
      this.currentAction.play();
    }
  }

  setupLighting() {
    // Ambient Soft Fill (Kept low to let ambient occlusion and natural shadows emerge)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);

    // Hemisphere Light for natural sky/ground bounce without blowing out highlights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x1e293b, 0.35);
    hemiLight.position.set(0, 15, 0);
    this.scene.add(hemiLight);

    // Key Light (Clean neutral studio light providing clear directional contrast and depth)
    this.keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    this.keyLight.position.set(2.5, 4.5, 3.5);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.bias = -0.0003;
    this.scene.add(this.keyLight);

    // Rim Light (Subtle edge separation from background)
    this.rimLight = new THREE.DirectionalLight(0x93c5fd, 0.35);
    this.rimLight.position.set(-3.0, 3.0, -3.5);
    this.scene.add(this.rimLight);

    // Upward Pedestal Spot (Gentle floor underglow)
    this.pedestalLight = new THREE.PointLight(0xf59e0b, 0.4, 3);
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

    // Adjust light colors to match tribe theme
    if (this.pedestalLight) {
      this.pedestalLight.color.set(tribeData.colors.primary);
    }

    if (this.onCharacterLoaded) {
      this.onCharacterLoaded(tribeData);
    }

    // If Judá, load our newly unified .glb with all 4 animations & textures
    if (tribeData.id === 'judah') {
      this.gltfLoader.load('/judah.glb', (gltf) => {
        this.displayGLTF(gltf);
      }, undefined, (err) => {
        console.warn('Fallback to procedural model:', err);
        this.loadProceduralModel(tribeData);
      });
    } else {
      this.loadProceduralModel(tribeData);
    }
  }

  loadProceduralModel(tribeData) {
    // Remove previous models
    if (this.humanModel) {
      this.scene.remove(this.humanModel.group);
      this.humanModel = null;
    }
    if (this.gltfModel) {
      this.scene.remove(this.gltfModel);
      this.gltfModel = null;
    }

    // Build Detailed Human Model
    this.humanModel = new DetailedHumanModel(tribeData);
    this.humanModel.group.position.set(0, 0.25, 0);
    this.scene.add(this.humanModel.group);
  }

  setAnimation(animName) {
    if (this.humanModel) {
      this.humanModel.setAnimation(animName);
    }

    if (this.mixer && this.animationActions) {
      const animKey = animName.toLowerCase();
      let target = this.animationActions[animKey];
      if (!target) {
        if (animKey === 'combat') target = this.animationActions['walk'] || this.animationActions['idle'];
        else if (animKey === 'attack') target = this.animationActions['cast'] || this.animationActions['attack'];
        else if (animKey === 'victory' || animKey === 'awakening') target = this.animationActions['roar'] || this.animationActions['victory'];
        else target = this.animationActions['idle'];
      }

      if (target && this.currentAction !== target) {
        if (this.currentAction) {
          this.currentAction.fadeOut(0.35);
        }
        target.reset().fadeIn(0.35).play();
        this.currentAction = target;
      }
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
