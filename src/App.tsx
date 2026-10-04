import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface Song {
  t: string;
  a: string;
  n: string;
  g: string;
  cover: string;
  searchQ?: string; // override search query for iTunes
}

interface Plan {
  id: 'A' | 'B' | 'C';
  mood: string;
  start: string;
  end: string;
  g: string;
  photo: string;
  slots: [string, string][];
}

const CFG = {
  kamu: 'Kamu',
  aku: 'Tegar',
  tanggal: '2026-10-11',
  kota: 'SURABAYA, INDONESIA',
  wa: '6285820004069',
};

// Photos from Gambar Kenangan for Hero Section
const PHOTOS = [
  '/Gambar Kenangan/Gambar 1.jpeg',
  '/Gambar Kenangan/Gambar 2.jpeg',
  '/Gambar Kenangan/Gambar 3.jpeg',
];

const ALL_KENANGAN_PHOTOS = [
  '/Gambar Kenangan/Gambar 1.jpeg',
  '/Gambar Kenangan/Gambar 2.jpeg',
  '/Gambar Kenangan/Gambar 3.jpeg',
  '/Gambar Kenangan/Gambar 4.jpeg',
  '/Gambar Kenangan/Gambar 5.jpeg',
  '/Gambar Kenangan/Gambar 6.jpeg',
  '/Gambar Kenangan/Gambar 7.jpeg',
  '/Gambar Kenangan/Gambar 8.jpeg',
  '/Gambar Kenangan/Gambar 9.jpeg',
  '/Gambar Kenangan/Gambar 10.jpeg',
  '/Gambar Kenangan/Gambar 11.jpeg',
  '/Gambar Kenangan/Gambar 12.jpeg',
  '/Gambar Kenangan/Gambar 13.jpeg',
];

const LETTER = [
  ['Hai, sayang', 'Surat kecil sebelum kita keluar bersama.'],
  ['Aku masih jatuh cinta, setiap hari', 'Pada caramu tertawa, dan pada sore yang jadi lebih pelan kalau ada kamu.'],
  ['Mau jalan denganku?', 'Pilih lagu dan rencana di bawah. Sisanya biar aku yang siapkan.'],
];

// Songs with official album artwork
const SONGS: Song[] = [
  {
    t: "Can't Help Falling in Love",
    a: 'Elvis Presley',
    n: 'untuk malam yang tenang',
    g: 'linear-gradient(150deg,#d9a0a8,#7a1426)',
    cover: '/songs/elvis.jpg',
    searchQ: "Can't Help Falling in Love Elvis Presley",
  },
  {
    t: 'Perfect',
    a: 'Ed Sheeran',
    n: 'untuk jalan pelan berdua',
    g: 'linear-gradient(150deg,#e9c7b8,#b5545f)',
    cover: '/songs/ed.jpg',
    searchQ: 'Perfect Ed Sheeran',
  },
  {
    t: 'Lover',
    a: 'Taylor Swift',
    n: 'untuk hari yang cerah',
    g: 'linear-gradient(150deg,#f0b6c8,#a03a66)',
    cover: '/songs/taylor.jpg',
    searchQ: 'Lover Taylor Swift',
  },
  {
    t: 'Cinta Luar Biasa',
    a: 'Andmesh',
    n: 'untuk yang tidak bisa kubilang',
    g: 'linear-gradient(150deg,#c98a8a,#4a0d17)',
    cover: '/songs/andmesh.jpg',
    searchQ: 'Cinta Luar Biasa Andmesh',
  },
  {
    t: 'Yellow',
    a: 'Coldplay',
    n: 'untuk sore di tepi air',
    g: 'linear-gradient(150deg,#f2d28a,#c9622f)',
    cover: '/songs/coldplay.jpg',
    searchQ: 'Yellow Coldplay',
  },
  {
    t: 'Sempurna',
    a: 'Andra and The Backbone',
    n: 'untuk kamu, apa adanya',
    g: 'linear-gradient(150deg,#b9a3c9,#5a3a7a)',
    cover: '/songs/andra.jpg',
    searchQ: 'Sempurna Andra and The Backbone',
  },
];

