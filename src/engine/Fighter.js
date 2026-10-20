import * as THREE from 'three';
import { FighterModel } from './FighterModel.js';

export class Fighter {
  constructor(scene, vfx, sfx, cameraSystem, tribe = 'judah', isAI = false) {
    this.scene = scene;
    this.vfx = vfx;
    this.sfx = sfx;
    this.cameraSystem = cameraSystem;
    this.tribe = tribe;
    this.isAI = isAI;

    // Core Stats
    this.maxHealth = 100;
    this.health = 100;
    this.maxRuach = 100;
    this.ruach = 50;
    this.maxSubs = 4;
    this.subs = 4;
    this.subRechargeTimer = 0;

    // Movement & Physics
    this.pos = new THREE.Vector3(isAI ? 0 : 0, 0.6, isAI ? -12 : 12);
    this.vel = new THREE.Vector3();
    this.rotationY = isAI ? 0 : Math.PI;
    this.baseSpeed = 14;
    this.dashSpeed = 38;
    this.isGrounded = true;
    this.jumpForce = 15;
    this.gravity = 36;

    // Combat State
    this.state = 'idle'; // idle, run, dash, attack, guard, charge, hit, knockback, ultimate
    this.comboStep = 0;
    this.comboTimer = 0;
    this.attackCooldown = 0;
    this.hitStunTimer = 0;
    this.dashTimer = 0;
    this.isAwakened = false;
    this.awakenedTimer = 0;

    // AI Decision Timers
    this.aiTimer = 0;
    this.aiAction = 'idle';

    // Model Rig
    this.model = new FighterModel(scene, tribe);
    this.model.group.position.copy(this.pos);
    this.model.group.rotation.y = this.rotationY;
  }

  // Set Opponent Reference
  setOpponent(opponent) {
    this.opponent = opponent;
  }

  // Attack Input (Melee Combo)
  performAttack() {
    if (this.state === 'hit' || this.state === 'knockback' || this.state === 'ultimate') return;

    if (this.state === 'attack' && this.attackCooldown > 0.08) {
      // Buffer next combo hit
      this.bufferedAttack = true;
      return;
    }

    if (!this.isGrounded) {
      // Aerial Attack
      this.state = 'attack';
      this.comboStep = 5;
      this.attackCooldown = 0.45;
      this.vel.set(0, -18, 0); // Dive down
      this.model.setAnimation('airAttack');
      this.sfx.playSlash();
      return;
    }

    // Ground Combo Chain: 1 -> 2 -> 3 -> 4 (Finisher)
    if (this.comboTimer > 0.8 || this.comboStep >= 4) {
      this.comboStep = 1;
    } else {
      this.comboStep = (this.comboStep % 4) + 1;
    }

    this.state = 'attack';
    this.comboTimer = 0;
    this.attackCooldown = 0.32;

    const animMap = { 1: 'attack1', 2: 'attack2', 3: 'attack3', 4: 'finisher' };
    this.model.setAnimation(animMap[this.comboStep]);

    // Slight forward step on attack
    const fwd = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationY);
    this.vel.addScaledVector(fwd, 6.0);

    // Audio & Slash VFX
    this.sfx.playSlash();
    const slashColor = this.tribe === 'judah' ? 0xf59e0b : 0xa855f7;
    this.vfx.createSlashArc(this.pos, this.rotationY, slashColor);

