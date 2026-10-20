import * as THREE from 'three';

/**
 * DetailedHumanModel.js
 * Constrói guerreiros humanos tridimensionais detalhados (sem blocos de Minecraft!).
 * Inclui anatomia humana suave, musculatura, dedos nas mãos, armaduras em relevo,
 * capas com física de vento, cabelos modelados e expressões faciais.
 */
export class DetailedHumanModel {
  constructor(tribeData) {
    this.tribe = tribeData;
    this.group = new THREE.Group();
    this.animTime = 0;
    this.currentAnim = 'idle';

    // Materiais PBR de Alta Qualidade
    this.initMaterials();

    // Construção do Esqueleto e Malha Anatômica
    this.buildHumanSkeleton();
    this.buildHeadAndFace();
    this.buildTorsoAndArmor();
    this.buildArmsAndHands();
    this.buildLegsAndBoots();
    this.buildCapeAndCloth();
    this.buildWeapon();
    this.buildAura();
  }

  initMaterials() {
    // 1. Textura procedural para pele / tecido / metal escovado
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 256, 256);
    // Micro ruído para relevo
    for (let i = 0; i < 4000; i++) {
      ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.05})`;
      ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
    }
    const noiseTex = new THREE.CanvasTexture(canvas);
    noiseTex.wrapS = THREE.RepeatWrapping;
    noiseTex.wrapT = THREE.RepeatWrapping;
    noiseTex.repeat.set(4, 4);

    // Pele Humana (Subsurface feeling)
    this.matSkin = new THREE.MeshStandardMaterial({
      color: 0xd4a373,
      roughness: 0.55,
      metalness: 0.05,
      bumpMap: noiseTex,
      bumpScale: 0.005
    });

    // Ouro Real de Judá / Metal Principal
    this.matGold = new THREE.MeshStandardMaterial({
      color: this.tribe.id === 'judah' ? 0xf59e0b : 0x9333ea,
      metalness: 0.85,
      roughness: 0.22,
      bumpMap: noiseTex,
      bumpScale: 0.015
    });

    // Bronze Envelhecido / Aço Escuro
    this.matArmor = new THREE.MeshStandardMaterial({
      color: this.tribe.id === 'judah' ? 0x92400e : 0x1e293b,
      metalness: 0.7,
      roughness: 0.35,
      bumpMap: noiseTex,
      bumpScale: 0.02
    });

    // Tecido Nobre / Capa (Azul Royal para Judá, Manto Sombrio para Benjamim)
    this.matCloth = new THREE.MeshStandardMaterial({
      color: this.tribe.id === 'judah' ? 0x1e3a8a : 0x3b0764,
      roughness: 0.8,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    // Bordas Douradas de Tecido
    this.matGoldTrim = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.9,
      roughness: 0.2
    });

    // Cabelo / Barba Real
    this.matHair = new THREE.MeshStandardMaterial({
      color: this.tribe.id === 'judah' ? 0x451a03 : 0x0f172a,
      roughness: 0.7
    });

    // Gemas / Luz Mística
    this.matGem = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.2
    });
  }

  buildHumanSkeleton() {
    // Nó raiz do corpo (pelve / centro de massa)
    this.pelvis = new THREE.Group();
    this.pelvis.position.y = 1.65;
    this.group.add(this.pelvis);

    // Coluna / Abdômen
    this.spine = new THREE.Group();
    this.spine.position.y = 0.3;
    this.pelvis.add(this.spine);

    // Tórax / Peito
    this.chest = new THREE.Group();
    this.chest.position.y = 0.45;
    this.spine.add(this.chest);

    // Pescoço e Cabeça
    this.neck = new THREE.Group();
    this.neck.position.y = 0.55;
    this.chest.add(this.neck);
  }

  buildHeadAndFace() {
    this.head = new THREE.Group();
    this.head.position.y = 0.22;
    this.neck.add(this.head);

    // 1. Crânio Humano Curvo
    const skullGeo = new THREE.SphereGeometry(0.24, 20, 20);
    skullGeo.scale(1, 1.15, 1.05);
    const skull = new THREE.Mesh(skullGeo, this.matSkin);
    skull.castShadow = true;
    this.head.add(skull);

    // 2. Mandíbula e Queixo Definido
    const jawGeo = new THREE.ConeGeometry(0.18, 0.24, 8);
    jawGeo.rotateX(Math.PI);
    const jaw = new THREE.Mesh(jawGeo, this.matSkin);
    jaw.position.set(0, -0.12, 0.08);
    jaw.scale.set(1.1, 0.9, 1.2);
    this.head.add(jaw);

    // 3. Nariz Esculpido
    const noseGeo = new THREE.ConeGeometry(0.04, 0.12, 4);
    const nose = new THREE.Mesh(noseGeo, this.matSkin);
    nose.position.set(0, 0.02, 0.26);
    nose.rotation.x = 0.35;
    this.head.add(nose);

    // 4. Olhos e Sobrancelhas
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const irisMat = new THREE.MeshBasicMaterial({ color: this.matGold.color });

    [-0.075, 0.075].forEach((x) => {
      // Globo ocular
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
      eye.position.set(x, 0.06, 0.21);
      // Íris
      const iris = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), irisMat);
      iris.position.set(0, 0, 0.025);
      eye.add(iris);
      this.head.add(eye);

      // Sobrancelha marcada
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.015, 0.02), this.matHair);
      brow.position.set(x, 0.1, 0.23);
      brow.rotation.z = x > 0 ? -0.15 : 0.15;
      this.head.add(brow);
    });

    // 5. Barba Real Bíblica (Imponente)
    const beardGeo = new THREE.ConeGeometry(0.16, 0.32, 6);
    beardGeo.rotateX(Math.PI);
    const beard = new THREE.Mesh(beardGeo, this.matHair);
    beard.position.set(0, -0.22, 0.12);
    beard.scale.set(1.1, 1, 0.8);
    this.head.add(beard);

    // 6. Cabelo Longo Nobre / Juba de Leão
    const hairGroup = new THREE.Group();
    // Topo e laterais com mechas curvas
    for (let i = 0; i < 9; i++) {
      const strandGeo = new THREE.CylinderGeometry(0.04, 0.07, 0.45, 6);
      const strand = new THREE.Mesh(strandGeo, this.matHair);
      const angle = (i / 8) * Math.PI - Math.PI / 2;
      strand.position.set(Math.sin(angle) * 0.22, 0.05, -Math.cos(angle) * 0.18);
      strand.rotation.z = -Math.sin(angle) * 0.4;
      strand.rotation.x = -0.3;
      hairGroup.add(strand);
    }
    this.head.add(hairGroup);

    // 7. Coroa Imperial do Leão de Judá
    const crown = new THREE.Group();
    crown.position.set(0, 0.25, 0);

    const diadem = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.025, 8, 24), this.matGold);
    diadem.rotation.x = Math.PI / 2;
    crown.add(diadem);

    // 5 Pontas Imperiais com Brasão Central de Leão
    for (let i = -2; i <= 2; i++) {
      const spikeH = i === 0 ? 0.2 : 0.12;
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.04, spikeH, 4), this.matGold);
      spike.position.set(i * 0.09, 0.08, 0.22 - Math.abs(i) * 0.03);
      crown.add(spike);
    }
    // Gema Azul Lápis-Lazúli no centro da coroa
    const crownGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.04), this.matGem);
    crownGem.position.set(0, 0.08, 0.25);
    crown.add(crownGem);

    this.head.add(crown);
  }

  buildTorsoAndArmor() {
    // 1. Abdômen com musculatura anatômica
    const absGeo = new THREE.CylinderGeometry(0.3, 0.28, 0.4, 12);
    absGeo.scale(1.2, 1, 0.85);
    const abs = new THREE.Mesh(absGeo, this.matSkin);
    abs.position.set(0, 0.1, 0);
    this.spine.add(abs);

    // 2. Peitoral e Caixa Torácica Musculosa
    const chestGeo = new THREE.CylinderGeometry(0.42, 0.36, 0.5, 14);
    chestGeo.scale(1.3, 1, 0.9);
    const chestMuscles = new THREE.Mesh(chestGeo, this.matSkin);
    chestMuscles.position.set(0, 0.18, 0);
    this.chest.add(chestMuscles);

    // 3. Peitoral de Armadura Real (Corselete esculpido de ouro e bronze)
    const cuirassGeo = new THREE.CylinderGeometry(0.44, 0.38, 0.52, 16);
    cuirassGeo.scale(1.32, 1, 0.92);
    const cuirass = new THREE.Mesh(cuirassGeo, this.matGold);
    cuirass.position.set(0, 0.18, 0);
    cuirass.castShadow = true;
    this.chest.add(cuirass);

    // 4. Brasão do Leão em Alto-Relevo Dourado no Peito
    const crestGroup = new THREE.Group();
    crestGroup.position.set(0, 0.22, 0.36);

    const lionFace = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.16, 6), this.matGoldTrim);
    lionFace.rotation.x = Math.PI / 2;
    crestGroup.add(lionFace);

    // Juba em anel ao redor do brasão
    const crestRing = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.025, 8, 16), this.matGoldTrim);
    crestGroup.add(crestRing);

    // Gema sagrada no coração
    const chestGem = new THREE.Mesh(new THREE.OctahedronGeometry(0.045), this.matGem);
    chestGem.position.set(0, -0.06, 0.06);
    crestGroup.add(chestGem);

    this.chest.add(crestGroup);

    // 5. Cinto de Guerra e Faixas Reais (Pelve)
    const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.4, 0.16, 16), this.matArmor);
    belt.scale.set(1.2, 1, 0.9);
    this.pelvis.add(belt);

    // Fivela Dourada com Estrela de 6 Pontas
    const buckle = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 6), this.matGold);
    buckle.rotation.x = Math.PI / 2;
    buckle.position.set(0, 0, 0.32);
    this.pelvis.add(buckle);

    // Faixas de Guerra / Pteruges (tiras romanas/bíblicas de couro e ouro)
    for (let i = -3; i <= 3; i++) {
      const pteryge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.02), this.matArmor);
      pteryge.position.set(i * 0.09, -0.22, 0.3 - Math.abs(i) * 0.03);
      this.pelvis.add(pteryge);

      // Ponta dourada
      const pterygeTip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.025), this.matGold);
      pterygeTip.position.set(i * 0.09, -0.38, 0.3 - Math.abs(i) * 0.03);
      this.pelvis.add(pterygeTip);
    }
  }

  buildArmsAndHands() {
    this.arms = {};

    [-1, 1].forEach((side) => {
      const sideName = side === -1 ? 'left' : 'right';

      // 1. Ombro / Clavícula
      const shoulderJoint = new THREE.Group();
      shoulderJoint.position.set(side * 0.58, 0.32, 0);
      this.chest.add(shoulderJoint);

      // Ombreira de Guerra em Camadas (Pauldrons Reais com cabeça de leão)
      const pauldron = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.6), this.matGold);
      pauldron.position.set(side * 0.06, 0.08, 0);
      pauldron.rotation.z = -side * 0.4;
      shoulderJoint.add(pauldron);

      // Deltoide / Braço Superior (Bíceps musculoso)
      const upperArm = new THREE.Group();
      upperArm.position.y = -0.06;
      shoulderJoint.add(upperArm);

      const bicep = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.38, 12), this.matSkin);
      bicep.position.y = -0.19;
      bicep.castShadow = true;
      upperArm.add(bicep);

      // 2. Cotovelo e Antebraço
      const elbowJoint = new THREE.Group();
      elbowJoint.position.y = -0.38;
      upperArm.add(elbowJoint);

      const forearm = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.08, 0.36, 12), this.matSkin);
      forearm.position.y = -0.18;
      forearm.castShadow = true;
      elbowJoint.add(forearm);

      // Braçadeiras de Ouro e Couro (Vambraces)
      const bracer = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.09, 0.24, 12), this.matGold);
      bracer.position.y = -0.18;
      elbowJoint.add(bracer);

      // 3. Pulso e Mão Humana Real com 5 Dedos!
      const wristJoint = new THREE.Group();
      wristJoint.position.y = -0.36;
      elbowJoint.add(wristJoint);

      // Palma da mão
      const palm = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.12, 0.05), this.matSkin);
      palm.position.y = -0.06;
      wristJoint.add(palm);

      // Polegar
      const thumb = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.015, 0.08, 6), this.matSkin);
      thumb.position.set(side * 0.06, -0.04, 0.02);
      thumb.rotation.z = side * 0.6;
      wristJoint.add(thumb);

      // 4 Dedos Articulados (Indicador, Médio, Anelar, Mínimo)
      for (let f = 0; f < 4; f++) {
        const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.014, 0.09, 6), this.matSkin);
        finger.position.set(-0.038 + f * 0.025, -0.14, 0);
        wristJoint.add(finger);
      }

      this.arms[sideName] = {
        shoulder: shoulderJoint,
        upperArm: upperArm,
        elbow: elbowJoint,
        wrist: wristJoint
      };
    });
  }

  buildLegsAndBoots() {
    this.legs = {};

    [-1, 1].forEach((side) => {
      const sideName = side === -1 ? 'left' : 'right';

      // Quadril
      const hipJoint = new THREE.Group();
      hipJoint.position.set(side * 0.24, -0.12, 0);
      this.pelvis.add(hipJoint);

      // Coxa Musculosa (Quadríceps)
      const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.55, 14), this.matSkin);
      thigh.position.y = -0.28;
      thigh.castShadow = true;
      hipJoint.add(thigh);

      // Joelheira de Ouro
      const knee = new THREE.Group();
      knee.position.y = -0.55;
      hipJoint.add(knee);

      const kneepad = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), this.matGold);
      kneepad.position.set(0, 0, 0.08);
      knee.add(kneepad);

      // Canela e Panturrilha
      const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.1, 0.52, 12), this.matSkin);
      calf.position.y = -0.26;
      calf.castShadow = true;
      knee.add(calf);

      // Caneleiras de Bronze (Greaves)
      const greave = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.11, 0.38, 12), this.matArmor);
      greave.position.y = -0.24;
      knee.add(greave);

      // Botas Reais de Couro e Bronze
      const foot = new THREE.Group();
      foot.position.y = -0.52;
      knee.add(foot);

      const boot = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.14, 0.32), this.matArmor);
      boot.position.set(0, 0.04, 0.08);
      boot.castShadow = true;
      foot.add(boot);

      // Biqueira de Ouro
      const toeCap = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.08, 0.1), this.matGold);
      toeCap.position.set(0, 0.02, 0.2);
      foot.add(toeCap);

      this.legs[sideName] = {
        hip: hipJoint,
        knee: knee,
        foot: foot
      };
    });
  }

  buildCapeAndCloth() {
    this.capeSegments = [];
    const capeGroup = new THREE.Group();
    capeGroup.position.set(0, 0.42, -0.32);
    this.chest.add(capeGroup);

    // Broches Dourados nos Ombros segurando a capa
    [-0.38, 0.38].forEach((x) => {
      const brooch = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.04, 8), this.matGold);
      brooch.rotation.x = Math.PI / 2;
      brooch.position.set(x, 0, 0.05);
      capeGroup.add(brooch);
    });

    // Manto Nobre ondulante (5 segmentos verticais encadeados para física realista)
    let parentNode = capeGroup;
    for (let s = 0; s < 5; s++) {
      const segGroup = new THREE.Group();
      segGroup.position.set(0, -0.32, 0);

      const w = 0.9 + s * 0.12;
      const segGeo = new THREE.PlaneGeometry(w, 0.34, 4, 1);
      const segMesh = new THREE.Mesh(segGeo, this.matCloth);
      segMesh.position.set(0, -0.16, 0);
      segMesh.castShadow = true;
      segGroup.add(segMesh);

      // Barra dourada no rodapé da capa
      if (s === 4) {
        const trimMesh = new THREE.Mesh(new THREE.PlaneGeometry(w, 0.06), this.matGoldTrim);
        trimMesh.position.set(0, -0.32, 0.005);
        segGroup.add(trimMesh);
      }

      parentNode.add(segGroup);
      this.capeSegments.push(segGroup);
      parentNode = segGroup;
    }
  }

  buildWeapon() {
    this.weaponGroup = new THREE.Group();

    if (this.tribe.id === 'judah') {
      // O Majestoso Cetro Real do Leão de Judá (Gênesis 49:10)
      this.weaponGroup.position.set(0, -0.2, 0.1);

      // Haste esculpida em ouro com empunhadura em relevo
      const staff = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.04, 2.3, 12), this.matGold);
      staff.castShadow = true;
      this.weaponGroup.add(staff);

      // Detalhes em espiral na haste
      for (let i = 0; i < 6; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.01, 6, 12), this.matGoldTrim);
        ring.position.y = -0.7 + i * 0.28;
        this.weaponGroup.add(ring);
      }

      // Cabeça do Cetro: Cabeça do Leão Imperial esculpida em ouro
      const lionHead = new THREE.Group();
      lionHead.position.y = 1.15;

      const lionSkull = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18), this.matGold);
      lionHead.add(lionSkull);

      // Juba do Leão em chamas de ouro
      for (let m = 0; m < 8; m++) {
        const mane = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.22, 4), this.matGoldTrim);
        const a = (m / 8) * Math.PI * 2;
        mane.position.set(Math.cos(a) * 0.16, Math.sin(a) * 0.16, -0.04);
        mane.rotation.z = a - Math.PI / 2;
        lionHead.add(mane);
      }

      // A Gema Sagrada da Realeza (Lápis-Lazúli e Sol Celestial)
      const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.14), this.matGem);
      crystal.position.set(0, 0.25, 0);
      lionHead.add(crystal);
      this.weaponGem = crystal;

      this.weaponGroup.add(lionHead);

      // Prende na mão direita
      this.arms.right.wrist.add(this.weaponGroup);
    } else {
      // Adagas de Damasco de Benjamim
      [-1, 1].forEach((side) => {
        const dagger = new THREE.Group();
        dagger.position.set(0, -0.15, 0.08);

        const blade = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.9, 4), this.matGold);
        blade.rotateX(Math.PI);
        dagger.add(blade);

        const guard = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.05), this.matArmor);
        dagger.add(guard);

        const arm = side === -1 ? this.arms.left : this.arms.right;
        arm.wrist.add(dagger);
      });
    }
  }

  buildAura() {
    // Halo / Aura de Luz Divina nos Pés e Costas
    const auraGeo = new THREE.RingGeometry(0.6, 1.4, 32);
    const auraMat = new THREE.MeshBasicMaterial({
      color: this.tribe.id === 'judah' ? 0xfbbf24 : 0xc084fc,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35
    });
    this.groundHalo = new THREE.Mesh(auraGeo, auraMat);
    this.groundHalo.rotation.x = -Math.PI / 2;
    this.groundHalo.position.y = -1.62;
    this.pelvis.add(this.groundHalo);
  }

  // Define a Animação Atual
  setAnimation(animName) {
    this.currentAnim = animName;
    this.animTime = 0;
  }

  // Atualização das Animações em Tempo Real
  update(dt) {
    this.animTime += dt;
    const t = this.animTime;

    // Pulso do Halo de Luz
    if (this.groundHalo) {
      const pulse = 1.0 + Math.sin(t * 3) * 0.1;
      this.groundHalo.scale.set(pulse, pulse, 1);
    }

    // Brilho da Gema Sagrada da Arma
    if (this.weaponGem) {
      this.weaponGem.rotation.y += 1.5 * dt;
    }

    // Física Natural da Capa (Ondulações)
    this.capeSegments.forEach((seg, idx) => {
      const windWave = Math.sin(t * 4 + idx * 0.7) * 0.08;
      const baseAngle = 0.06 + idx * 0.04;
      seg.rotation.x = baseAngle + windWave;
      seg.rotation.z = Math.cos(t * 3 + idx * 0.5) * 0.03;
    });

    // Reset base transforms
    this.resetTransforms();

    switch (this.currentAnim) {
      case 'idle':
        // Respiração Humana Suave + Postura Nobre
        const breath = Math.sin(t * 2.5);
        this.chest.position.y = 0.45 + breath * 0.02;
        this.chest.rotation.x = breath * 0.025;
        this.pelvis.position.y = 1.65 + breath * 0.01;
        this.head.rotation.x = -breath * 0.02;

        // Braço direito apoiando o Cetro com firmeza
        this.arms.right.shoulder.rotation.x = 0.2;
        this.arms.right.shoulder.rotation.z = -0.15;
        this.arms.right.elbow.rotation.x = -0.3;

        // Braço esquerdo solto ao lado com leve balanço
        this.arms.left.shoulder.rotation.x = -0.1 + Math.sin(t * 2) * 0.04;
        this.arms.left.shoulder.rotation.z = 0.12;

        // Pernas levemente afastadas em pose estável
        this.legs.left.hip.rotation.z = 0.08;
        this.legs.right.hip.rotation.z = -0.08;
        break;

      case 'combat':
        // Postura de Batalha (Centro de gravidade baixo, Cetro em guarda)
        this.pelvis.position.y = 1.52;
        this.spine.rotation.x = 0.22;
        this.head.rotation.x = -0.18;

        // Braço direito com arma apontada à frente
        this.arms.right.shoulder.rotation.x = 0.85;
        this.arms.right.shoulder.rotation.y = -0.3;
        this.arms.right.elbow.rotation.x = -0.7;

        // Braço esquerdo em guarda defensiva
        this.arms.left.shoulder.rotation.x = 0.65;
        this.arms.left.shoulder.rotation.z = 0.45;
        this.arms.left.elbow.rotation.x = -1.1;

        // Pernas flexionadas
        this.legs.left.hip.rotation.x = 0.35;
        this.legs.left.knee.rotation.x = -0.45;
        this.legs.right.hip.rotation.x = -0.25;
        this.legs.right.knee.rotation.x = 0.35;
        break;

      case 'attack':
        // Golpe de Ataque Nobre (Golpe cortante para baixo com o Cetro)
        const atkProg = (t % 1.4) / 1.4;
        if (atkProg < 0.35) {
          // Fase 1: Armar o golpe (elevar cetro para trás)
          const prep = atkProg / 0.35;
          this.arms.right.shoulder.rotation.x = 0.5 + prep * 1.8;
          this.arms.right.shoulder.rotation.z = -prep * 0.4;
          this.chest.rotation.y = prep * 0.4;
        } else if (atkProg < 0.65) {
          // Fase 2: O Impacto devastador para a frente
          const swing = (atkProg - 0.35) / 0.3;
          this.arms.right.shoulder.rotation.x = 2.3 - swing * 2.8;
          this.chest.rotation.x = swing * 0.35;
          this.chest.rotation.y = 0.4 - swing * 0.8;
        } else {
          // Fase 3: Recuperação
          this.arms.right.shoulder.rotation.x = -0.5;
        }
        break;

      case 'victory':
        // Brado de Vitória do Leão de Judá (Erguendo o Cetro aos Céus)
        this.chest.rotation.x = -0.25;
        this.head.rotation.x = -0.55; // Olhando para o alto
        this.arms.right.shoulder.rotation.x = 2.9; // Braço totalmente erguido ao céu
        this.arms.right.shoulder.rotation.z = -0.2;
        this.arms.left.shoulder.rotation.x = 0.8;
        this.arms.left.shoulder.rotation.z = 0.5;
        this.pelvis.position.y = 1.68 + Math.sin(t * 5) * 0.02;
        break;

      case 'awakening':
        // Despertar Ancestral (Levitação e Aura Flamejante)
        const floatY = Math.sin(t * 3) * 0.15;
        this.pelvis.position.y = 1.85 + floatY;
        this.arms.right.shoulder.rotation.z = -1.2;
        this.arms.left.shoulder.rotation.z = 1.2;
        this.arms.right.shoulder.rotation.x = 0.3;
        this.arms.left.shoulder.rotation.x = 0.3;
        this.head.rotation.x = -0.3;
        this.legs.left.hip.rotation.x = 0.2;
        this.legs.right.hip.rotation.x = 0.3;
        break;
    }
  }

  resetTransforms() {
    this.chest.rotation.set(0, 0, 0);
    this.spine.rotation.set(0, 0, 0);
    this.head.rotation.set(0, 0, 0);
    this.neck.rotation.set(0, 0, 0);

    ['left', 'right'].forEach((side) => {
      this.arms[side].shoulder.rotation.set(0, 0, 0);
      this.arms[side].elbow.rotation.set(0, 0, 0);
      this.arms[side].wrist.rotation.set(0, 0, 0);

      this.legs[side].hip.rotation.set(0, 0, 0);
      this.legs[side].knee.rotation.set(0, 0, 0);
    });
  }
}
