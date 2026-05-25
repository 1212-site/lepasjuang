import React, { useState, useEffect } from 'react';
import { GraduationCap, Calendar, Clock, MapPin, Navigation, Shirt, Send, ChevronLeft, ChevronRight, Sparkles, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Wish, FallingElement } from './types';
import { CountdownItem } from './components/CountdownItem';
import { GalleryCard } from './components/GalleryCard';
import { WishCard } from './components/WishCard';

// --- Main App ---

export default function App() {
  const targetDate = new Date('2026-06-02T08:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const [wishes, setWishes] = useState<Wish[]>([]);

  const [formData, setFormData] = useState({ name: '', major: '', message: '' });

  // --- Dynamic Guest Greeting States ---
  const [guestName, setGuestName] = useState('Orang Tua/Wali Siswa Angkatan #2');
  const [hasCustomGuest, setHasCustomGuest] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [fallingElements, setFallingElements] = useState<FallingElement[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const to = params.get('to') || params.get('yth') || params.get('guest');
    if (to) {
      setGuestName(to);
      setHasCustomGuest(true);
    }
  }, []);

  const triggerShower = () => {
    // Generate/regenerate a beautiful cascade of graduation elements
    const elements: FallingElement[] = Array.from({ length: 45 }).map((_, i) => {
      const types: ('cap' | 'sparkle' | 'star' | 'diploma')[] = ['cap', 'sparkle', 'star', 'diploma'];
      return {
        id: Date.now() + i,
        x: Math.random() * 95,
        size: Math.random() * 18 + 14, // size from 14px to 32px
        delay: Math.random() * 3.5, // staggered delay up to 3.5s
        duration: Math.random() * 5 + 4, // falls for 4 to 9 seconds
        rotate: Math.random() * 360,
        drift: Math.random() * 30 - 15,
        type: types[i % types.length],
      };
    });
    setFallingElements(elements);
  };

  const handleOpenInvitation = () => {
    setIsOpened(true);
    triggerShower();
  };

  // --- Slider States & Effects ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');
  const [isAutoplayActive, setIsAutoplayActive] = useState(true);

  // Auto-play effect: changes the slide every 7 seconds, pauses if user manually interacts
  useEffect(() => {
    if (!isAutoplayActive || wishes.length <= 1) return;

    const interval = setInterval(() => {
      setSlideDirection('right');
      setCurrentIndex((prev) => (prev === wishes.length - 1 ? 0 : prev + 1));
    }, 7000);

    return () => clearInterval(interval);
  }, [isAutoplayActive, wishes.length]);

  // Keep index in safe range when wishes are deleted/modified
  useEffect(() => {
    if (currentIndex >= wishes.length) {
      setCurrentIndex(Math.max(0, wishes.length - 1));
    }
  }, [wishes.length, currentIndex]);

  const handlePrev = () => {
    setIsAutoplayActive(false); // Stop autoplay when user manually interacts
    setSlideDirection('left');
    setCurrentIndex((prev) => (prev === 0 ? wishes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsAutoplayActive(false);
    setSlideDirection('right');
    setCurrentIndex((prev) => (prev === wishes.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (idx: number) => {
    setIsAutoplayActive(false);
    setSlideDirection(idx > currentIndex ? 'right' : 'left');
    setCurrentIndex(idx);
  };

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        const res = await fetch('https://belepasjuang.smktibazma.sch.id/api/wishes');
        const data = await res.json();

        setWishes(data);
      } catch (error) {
        console.error('Gagal mengambil wishes:', error);
      }
    };

    fetchWishes();
  }, []);

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.message.trim()) return;

    try {
      const res = await fetch('https://belepasjuang.smktibazma.sch.id/api/wishes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          major: formData.major || 'Alumni / Tamu',
          message: formData.message,
        }),
      });

      const newWish = await res.json();

      setWishes((prev) => [newWish, ...prev]);

      setCurrentIndex(0);
      setSlideDirection('left');
      setIsAutoplayActive(false);

      setFormData({
        name: '',
        major: '',
        message: '',
      });
    } catch (error) {
      console.error('Gagal menyimpan wish:', error);
    }
  };

  return (
    <div className={`min-h-screen selection:bg-gold selection:text-navy-base bg-navy-base relative ${!isOpened ? 'h-screen overflow-hidden' : ''}`}>
      {/* Invitation Gate / Cover Screen */}
      <AnimatePresence>
        {!isOpened && (
          <motion.div
            key="cover"
            initial={{ opacity: 1, y: 0 }}
            exit={{
              y: '-100vh',
              opacity: [1, 1, 0],
              transition: {
                duration: 1.1,
                ease: [0.76, 0, 0.24, 1],
              },
            }}
            className="fixed inset-0 z-[150] flex flex-col items-center justify-center p-6 bg-navy-darkest overflow-hidden text-center"
          >
            {/* Spotlight background effect */}
            <div className="absolute inset-0 bg-radial from-navy-light/40 to-transparent blur-3xl opacity-60 -z-10" />

            {/* Elegant Background Sparkles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 -z-10">
              <div className="absolute top-[15%] left-[20%] animate-pulse text-gold text-2xl">✦</div>
              <div className="absolute top-[30%] right-[15%] animate-pulse text-gold text-3xl delay-1000">✦</div>
              <div className="absolute bottom-[20%] left-[15%] animate-pulse text-gold text-xl delay-500">✦</div>
              <div className="absolute bottom-[35%] right-[25%] animate-pulse text-gold text-2xl delay-1500">✦</div>
              <div className="absolute top-[50%] left-[45%] animate-pulse text-gold/50 text-xl delay-700">✦</div>
            </div>

            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, ease: 'easeOut' }}
              className="max-w-md w-full navy-card p-8 md:p-10 rounded-3xl border border-gold/25 relative z-10 shadow-2xl bg-navy-base/90 backdrop-blur-md flex flex-col items-center"
            >
              {/* Rotating Glowing Badge */}
              <motion.div
                animate={{ rotate: [0, 8, -8, 0], y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
                className="mb-6 p-4.5 bg-gold/15 rounded-full border border-gold/40 relative shadow-[0_0_15px_rgba(233,195,73,0.2)]"
              >
                <GraduationCap className="w-12 h-12 text-gold filter drop-shadow-[0_0_8px_rgba(233,195,73,0.4)]" />
                <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }} className="absolute -top-1 -right-1 text-gold text-base">
                  ✦
                </motion.div>
              </motion.div>

              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-gold font-extrabold mb-2 block">Official Invitation</span>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-2 leading-tight">
                LEPAS JUANG <br />
                <span className="gold-gradient-text italic font-bold">ANGKATAN #2</span>
              </h2>
              <span className="text-[11px] uppercase tracking-[0.2em] text-blue-200/50 mb-8 block font-mono">SMK TI BAZMA</span>

              {/* Recipient Card */}
              <div className="w-full py-5 px-4 bg-navy-darkest/70 border border-white/5 rounded-2xl mb-8 relative overflow-hidden">
                <div className="absolute top-2 right-2 flex gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-gold/30 animate-pulse" />
                </div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-gold block mb-2 font-bold">Kepada Yth. Bapak/Ibu/Sdr/i:</span>
                <h3 className="text-xs min-[360px]:text-[13px] min-[400px]:text-sm sm:text-base font-serif text-white font-extrabold tracking-wide py-1 whitespace-nowrap overflow-hidden text-ellipsis" title={guestName}>
                  {guestName}
                </h3>
                {hasCustomGuest ? <span className="text-[10px] text-gold/90 tracking-widest font-bold uppercase block mt-2 animate-pulse">Wali Siswa Angkatan #2</span> : null}
              </div>

              {/* Elegant Button to Open */}
              <motion.button
                onClick={handleOpenInvitation}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-navy-darkest bg-gold hover:bg-gold/95 transition-all font-sans font-extrabold text-xs tracking-[0.25em] h-14 px-8 rounded-full shadow-[0_0_20px_rgba(233,195,73,0.35)] hover:shadow-[0_0_35px_rgba(233,195,73,0.55)] flex items-center justify-center gap-3 uppercase cursor-pointer"
              >
                <Sparkles className="w-4 h-4 animate-pulse text-navy-darkest" />
                Buka Undangan
                <Sparkles className="w-4 h-4 animate-pulse text-navy-darkest" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Falling Graduation Elements Shower */}
      <div className="fixed inset-0 pointer-events-none z-[80] w-full h-full overflow-hidden">
        <AnimatePresence>
          {fallingElements.map((el) => (
            <motion.div
              key={el.id}
              initial={{
                y: -60,
                x: `${el.x}vw`,
                opacity: 0,
                rotate: el.rotate,
                scale: 0.5,
              }}
              animate={{
                y: '105vh',
                x: `${el.x + el.drift}vw`,
                opacity: [0, 1, 1, 0.8, 0],
                rotate: el.rotate + 360 + Math.random() * 360,
                scale: [0.8, 1, 1, 0.9, 0.7],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: el.duration,
                delay: el.delay,
                ease: 'easeOut',
              }}
              className="absolute pointer-events-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]"
              style={{
                color: '#e9c349', // gold color
              }}
            >
              {el.type === 'cap' && <GraduationCap className="text-gold" style={{ width: el.size, height: el.size }} />}
              {el.type === 'diploma' && <Award className="text-gold" style={{ width: el.size * 0.9, height: el.size * 0.9 }} />}
              {el.type === 'sparkle' && <Sparkles className="text-[#fff5cc]" style={{ width: el.size * 0.7, height: el.size * 0.7 }} />}
              {el.type === 'star' && (
                <span className="text-gold block font-bold leading-none select-none" style={{ fontSize: el.size * 0.8 }}>
                  ★
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-base/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button type="button" onClick={triggerShower} className="flex items-center gap-2 text-left hover:opacity-90 active:scale-95 transition-all group cursor-pointer" title="Klik untuk menghujani topi kelulusan! 🎓">
            <GraduationCap className="w-6 h-6 text-gold group-hover:rotate-12 transition-transform" />
            <span className="font-serif tracking-[0.2em] text-lg font-medium text-white flex items-center gap-1.5 selection:bg-transparent">
              CLASS OF <span className="text-gold">2022</span>
              <Sparkles className="w-3.5 h-3.5 text-gold/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            </span>
          </button>
          <a href="#rsvp" className="px-6 py-2 bg-gold hover:bg-gold/90 text-navy-darkest text-sm font-bold tracking-widest rounded-sm transition-all shadow-lg hover:shadow-gold/20">
            RSVP
          </a>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 flex flex-col items-center text-center overflow-hidden">
          {/* Spotlight background effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-radial from-navy-light/20 to-transparent blur-3xl -z-10" />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.3 }}
              className="relative inline-block mb-10 cursor-pointer group"
              onClick={triggerShower}
              title="Klik untuk menghujani topi! 🎓"
            >
              <div className="absolute -inset-2 bg-gold/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}>
                <GraduationCap className="w-16 h-16 md:w-20 md:h-20 text-gold mx-auto filter drop-shadow-[0_0_12px_rgba(233,195,73,0.3)] group-hover:scale-105 transition-transform" />
              </motion.div>
            </motion.div>
            <h1 className="text-4xl md:text-7xl font-serif text-white mb-4 leading-tight">
              LEPAS JUANG <br />
              <span className="italic gold-gradient-text">ANGKATAN #2</span>
            </h1>
            <p className="text-blue-100/60 font-sans tracking-wide mx-auto italic text-sm md:text-base md:whitespace-nowrap">"Digital dalam Karya, Kuat dalam Karakter, Luas dalam Manfaat"</p>
          </motion.div>

          {/* Guest Greeting Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="mb-12 navy-card px-6 py-6 md:py-8 rounded-2xl border border-gold/20 max-w-md w-full mx-auto shadow-2xl bg-navy-light/15 relative overflow-hidden backdrop-blur-xs flex flex-col items-center"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

            <span className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-gold font-bold block mb-1">Kepada Yth.</span>
            <span className="text-xs text-blue-200/50 block mb-4 font-sans italic">Bapak/Ibu/Saudara/Saudari:</span>

            <div className="w-full py-4 px-3 bg-navy-darkest/60 border border-white/5 rounded-xl my-1 backdrop-blur-md overflow-hidden">
              <h3 className="text-xs min-[360px]:text-[13px] min-[400px]:text-sm sm:text-base font-serif text-white font-bold tracking-wide py-1 whitespace-nowrap overflow-hidden text-ellipsis" title={guestName}>
                {guestName}
              </h3>
              {hasCustomGuest ? <p className="text-[10px] text-gold/80 mt-1.5 tracking-widest font-sans font-bold uppercase animate-pulse">Wali Siswa Angkatan #2</p> : null}
            </div>

            <p className="text-[11px] text-blue-200/60 mt-4 leading-relaxed font-sans max-w-[280px]">Merupakan suatu kehormatan & kebahagiaan bagi kami apabila Bapak/Ibu berkenan hadir di acara kami.</p>
          </motion.div>

          {/* Countdown */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex gap-4 md:gap-6 mt-12">
            <CountdownItem value={timeLeft.days} label="Hari" />
            <CountdownItem value={timeLeft.hours} label="Jam" />
            <CountdownItem value={timeLeft.minutes} label="Menit" />
            <CountdownItem value={timeLeft.seconds} label="Detik" />
          </motion.div>

          <div className="mt-12 space-y-3">
            <div className="flex items-center justify-center gap-3 text-gold/80">
              <Calendar className="w-5 h-5" />
              <span className="font-sans font-medium tracking-widest text-sm uppercase">2 JUNI 2026</span>
            </div>
            <div className="flex items-center justify-center gap-3 text-gold/80">
              <Clock className="w-5 h-5" />
              <span className="font-sans font-medium tracking-widest text-sm uppercase">08:00 WIB</span>
            </div>
          </div>

          <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mt-20 opacity-40"></motion.div>
        </section>

        {/* Dress Code Section */}
        <section className="px-6 py-20 bg-navy-light/10 text-center">
          <div className="max-w-2xl mx-auto navy-card p-10 rounded-2xl">
            <div className="flex justify-center items-center gap-4 mb-8">
              <div className="p-3 bg-gold/10 rounded-lg">
                <Shirt className="w-6 h-6 text-gold" />
              </div>
              <h2 className="text-2xl font-serif text-white">Dress Code</h2>
            </div>
            <p className="text-blue-200/70 mb-8 leading-relaxed max-w-lg mx-auto">
              Untuk menjaga kekhidmatan, keindahan, serta keselarasan suasana acara, kami mengundang seluruh tamu untuk hadir dengan mengenakan busana yang sopan, rapi, dan formal, sehingga dapat bersama-sama menciptakan suasana acara yang
              hangat, berkesan, dan penuh makna.
            </p>
            <div className="bg-navy-darkest/50 border border-gold/20 p-6 rounded-lg max-w-md mx-auto">
              <span className="text-xs uppercase tracking-widest text-gold font-bold block mb-2">PRIA & WANITA</span>
              <p className="text-white font-medium">Batik Lengan Panjang atau Pakaian Formal</p>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="max-w-4xl mx-auto px-6 py-24">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-gold/10 rounded-lg">
              <MapPin className="w-6 h-6 text-gold" />
            </div>
            <h2 className="text-3xl font-serif text-white font-medium">Lokasi</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-xl font-serif text-white mb-2">Gedung Griya Legita</h3>
              <p className="text-blue-200/60 leading-relaxed mb-8">Universitas Pertamina, Komplek PSC, Jakarta Selatan.</p>
              <a
                href="https://maps.app.goo.gl/PmZYUHZiRzJHh7st7"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 border border-gold/50 text-gold text-xs font-bold tracking-[0.2em] rounded-sm hover:bg-gold hover:text-navy-base transition-all group animate-pulse"
              >
                <Navigation className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                BUKA DI GOOGLE MAPS
              </a>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-2xl hover:shadow-gold/10 transition-shadow">
              <img
                src="/uper.jpg"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541339907198-e08756defe93?auto=format&fit=crop&q=80&w=800';
                }}
                alt="University Building"
                className="w-full h-64 object-cover animate-fade-in"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-navy-base/40 flex items-center justify-center"></div>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="px-6 py-24 bg-navy-darkest/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif text-gold mb-4">Galeri Kenangan</h2>
              <p className="text-blue-200/50 mx-auto text-sm">Momen-momen terbaik selama perjalanan perjuangan kita.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GalleryCard index={0} imageUrl="/1.jpg" />
              <GalleryCard index={1} imageUrl="/2.jpg" />
              <GalleryCard index={2} imageUrl="/3.jpg" />
              <GalleryCard index={3} imageUrl="/4.jpg" />
            </div>
          </div>
        </section>

        {/* RSVP Section */}
        <section id="rsvp" className="max-w-2xl mx-auto px-6 py-24">
          <div className="navy-card p-8 md:p-12 rounded-3xl relative overflow-hidden text-center">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">Konfirmasi Kehadiran</h2>
              <p className="text-gold text-xs tracking-widest uppercase font-bold mb-4">RSVP SEBELUM 1 JUNI 2026</p>
              <p className="text-blue-200/70 text-sm md:text-base leading-relaxed max-w-sm mx-auto">Silakan Klik tombol di bawah ini untuk mengisi formulir konfirmasi kehadiran melalui Google Form.</p>
            </div>

            <a
              href="https://forms.gle/Gc1wqTdrv6HsQQXg6" // Replace with actual Google Form URL
              target="_blank"
              rel="noreferrer"
              className="inline-block w-full py-5 bg-gold hover:bg-gold/90 text-navy-darkest font-extrabold uppercase tracking-[0.3em] text-[10px] md:text-sm rounded-sm transition-all shadow-xl hover:shadow-gold/20"
            >
              ISI GOOGLE FORM
            </a>
          </div>
        </section>

        {/* Wishing Board */}
        <section className="px-6 py-24 mb-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-serif text-gold mb-4">Wishing Board</h2>
              <p className="text-blue-200/60 mx-auto text-sm leading-relaxed max-w-xl">Catatan, Doa, dan Harapan untuk Angkatan #2: Tentang Perjalanan, Perjuangan, dan Mimpi yang Tumbuh Bersama.</p>
            </div>

            {/* Always visible, highly polished user submission form */}
            <div className="navy-card p-6 md:p-8 rounded-2xl mb-12 overflow-hidden border border-gold/15 shadow-xl">
              <form onSubmit={handleWishSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                  <Send className="w-4 h-4 text-gold" />
                  <h3 className="text-base md:text-lg font-serif text-white">Bagikan Doa & Ucapan Anda</h3>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gold font-bold mb-1.5">NAMA LENGKAP</label>
                    <input
                      required
                      type="text"
                      placeholder="Contoh: Budi Santoso, S.T."
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-navy-darkest/60 border border-white/10 rounded-sm px-3 py-2 text-white placeholder-blue-200/30 focus:outline-hidden focus:border-gold transition-colors font-sans text-xs md:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gold font-bold mb-1.5">STATUS / JURUSAN</label>
                    <input
                      type="text"
                      placeholder="Contoh: Wali Asrama / Alumni / Tendik"
                      value={formData.major}
                      onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                      className="w-full bg-navy-darkest/60 border border-white/10 rounded-sm px-3 py-2 text-white placeholder-blue-200/30 focus:outline-hidden focus:border-gold transition-colors font-sans text-xs md:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-gold font-bold mb-1.5">PESAN / HARAPAN</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Tulis ucapan selamat atau harapan terbaik Anda untuk kemajuan bersama..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-navy-darkest/60 border border-white/10 rounded-sm px-3 py-2 text-white placeholder-blue-200/30 focus:outline-hidden focus:border-gold transition-colors font-sans text-xs md:text-sm resize-none"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button type="submit" className="px-8 py-3 bg-gold hover:bg-gold/90 text-navy-darkest font-extrabold tracking-[0.15em] text-[11px] rounded-sm transition-all shadow-md hover:shadow-gold/15 uppercase cursor-pointer">
                    Kirim Ucapan
                  </button>
                </div>
              </form>
            </div>

            {/* List of wishes rendered as an elegant slider */}
            {wishes.length > 0 && (
              <div className="relative">
                <div className="overflow-hidden min-h-[220px] md:min-h-[200px] flex flex-col justify-between">
                  <AnimatePresence mode="wait" custom={slideDirection}>
                    {(() => {
                      const wish = wishes[currentIndex] || wishes[0];
                      if (!wish) return null;
                      const isDefaultWish = ['1', '2', '3'].includes(wish.id);
                      return (
                        <motion.div
                          key={wish.id}
                          custom={slideDirection}
                          variants={{
                            enter: (dir: 'left' | 'right') => ({
                              x: dir === 'right' ? 100 : -100,
                              opacity: 0,
                              scale: 0.98,
                            }),
                            center: {
                              x: 0,
                              opacity: 1,
                              scale: 1,
                            },
                            exit: (dir: 'left' | 'right') => ({
                              x: dir === 'right' ? -100 : 100,
                              opacity: 0,
                              scale: 0.98,
                            }),
                          }}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          transition={{
                            x: { type: 'spring', stiffness: 350, damping: 35 },
                            opacity: { duration: 0.25 },
                          }}
                        >
                          <WishCard
                            wish={wish}
                            onDelete={
                              !isDefaultWish
                                ? () => {
                                    const updatedWishes = wishes.filter((w) => w.id !== wish.id);
                                    setWishes(updatedWishes);
                                    if (currentIndex >= updatedWishes.length) {
                                      setCurrentIndex(Math.max(0, updatedWishes.length - 1));
                                    }
                                  }
                                : undefined
                            }
                          />
                        </motion.div>
                      );
                    })()}
                  </AnimatePresence>
                </div>

                {/* Controls for Slider */}
                {wishes.length > 1 && (
                  <div className="flex items-center justify-between mt-6 max-w-md mx-auto px-2">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="p-2.5 rounded-full border border-white/10 bg-navy-darkest/40 hover:bg-gold/10 hover:border-gold/50 text-white/70 hover:text-gold transition-all cursor-pointer flex items-center justify-center active:scale-95"
                      title="Sebelumnya"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Proportional indicator dots / fraction tracker */}
                    {wishes.length <= 8 ? (
                      <div className="flex items-center gap-1.5">
                        {wishes.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleDotClick(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === currentIndex ? 'w-5 bg-gold' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
                            aria-label={`Slide ${idx + 1}`}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1 mx-4">
                        <span className="text-[11px] font-mono tracking-widest text-blue-200/60 uppercase">
                          {currentIndex + 1} / {wishes.length}
                        </span>
                        <div className="w-24 h-0.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-gold transition-all duration-300" style={{ width: `${((currentIndex + 1) / wishes.length) * 100}%` }} />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleNext}
                      className="p-2.5 rounded-full border border-white/10 bg-navy-darkest/40 hover:bg-gold/10 hover:border-gold/50 text-white/70 hover:text-gold transition-all cursor-pointer flex items-center justify-center active:scale-95"
                      title="Berikutnya"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="px-6 py-20 bg-navy-darkest border-t border-white/5 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-gold" />
              <span className="font-serif tracking-[0.3em] text-xl font-medium text-white italic">
                CLASS OF <span className="text-gold">2022</span>
              </span>
            </div>
            <p className="text-blue-200/40 text-[10px] tracking-widest uppercase">© Gen 2 . SMK TI BAZMA</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