// Plans with photos from Gambar Kenangan
const PLANS: Plan[] = [
  {
    id: 'A',
    mood: 'Santai dan banyak jalan',
    start: '10:00',
    end: '21:30',
    g: 'linear-gradient(160deg,#f6c26b,#c73e5c)',
    photo: '/Gambar Kenangan/Gambar 4.jpeg',
    slots: [
      ['Pagi', 'Siang atau pagi, kita tentukan nanti'],
      ['Sore', 'Graha Natura'],
      ['Malam', 'Jalan Tunjungan'],
    ],
  },
  {
    id: 'B',
    mood: 'Tenang dan hangat',
    start: '16:00',
    end: '21:30',
    g: 'linear-gradient(160deg,#e9894f,#8a1328)',
    photo: '/Gambar Kenangan/Gambar 5.jpeg',
    slots: [
      ['Sore', 'Lagoon, melukis kecil dan membaca buku'],
      ['Malam', 'Dinner'],
    ],
  },
  {
    id: 'C',
    mood: 'Baru dan seru',
    start: '16:00',
    end: '21:30',
    g: 'linear-gradient(160deg,#6fb4d8,#5b43a0)',
    photo: '/Gambar Kenangan/Gambar 1.jpeg',
    slots: [
      ['Sore', 'Surabaya North Quay'],
      ['Malam', 'Cafe baru'],
    ],
  },
];

const bulan = [
  'JANUARI', 'FEBRUARI', 'MARET', 'APRIL', 'MEI', 'JUNI',
  'JULI', 'AGUSTUS', 'SEPTEMBER', 'OKTOBER', 'NOVEMBER', 'DESEMBER',
];

