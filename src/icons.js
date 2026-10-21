/**
 * icons.js - Ícones Vetoriais Heráldicos e Guerreiros das 12 Tribos de Israel
 * Desenhados em estilo guerreiro monocromático (branco / currentColor) para estética de jogo de ação.
 */

export const TRIBE_ICONS = {
  // 1. JUDÁ: O Leão Soberano de Judá (Juba Radiante Majestosa e Face Felina de Batalha)
  judah: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="tribe-svg-icon">
      <!-- Juba Externa Ondulada e Majestosa (Juba do Leão de Judá) -->
      <path d="M12 2 C10 2 8.5 3 7 4 C5 4.5 3 6.5 2.5 9 C2 11.5 2.5 14 3.5 16 C4.5 18 6.5 20 9 21.5 L12 22.5 L15 21.5 C17.5 20 19.5 18 20.5 16 C21.5 14 22 11.5 21.5 9 C21 6.5 19 4.5 17 4 C15.5 3 14 2 12 2 Z" />
      <!-- Mechas de Juba que emolduram a face -->
      <path d="M7 4 L9 6" />
      <path d="M17 4 L15 6" />
      <path d="M3 9 L6 10" />
      <path d="M21 9 L18 10" />
      <path d="M3.5 14 L6.5 14" />
      <path d="M20.5 14 L17.5 14" />
      <!-- Orelhas Felinas Arredondadas (típicas de Leão, aninhadas na juba) -->
      <path d="M7 6.5 C6 5.5 6 4 7.5 4 C9 4 9 5.5 8.5 6.5" />
      <path d="M17 6.5 C18 5.5 18 4 16.5 4 C15 4 15 5.5 15.5 6.5" />
      <!-- Testa e Sobrancelhas de Leão -->
      <path d="M8 10 C9.5 9 10.5 9.5 12 9.5 C13.5 9.5 14.5 9 16 10" />
      <!-- Olhos Felinos Predadores -->
      <path d="M8.5 11 L10.5 11.8" stroke-width="2" />
      <path d="M15.5 11 L13.5 11.8" stroke-width="2" />
      <!-- Ponte Nasal e Focinho Felino Largo -->
      <path d="M10.5 11.8 L10.5 14.5 L13.5 14.5 L13.5 11.8" />
      <path d="M10 14.5 H14 L12 16.5 Z" fill="currentColor" />
      <!-- Bigodeiras Curvas e Queixo Forte -->
      <path d="M12 16.5 V18" />
      <path d="M9.5 17.5 C10.5 18.5 12 18 12 18 C12 18 13.5 18.5 14.5 17.5" />
      <path d="M10.5 19.5 H13.5" />
    </svg>
  `,

  // 2. BENJAMIM: Cabeça de Lobo Feroz das Sombras
  benjamin: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="tribe-svg-icon">
      <!-- Orelhas pontiagudas de Lobo -->
      <path d="M5 2.5 L8.5 8 L12 3 L15.5 8 L19 2.5 L18 10 L20 12 L17 17 L12 21.5 L7 17 L4 12 L6 10 Z" />
      <!-- Olhos penetrantes angulares -->
      <path d="M8 11.5 L10 12" />
      <path d="M16 11.5 L14 12" />
      <!-- Nariz e focinho afiado -->
      <path d="M12 14.5 L11 16.5 H13 Z" fill="currentColor" />
      <path d="M12 16.5 V18.5" />
      <path d="M10 18.5 L12 19.5 L14 18.5" />
    </svg>
  `,

  // 3. DAN: Víbora Armada / Serpente Encurvada para o Bote
  dan: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="tribe-svg-icon">
      <!-- Cabeça de Víbora Chifruda com Olhar Predador -->
      <path d="M12 2 C8.5 2 6 4.5 6 7.5 C6 10.5 8.5 12 12 13 C15.5 14 18 15.5 18 18.5 C18 20.5 16 22 13 22 C10 22 8 20 8 18" />
      <!-- Chifres / Presas da Serpente -->
      <path d="M8.5 3.5 L6.5 2" />
      <path d="M15.5 3.5 L17.5 2" />
      <!-- Olho de Réptil -->
      <circle cx="10" cy="6.5" r="1" fill="currentColor" />
      <!-- Língua Farpada -->
      <path d="M12 2 V0.5 L10.5 -0.5 M12 0.5 L13.5 -0.5" />
      <path d="M11 6 L14 6" />
    </svg>
  `,

  // 4. LEVI: Fogo Sagrado do Altar e Braseiro do Santuário
  levi: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="tribe-svg-icon">
      <!-- Chamas Sagradas em 3 níveis de poder -->
      <path d="M12 2 C12 2 15 5.5 15 8.5 C15 10 14 11 13 11.5 C14.5 11.5 17 13 17 15.5 C17 18.5 14.5 21 12 21 C9.5 21 7 18.5 7 15.5 C7 12.5 9.5 10.5 10.5 8 C11.5 9 12.5 9.5 12.5 9.5 C12.5 9.5 11 6.5 12 2 Z" />
      <path d="M12 13 C12 13 13.5 14.5 13.5 16 C13.5 17 12.8 17.8 12 18 C11.2 17.8 10.5 17 10.5 16 C10.5 14.5 12 13 12 13 Z" fill="currentColor" />
      <!-- Base do Altar de Bronze -->
      <path d="M5 21.5 H19" stroke-width="2" />
      <path d="M7 21.5 L8.5 23 H15.5 L17 21.5" />
    </svg>
  `,

  // 5. NAFTALI: Cervo Ágil com Galhadas de Batalha
  naftali: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="tribe-svg-icon">
      <!-- Chifres / Galhadas Afiadas de Cervo -->
      <path d="M6 2 L8 6 L12 9 L16 6 L18 2" />
      <path d="M4 4 L7 6" />
      <path d="M20 4 L17 6" />
      <path d="M9 4 L11 7" />
      <path d="M15 4 L13 7" />
      <!-- Cabeça e Focinho Veloz -->
      <path d="M10 9.5 L8 12.5 L10 18 L12 21.5 L14 18 L16 12.5 L14 9.5 Z" />
      <!-- Olhos e Linhas Faciais -->
      <circle cx="10" cy="13" r="0.8" fill="currentColor" />
      <circle cx="14" cy="13" r="0.8" fill="currentColor" />
      <path d="M11 19 H13" />
    </svg>
  `,

  // 6. ZEBULOM: Tridente de Guerra Naval e Ondas de Impacto
  zebulom: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="tribe-svg-icon">
      <!-- Ponta Central do Tridente -->
      <path d="M12 2 L13.5 6 H10.5 Z" fill="currentColor" />
      <path d="M12 6 V22" stroke-width="2" />
      <!-- Pontas Laterais com Barbas de Arpão -->
      <path d="M6 7 L7.5 4 L8.5 7 C8.5 11 10 13 12 13 C14 13 15.5 11 15.5 7 L16.5 4 L18 7" />
      <!-- Asas / Ondas do Tridente -->
      <path d="M4 17 C6 15.5 8 18 10 16.5" />
      <path d="M14 16.5 C16 18 18 15.5 20 17" />
    </svg>
  `,

  // 7. ISSACAR: Escudo de Rocha com Estrela Celestial
  issacar: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="tribe-svg-icon">
      <!-- Escudo Balístico Fortificado de Basalto -->
      <path d="M12 2 L20 5.5 V11.5 C20 16.5 16.5 20.5 12 22 C7.5 20.5 4 16.5 4 11.5 V5.5 Z" />
      <!-- Estrela Celestial Radiante (Sabedoria dos Céus) -->
      <path d="M12 6.5 L13.5 10 L17 10.5 L14.5 13 L15 16.5 L12 15 L9 16.5 L9.5 13 L7 10.5 L10.5 10 Z" fill="currentColor" />
    </svg>
  `,

  // 8. GADE: Duas Espadas de Choque Cruzadas com Brasão de Vanguarda
  gade: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="tribe-svg-icon">
      <!-- Espada 1 (Diagonal / Lâmina de Choque) -->
      <path d="M4 4 L17 17 M17 17 L19 16 L20 17 L17 20 L16 19 L17 17" />
      <path d="M6 3 L3 6 L5 8 L8 5 Z" fill="currentColor" />
      <path d="M2.5 2.5 L4.5 4.5" stroke-width="2.2" />
      <!-- Espada 2 (Diagonal Oposta) -->
      <path d="M20 4 L7 17 M7 17 L5 16 L4 17 L7 20 L8 19 L7 17" />
      <path d="M18 3 L21 6 L19 8 L16 5 Z" fill="currentColor" />
      <path d="M21.5 2.5 L19.5 4.5" stroke-width="2.2" />
      <!-- Centro do Brasão de Choque -->
      <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    </svg>
  `,

  // 9. ASER: Ramo de Oliveira Sagrada e Lâmina de Bronze
  aser: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="tribe-svg-icon">
      <!-- Lâmina Central de Ferro e Bronze -->
      <path d="M12 2 L13.5 5 V15 L12 17 L10.5 15 V5 Z" fill="currentColor" />
      <path d="M12 17 V22" stroke-width="2" />
      <path d="M9.5 18 H14.5" stroke-width="2" />
      <!-- Ramos de Oliveira Guerreira nas Laterais -->
      <path d="M7 8 C5.5 9 5 11 6 12 C7 11 8 10 7 8 Z" fill="currentColor" />
      <path d="M6 13 C4.5 14 4.5 16 6 17 C7 16 7.5 15 6 13 Z" fill="currentColor" />
      <path d="M17 8 C18.5 9 19 11 18 12 C17 11 16 10 17 8 Z" fill="currentColor" />
      <path d="M18 13 C19.5 14 19.5 16 18 17 C17 16 16.5 15 18 13 Z" fill="currentColor" />
    </svg>
  `,

  // 10. RÚBEN: Montante Ondulado e Torrente Primogênita
  ruben: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="tribe-svg-icon">
      <!-- Espada Flamberge / Montante Ondulado Central -->
      <path d="M12 2 L13 4 C11.5 6 13.5 8 12 10 C10.5 12 12.5 14 11 16 H13 L12 17 V22" stroke-width="2" />
      <path d="M9 17 H15" stroke-width="2" />
      <!-- Vórtices de Torrente Impetuosa -->
      <path d="M4 10 C6 7.5 8.5 8 8 10 C7.5 12 5 12.5 4 14 C3 15.5 4 17 6 18" />
      <path d="M20 10 C18 7.5 15.5 8 16 10 C16.5 12 19 12.5 20 14 C21 15.5 20 17 18 18" />
    </svg>
  `,

  // 11. SIMEÃO: Lâminas Gêmeas de Fúria (Kopis Berserker)
  simeao: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="tribe-svg-icon">
      <!-- Lâmina Curva 1 (Kopis Esquerdo) -->
      <path d="M3 21 L6 18 L5 16 M6 18 L10 14 C12 12 13 8 11 4 C14 5 17 8 15 12 L11 16 L8 19 L6 18" fill="currentColor" fill-opacity="0.2" />
      <!-- Lâmina Curva 2 (Kopis Direito) -->
      <path d="M21 21 L18 18 L19 16 M18 18 L14 14 C12 12 11 8 13 4 C10 5 7 8 9 12 L13 16 L16 19 L18 18" fill="currentColor" fill-opacity="0.2" />
      <!-- Ponto de Impacto Sangrento -->
      <circle cx="12" cy="13" r="1.5" fill="currentColor" />
    </svg>
  `,

  // 12. JOSÉ: Arco de Guerra de Búfalo e Flecha Sagrada
  jose: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="tribe-svg-icon">
      <!-- Arco Recurvo Tenso (Chifres de Búfalo) -->
      <path d="M6 3 C10 5 13 9 13 12 C13 15 10 19 6 21" stroke-width="2" />
      <path d="M6 3 L6 21" stroke-dasharray="1.5 1.5" />
      <!-- Flecha de Luz Rápida Notched -->
      <path d="M3 12 H20" stroke-width="2" />
      <path d="M17 9 L21 12 L17 15" stroke-width="2" fill="currentColor" />
      <!-- Emblema de Chifre de Búfalo no Centro -->
      <path d="M14 8 C16 7 18 8 19 10" />
      <path d="M14 16 C16 17 18 16 19 14" />
    </svg>
  `
};

/**
 * Retorna o SVG do ícone correspondente da tribo
 * @param {string} tribeId 
 * @returns {string} SVG HTML string
 */
export function getTribeIcon(tribeId) {
  return TRIBE_ICONS[tribeId] || TRIBE_ICONS['judah'];
}
