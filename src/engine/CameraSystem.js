import * as THREE from 'three';

export class CameraSystem {
  constructor(camera) {
    this.camera = camera;
    this.targetPos = new THREE.Vector3(0, 3, 12);
    this.lookAtTarget = new THREE.Vector3(0, 1.8, 0);

    // Screen shake / trauma
    this.trauma = 0;
    this.maxShakeOffset = 0.8;
    this.maxShakeRot = 0.08;

    // Hit-stop freeze frame timer
    this.hitStopTimer = 0;

    // Cinematic state
    this.cinematicMode = false;
    this.cinematicTimer = 0;
    this.baseFov = 52;
    this.currentFov = 52;
  }

  addTrauma(amount) {
    this.trauma = Math.min(this.trauma + amount, 1.0);
  }

  triggerHitStop(duration = 0.08) {
    this.hitStopTimer = duration;
  }

  startCinematic(type = 'ultimate') {
    this.cinematicMode = true;
    this.cinematicType = type;
    this.cinematicTimer = 0;
  }

  stopCinematic() {
    this.cinematicMode = false;
    this.cinematicType = null;
    this.camera.fov = this.baseFov;
    this.camera.updateProjectionMatrix();
  }

  update(dt, player, enemy, isDashing = false) {
    // 1. Process Hit Stop
    if (this.hitStopTimer > 0) {
      this.hitStopTimer -= dt;
      return true; // Return true to indicate frame freeze
    }

    // 2. Cinematic Camera Overrides
    if (this.cinematicMode) {
      this.cinematicTimer += dt;
      const t = this.cinematicTimer;

      if (this.cinematicType === 'ultimate') {
        if (t < 0.6) {
          // Angle 1: Low-angle dramatic closeup of player
          const p = player.model.group.position;
          this.camera.position.set(p.x + 1.2, p.y + 0.8, p.z + 1.8);
          this.camera.lookAt(p.x, p.y + 2.0, p.z);
          this.camera.fov = 42;
        } else if (t < 1.4) {
          // Angle 2: Wide high angle showing arena & energy charge
          const p = player.model.group.position;
          this.camera.position.set(p.x - 3.5, p.y + 4.5, p.z - 3.0);
          this.camera.lookAt(p.x, p.y + 1.5, p.z);
          this.camera.fov = 55;
        } else {
          // Angle 3: Tracking behind the spectral lion charge towards enemy
          const p = player.model.group.position;
          const e = enemy.model.group.position;
          const mid = new THREE.Vector3().lerpVectors(p, e, 0.4);
          this.camera.position.set(mid.x, mid.y + 3.5, mid.z + 5.5);
          this.camera.lookAt(e.x, e.y + 1.5, e.z);
          this.camera.fov = 60;
        }
        this.camera.updateProjectionMatrix();
        return false;
      }
    }

    // 3. Ninja Storm Dynamic Arena Camera
    const pPos = player.model.group.position;
    const ePos = enemy.model.group.position;

    // Vector from player to enemy
    const toEnemy = new THREE.Vector3().subVectors(ePos, pPos);
    const dist = toEnemy.length();
    toEnemy.normalize();

    // Desired camera distance scales with fighter separation
    const camDist = THREE.MathUtils.clamp(dist * 0.55 + 5.5, 7.0, 16.0);
    const camHeight = THREE.MathUtils.clamp(dist * 0.18 + 2.4, 2.6, 5.2);

    // Camera sits behind player, facing enemy
    const idealCamPos = new THREE.Vector3(
      pPos.x - toEnemy.x * camDist,
      pPos.y + camHeight,
      pPos.z - toEnemy.z * camDist
    );

    // Smoothly interpolate camera position
    this.targetPos.lerp(idealCamPos, THREE.MathUtils.clamp(dt * 7, 0, 1));
    this.camera.position.copy(this.targetPos);

    // Look at midpoint weighted towards opponent
    const targetLookAt = new THREE.Vector3().lerpVectors(pPos, ePos, 0.45);
    targetLookAt.y += 1.6;
    this.lookAtTarget.lerp(targetLookAt, THREE.MathUtils.clamp(dt * 10, 0, 1));
    this.camera.lookAt(this.lookAtTarget);

    // 4. Dynamic FoV on Dash / High Speed
    const targetFov = isDashing ? 66 : this.baseFov;
    this.currentFov = THREE.MathUtils.lerp(this.currentFov, targetFov, dt * 8);
    this.camera.fov = this.currentFov;

    // 5. Screen Shake Trauma
    if (this.trauma > 0) {
      const shake = this.trauma * this.trauma;
      const offsetX = (Math.random() * 2 - 1) * this.maxShakeOffset * shake;
      const offsetY = (Math.random() * 2 - 1) * this.maxShakeOffset * shake;
      const offsetZ = (Math.random() * 2 - 1) * this.maxShakeOffset * shake;

      this.camera.position.x += offsetX;
      this.camera.position.y += offsetY;
      this.camera.position.z += offsetZ;

      this.trauma = Math.max(0, this.trauma - dt * 2.2);
    }

    this.camera.updateProjectionMatrix();
    return false;
  }
}
