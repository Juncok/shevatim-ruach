import * as THREE from 'three';

export class VFX {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.shockwaves = [];
    this.slashArcs = [];
    this.projectiles = [];
    this.spectralLion = null;

    this.createSpectralLionMesh();
  }

  // Create the Colossal Golden Lion Avatar for Judah's Ultimate Jutsu
  createSpectralLionMesh() {
    this.lionGroup = new THREE.Group();
    this.lionGroup.visible = false;

    // Glowing ethereal golden material
    const lionMat = new THREE.MeshBasicMaterial({
      color: 0xfef08a,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });

    const lionSolidMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xfbbf24,
      emissiveIntensity: 1.5,
      transparent: true,
      opacity: 0.65,
      roughness: 0.2
    });

    // Lion Head / Jaws
    const headGeo = new THREE.ConeGeometry(2.5, 4.0, 7);
    const head = new THREE.Mesh(headGeo, lionSolidMat);
    head.rotation.x = Math.PI / 2;
    head.position.set(0, 3.5, 3.5);
    this.lionGroup.add(head);

    // Lion Mane (Spikes)
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const maneGeo = new THREE.ConeGeometry(0.8, 3.2, 4);
      const maneSpike = new THREE.Mesh(maneGeo, lionMat);
      maneSpike.position.set(Math.cos(a) * 3.2, 3.5 + Math.sin(a) * 3.2, 1.5);
      maneSpike.rotation.z = a - Math.PI / 2;
      this.lionGroup.add(maneSpike);
    }

    // Glowing Eyes
    const eyeGeo = new THREE.SphereGeometry(0.4, 8, 8);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-1.0, 4.5, 4.2);
    const eyeR = new THREE.Mesh(eyeGeo, eyeMat);
    eyeR.position.set(1.0, 4.5, 4.2);
    this.lionGroup.add(eyeL);
    this.lionGroup.add(eyeR);

    // Front Spectral Paws
    const pawGeo = new THREE.BoxGeometry(1.6, 2.5, 2.8);
    const pawL = new THREE.Mesh(pawGeo, lionSolidMat);
    pawL.position.set(-2.8, 1.5, 3.0);
    const pawR = new THREE.Mesh(pawGeo, lionSolidMat);
    pawR.position.set(2.8, 1.5, 3.0);
    this.lionGroup.add(pawL);
    this.lionGroup.add(pawR);

    this.scene.add(this.lionGroup);
  }

  // Trigger Spectral Lion Ultimate Charge
  triggerSpectralLion(startPos, targetPos, onHit) {
    this.lionGroup.position.copy(startPos);
    this.lionGroup.visible = true;
    this.lionGroup.scale.set(0.1, 0.1, 0.1);

    const dir = new THREE.Vector3().subVectors(targetPos, startPos).normalize();
    this.lionGroup.lookAt(targetPos.x, targetPos.y + 1, targetPos.z);

    this.lionAnim = {
      progress: 0,
      startPos: startPos.clone(),
      targetPos: targetPos.clone(),
      onHit: onHit,
      hitTriggered: false
    };
  }

  // Expanding Anime Shockwave Ring
  createShockwave(pos, color = 0xfbbf24, maxRadius = 5.0, duration = 0.35) {
    const geo = new THREE.RingGeometry(0.1, 0.6, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
      depthWrite: false
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.copy(pos);
    mesh.rotation.x = -Math.PI / 2;
    this.scene.add(mesh);

    this.shockwaves.push({
      mesh,
      maxRadius,
      duration,
      age: 0
    });
  }

  // Hit Spark Explosion (Sparks fly radially on impact)
  createHitSparks(pos, color = 0xfef08a, count = 18) {
    for (let i = 0; i < count; i++) {
      const geo = new THREE.SphereGeometry(0.1 + Math.random() * 0.12, 4, 4);
      const mat = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 1
      });
      const spark = new THREE.Mesh(geo, mat);
      spark.position.copy(pos);

      const angle = Math.random() * Math.PI * 2;
      const elev = (Math.random() - 0.2) * Math.PI;
      const speed = 6 + Math.random() * 12;
      const vel = new THREE.Vector3(
        Math.cos(angle) * Math.cos(elev) * speed,
        Math.sin(elev) * speed + 3,
        Math.sin(angle) * Math.cos(elev) * speed
      );

      this.scene.add(spark);
      this.particles.push({
        mesh: spark,
        vel,
        gravity: 18,
        life: 0.25 + Math.random() * 0.2,
        age: 0
      });
    }
  }

  // Slash Arc Ribbon Mesh
  createSlashArc(pos, rotY, color = 0xf59e0b) {
    const shape = new THREE.RingGeometry(1.6, 2.5, 16, 1, 0, Math.PI * 0.85);
    const mat = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const arc = new THREE.Mesh(shape, mat);
    arc.position.copy(pos);
    arc.position.y += 1.2;
    arc.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.4;
    arc.rotation.z = rotY + Math.PI * 0.2;
    this.scene.add(arc);

    this.slashArcs.push({
      mesh: arc,
      age: 0,
      life: 0.14
    });
  }

  // Ruach Dash Aura Ground Rings & Speed Lines
  createDashEffect(pos, dir, color = 0x38bdf8) {
    this.createShockwave(new THREE.Vector3(pos.x, 0.65, pos.z), color, 3.5, 0.25);

    // Speed particles
    for (let i = 0; i < 8; i++) {
      const geo = new THREE.CylinderGeometry(0.04, 0.08, 1.2, 4);
      const mat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.8 });
      const p = new THREE.Mesh(geo, mat);
      p.position.set(
        pos.x + (Math.random() - 0.5) * 1.5,
        pos.y + 0.5 + Math.random() * 1.2,
        pos.z + (Math.random() - 0.5) * 1.5
      );
      p.rotation.x = Math.PI / 2;
      this.scene.add(p);
      this.particles.push({
        mesh: p,
        vel: dir.clone().multiplyScalar(-10),
        life: 0.15,
        age: 0
      });
    }
  }

  // Kawarimi / Substitution Poof (Golden smoke/embers)
  createSubstitutionPoof(pos, color = 0xfacc15) {
    this.createShockwave(new THREE.Vector3(pos.x, 0.7, pos.z), color, 4.0, 0.35);
    for (let i = 0; i < 20; i++) {
      const geo = new THREE.DodecahedronGeometry(0.2 + Math.random() * 0.2);
      const mat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.9 });
      const p = new THREE.Mesh(geo, mat);
      p.position.set(pos.x + (Math.random() - 0.5), pos.y + 1 + Math.random(), pos.z + (Math.random() - 0.5));
      const vel = new THREE.Vector3((Math.random() - 0.5) * 6, Math.random() * 6 + 2, (Math.random() - 0.5) * 6);
      this.scene.add(p);
      this.particles.push({
        mesh: p,
        vel,
        gravity: 4,
        life: 0.4 + Math.random() * 0.2,
        age: 0
      });
    }
  }

  // Aura Particles when Charging Ruach or in Awakening
  emitAuraParticles(pos, color = 0xf59e0b, count = 2) {
    for (let i = 0; i < count; i++) {
      const geo = new THREE.SphereGeometry(0.12, 4, 4);
      const mat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.8 });
      const p = new THREE.Mesh(geo, mat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 0.6 + Math.random() * 0.6;
      p.position.set(pos.x + Math.cos(angle) * radius, pos.y + 0.2, pos.z + Math.sin(angle) * radius);
      this.scene.add(p);
      this.particles.push({
        mesh: p,
        vel: new THREE.Vector3(0, 3 + Math.random() * 3, 0),
        life: 0.35,
        age: 0
      });
    }
  }

  // Spawn Energy Projectile (Golden Roar / Shadow Fang)
  spawnProjectile(origin, dir, shooter, color = 0xf59e0b) {
    const geo = new THREE.SphereGeometry(0.45, 12, 12);
    const mat = new THREE.MeshBasicMaterial({ color: color });
    const core = new THREE.Mesh(geo, mat);

    // Glowing halo
    const haloGeo = new THREE.RingGeometry(0.45, 0.85, 16);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    core.add(halo);

    core.position.copy(origin);
    core.position.y += 1.3;
    this.scene.add(core);

    this.projectiles.push({
      mesh: core,
      dir: dir.clone().normalize(),
      speed: 38,
      shooter,
      life: 1.8,
      age: 0,
      color
    });
  }

  // Show Floating Damage Number (3D projection to screen)
  showDamageNumber(damage, worldPos, camera, isCrit = false) {
    const canvas = document.getElementById('game-container');
    const el = document.createElement('div');
    el.className = 'damage-number';
    el.innerText = isCrit ? `CRÍTICO! ${Math.round(damage)}` : `${Math.round(damage)}`;
    if (isCrit) el.style.color = '#ef4444';

    const tempV = worldPos.clone();
    tempV.y += 2.0;
    tempV.project(camera);

    const x = (tempV.x * 0.5 + 0.5) * canvas.clientWidth;
    const y = (-(tempV.y * 0.5) + 0.5) * canvas.clientHeight;
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;

    canvas.appendChild(el);
    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 800);
  }

  update(dt, time) {
    // 1. Shockwaves
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.age += dt;
      const progress = sw.age / sw.duration;
      if (progress >= 1.0) {
        this.scene.remove(sw.mesh);
        sw.mesh.geometry.dispose();
        sw.mesh.material.dispose();
        this.shockwaves.splice(i, 1);
      } else {
        const scale = progress * sw.maxRadius;
        sw.mesh.scale.set(scale, scale, 1);
        sw.mesh.material.opacity = (1 - progress) * 0.9;
      }
    }

    // 2. Slash Arcs
    for (let i = this.slashArcs.length - 1; i >= 0; i--) {
      const arc = this.slashArcs[i];
      arc.age += dt;
      if (arc.age >= arc.life) {
        this.scene.remove(arc.mesh);
        arc.mesh.geometry.dispose();
        arc.mesh.material.dispose();
        this.slashArcs.splice(i, 1);
      } else {
        arc.mesh.material.opacity = (1 - arc.age / arc.life) * 0.85;
      }
    }

    // 3. Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.age += dt;
      if (p.age >= p.life) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.particles.splice(i, 1);
      } else {
        if (p.gravity) p.vel.y -= p.gravity * dt;
        p.mesh.position.addScaledVector(p.vel, dt);
        p.mesh.material.opacity = 1 - p.age / p.life;
      }
    }

    // 4. Projectiles
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];
      proj.age += dt;
      proj.mesh.position.addScaledVector(proj.dir, proj.speed * dt);
      proj.mesh.children[0].rotation.z += 15 * dt;

      // Aura trail
      if (Math.random() < 0.4) {
        this.emitAuraParticles(proj.mesh.position, proj.color, 1);
      }

      if (proj.age >= proj.life) {
        this.createShockwave(proj.mesh.position, proj.color, 1.8, 0.2);
        this.scene.remove(proj.mesh);
        this.projectiles.splice(i, 1);
      }
    }

    // 5. Spectral Lion Animation
    if (this.lionAnim) {
      this.lionAnim.progress += dt * 1.8;
      const t = this.lionAnim.progress;

      if (t < 0.3) {
        // Materialize & grow behind character
        const s = (t / 0.3) * 1.8;
        this.lionGroup.scale.set(s, s, s);
      } else if (t < 1.0) {
        // Charge forward towards target!
        const chargeT = (t - 0.3) / 0.7;
        this.lionGroup.position.lerpVectors(this.lionAnim.startPos, this.lionAnim.targetPos, chargeT);
        this.lionGroup.scale.set(2.4, 2.4, 2.4);

        if (chargeT >= 0.85 && !this.lionAnim.hitTriggered) {
          this.lionAnim.hitTriggered = true;
          this.createShockwave(this.lionAnim.targetPos, 0xfacc15, 8.0, 0.5);
          this.createHitSparks(this.lionAnim.targetPos, 0xffffff, 40);
          if (this.lionAnim.onHit) this.lionAnim.onHit();
        }
      } else {
        // Disperse
        this.lionGroup.visible = false;
        this.lionAnim = null;
      }
    }
  }
}
