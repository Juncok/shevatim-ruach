import { TRIBES } from './tribesData.js';
import { CharacterShowroom } from './engine/CharacterShowroom.js';

class App {
  constructor() {
    this.canvas = document.getElementById('showroom-canvas');
    this.currentTribe = TRIBES[0]; // Judá por padrão

    // Inicializa o Showroom 3D
    this.showroom = new CharacterShowroom(this.canvas, (tribe) => {
      this.updateTribeInfoPanel(tribe);
    });

    // Constrói o Carrossel das 12 Tribos no rodapé
    this.initRosterCarousel();

    // Conecta os botões de Animação e Câmera
    this.bindActionButtons();

    // Carrega o primeiro guerreiro (Judá)
    this.selectTribe(this.currentTribe);

    // Ajusta proporção no redimensionamento da janela
    window.addEventListener('resize', () => this.showroom.onResize());
  }

  initRosterCarousel() {
    const container = document.getElementById('roster-carousel');
    if (!container) return;

    container.innerHTML = '';
    TRIBES.forEach((tribe) => {
      const card = document.createElement('div');
      card.className = `roster-card ${tribe.id === this.currentTribe.id ? 'active' : ''}`;
      card.dataset.tribeId = tribe.id;

      // Status badge class
      let statusClass = 'status-planejado';
      if (tribe.status === 'COMPLETO') statusClass = 'status-completo';
      else if (tribe.status === 'EM DESENVOLVIMENTO') statusClass = 'status-em-desenvolvimento';

      card.innerHTML = `
        <span class="card-icon">${tribe.symbol}</span>
        <span class="card-name">${tribe.name}</span>
        <span class="card-hebrew">${tribe.hebrew}</span>
        <span class="card-status ${statusClass}">${tribe.status}</span>
      `;

      card.addEventListener('click', () => {
        this.selectTribe(tribe);
      });

      container.appendChild(card);
    });
  }

  selectTribe(tribe) {
    this.currentTribe = tribe;

    // Atualiza cards ativos no carrossel
    document.querySelectorAll('.roster-card').forEach((card) => {
      card.classList.toggle('active', card.dataset.tribeId === tribe.id);
    });

    // Atualiza header
    const tag = document.getElementById('current-tribe-tag');
    if (tag) {
      tag.innerText = `${tribe.symbol} TRIBO DE ${tribe.name}`;
      tag.style.borderColor = tribe.colors.primary;
      tag.style.color = tribe.colors.accent;
    }

    // Carrega modelo 3D no Showroom
    this.showroom.loadTribe(tribe);
  }

  updateTribeInfoPanel(tribe) {
    const elHebrew = document.getElementById('char-hebrew');
    const elSymbol = document.getElementById('char-symbol');
    const elName = document.getElementById('char-name');
    const elTitle = document.getElementById('char-title');
    const elBlessing = document.getElementById('char-blessing');
    const elRole = document.getElementById('char-role');
    const elWeapon = document.getElementById('char-weapon');
    const elUltimate = document.getElementById('char-ultimate');

    if (elHebrew) elHebrew.innerText = tribe.hebrew;
    if (elSymbol) elSymbol.innerText = tribe.symbol;
    if (elName) elName.innerText = tribe.name;
    if (elTitle) elTitle.innerText = tribe.title;
    if (elBlessing) elBlessing.innerText = tribe.blessing;
    if (elRole) elRole.innerText = tribe.role;
    if (elWeapon) elWeapon.innerText = tribe.weapon;
    if (elUltimate) elUltimate.innerText = tribe.ultimate;

    // Atualiza Barras de Atributos
    const setStat = (id, val) => {
      const fill = document.getElementById(`stat-${id}`);
      const num = document.getElementById(`stat-val-${id}`);
      if (fill) fill.style.width = `${val}%`;
      if (num) num.innerText = val;
    };

    setStat('power', tribe.stats.power);
    setStat('speed', tribe.stats.speed);
    setStat('defense', tribe.stats.defense);
    setStat('ruach', tribe.stats.ruach);
  }

  bindActionButtons() {
    // 1. Botões de Animação
    const animBtns = document.querySelectorAll('.btn-anim');
    animBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        animBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const animName = btn.dataset.anim;
        this.showroom.setAnimation(animName);
      });
    });

    // 2. Presets de Câmera
    const camBtns = document.querySelectorAll('.btn-cam');
    camBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        camBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const preset = btn.dataset.cam;
        this.showroom.setCameraPreset(preset);
      });
    });

    // 3. Botão de Giro 360° Automático
    const btnRotate = document.getElementById('btn-autorotate');
    if (btnRotate) {
      btnRotate.addEventListener('click', () => {
        const isSpinning = this.showroom.toggleAutoRotate();
        btnRotate.innerText = isSpinning
          ? '🔄 GIRAR 360° AUTOMÁTICO: ATIVO'
          : '🔄 GIRAR 360° AUTOMÁTICO: DESLIGADO';
        btnRotate.style.background = isSpinning ? 'rgba(245, 158, 11, 0.3)' : '';
      });
    }

    // 4. Botão de Importar Modelo .GLB de IA
    const btnImport = document.getElementById('btn-import-glb');
    const fileInput = document.getElementById('glb-file-input');
    if (btnImport && fileInput) {
      btnImport.addEventListener('click', () => fileInput.click());
      fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          this.showroom.loadGLBFromFile(e.target.files[0]);
        }
      });
    }
  }
}

// Inicia a aplicação após o carregamento da página
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