export default function App() {
  // ─── Surat State ───
  const [pg, setPg] = useState(0);

  // ─── Musik State ───
  const [pickedSongs, setPickedSongs] = useState<number[]>([]);
  const MAX_SONGS = 3;
  const [playingIdx, setPlayingIdx] = useState<number | null>(null);
  const [previewUrls, setPreviewUrls] = useState<(string | null)[]>(SONGS.map(() => null));
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch iTunes preview URLs
  useEffect(() => {
    SONGS.forEach((s, idx) => {
      const q = s.searchQ || `${s.t} ${s.a}`;
      fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&limit=1&entity=song&media=music`)
        .then((r) => r.json())
        .then((data) => {
          const url: string | null = data.results?.[0]?.previewUrl ?? null;
          setPreviewUrls((prev) => {
            const next = [...prev];
            next[idx] = url;
            return next;
          });
        })
        .catch(() => { /* no preview */ });
    });
  }, []);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  // Play/Pause toggle
  const handlePlayPause = (idx: number) => {
    const url = previewUrls[idx];
    if (!url) return;

    if (playingIdx === idx) {
      // Pause current
      audioRef.current?.pause();
      setPlayingIdx(null);
      return;
    }

    // Stop previous
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }

    const audio = new Audio(url);
    audio.volume = 0.85;
    audioRef.current = audio;
    audio.play().catch(() => { });
    setPlayingIdx(idx);

    audio.addEventListener('ended', () => {
      setPlayingIdx(null);
    });
  };

  // ─── Tiket & RSVP State ───
  const [selectedPlanId, setSelectedPlanId] = useState<'A' | 'B' | 'C' | null>(null);
  const tgl = CFG.tanggal;
  const [jam, setJam] = useState('16:00');
  const [statusMsg, setStatusMsg] = useState('');
  const [isLaceSpinning, setIsLaceSpinning] = useState(false);

  // ─── Sempurna floating player state ───
  const [sempurnaOpen, setSempurnaOpen] = useState(false);


  const ticketsRef = useRef<HTMLDivElement>(null);
  const rsvpRef = useRef<HTMLDivElement>(null);
  const mainPhotoRef = useRef<HTMLDivElement>(null);

  // Parallax scroll on main photo
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (mainPhotoRef.current) {
          const y = Math.min(window.scrollY, 600);
          mainPhotoRef.current.style.transform = `translateY(${y * -0.04}px)`;
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── Scroll Reveal (IntersectionObserver) ───
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;

    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).classList.add('revealed');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);


  const selectedPlan = useMemo(
    () => PLANS.find((p) => p.id === selectedPlanId) || null,
    [selectedPlanId]
  );

  // Song toggle handler
  const handleToggleSong = (idx: number) => {
    setPickedSongs((prev) => {
      const found = prev.indexOf(idx);
      if (found > -1) {
        return prev.filter((i) => i !== idx);
      }
      if (prev.length >= MAX_SONGS) {
        return [...prev.slice(1), idx];
      }
      return [...prev, idx];
    });
  };

  // Fixed & Smooth Lace RSVP Click Handler
  const handleLaceClick = () => {
    setIsLaceSpinning(true);
    try {
      confetti({
        particleCount: 35,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#8a1328', '#c73e5c', '#eadfd3'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      ticketsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsLaceSpinning(false);
    }, 550);
  };

  // Ticket pick handler
  const handlePickTicket = (plan: Plan) => {
    setSelectedPlanId(plan.id);
    setJam(plan.start);
    setStatusMsg('');

    try {
      confetti({
        particleCount: 36,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#8a1328', '#c73e5c', '#eadfd3'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      rsvpRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 600);
  };

  // Reset ticket selection
  const handleResetTicket = () => {
    setSelectedPlanId(null);
    setStatusMsg('');
    ticketsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Date formatting
  const tglText = useMemo(() => {
    const d = (tgl || CFG.tanggal).split('-');
    if (d.length !== 3) return tgl;
    const mIndex = parseInt(d[1], 10) - 1;
    return `${parseInt(d[2], 10)} ${bulan[mIndex] || d[1]} ${d[0]}`;
  }, [tgl]);

  const chosenSongsList = useMemo(
    () => pickedSongs.map((i) => `${SONGS[i].t} (${SONGS[i].a})`),
    [pickedSongs]
  );

  const planText = useCallback(() => {
    if (!selectedPlan) return '';
    const slots = selectedPlan.slots.map((s) => `- ${s[0]}: ${s[1]}`).join('\n');
    let t = `Plan ${selectedPlan.id} (${selectedPlan.mood})\n${slots}`;
    if (chosenSongsList.length) {
      t += `\nLagu pilihan: ${chosenSongsList.join(', ')}`;
    }
    return t;
  }, [selectedPlan, chosenSongsList]);

  // Google Calendar URL
  const gcalUrl = useMemo(() => {
    if (!selectedPlan) return '#';
    const d = tgl || CFG.tanggal;
    const dClean = d.replace(/-/g, '');
    const startClean = jam.replace(':', '') + '00';
    const endClean = selectedPlan.end.replace(':', '') + '00';

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Jalan bareng · Plan ${selectedPlan.id}`,
      dates: `${dClean}T${startClean}/${dClean}T${endClean}`,
      details: `${planText()}\n\nDibuat dengan sayang oleh ${CFG.aku}`,
      ctz: 'Asia/Jakarta',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }, [selectedPlan, tgl, jam, planText]);

  // Copy Plan
  const handleCopyPlan = async () => {
    const full = `${planText()}\nJadwal: ${tglText}, mulai ${jam.replace(':', '.')} WIB.`;
    try {
      await navigator.clipboard.writeText(full);
      setStatusMsg('✓ Rencana tersalin ke clipboard! Siap dikirimkan.');
      confetti({
        particleCount: 35,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#8a1328', '#c73e5c', '#fff'],
      });
    } catch {
      setStatusMsg(`Salin manual:\n${full.replace(/\n/g, ' | ')}`);
    }
  };

  // RSVP Confirm button (Direct to WhatsApp)
  const handleConfirmRsvp = () => {
    if (!selectedPlan) return;

    const slots = selectedPlan.slots.map((s) => `• ${s[0]}: ${s[1]}`).join('\n');
    let message = `Halo ${CFG.aku} ❤️\n\nAku sudah pilih rencana untuk hari kita:\n\n✨ *Plan ${selectedPlan.id} (${selectedPlan.mood})*\n📅 Tanggal: ${tglText}\n⏰ Mulai: ${jam.replace(':', '.')} WIB\n\n📍 Jadwal:\n${slots}`;

    if (chosenSongsList.length > 0) {
      message += `\n\n🎵 Lagu pilihan yang ingin kudengar:\n${chosenSongsList.map((song) => `• ${song}`).join('\n')}`;
    }

    message += `\n\nSampai bertemu nanti yaa! 🥰`;

    const waUrl = `https://wa.me/${CFG.wa}?text=${encodeURIComponent(message)}`;

    // Open WhatsApp
    window.open(waUrl, '_blank');

    setStatusMsg(`✓ Terkonfirmasi! Mengalihkan pesan RSVP ke WhatsApp ${CFG.aku}...`);
    confetti({
      particleCount: 60,
      spread: 95,
      origin: { y: 0.75 },
      colors: ['#25D366', '#8a1328', '#c73e5c', '#eadfd3', '#f6c26b'],
    });
  };

  // Lace SVG mask & pattern
  const laceSvgElements = useMemo(() => {
    const baseCircles: { cx: string; cy: string }[] = [];
    for (let i = 0; i < 36; i++) {
      const a = (i * Math.PI) / 18;
      baseCircles.push({
        cx: (200 + 181 * Math.cos(a)).toFixed(1),
        cy: (200 + 181 * Math.sin(a)).toFixed(1),
      });
    }

    const holes1: { cx: string; cy: string }[] = [];
    for (let i = 0; i < 24; i++) {
      const a = (i * Math.PI) / 12;
      holes1.push({
        cx: (200 + 160 * Math.cos(a)).toFixed(1),
        cy: (200 + 160 * Math.sin(a)).toFixed(1),
      });
    }

    const holes2: { cx: string; cy: string }[] = [];
    for (let i = 0; i < 24; i++) {
      const a = (i * Math.PI) / 12 + 0.13;
      holes2.push({
        cx: (200 + 104 * Math.cos(a)).toFixed(1),
        cy: (200 + 104 * Math.sin(a)).toFixed(1),
      });
    }

    return (
      <svg viewBox="0 0 400 400" aria-hidden="true">
        <defs>
          <mask id="lm">
            <rect width="400" height="400" fill="#fff" />
            <g fill="#000">
              {holes1.map((h, i) => (
                <circle key={`h1-${i}`} cx={h.cx} cy={h.cy} r="8.5" />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <ellipse
                  key={`ell-${i}`}
                  cx="200"
                  cy="80"
                  rx="10"
                  ry="25"
                  transform={`rotate(${i * 30} 200 200)`}
                />
              ))}
              {holes2.map((h, i) => (
                <circle key={`h2-${i}`} cx={h.cx} cy={h.cy} r="4.5" />
              ))}
            </g>
            <circle cx="200" cy="200" r="86" fill="none" stroke="#000" strokeWidth="5" />
          </mask>
        </defs>
        <g mask="url(#lm)" fill="#eadfd3">
          <circle cx="200" cy="200" r="180" />
          {baseCircles.map((b, i) => (
            <circle key={`base-${i}`} cx={b.cx} cy={b.cy} r="10" />
          ))}
        </g>
      </svg>
    );
  }, []);

  return (
    <div className="landing-page">

      {/* ─── FLOATING SEMPURNA PLAYER (left side) ─── */}
      <div className={`sempurna-player-wrap${sempurnaOpen ? ' open' : ''}`} aria-label="Putar Sempurna">
        {/* Toggle button */}
        <button
          className="sempurna-fab"
          type="button"
          onClick={() => setSempurnaOpen((o) => !o)}
          aria-label={sempurnaOpen ? 'Tutup player' : 'Putar Sempurna – Andra and The Backbone'}
          title={sempurnaOpen ? 'Tutup' : 'Putar Sempurna'}
        >
          {sempurnaOpen ? (
            /* Close X */
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          ) : (
            /* Musical note icon */
            <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
              <path d="M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zm12-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Player panel */}
        <div className="sempurna-panel">
          <div className="sempurna-panel-header">
            <div className="sempurna-info">
              <span className="sempurna-title">Sempurna</span>
              <span className="sempurna-artist">Andra and The Backbone</span>
            </div>
          </div>
          <div className="sempurna-iframe-wrap">
            {sempurnaOpen && (
              <iframe
                src="https://www.youtube.com/embed/jStNaVCW838?autoplay=1&rel=0&modestbranding=1"
                title="Sempurna – Andra and The Backbone"
                frameBorder="0"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            )}
          </div>
          <a
            className="sempurna-yt-link"
            href="https://www.youtube.com/watch?v=4AiDimCHVXM"
            target="_blank"
            rel="noopener noreferrer"
          >
            Buka di YouTube ↗
          </a>
        </div>
      </div>

      {/* ─── 1 HERO (Full Width) ─── */}
      <header className="sec sec-hero" id="hero" aria-label="Pembuka">
        <div className="sec-container" data-reveal>
          <div className="hero-top">
            <span className="num">10</span>
            <div className="hero-title">
              <span className="sc">K</span>amu terlalu indah<br />
              untuk sekadar jadi <strong>[ MILIKKU ]</strong>
            </div>
            <span className="num">26</span>
          </div>

          <div className="photo-row" id="photoRow">
            {PHOTOS.map((src, i) => (
              <div
                key={i}
                className={`frame-anchor ${i === 0 ? 'frame-anchor-flower' : ''}`}
              >
                {i === 0 && (
                  <img
                    src="/elemen/Flower1.png"
                    alt="Flower Ornament"
                    className="hero-flower-decor"
                  />
                )}
                <div
                  ref={i === 1 ? mainPhotoRef : undefined}
                  className={`frame ${i === 1 ? 'main' : ''}`}
                  style={{
                    backgroundImage: `url("${encodeURI(src)}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {i === 1 && (
                    <>
                      <span className="tag l">galeri {CFG.aku.toLowerCase()}</span>
                      <span className="tag r">cantikku</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="small credit">
            dibuat dengan sayang oleh <b id="fromName">{CFG.aku}</b>
          </p>
        </div>

        {/* ─── RUNNING PHOTO MARQUEE (Right to Left) ─── */}
        <div className="memory-marquee-section" aria-label="Galeri Kenangan Berjalan">
          <div className="memory-marquee-track">
            {/* Set 1 */}
            {ALL_KENANGAN_PHOTOS.map((src, idx) => (
              <div key={`m1-${idx}`} className="memory-marquee-item">
                <img src={encodeURI(src)} alt={`Kenangan ${idx + 1}`} loading="lazy" />
              </div>
            ))}
            {/* Set 2 (for seamless loop) */}
            {ALL_KENANGAN_PHOTOS.map((src, idx) => (
              <div key={`m2-${idx}`} className="memory-marquee-item">
                <img src={encodeURI(src)} alt={`Kenangan ${idx + 1} loop`} loading="lazy" />
              </div>
            ))}
            {/* Set 3 (extra safety for wide displays) */}
            {ALL_KENANGAN_PHOTOS.map((src, idx) => (
              <div key={`m3-${idx}`} className="memory-marquee-item">
                <img src={encodeURI(src)} alt={`Kenangan ${idx + 1} loop 2`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ─── 2 SURAT (Full Width & Enlarged, Side Buttons) ─── */}
      <section className="sec sec-letter" id="letter" aria-label="Surat">
        <div className="sec-container sec-letter-container" data-reveal>
          {/* Elemen Pita Cantik */}
          <div className="letter-header-decor">
            <img src="/elemen/Ribbon.png" alt="Ribbon Decor" className="letter-ribbon-badge" />
          </div>

          <div className="stage-wrapper">
            {/* Tombol Samping Kiri */}
            <button
              type="button"
              className="nav-arrow left"
              onClick={() => setPg((prev) => (prev > 0 ? prev - 1 : LETTER.length - 1))}
              aria-label="Surat sebelumnya"
              title="Surat sebelumnya"
            >
              ‹
            </button>

            <div className="stage">
              <div className="stage-in in" key={pg} aria-live="polite">
                <div className="big">{LETTER[pg][0]}</div>
                <p>{LETTER[pg][1]}</p>
              </div>
            </div>

            {/* Tombol Samping Kanan */}
            <button
              type="button"
              className="nav-arrow right"
              onClick={() => setPg((prev) => (prev < LETTER.length - 1 ? prev + 1 : 0))}
              aria-label="Surat selanjutnya"
              title="Surat selanjutnya"
            >
              ›
            </button>
          </div>

          {/* Indikator Halaman Lembut */}
          <div className="letter-dots">
            {LETTER.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`dot ${pg === i ? 'active' : ''}`}
                onClick={() => setPg(i)}
                aria-label={`Buka surat halaman ${i + 1}`}
              />
            ))}
          </div>

          {/* ─── TABURAN BUNGA CANTIK (Flower1.png Beragam Ukuran & Animasi Mengambang) ─── */}
          <div className="scattered-flowers-layer" aria-hidden="true">
            <img src="/elemen/Flower1.png" alt="" className="scatter-flower sf-1" />
            <img src="/elemen/Flower1.png" alt="" className="scatter-flower sf-2" />
            <img src="/elemen/Flower1.png" alt="" className="scatter-flower sf-3" />
            <img src="/elemen/Flower1.png" alt="" className="scatter-flower sf-4" />
            <img src="/elemen/Flower1.png" alt="" className="scatter-flower sf-5" />
            <img src="/elemen/Flower1.png" alt="" className="scatter-flower sf-6" />
            <img src="/elemen/Flower1.png" alt="" className="scatter-flower sf-7" />
            <img src="/elemen/Flower1.png" alt="" className="scatter-flower sf-8" />
            <img src="/elemen/Flower1.png" alt="" className="scatter-flower sf-9" />
            <img src="/elemen/Flower1.png" alt="" className="scatter-flower sf-10" />
            <img src="/elemen/Flower1.png" alt="" className="scatter-flower sf-11" />
            <img src="/elemen/Flower1.png" alt="" className="scatter-flower sf-12" />
          </div>
        </div>
      </section>

      {/* ─── 3 MUSIK (Full Width with Real Album Covers) ─── */}
      <section className="sec sec-music" id="music" aria-label="Musik">
        <div className="sec-container" data-reveal>
          <div className="m-head">
            <img src="/elemen/SongPiring.png" alt="Piringan Hitam" className="music-decor-badge" />
            <span className="small">lagu-lagu yang mengingatkanku padamu</span>
            <h2>
              Kamu mengingatkanku pada warna <span className="sc">Merah</span>
            </h2>
            <span className="small">
              Pilih sampai 3 lagu yang paling kamu suka. Ketuk piringan hitamnya.
            </span>
          </div>

          <div className="songs">
            {SONGS.map((s, idx) => {
              const isChecked = pickedSongs.includes(idx);
              const isPlaying = playingIdx === idx;
              const hasPreview = !!previewUrls[idx];
              return (
                <article key={idx} className="song">
                  <div className="cover-wrapper">
                    <button
                      className={`cover${isPlaying ? ' playing' : ''}`}
                      type="button"
                      role="checkbox"
                      aria-checked={isChecked ? 'true' : 'false'}
                      onClick={() => handleToggleSong(idx)}
                      aria-label={`Pilih ${s.t} oleh ${s.a}`}
                    >
                      <span className="disc" />
                      <span className="art" style={{ background: s.g }}>
                        <img
                          src={s.cover}
                          alt={`${s.t} - ${s.a}`}
                          className="cover-img"
                          loading="lazy"
                        />
                        <div className="art-overlay" />
                        <small>{s.a}</small>
                      </span>
                      <span className="tick">dipilih</span>
                    </button>

                    {/* Play/Pause button */}
                    <button
                      className={`play-btn${isPlaying ? ' active' : ''}${!hasPreview ? ' loading' : ''}`}
                      type="button"
                      onClick={() => handlePlayPause(idx)}
                      aria-label={isPlaying ? `Pause ${s.t}` : `Putar preview ${s.t}`}
                      title={!hasPreview ? 'Memuat preview...' : isPlaying ? 'Pause' : 'Putar preview'}
                      disabled={!hasPreview}
                    >
                      {!hasPreview ? (
                        <span className="play-spinner" />
                      ) : isPlaying ? (
                        // Pause icon
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                          <rect x="5" y="3" width="4" height="18" rx="1" />
                          <rect x="15" y="3" width="4" height="18" rx="1" />
                        </svg>
                      ) : (
                        // Play icon
                        <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                          <path d="M6 3.9C6 2.7 7.3 2 8.3 2.7l11.1 8.1c.9.6.9 2 0 2.6L8.3 21.3C7.3 22 6 21.3 6 20.1V3.9z" />
                        </svg>
                      )}
                    </button>
                  </div>

                  <h3>{s.t}</h3>
                  <div className="by">{s.a}</div>
                  <div className="note">{s.n}</div>
                  {isPlaying && (
                    <div className="now-playing-bar">
                      <span /><span /><span /><span /><span />
                    </div>
                  )}
                  <a
                    href={`https://open.spotify.com/search/${encodeURIComponent(s.t + ' ' + s.a)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    dengarkan di Spotify
                  </a>
                </article>
              );
            })}
          </div>

          <p className="m-count">
            {pickedSongs.length ? (
              <>
                <b>{pickedSongs.length} dari {MAX_SONGS}</b> lagu dipilih
              </>
            ) : (
              'Belum ada lagu yang dipilih.'
            )}
          </p>
        </div>
      </section>

      {/* ─── 4 PLAN: LINGKARAN RENDA (Full Width Dark & Smooth Spin) ─── */}
      <section className="sec sec-plan" id="plan" aria-label="Plan">
        <div className="sec-container" data-reveal>
          <h2>Pilih satu hari</h2>
          <button
            className={`lace ${isLaceSpinning ? 'spinning' : ''}`}
            id="lace"
            type="button"
            onClick={handleLaceClick}
            aria-label="Buka pilihan rencana"
          >
            <span>{laceSvgElements}</span>
            <span className="lt">
              <b>RSVP</b>
              <span>DI SINI</span>
            </span>
          </button>
          <p>Ketuk lingkaran renda ini. Di baliknya ada tiga rencana untuk kita.</p>
        </div>
      </section>

      {/* ─── 5 TIKET (Full Width Dark with Memory Photos) ─── */}
      <section
        ref={ticketsRef}
        className="sec sec-tickets"
        id="tickets"
        aria-label="Kartu rencana"
      >
        <div className="sec-container">
          <div className="tickets-header-decor">
            <img src="/elemen/BordidStar.png" alt="Star" className="star-badge" />
            <span className="eyebrow">Tiga rencana</span>
            <img src="/elemen/BordidStar.png" alt="Star" className="star-badge" />
          </div>
          <h2>Ambil satu tiket</h2>

          <div className="tix">
            {PLANS.map((p) => {
              const isTaken = selectedPlanId === p.id;
              const isDim = selectedPlanId !== null && !isTaken;

              return (
                <div
                  key={p.id}
                  className={`disp ${isTaken ? 'taken' : ''} ${isDim ? 'dim' : ''}`}
                  data-id={p.id}
                >
                  <div className="gate" />
                  <button
                    className="ticket"
                    type="button"
                    onClick={() => handlePickTicket(p)}
                    aria-label={`Ambil tiket Plan ${p.id}`}
                  >
                    <div className="t-top">
                      <small>ADMIT ONE · HARI KITA</small>
                      <span
                        className="oval"
                        style={{
                          backgroundImage: `url("${encodeURI(p.photo)}")`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                    </div>

                    <div className="t-mid">
                      <h3>Plan {p.id}</h3>
                      <span className="mood">{p.mood}</span>
                      <ul className="t-slots">
                        {p.slots.map(([slotTime, slotDesc], sIdx) => (
                          <li key={sIdx}>
                            <em>{slotTime}</em>
                            <span>{slotDesc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="t-stub">
                      <div className="barcode" />
                      <small>
                        KURSI {p.id} · {CFG.tanggal.split('-').reverse().join('.')}
                      </small>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          <p className="hint">
            {selectedPlanId
              ? `Tiketmu sudah diambil: Plan ${selectedPlanId}. Lanjutkan ke RSVP di bawah.`
              : 'Arahkan ke tiket untuk melihat isinya, ketuk untuk mengambil.'}
          </p>
        </div>
      </section>

      {/* ─── 6 RSVP (Full Width) ─── */}
      {selectedPlan && (
        <section ref={rsvpRef} className="sec sec-rsvp" id="rsvp" aria-label="RSVP">
          <div className="sec-container">
            <h2>This Is Your RSVP</h2>

            <div className="rsvp-wrapper">
              <div className="rsvp-ticket">
                <span
                  className="oval"
                  style={{
                    backgroundImage: `url("${encodeURI(selectedPlan.photo)}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <div className="names">
                  <span>{CFG.kamu.toUpperCase()}</span>
                  <span>&amp;</span>
                  <span>{CFG.aku.toUpperCase()}</span>
                </div>
                <div className="meta">
                  <span>
                    {tglText}
                    <br />
                    PLAN {selectedPlan.id} · {jam.replace(':', '.')} WIB
                  </span>
                  <span>
                    SURABAYA<br />INDONESIA
                  </span>
                </div>
                <div className="barcode" style={{ width: '100%' }} />
              </div>

              <div className="rsvp-grid">
                <div className="sumbox">
                  <h3>Rencana kita</h3>
                  <ul>
                    {selectedPlan.slots.map(([sTime, sDesc], idx) => (
                      <li key={idx}>
                        <b>{sTime}:</b> {sDesc}
                      </li>
                    ))}
                  </ul>

                  {chosenSongsList.length > 0 ? (
                    <div className="small">
                      Lagu pilihanmu: <b>{chosenSongsList.join(', ')}</b>
                    </div>
                  ) : (
                    <div className="small">
                      Kamu belum memilih lagu. Kembali ke bagian musik di atas kalau mau.
                    </div>
                  )}
                </div>

                <div className="cal-row">
                  <div className="field">
                    <label htmlFor="tgl">Tanggal (Khusus Hari Ini)</label>
                    <input
                      id="tgl"
                      type="date"
                      value={tgl}
                      readOnly
                      style={{ cursor: 'not-allowed', opacity: 0.85 }}
                      title="Tanggal kegiatan sudah ditetapkan untuk 11 Oktober 2026"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="jam">Mulai jam</label>
                    <input
                      id="jam"
                      type="time"
                      value={jam}
                      onChange={(e) => setJam(e.target.value)}
                    />
                  </div>
                </div>

                <div className="btns">
                  <button
                    className="btn p btn-wa"
                    id="confirm"
                    type="button"
                    onClick={handleConfirmRsvp}
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style={{ verticalAlign: 'middle', marginRight: '6px' }}>
                      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.25-1.5-1.4-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.53.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.3z" />
                    </svg>
                    Konfirmasi RSVP via WhatsApp
                  </button>
                  <a
                    className="btn g"
                    id="gcal"
                    href={gcalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tambahkan ke Google Calendar
                  </a>
                  <button
                    className="btn g"
                    id="copy"
                    type="button"
                    onClick={handleCopyPlan}
                  >
                    Salin rencana
                  </button>
                  <button
                    className="btn g"
                    id="again"
                    type="button"
                    onClick={handleResetTicket}
                  >
                    Ganti pilihan
                  </button>
                </div>

                {statusMsg && (
                  <p className="status" id="status" role="status">
                    {statusMsg}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── 7 PENUTUP (Full Width Dark with Romantic Finishing) ─── */}
      <section className="sec sec-close" id="closing" aria-label="Penutup">
        <div className="sec-container" data-reveal>
          <div className="close-badge-group">
            <span className="close-sparkle">✦</span>
            <img
              src="/elemen/LovSignHand.png"
              alt="Love Sign Hand"
              className="close-heart-badge"
            />
            <span className="close-sparkle">✦</span>
          </div>

          <span className="close-sub-title">until the day comes</span>
          <h2>Thank You For Your Attention, Honey</h2>
          <p className="close-msg">
            Terima kasih sudah meluangkan waktu untukku. Apa pun rencana yang kamu pilih,
            yang paling kutunggu tetap kamu. Sampai bertemu di tanggal 11 nanti.
          </p>

          <p className="close-credit">
            Dibuat dengan sayang · <b>{CFG.aku}</b>
          </p>
        </div>
      </section>
    </div>
  );
}