    // Check Melee Hit against Opponent
    this.checkMeleeHit();
  }

  checkMeleeHit() {
    if (!this.opponent) return;
    const toOpp = new THREE.Vector3().subVectors(this.opponent.pos, this.pos);
    const dist = toOpp.length();

    // Hitbox cone
    if (dist < 3.2) {
      const isFinisher = this.comboStep === 4 || this.comboStep === 5;
      const baseDamage = isFinisher ? 12 : 5;
      const damage = this.isAwakened ? baseDamage * 1.3 : baseDamage;

      this.opponent.takeHit(damage, this, isFinisher);

      // Hit-stop & screen shake
      this.cameraSystem.triggerHitStop(isFinisher ? 0.1 : 0.05);
      this.cameraSystem.addTrauma(isFinisher ? 0.4 : 0.15);

      // VFX Hit Sparks & Shockwave
      const hitPos = new THREE.Vector3().lerpVectors(this.pos, this.opponent.pos, 0.6);
      hitPos.y += 1.4;
      this.vfx.createHitSparks(hitPos, this.tribe === 'judah' ? 0xfef08a : 0xe9d5ff, isFinisher ? 28 : 14);
      if (isFinisher) {
        this.vfx.createShockwave(hitPos, this.tribe === 'judah' ? 0xf59e0b : 0xa855f7, 4.5, 0.3);
      }
    }
  }

  // Ruach Dash (Chakra Dash)
  performDash() {
    if (this.state === 'hit' || this.state === 'knockback' || this.state === 'ultimate') return;
    if (this.ruach < 15 && !this.isAwakened) return;

    if (!this.isAwakened) {
      this.ruach = Math.max(0, this.ruach - 15);
    }

    this.state = 'dash';
    this.dashTimer = 0.45;
    this.model.setAnimation('dash');
    this.sfx.playDash();

    // Dash vector directly towards opponent
    if (this.opponent) {
      const dir = new THREE.Vector3().subVectors(this.opponent.pos, this.pos).normalize();
      dir.y = 0.1;
      this.vel.copy(dir.multiplyScalar(this.dashSpeed));
      this.vfx.createDashEffect(this.pos, dir, this.tribe === 'judah' ? 0xf59e0b : 0xa855f7);
    }
  }

  // Substitution Jutsu (Kawarimi)
  performSubstitution() {
    if (this.subs < 1) return;
    this.subs--;

    this.sfx.playSubstitution();
    this.vfx.createSubstitutionPoof(this.pos, this.tribe === 'judah' ? 0xfacc15 : 0xc084fc);

    // Teleport behind attacker!
    if (this.opponent) {
      const oppFwd = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.opponent.rotationY);
      const behindPos = this.opponent.pos.clone().sub(oppFwd.multiplyScalar(2.6));
      behindPos.y = 0.6;
      this.pos.copy(behindPos);
      this.faceTarget(this.opponent.pos);
    }

    this.state = 'idle';
    this.hitStunTimer = 0;
    this.vel.set(0, 0, 0);
  }

  // Ranged Projectile
  performShoot() {
    if (this.state === 'hit' || this.state === 'knockback' || this.state === 'ultimate') return;
    if (this.ruach < 10 && !this.isAwakened) return;

    if (!this.isAwakened) this.ruach -= 10;

    this.sfx.playShoot();
    const fwd = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), this.rotationY);
    const projColor = this.tribe === 'judah' ? 0xf59e0b : 0x9333ea;
    this.vfx.spawnProjectile(this.pos, fwd, this, projColor);
  }

  // Ruach Charging (Chakra Charge)
  setCharging(isCharging) {
    if (this.state === 'hit' || this.state === 'knockback' || this.state === 'ultimate') return;

    if (isCharging) {
      this.state = 'charge';
      this.model.setAnimation('charge');
      this.sfx.playCharge(true);
      this.vel.set(0, 0, 0);
    } else if (this.state === 'charge') {
      this.state = 'idle';
      this.model.setAnimation('idle');
      this.sfx.playCharge(false);
    }
  }

  // Guard / Block
  setGuarding(isGuarding) {
    if (this.state === 'hit' || this.state === 'knockback' || this.state === 'ultimate') return;

    if (isGuarding) {
      this.state = 'guard';
      this.model.setAnimation('guard');
      this.vel.set(0, 0, 0);
    } else if (this.state === 'guard') {
      this.state = 'idle';
      this.model.setAnimation('idle');
    }
  }

  // Secret Technique / Ultimate Jutsu
  performUltimate() {
    if (this.state === 'hit' || this.state === 'knockback' || this.state === 'ultimate') return;
    if (this.ruach < 50 && !this.isAwakened) return;

    if (!this.isAwakened) this.ruach -= 50;

    this.state = 'ultimate';
    this.model.setAnimation('ultimate');
    this.sfx.playUltimate();
    this.cameraSystem.startCinematic('ultimate');

    // UI Cut-in
    const cutin = document.getElementById('ultimate-cutin');
    if (cutin) {
      cutin.classList.add('active');
      setTimeout(() => cutin.classList.remove('active'), 1800);
    }

    // Trigger Spectral Avatar Attack
    if (this.opponent) {
      const startP = this.pos.clone();
      const targetP = this.opponent.pos.clone();
      this.vfx.triggerSpectralLion(startP, targetP, () => {
        this.opponent.takeHit(38, this, true);
        this.cameraSystem.addTrauma(0.8);
      });
    }

    setTimeout(() => {
      this.state = 'idle';
      this.cameraSystem.stopCinematic();
    }, 2200);
  }

  // Awakening Mode (Despertar)
  performAwakening() {
    if (this.health > 45 && !this.isAI) return;
    if (this.isAwakened) return;

    this.isAwakened = true;
    this.awakenedTimer = 22; // 22 seconds duration
    this.sfx.playAwakening();

    const banner = document.getElementById('awakening-banner');
    if (banner) {
      banner.classList.remove('active');
    }

    // Massive aura flash
    this.vfx.createShockwave(this.pos, this.tribe === 'judah' ? 0xfacc15 : 0xc084fc, 8.0, 0.6);
  }

  // Take Damage
  takeHit(damage, attacker, isHeavy = false) {
    // If guarding, take 85% reduced damage and don't get stunned
    if (this.state === 'guard') {
      this.health = Math.max(0, this.health - damage * 0.15);
      this.sfx.playHit(false);
      this.vfx.createHitSparks(this.pos, 0x60a5fa, 8);
      return;
    }

    // AI substitution reaction check
    if (this.isAI && this.subs > 0 && Math.random() < 0.35) {
      this.performSubstitution();
      return;
    }

    this.health = Math.max(0, this.health - damage);
    this.sfx.playHit(isHeavy);
    this.vfx.showDamageNumber(damage, this.pos, this.cameraSystem.camera, isHeavy);

    if (isHeavy) {
      this.state = 'knockback';
      this.hitStunTimer = 0.7;
      this.model.setAnimation('knockback');

      // Launch backwards away from attacker
      const dir = new THREE.Vector3().subVectors(this.pos, attacker.pos).normalize();
      dir.y = 0.5;
      this.vel.copy(dir.multiplyScalar(22));
    } else {
      this.state = 'hit';
      this.hitStunTimer = 0.28;
      this.model.setAnimation('hit');
      this.vel.set(0, 0, 0);
    }
  }

  // Face Target in 3D
  faceTarget(targetPos) {
    const dx = targetPos.x - this.pos.x;
    const dz = targetPos.z - this.pos.z;
    this.rotationY = Math.atan2(dx, dz);
    this.model.group.rotation.y = this.rotationY;
  }

  // AI Decision Logic (Simulates Ninja Storm AI)
  updateAI(dt) {
    if (!this.opponent || this.state === 'hit' || this.state === 'knockback' || this.state === 'ultimate') return;

    this.aiTimer += dt;
    const toPlayer = new THREE.Vector3().subVectors(this.opponent.pos, this.pos);
    const dist = toPlayer.length();

    // Check Awakening
    if (this.health < 40 && !this.isAwakened) {
      this.performAwakening();
    }

    // AI Think Loop every 0.25s
    if (this.aiTimer > 0.25) {
      this.aiTimer = 0;
      this.faceTarget(this.opponent.pos);

      if (dist > 14) {
        // Far: Ruach Dash or Projectile or Charge
        const roll = Math.random();
        if (roll < 0.45 && this.ruach >= 15) {
          this.performDash();
        } else if (roll < 0.75 && this.ruach >= 10) {
          this.performShoot();
        } else if (this.ruach < 40) {
          this.setCharging(true);
        } else {
          // Approach
          const dir = toPlayer.clone().normalize();
          this.vel.copy(dir.multiplyScalar(this.baseSpeed));
          this.state = 'run';
          this.model.setAnimation('run');
        }
      } else if (dist > 3.0) {
        // Mid-range: Close the gap or throw projectile
        if (Math.random() < 0.4 && this.ruach >= 15) {
          this.performDash();
        } else {
          const dir = toPlayer.clone().normalize();
          this.vel.copy(dir.multiplyScalar(this.baseSpeed));
          this.state = 'run';
          this.model.setAnimation('run');
        }
      } else {
        // Close-range: Attack combo, block, or ultimate!
        if (this.ruach >= 50 && Math.random() < 0.3) {
          this.performUltimate();
        } else if (Math.random() < 0.75) {
          this.performAttack();
        } else {
          this.setGuarding(true);
          setTimeout(() => this.setGuarding(false), 500);
        }
      }
    }
  }

  update(dt, arena) {
    // 1. Process AI
    if (this.isAI) {
      this.updateAI(dt);
    }

    // 2. Cooldowns & Timers
    if (this.attackCooldown > 0) {
      this.attackCooldown -= dt;
      if (this.attackCooldown <= 0) {
        if (this.bufferedAttack) {
          this.bufferedAttack = false;
          this.performAttack();
        } else if (this.state === 'attack') {
          this.state = 'idle';
          this.model.setAnimation('idle');
        }
      }
    }

    this.comboTimer += dt;

    // Hit Stun Recovery
    if (this.hitStunTimer > 0) {
      this.hitStunTimer -= dt;
      if (this.hitStunTimer <= 0) {
        this.state = 'idle';
        this.model.setAnimation('idle');
      }
    }

    // Dash Duration & Connection
    if (this.state === 'dash') {
      this.dashTimer -= dt;
      if (this.opponent) {
        const toOpp = new THREE.Vector3().subVectors(this.opponent.pos, this.pos);
        if (toOpp.length() < 2.5) {
          // Dashed into opponent! Connect combo!
          this.state = 'idle';
          this.performAttack();
        }
      }
      if (this.dashTimer <= 0 && this.state === 'dash') {
        this.state = 'idle';
        this.model.setAnimation('idle');
      }
    }

    // Charge Ruach Generation
    if (this.state === 'charge') {
      this.ruach = Math.min(this.maxRuach, this.ruach + 38 * dt);
      this.vfx.emitAuraParticles(this.pos, this.tribe === 'judah' ? 0xf59e0b : 0xa855f7, 2);
    }

    // Passive Ruach Regen
    this.ruach = Math.min(this.maxRuach, this.ruach + 3.0 * dt);

    // Substitution Stock Recharge (1 stock every 14s)
    if (this.subs < this.maxSubs) {
      this.subRechargeTimer += dt;
      if (this.subRechargeTimer >= 14) {
        this.subs++;
        this.subRechargeTimer = 0;
      }
    }

    // Awakening Timer
    if (this.isAwakened) {
      this.awakenedTimer -= dt;
      this.vfx.emitAuraParticles(this.pos, this.tribe === 'judah' ? 0xfacc15 : 0xc084fc, 3);
      if (this.awakenedTimer <= 0) {
        this.isAwakened = false;
      }
    }

    // 3. Movement & Physics Integration
    if (this.state !== 'charge' && this.state !== 'guard') {
      this.pos.x += this.vel.x * dt;
      this.pos.z += this.vel.z * dt;
    }

    // Gravity
    if (!this.isGrounded) {
      this.vel.y -= this.gravity * dt;
      this.pos.y += this.vel.y * dt;
      if (this.pos.y <= 0.6) {
        this.pos.y = 0.6;
        this.isGrounded = true;
        this.vel.y = 0;
        this.vfx.createShockwave(this.pos, 0x94a3b8, 2.5, 0.2);
        if (this.state === 'attack' && this.comboStep === 5) {
          this.state = 'idle';
          this.model.setAnimation('idle');
        }
      }
    }

    // Friction / Damping
    if (this.state !== 'dash') {
      this.vel.x *= Math.max(0, 1 - 10 * dt);
      this.vel.z *= Math.max(0, 1 - 10 * dt);
    }

    // Arena Boundary Clamp
    arena.clampPosition(this.pos);

    // Update Model Rig Position & Rotation
    this.model.group.position.copy(this.pos);
    this.model.group.rotation.y = this.rotationY;
    this.model.update(dt, this.isAwakened);
  }
}
