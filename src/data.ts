// ─── Data: Plans ───────────────────────────────────────────────────────────────
export interface TimelineItem {
  time: string;
  emoji: string;
  activity: string;
  description: string;
}

export interface Plan {
  id: string;
  number: string;
  emoji: string;
  title: string;
  subtitle: string;
  tagline: string;
  vibe: string;
  duration: string;
  activities: string[];
  activityEmojis: string[];
  timeline: TimelineItem[];
  color: string;
  gradient: string;
  accentColor: string;
  closingLine: string;
}

export const plans: Plan[] = [
  {
    id: 'plan-01',
    number: '01',
    emoji: '🌷',
    title: 'Sweet & Simple',
    subtitle: 'Coffee & Sunset',
    tagline: 'Kita ngobrol santai sambil menikmati kopi, lalu cari tempat yang enak buat lihat sunset.',
    vibe: 'Santai, intimate, tidak terlalu formal',
    duration: '± 3–4 jam',
    activities: ['Coffee', 'Sunset', 'Dessert', 'Deep Talk'],
    activityEmojis: ['☕', '🌅', '🍰', '💬'],
    timeline: [
      { time: '15:00', emoji: '☕', activity: 'Meet & Coffee', description: 'Mulai dari yang simple — kopi hangat dan cerita ringan.' },
      { time: '16:30', emoji: '🚶', activity: 'Take a Walk', description: 'Jalan santai, nggak perlu tujuan yang jelas.' },
      { time: '17:15', emoji: '🌅', activity: 'Sunset View', description: 'Diam sebentar, nikmati warna langit sore.' },
      { time: '18:00', emoji: '🍰', activity: 'Dessert Time', description: 'Manis di penghujung sore yang sudah indah.' },
    ],
    color: '#d4637a',
    gradient: 'linear-gradient(135deg, #fdf2f5 0%, #fce8ef 50%, #f8d7e3 100%)',
    accentColor: '#8b2252',
    closingLine: 'Sounds like a good afternoon?',
  },
  {
    id: 'plan-02',
    number: '02',
    emoji: '🎡',
    title: 'Fun Date',
    subtitle: 'Play & Explore',
    tagline: 'Kalau kamu mau sesuatu yang lebih seru, kita jalan-jalan, main, foto-foto, dan bikin cerita baru.',
    vibe: 'Fun, playful, banyak aktivitas',
    duration: '± 5–6 jam',
    activities: ['Arcade', 'Dinner', 'Photo Session', 'Jalan-jalan'],
    activityEmojis: ['🎮', '🍜', '📸', '🎡'],
    timeline: [
      { time: '14:00', emoji: '🎮', activity: 'Arcade Games', description: 'Lomba main arcade, yang kalah traktir es krim.' },
      { time: '16:00', emoji: '📸', activity: 'Photo Session', description: 'Foto-foto seru — portrait, candid, semua masuk.' },
      { time: '17:30', emoji: '🎡', activity: 'Explore Together', description: 'Jalan, lihat-lihat, temukan spot baru.' },
      { time: '19:00', emoji: '🍜', activity: 'Dinner', description: 'Makan malam sambil cerita semua yang tadi.' },
    ],
    color: '#9d6b9a',
    gradient: 'linear-gradient(135deg, #fdf0f8 0%, #f5e3f5 50%, #edd6f0 100%)',
    accentColor: '#5c3060',
    closingLine: 'Ready for an adventure?',
  },
  {
    id: 'plan-03',
    number: '03',
    emoji: '🌙',
    title: 'Romantic Escape',
    subtitle: 'Dinner Under The Stars',
    tagline: 'Yang ini sedikit berbeda. Dinner, ngobrol lebih lama, dan menikmati malam tanpa terburu-buru.',
    vibe: 'Romantic, elegant, memorable',
    duration: '± 4–5 jam',
    activities: ['City Walk', 'Dinner', 'Night View', 'Musik'],
    activityEmojis: ['🌆', '🍽️', '🌃', '🎶'],
    timeline: [
      { time: '18:00', emoji: '🌆', activity: 'City Walk', description: 'Jalan sore menjelang malam, lampu kota mulai menyala.' },
      { time: '19:00', emoji: '🍽️', activity: 'Romantic Dinner', description: 'Makan malam yang tenang, cahaya lilin, dan kamu.' },
      { time: '20:30', emoji: '🌃', activity: 'Night View', description: 'Cari spot dengan pemandangan malam yang indah.' },
      { time: '21:30', emoji: '🎶', activity: 'Just Us', description: 'Musik, langit malam, dan waktu yang tak tergesa.' },
    ],
    color: '#7b5ea7',
    gradient: 'linear-gradient(135deg, #f0edf8 0%, #e6dff5 50%, #ddd3f0 100%)',
    accentColor: '#3d2470',
    closingLine: 'Sounds like a perfect night?',
  },
];

// ─── Date & Event Info (customize here) ────────────────────────────────────────
export const dateInfo = {
  date: 'TBD',        // e.g. "Sabtu, 18 Oktober 2025"
  time: 'TBD',        // e.g. "15:00 WIB"
  meetingPoint: 'TBD', // e.g. "Lobby Mall Central Park"
  targetDate: null as Date | null, // Set a Date object for countdown, e.g. new Date('2025-10-18T15:00:00')
};

// ─── Personal Content (customize here) ─────────────────────────────────────────
export const personalContent = {
  senderName: 'Someone Special', // your name
  receiverName: 'You',           // her/his name
  personalMessage: [
    'Aku sebenarnya sudah lama ingin ngajak kamu pergi.',
    'Tapi kali ini aku nggak mau cuma bilang "Mau jalan nggak?"',
    'Jadi aku sudah menyiapkan beberapa pilihan buat kita.',
  ],
  closingMessage: 'You choose the plan. I\'ll take care of the rest.',

  // ─── Love Letter Card ─────────────────────────────
  herPhotoUrl: '/story2.jpg',        // ← ganti dengan foto dia
  herCaption: 'my favourite person ♥', // ← caption di bawah foto
  loveReasons: [
    'Your smile that lights up everything',
    'The way you laugh at the simplest things',
    'Your kindness to everyone around you',
    'How you make every moment feel special',
    'The look in your eyes when you\'re focused',
    'Your pure and gentle heart',
    'Your endless patience',
    'Simply, everything about you',
  ],
  loveLetterQuote: 'Being with you is my favourite thing in the world.',
};

