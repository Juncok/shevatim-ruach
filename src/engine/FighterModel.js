import * as THREE from 'three';

export class FighterModel {
  constructor(scene, tribe = 'judah') {
    this.scene = scene;
    this.tribe = tribe;
    this.group = new THREE.Group();

    // Visual Palette & Config
    if (tribe === 'judah') {
      this.primaryColor = 0xf59e0b;     // Gold
      this.armorColor = 0xb45309;       // Bronze/Copper
      this.clothColor = 0x1d4ed8;       // Royal Blue
      this.glowColor = 0xfbbf24;        // Radiant Gold
      this.weaponType = 'scepter';
    } else {
      this.primaryColor = 0xa855f7;     // Purple
      this.armorColor = 0x334155;       // Slate Dark Steel
      this.clothColor = 0x1e1b4b;       // Midnight Shadow
      this.glowColor = 0xc084fc;        // Violet Light
      this.weaponType = 'daggers';
    }

    this.animTime = 0;
    this.animState = 'idle';
    this.buildRig();
    this.scene.add(this.group);
  }

  buildRig() {
    // Stylized Anime Toon Material
    const armorMat = new THREE.MeshStandardMaterial({
      color: this.armorColor,
      metalness: 0.65,
      roughness: 0.25
    });

    const clothMat = new THREE.MeshStandardMaterial({
      color: this.clothColor,
      roughness: 0.7,
      metalness: 0.1
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.glowColor,
      emissiveIntensity: 0.35,
      metalness: 0.8,
      roughness: 0.2
    });

    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      roughness: 0.6
    });

    // 1. Root / Pelvis
    this.hips = new THREE.Group();
    this.hips.position.y = 1.6;
    this.group.add(this.hips);

    const pelvisGeo = new THREE.BoxGeometry(0.75, 0.45, 0.5);
    const pelvis = new THREE.Mesh(pelvisGeo, armorMat);
    pelvis.castShadow = true;
    this.hips.add(pelvis);

    // 2. Torso / Cuirass
    this.torso = new THREE.Group();
    this.torso.position.y = 0.45;
    this.hips.add(this.torso);

    const chestGeo = new THREE.BoxGeometry(0.9, 0.85, 0.55);
    const chest = new THREE.Mesh(chestGeo, armorMat);
    chest.castShadow = true;
    this.torso.add(chest);

    // Glowing Tribal Emblem on chest
    const emblemGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.08, 6);
    const emblem = new THREE.Mesh(emblemGeo, goldMat);
    emblem.rotation.x = Math.PI / 2;
    emblem.position.set(0, 0.1, 0.29);
    this.torso.add(emblem);

    // 3. Head & Headdress
    this.head = new THREE.Group();
    this.head.position.y = 0.75;
    this.torso.add(this.head);

    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.52, 0.48), skinMat);
    headMesh.castShadow = true;
    this.head.add(headMesh);

    // Tribal Headdress (Judah Crown/Mane or Benjamin Wolf Cowl)
    if (this.tribe === 'judah') {
      const crownGeo = new THREE.ConeGeometry(0.35, 0.5, 5);
      const crown = new THREE.Mesh(crownGeo, goldMat);
      crown.position.set(0, 0.45, -0.05);
      this.head.add(crown);

      // Lion headdress side wings
      const earL = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 4), goldMat);
      earL.position.set(-0.3, 0.35, 0);
      earL.rotation.z = 0.5;
      const earR = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.35, 4), goldMat);
      earR.position.set(0.3, 0.35, 0);
      earR.rotation.z = -0.5;
      this.head.add(earL);
      this.head.add(earR);
    } else {
      // Benjamin Wolf Cowl / Ears
      const earL = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 4), armorMat);
      earL.position.set(-0.25, 0.42, -0.05);
      earL.rotation.z = 0.3;
      const earR = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.4, 4), armorMat);
      earR.position.set(0.25, 0.42, -0.05);
      earR.rotation.z = -0.3;
      this.head.add(earL);
      this.head.add(earR);
    }

    // Glowing Eyes
    const eyeMat = new THREE.MeshBasicMaterial({ color: this.glowColor });
    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.05), eyeMat);
    eyeL.position.set(-0.13, 0.05, 0.25);
    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.05, 0.05), eyeMat);
    eyeR.position.set(0.13, 0.05, 0.25);
    this.head.add(eyeL);
    this.head.add(eyeR);

    // 4. Flowing Cape (Back of torso)
    this.cape = new THREE.Group();
    this.cape.position.set(0, 0.35, -0.3);
    const capeGeo = new THREE.PlaneGeometry(0.9, 1.6, 2, 4);
    const capeMesh = new THREE.Mesh(capeGeo, clothMat);
    capeMesh.position.set(0, -0.8, 0);
    capeMesh.castShadow = true;
    this.cape.add(capeMesh);
    this.torso.add(this.cape);

    // 5. Arms & Shoulders
    // Left Arm
    this.shoulderL = new THREE.Group();
    this.shoulderL.position.set(-0.62, 0.3, 0);
    const pauldronL = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.42), goldMat);
    this.shoulderL.add(pauldronL);

    this.armL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.65, 0.24), armorMat);
    this.armL.position.y = -0.4;
    this.shoulderL.add(this.armL);
    this.torso.add(this.shoulderL);

    // Right Arm (Weapon Arm)
    this.shoulderR = new THREE.Group();
    this.shoulderR.position.set(0.62, 0.3, 0);
    const pauldronR = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.42), goldMat);
    this.shoulderR.add(pauldronR);

    this.armR = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.65, 0.24), armorMat);
    this.armR.position.y = -0.4;
    this.shoulderR.add(this.armR);
    this.torso.add(this.shoulderR);

    // 6. Weapons
    if (this.tribe === 'judah') {
      // Golden Scepter of Judah (Cetro de Judá)
      this.weapon = new THREE.Group();
      this.weapon.position.set(0, -0.4, 0.2);

      // Shaft
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 1.8, 8), goldMat);
      shaft.castShadow = true;
      this.weapon.add(shaft);

      // Scepter Lion Head Ornament
      const head = new THREE.Mesh(new THREE.DodecahedronGeometry(0.22), goldMat);
      head.position.y = 0.9;
      this.weapon.add(head);

      // Glowing Aura Crystal
      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.14),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      crystal.position.y = 0.9;
      this.weapon.add(crystal);

      this.armR.add(this.weapon);
    } else {
      // Dual Obsidian Daggers (Adagas de Benjamim)
      this.weaponR = new THREE.Group();
      this.weaponR.position.set(0, -0.35, 0.2);
      const bladeGeo = new THREE.ConeGeometry(0.08, 0.9, 4);
      bladeGeo.rotateX(Math.PI);
      const bladeR = new THREE.Mesh(bladeGeo, goldMat);
      this.weaponR.add(bladeR);
      this.armR.add(this.weaponR);

      this.weaponL = new THREE.Group();
      this.weaponL.position.set(0, -0.35, 0.2);
      const bladeL = new THREE.Mesh(bladeGeo, goldMat);
      this.weaponL.add(bladeL);
      this.armL.add(this.weaponL);
    }

    // 7. Legs
    // Left Leg
    this.thighL = new THREE.Group();
    this.thighL.position.set(-0.25, -0.2, 0);
    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.75, 0.32), armorMat);
    legL.position.y = -0.4;
    legL.castShadow = true;
    this.thighL.add(legL);
    this.hips.add(this.thighL);

    // Right Leg
    this.thighR = new THREE.Group();
    this.thighR.position.set(0.25, -0.2, 0);
    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.75, 0.32), armorMat);
    legR.position.y = -0.4;
    legR.castShadow = true;
    this.thighR.add(legR);
    this.hips.add(this.thighR);
  }

  // Set Animation State
  setAnimation(state, speed = 1.0) {
    if (this.animState !== state) {
      this.animState = state;
      this.animTime = 0;
    }
  }

  // Update Procedural Rig Animations
  update(dt, isAwakened = false) {
    this.animTime += dt;
    const t = this.animTime;

    // Reset base transforms
    this.torso.rotation.set(0, 0, 0);
    this.head.rotation.set(0, 0, 0);
    this.shoulderL.rotation.set(0, 0, 0);
    this.shoulderR.rotation.set(0, 0, 0);
    this.thighL.rotation.set(0, 0, 0);
    this.thighR.rotation.set(0, 0, 0);
    this.hips.position.y = 1.6;

    // Cape flutter physics
    this.cape.rotation.x = Math.sin(t * 8) * 0.15 + (this.animState === 'dash' ? 0.8 : (this.animState === 'run' ? 0.4 : 0.05));

    switch (this.animState) {
      case 'idle':
        // Breathing bounce
        const bounce = Math.sin(t * 4) * 0.04;
        this.hips.position.y = 1.6 + bounce;
        this.torso.rotation.x = 0.05 + bounce * 0.5;
        this.head.rotation.x = -0.05;
        this.shoulderL.rotation.x = 0.2 + bounce;
        this.shoulderR.rotation.x = -0.2 - bounce;
        this.shoulderL.rotation.z = -0.15;
        this.shoulderR.rotation.z = 0.15;
        break;

      case 'run':
        // Dynamic Ninja Run
        const runCycle = t * 14;
        this.hips.position.y = 1.55 + Math.abs(Math.sin(runCycle)) * 0.1;
        this.torso.rotation.x = 0.28; // Lean forward
        this.thighL.rotation.x = Math.sin(runCycle) * 0.85;
        this.thighR.rotation.x = -Math.sin(runCycle) * 0.85;
        this.shoulderL.rotation.x = -Math.sin(runCycle) * 0.7;
        this.shoulderR.rotation.x = Math.sin(runCycle) * 0.7;
        break;

      case 'dash':
        // Ruach / Chakra Dash (Aerodynamic flight pose)
        this.hips.position.y = 1.45;
        this.torso.rotation.x = 0.65; // Heavy forward tilt
        this.head.rotation.x = -0.45;  // Look up at target
        this.shoulderL.rotation.x = -0.8;
        this.shoulderR.rotation.x = -0.9;
        this.shoulderL.rotation.z = -0.4;
        this.shoulderR.rotation.z = 0.4;
        this.thighL.rotation.x = 0.3;
        this.thighR.rotation.x = -0.5;
        break;

      case 'attack1':
        // Quick Horizontal Slash
        const a1 = Math.min(t * 12, 1);
        this.torso.rotation.y = Math.sin(a1 * Math.PI) * 0.7;
        this.shoulderR.rotation.x = 0.5 + Math.sin(a1 * Math.PI) * 1.5;
        this.shoulderR.rotation.y = -Math.sin(a1 * Math.PI) * 1.2;
        break;

      case 'attack2':
        // Rising Uppercut Slash
        const a2 = Math.min(t * 12, 1);
        this.torso.rotation.x = -Math.sin(a2 * Math.PI) * 0.4;
        this.shoulderR.rotation.x = -1.2 + Math.sin(a2 * Math.PI) * 2.2;
        this.shoulderL.rotation.x = 0.5;
        break;

      case 'attack3':
        // Spinning Strike
        const a3 = Math.min(t * 10, 1);
        this.torso.rotation.y = a3 * Math.PI * 2;
        this.shoulderR.rotation.z = 1.2;
        this.shoulderL.rotation.z = -1.2;
        break;

      case 'finisher':
        // Massive Downward Hammer Slam
        const fin = Math.min(t * 8, 1);
        this.hips.position.y = 1.35;
        this.torso.rotation.x = Math.sin(fin * Math.PI) * 0.8;
        this.shoulderR.rotation.x = 1.8 - Math.sin(fin * Math.PI) * 2.5;
        this.shoulderL.rotation.x = 1.8 - Math.sin(fin * Math.PI) * 2.5;
        break;

      case 'airAttack':
        // Downward Aerial Dive
        this.torso.rotation.x = 0.9;
        this.shoulderR.rotation.x = 2.0;
        this.thighL.rotation.x = -0.4;
        this.thighR.rotation.x = -0.6;
        break;

      case 'guard':
        // Defensive Cross Guard
        this.hips.position.y = 1.45;
        this.torso.rotation.x = 0.15;
        this.shoulderL.rotation.x = 0.9;
        this.shoulderR.rotation.x = 0.9;
        this.shoulderL.rotation.z = 0.4;
        this.shoulderR.rotation.z = -0.4;
        break;

      case 'hit':
        // Flinch Backwards
        this.torso.rotation.x = -0.4;
        this.head.rotation.x = 0.3;
        this.shoulderL.rotation.x = -0.6;
        this.shoulderR.rotation.x = -0.6;
        break;

      case 'knockback':
        // Airborne Knockback
        this.hips.position.y = 1.8;
        this.torso.rotation.x = -0.8;
        this.shoulderL.rotation.x = -1.2;
        this.shoulderR.rotation.x = -1.2;
        this.thighL.rotation.x = -0.5;
        this.thighR.rotation.x = -0.5;
        break;

      case 'charge':
        // Ruach / Chakra Charging (crouched, pulsing)
        const pulse = Math.sin(t * 25) * 0.05;
        this.hips.position.y = 1.35 + pulse;
        this.torso.rotation.x = 0.35;
        this.shoulderL.rotation.x = 0.4;
        this.shoulderR.rotation.x = 0.4;
        this.shoulderL.rotation.z = -0.5;
        this.shoulderR.rotation.z = 0.5;
        this.thighL.rotation.z = -0.25;
        this.thighR.rotation.z = 0.25;
        break;

      case 'ultimate':
        // Lifting Scepter to Heavens with Holy Light
        this.torso.rotation.x = -0.25;
        this.head.rotation.x = -0.4;
        this.shoulderR.rotation.x = 2.8; // Raised arm to sky
        this.shoulderR.rotation.z = 0.2;
        this.shoulderL.rotation.x = -0.3;
        break;
    }

    // Awakening Aura Glow Pulsing
    if (isAwakened) {
      const glowScale = 1.0 + Math.sin(t * 12) * 0.04;
      this.group.scale.set(glowScale, glowScale, glowScale);
    } else {
      this.group.scale.set(1, 1, 1);
    }
  }
}
