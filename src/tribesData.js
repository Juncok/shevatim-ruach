/**
 * tribesData.js - Lore bíblico, atributos e identidade visual das 12 Tribos de Israel
 */
export const TRIBES = [
  {
    id: 'judah',
    name: 'JUDÁ',
    hebrew: 'יְהוּדָה',
    title: 'O Leão Soberano',
    totem: '🦁 Leão de Ouro',
    symbol: '🦁',
    element: 'Luz Sagrada e Terra',
    blessing: '"Judá é leãozinho; da presa subiste, filho meu. Encurva-se e deita-se como leão; o cetro não se arredará de Judá." (Gênesis 49:9-10)',
    role: 'Guerreiro Régio • Golpes de Alto Impacto',
    weapon: 'Cetro Imperial de Ouro e Lápis-Lazúli',
    ultimate: 'Fúria do Leão Ancestral (Invocação de Avatar Espectral)',
    forms: {
      young: {
        title: 'O Jovem Leãozinho de Hebrom',
        role: 'Guerreiro Ágil • Combos de Espada de Bronze e Esquivas Rápidas',
        weapon: 'Espada Curta de Bronze e Bordão de Pastor',
        ultimate: 'Investida do Leãozinho (Combo Acrobático Veloz)',
        modelFile: 'judah_young.glb',
        stats: { power: 82, speed: 94, defense: 74, ruach: 75 }
      },
      awakened: {
        title: 'O Leão Soberano (Despertar da Bênção)',
        role: 'Patriarca Ungido • Alto Impacto, Super Armadura e Luz Solar',
        weapon: 'Cetro Imperial de Ouro e Lápis-Lazúli',
        ultimate: 'Fúria do Leão Ancestral (Invocação de Avatar Espectral)',
        modelFile: 'judah.glb',
        stats: { power: 98, speed: 80, defense: 95, ruach: 100 }
      }
    },
    colors: {
      primary: '#f59e0b',
      secondary: '#1e3a8a',
      accent: '#fbbf24',
      glow: '#fef08a'
    },
    stats: {
      power: 95,
      speed: 78,
      defense: 90,
      ruach: 88,
      range: 75
    },
    status: 'COMPLETO'
  },
  {
    id: 'benjamin',
    name: 'BENJAMIM',
    hebrew: 'בִּנְיָמִין',
    title: 'O Lobo Noturno',
    totem: '🐺 Lobo Voraz',
    symbol: '🐺',
    element: 'Sombras e Vento',
    blessing: '"Benjamim é lobo que despedaça; pela manhã devorará a presa e à tarde repartirá o despojo." (Gênesis 49:27)',
    role: 'Assassino Ágil • Combos Rápidos e Furtividade',
    weapon: 'Adagas Duplas de Obsidiana e Damasco',
    ultimate: 'Alcateia das Sombras (Fúria Berserker)',
    colors: {
      primary: '#9333ea',
      secondary: '#0f172a',
      accent: '#c084fc',
      glow: '#e9d5ff'
    },
    stats: {
      power: 82,
      speed: 98,
      defense: 70,
      ruach: 84,
      range: 65
    },
    status: 'EM DESENVOLVIMENTO'
  },
  {
    id: 'dan',
    name: 'DAN',
    hebrew: 'דָּן',
    title: 'A Serpente da Vereda',
    totem: '🐍 Víbora Chifruda',
    symbol: '🐍',
    element: 'Veneno e Armadilhas',
    blessing: '"Dan será serpente junto ao caminho, uma víbora junto à vereda, que morde os talões do cavalo." (Gênesis 49:17)',
    role: 'Tático Furtivo • Esquivas e Efeitos de Dano Contínuo',
    weapon: 'Chicote Segmentado de Lâminas e Foice Curva',
    ultimate: 'Mordida da Serpente de Bronze',
    colors: {
      primary: '#10b981',
      secondary: '#064e3b',
      accent: '#34d399',
      glow: '#a7f3d0'
    },
    stats: {
      power: 76,
      speed: 92,
      defense: 72,
      ruach: 86,
      range: 85
    },
    status: 'PLANEJADO'
  },
  {
    id: 'levi',
    name: 'LEVI',
    hebrew: 'לֵוִי',
    title: 'O Zelote do Altar Sagrado',
    totem: '🔥 Chamas do Santuário',
    symbol: '🔥',
    element: 'Fogo Divino e Julgamento',
    blessing: '"Ensinarão os teus juízos a Jacó, e a tua lei a Israel; colocarão incenso diante de ti e holocausto sobre o teu altar." (Deut 33:10)',
    role: 'Sacerdote Guerreiro • Magias de Luz Celestial e Fogo',
    weapon: 'Cajado com Efod das 12 Pedras Preciosas e Incensário de Bronze',
    ultimate: 'Glória da Shekinah (Pilar de Fogo Sagrado)',
    colors: {
      primary: '#ef4444',
      secondary: '#ffffff',
      accent: '#f87171',
      glow: '#fecaca'
    },
    stats: {
      power: 88,
      speed: 75,
      defense: 80,
      ruach: 100,
      range: 92
    },
    status: 'PLANEJADO'
  },
  {
    id: 'naftali',
    name: 'NAFTALI',
    hebrew: 'נַפְתָּלִי',
    title: 'A Gazela Livre',
    totem: '🦌 Cerva Solta',
    symbol: '🦌',
    element: 'Tempestade e Agilidade Aérea',
    blessing: '"Naftali é uma cerva solta que profere palavras formosas." (Gênesis 49:21)',
    role: 'Mestre Acrobático • O Lutador mais Rápido do Jogo',
    weapon: 'Lança Leve com Penas Douradas e Lâminas de Chute',
    ultimate: 'Salto do Vento Celestial (Tempestade de Chutes Aéreos)',
    colors: {
      primary: '#06b6d4',
      secondary: '#083344',
      accent: '#38bdf8',
      glow: '#bae6fd'
    },
    stats: {
      power: 74,
      speed: 100,
      defense: 65,
      ruach: 85,
      range: 80
    },
    status: 'PLANEJADO'
  },
  {
    id: 'zebulom',
    name: 'ZEBULOM',
    hebrew: 'זְבוּלֻן',
    title: 'O Senhor dos Mares',
    totem: '⛵ Caravela / Tridente',
    symbol: '🌊',
    element: 'Água e Tsunami',
    blessing: '"Zebulom habitará no porto dos mares; e será porto para navios." (Gênesis 49:13)',
    role: 'Combatente Marítimo • Controle de Campo e Ondas',
    weapon: 'Tridente dos Abismos e Correntes de Âncora',
    ultimate: 'Mar da Fúria (Turbilhão Aquático)',
    colors: {
      primary: '#0284c7',
      secondary: '#172554',
      accent: '#60a5fa',
      glow: '#bfdbfe'
    },
    stats: {
      power: 85,
      speed: 82,
      defense: 84,
      ruach: 87,
      range: 88
    },
    status: 'PLANEJADO'
  },
  {
    id: 'issacar',
    name: 'ISSACAR',
    hebrew: 'יִשָּׂשכָר',
    title: 'O Titã Inabalável',
    totem: '🪨 Jumento Forte / Constelações',
    symbol: '⭐',
    element: 'Terra e Astrologia Bíblica',
    blessing: '"Issacar é um jumento forte, deitado entre dois fardos." (Gênesis 49:14)',
    role: 'Super Tanker • Hiper-Armadura e Golpes Telúricos',
    weapon: 'Escudo Maciço de Basalto e Mangual Pesado',
    ultimate: 'Impacto dos Céus (Queda de Meteoro)',
    colors: {
      primary: '#d97706',
      secondary: '#451a03',
      accent: '#f59e0b',
      glow: '#fde68a'
    },
    stats: {
      power: 96,
      speed: 60,
      defense: 100,
      ruach: 82,
      range: 65
    },
    status: 'PLANEJADO'
  },
  {
    id: 'gade',
    name: 'GADE',
    hebrew: 'גָּד',
    title: 'A Vanguarda de Choque',
    totem: '🛡️ Tropa de Incursão',
    symbol: '⚔️',
    element: 'Aço e Estratégia Militar',
    blessing: '"Quanto a Gade, uma tropa o assaltará, mas ele a perseguirá no final." (Gênesis 49:19)',
    role: 'Especialista em Contra-Ataque • Posturas Militares',
    weapon: 'Lança de Choque e Escudo Balístico Antigo',
    ultimate: 'Falange Triunfante (Formação Invencível)',
    colors: {
      primary: '#64748b',
      secondary: '#1e293b',
      accent: '#94a3b8',
      glow: '#f1f5f9'
    },
    stats: {
      power: 89,
      speed: 83,
      defense: 92,
      ruach: 80,
      range: 78
    },
    status: 'PLANEJADO'
  },
  {
    id: 'aser',
    name: 'ASER',
    hebrew: 'אָשֵׁר',
    title: 'O Andarilho de Bronze',
    totem: '🫒 Oliveira Real e Calçado de Ferro',
    symbol: '🫒',
    element: 'Óleo Santo e Metal Forjado',
    blessing: '"O teu calçado seja de ferro e bronze; e a tua força seja como os teus dias." (Deut 33:25)',
    role: 'Lutador de Chutes Pesados • Pés de Ferro e Óleo Flamejante',
    weapon: 'Botas e Greaves de Ferro e Bronze Forjados',
    ultimate: 'Pisada dos Montes (Impacto Sísmico Dourado)',
    colors: {
      primary: '#84cc16',
      secondary: '#365314',
      accent: '#a3e635',
      glow: '#d9f99d'
    },
    stats: {
      power: 87,
      speed: 84,
      defense: 88,
      ruach: 86,
      range: 70
    },
    status: 'PLANEJADO'
  },
  {
    id: 'ruben',
    name: 'RÚBEN',
    hebrew: 'רְאוּבֵן',
    title: 'A Torrente Impetuosa',
    totem: '🌊 Correnteza Indomável',
    symbol: '💧',
    element: 'Pressão Hidráulica e Vento Forte',
    blessing: '"Rúben, tu és meu primogênito, minha força e as primícias do meu vigor; impetuoso como a água." (Gênesis 49:3-4)',
    role: 'Pressão Contínua • Espadachim Voraz sem Intervalos',
    weapon: 'Montante Ondulado (Espada Flamejante)',
    ultimate: 'Torrente do Primogênito',
    colors: {
      primary: '#3b82f6',
      secondary: '#1e3a8a',
      accent: '#60a5fa',
      glow: '#dbeafe'
    },
    stats: {
      power: 91,
      speed: 86,
      defense: 76,
      ruach: 84,
      range: 82
    },
    status: 'PLANEJADO'
  },
  {
    id: 'simeao',
    name: 'SIMEÃO',
    hebrew: 'שִׁמְעוֹן',
    title: 'A Lâmina Escarlate',
    totem: '⚔️ Espadas de Violência',
    symbol: '🗡️',
    element: 'Fúria e Sangue de Batalha',
    blessing: '"Instrumentos de violência são as suas espadas; no seu furor mataram homens." (Gênesis 49:5-6)',
    role: 'Berserker Implacável • Mais dano conforme perde vida',
    weapon: 'Kopis Gêmeos (Espadas Curvas Cortantes)',
    ultimate: 'Corte Carmesim do Vingador',
    colors: {
      primary: '#dc2626',
      secondary: '#450a0a',
      accent: '#f87171',
      glow: '#fecaca'
    },
    stats: {
      power: 97,
      speed: 88,
      defense: 62,
      ruach: 79,
      range: 72
    },
    status: 'PLANEJADO'
  },
  {
    id: 'jose',
    name: 'JOSÉ',
    hebrew: 'יוֹסֵף',
    title: 'O Príncipe do Búfalo Selvagem',
    totem: '🏹 Ramo Frutífero e Chifres de Búfalo',
    symbol: '🏹',
    element: 'Luz Radiante e Natureza Divina',
    blessing: '"José é um ramo frutífero junto à fonte; os seus chifres são chifres de búfalo selvagem; o seu arco permaneceu firme." (Gênesis 49:22 / Deut 33:17)',
    role: 'Atirador de Precisão Celestial • Sniping à Distância',
    weapon: 'Arco Composto Sagrado de Ouro e Flechas de Luz',
    ultimate: 'Chifres da Glória (Disparo Cósmico Perfurante)',
    colors: {
      primary: '#eab308',
      secondary: '#14532d',
      accent: '#fde047',
      glow: '#fef9c3'
    },
    stats: {
      power: 90,
      speed: 89,
      defense: 78,
      ruach: 95,
      range: 100
    },
    status: 'PLANEJADO'
  }
];
