// Bitmoji Components Library
const bitmojis = {
  // Default user Bitmoji
  default: `
    <svg viewBox="0 0 100 100" class="bitmoji">
      <circle cx="50" cy="50" r="45" fill="#FFD180"/>
      <circle cx="50" cy="45" r="35" fill="#FFAB40"/>
      <circle cx="35" cy="40" r="5" fill="#212121"/>
      <circle cx="65" cy="40" r="5" fill="#212121"/>
      <path d="M35 60 Q50 70 65 60" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,

  // Sarah Chen - Tech enthusiast
  sarah: `
    <svg viewBox="0 0 100 100" class="bitmoji">
      <circle cx="50" cy="50" r="45" fill="#FFE0B2"/>
      <path d="M20 40 h60 v25 q-30 20 -60 0 v-25" fill="#4A148C"/>
      <circle cx="35" cy="40" r="5" fill="#212121"/>
      <circle cx="65" cy="40" r="5" fill="#212121"/>
      <path d="M35 60 Q50 70 65 60" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
      <path d="M15 30 q35 -20 70 0" fill="#3E2723" stroke="none"/>
    </svg>
  `,

  // Marcus Johnson - Music producer
  marcus: `
    <svg viewBox="0 0 100 100" class="bitmoji">
      <circle cx="50" cy="50" r="45" fill="#8D6E63"/>
      <path d="M20 30 h60 v10 q-30 20 -60 0 v-10" fill="#212121"/>
      <circle cx="35" cy="40" r="5" fill="#212121"/>
      <circle cx="65" cy="40" r="5" fill="#212121"/>
      <path d="M35 60 Q50 70 65 60" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
      <path d="M25 25 h50" stroke="#212121" stroke-width="5"/>
    </svg>
  `,

  // Elena Rodriguez - Storyteller
  elena: `
    <svg viewBox="0 0 100 100" class="bitmoji">
      <circle cx="50" cy="50" r="45" fill="#FFCCBC"/>
      <path d="M15 35 q35 -30 70 0" fill="#FF5722" stroke="none"/>
      <circle cx="35" cy="40" r="5" fill="#212121"/>
      <circle cx="65" cy="40" r="5" fill="#212121"/>
      <path d="M35 60 Q50 70 65 60" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `,

  // David Kim - Audio engineer
  david: `
    <svg viewBox="0 0 100 100" class="bitmoji">
      <circle cx="50" cy="50" r="45" fill="#FFE0B2"/>
      <path d="M20 30 h60 v15 q-30 20 -60 0 v-15" fill="#424242"/>
      <circle cx="35" cy="40" r="5" fill="#212121"/>
      <circle cx="65" cy="40" r="5" fill="#212121"/>
      <path d="M35 60 Q50 70 65 60" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
      <rect x="20" y="20" width="60" height="5" fill="#F57C00"/>
    </svg>
  `,

  // Maya Patel - Voice coach
  maya: `
    <svg viewBox="0 0 100 100" class="bitmoji">
      <circle cx="50" cy="50" r="45" fill="#FFCCBC"/>
      <path d="M15 35 q35 -20 70 0" fill="#795548" stroke="none"/>
      <circle cx="35" cy="40" r="5" fill="#212121"/>
      <circle cx="65" cy="40" r="5" fill="#212121"/>
      <path d="M35 60 Q50 70 65 60" fill="none" stroke="#212121" stroke-width="3" stroke-linecap="round"/>
      <circle cx="50" cy="25" r="8" fill="#FF9800"/>
    </svg>
  `
};

// Function to get Bitmoji by name
function getBitmoji(name = 'default') {
  return bitmojis[name] || bitmojis.default;
}

// Function to create Bitmoji element
function createBitmojiElement(name = 'default', className = '') {
  const div = document.createElement('div');
  div.className = `bitmoji-container ${className}`;
  div.innerHTML = getBitmoji(name);
  return div;
} 