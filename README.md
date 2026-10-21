# 🦁 SHEVATIM: RUACH (שְׁבָטִים: רוּחַ)
### *As 12 Tribos de Israel*

![Three.js](https://img.shields.io/badge/Three.js-r186-black?style=for-the-badge&logo=three.js)
![WebGL](https://img.shields.io/badge/WebGL-2.0-red?style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite)
![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-amber?style=for-the-badge)

> **"Shevatim"** (שְׁבָטִים) = *As Tribos*  
> **"Ruach"** (רוּחַ) = *O Espírito / O Fôlego Sagrado de Poder*

**SHEVATIM: RUACH** é o primeiro jogo 3D (estilo *Naruto Shippuden: Ultimate Ninja Storm*, *Dragon Ball Sparking! ZERO* e *Tekken*) inspirado na rica mitologia e profecias bíblicas das **12 Tribos de Israel** (Gênesis 49 e Deuteronômio 33).

Cada guerreiro personifica a identidade, o animal sagrado, a arma e os atributos proféticos de sua respectiva tribo.

---

## 🏛️ O Showroom 3D de Personagens
O projeto conta com um **Visualizador e Showroom 3D** onde os guerreiros podem ser inspecionados em tempo real:
* 🔍 **Inspeção 360°:** Rotação e zoom livre da câmera com iluminação de estúdio (Key, Fill, Rim Light);
* 🎬 **Testador de Animações:** Postura normal (Idle), combate, golpes cortantes com armas, brado de vitória e despertar de aura;
* 📜 **Ficha Técnica e Lore:** Nome em hebraico, bênção bíblica profética, estilo de combate e gráficos de atributos;
* 🤖 **Importador de Modelos 3D (.GLB):** Suporte nativo para carregar modelos de IA (Tripo3D, Meshy) ou Mixamo com *Drag e Drop* direto no navegador!

---

## ⚔️ As 12 Tribos de Israel (Roster)

| Tribo | Totem / Símbolo | Estilo de Combate | Arma Sagrada |
| :--- | :--- | :--- | :--- |
| **Judá** | 🦁 Leão de Ouro | Guerreiro Régio • Golpes de Alto Impacto | Cetro Real de Ouro e Lápis-Lazúli |
| **Benjamim** | 🐺 Lobo Voraz | Assassino Ágil • Combos Rápidos e Furtividade | Adagas Duplas de Obsidiana e Damasco |
| **Dan** | 🐍 Víbora da Vereda | Tático Furtivo • Esquivas e Dano Contínuo | Chicote Segmentado de Lâminas e Foice |
| **Levi** | 🔥 Chamas do Santuário | Sacerdote • Magias de Luz Celestial e Fogo | Cajado com Efod das 12 Pedras Preciosas |
| **Naftali** | 🦌 Cerva Solta | Acrobático Aéreo • Velocidade Extrema | Lança Leve com Penas Douradas |
| **Zebulom** | 🌊 Senhor dos Mares | Combatente Marítimo • Controle de Campo | Tridente dos Abismos e Correntes de Âncora |
| **Issacar** | ⭐ Titã Inabalável | Super Tanker • Hiper-Armadura e Golpes Telúricos | Escudo Maciço de Basalto e Mangual |
| **Gade** | ⚔️ Vanguarda de Choque | Contra-Ataque • Posturas Militares | Lança de Choque e Escudo Balístico |
| **Aser** | 🫒 Andarilho de Bronze | Chutes Sísmicos • Calçado de Ferro e Bronze | Botas e Greaves Forjados de Metal |
| **Rúben** | 💧 Torrente Impetuosa | Pressão Contínua • Espadachim Voraz | Montante Ondulado (Espada Flamejante) |
| **Simeão** | 🗡️ Lâmina Escarlate | Berserker Implacável • Mais dano com vida baixa | Kopis Gêmeos (Lâminas Curvas) |
| **José** | 🏹 Búfalo Selvagem | Atirador de Precisão Celestial • Longo Alcance | Arco Composto Sagrado e Flechas de Luz |

---

## 🛠️ Tecnologias Utilizadas
* **Engine:** [Three.js](https://threejs.org/) (WebGL 2.0 com sombras em tempo real, iluminação ACESFilmic e Shaders PBR)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Animações e Rigging:** Suporte a `.GLB` / `.GLTF` via `GLTFLoader` e `AnimationMixer`
* **Estilização:** CSS3 puro com Glassmorphism, Google Fonts (*Cinzel*, *Teko*, *Montserrat*)
* **Áudio:** Web Audio API (Síntese procedural para impactos e efeitos sonoros sem arquivos pesados)

---

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos:
* [Node.js](https://nodejs.org/) instalado (v18+)

### Instalação:
```bash
# 1. Clone o repositório
git clone https://github.com/SEU-USUARIO/shevatim-ruach.git

# 2. Acesse a pasta do projeto
cd shevatim-ruach

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Abra `http://localhost:5173/` no seu navegador!

---

## 🎨 Pipeline de Personagens 3D (Como Criar os Guerreiros com IA)

1. **Geração do Concept Art 2D (A-Pose):**
   * Imagens de referência já disponíveis na pasta `public/` (ex: `judah_concept.jpg`).
2. **Transformação em Modelo 3D:**
   * Suba a imagem no [Tripo3D](https://www.tripo3d.ai/) ou [Meshy.ai](https://www.meshy.ai/);
   * Exporte como arquivo **`.glb`**.
3. **Animações de Captura de Movimento:**
   * Envie o arquivo `.glb` para o [Adobe Mixamo](https://www.mixamo.com/);
   * Aplique animações de espada, corrida ou celebração e baixe o modelo.
4. **Visualização:**
   * Arraste o arquivo `.glb` direto na tela do navegador do jogo!

---

## 📜 Licença
Distribuído sob a licença MIT. Consulte `LICENSE` para mais informações.
