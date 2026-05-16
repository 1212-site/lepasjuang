import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  MapPin, 
  Navigation, 
  Shirt, 
  Quote, 
  Send,
  Camera,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Wish {
  id: string;
  name: string;
  major: string;
  message: string;
  initial: string;
}

// --- Components ---

const CountdownItem = ({ value, label }: { value: number, label: string }) => (
  <div className="flex flex-col items-center justify-center bg-navy-light/30 border border-white/10 rounded-lg p-4 min-w-[80px] md:min-w-[100px]">
    <span className="text-2xl md:text-4xl font-serif font-bold text-white">{value.toString().padStart(2, '0')}</span>
    <span className="text-[10px] md:text-xs uppercase tracking-widest text-blue-200/60 mt-1">{label}</span>
  </div>
);

const TimelineItem = ({ time, title, description, isLast = false }: { time: string, title: string, description: string, isLast?: boolean }) => (
  <div className="flex gap-6 md:gap-10">
    <div className="flex flex-col items-center">
      <div className="w-4 h-4 rounded-sm bg-gold/80 border border-gold" />
      {!isLast && <div className="w-px h-full bg-linear-to-b from-gold/50 to-transparent my-2" />}
    </div>
    <div className="pb-10">
      <span className="text-sm font-medium text-gold/90 font-sans tracking-wide">{time}</span>
      <h3 className="text-xl md:text-2xl font-serif text-white mt-1 mb-2">{title}</h3>
      <p className="text-blue-200/70 text-sm md:text-base leading-relaxed max-w-lg">{description}</p>
    </div>
  </div>
);

const GalleryCard = ({ imageUrl, index }: { imageUrl: string, index: number }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    className="aspect-square relative overflow-hidden rounded-lg group"
  >
    <img 
      src={imageUrl} 
      alt="Graduation memory" 
      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 bg-navy-base/20 group-hover:bg-transparent transition-colors duration-500" />
  </motion.div>
);

const WishCard = ({ wish }: { wish: Wish }) => (
  <motion.div 
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="navy-card p-6 rounded-xl relative overflow-hidden mb-6"
  >
    <Quote className="absolute top-4 right-4 w-10 h-10 text-white/5" />
    <p className="text-blue-100/90 italic mb-6 relative z-10 font-sans leading-relaxed">
      "{wish.message}"
    </p>
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center font-serif text-white text-lg">
        {wish.initial}
      </div>
      <div>
        <h4 className="text-white font-medium text-sm">{wish.name}</h4>
        <p className="text-blue-200/50 text-xs">{wish.major}</p>
      </div>
    </div>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const targetDate = new Date('2026-06-02T08:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [wishes, setWishes] = useState<Wish[]>([
    { id: '1', name: 'Ust. Ach Fauzi, S.A.P', major: 'Wali Asrama', message: 'Jaga sholat dan jangan jauh dari Al-Qur’an. Karena ketika hidup mulai berjalan semakin cepat, dua hal tersebut yang akan menjaga arah kalian. Teruslah bertumbuh tanpa kehilangan adab. Melangkahlah jauh, tapi jangan kehilangan nilai. Dan tetaplah menjadi manusia yang baik, bahkan ketika dunia memberi banyak alasan untuk berubah.', initial: 'A' },
    { id: '2', name: 'M. Fadhlurrahman Muzakki, S. Pd.', major: 'Tendik', message: 'Jangan mati muda!', initial: 'N' },
    { id: '3', name: 'Fatimah Azzahra, S. Pi.', major: 'Tendik', message: 'Hidup cuma sekali, jadi jangan berhenti berlari.', initial: 'R' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="min-h-screen selection:bg-gold selection:text-navy-base">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-base/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-gold" />
            <span className="font-serif tracking-[0.2em] text-lg font-medium text-white">
              CLASS OF <span className="text-gold">2022</span>
            </span>
          </div>
          <a 
            href="#rsvp" 
            className="px-6 py-2 bg-gold hover:bg-gold/90 text-navy-darkest text-sm font-bold tracking-widest rounded-sm transition-all shadow-lg hover:shadow-gold/20"
          >
            RSVP
          </a>
        </div>
      </nav>

      <main className="pt-20">
        
        {/* Hero Section */}
        <section className="relative px-6 py-24 md:py-32 flex flex-col items-center text-center overflow-hidden">
          {/* Spotlight background effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-radial from-navy-light/20 to-transparent blur-3xl -z-10" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <GraduationCap className="w-16 h-16 md:w-20 md:h-20 text-gold mx-auto mb-10 opacity-80" />
            <h1 className="text-4xl md:text-7xl font-serif text-white mb-4 leading-tight">
              LEPAS JUANG <br />
              <span className="italic gold-gradient-text">ANGKATAN #2</span>
            </h1>
            <p className="text-white-200/60 font-sans tracking-wide mx-auto italic text-sm md:text-base">
              "Digital dalam Karya, Kuat dalam Karakter, Luas dalam Manfaat"
            </p>
          </motion.div>

          {/* Countdown */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4 md:gap-6 mt-12"
          >
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

          <motion.div 
            animate={{ y: [0, 10, 0] }} 
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-20 opacity-40"
          >
          </motion.div>
        </section>

        {/* Dress Code Section */}
        <section className="px-6 py-20 bg-navy-light/10 text-center">
          <div className="max-w-2xl mx-auto navy-card p-10 rounded-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gold/10 rounded-lg">
                <Shirt className="w-6 h-6 text-gold" />
              </div>
              <h2 className="text-2xl font-serif text-white">Dress Code</h2>
            </div>
            <p className="text-blue-200/70 mb-8 leading-relaxed">
              Untuk menjaga kekhidmatan, keindahan, serta keselarasan suasana acara, kami mengundang seluruh tamu untuk hadir dengan mengenakan busana yang sopan, rapi, dan formal, sehingga dapat bersama-sama menciptakan suasana acara yang hangat, berkesan, dan penuh makna.
            </p>
            <div className="bg-navy-darkest/50 border border-gold/20 p-6 rounded-lg">
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
              <p className="text-blue-200/60 leading-relaxed mb-8">
                Universitas Pertamina, Komplek PSC, Jakarta Selatan.
              </p>
              <a 
                href="https://maps.app.goo.gl/PmZYUHZiRzJHh7st7" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 border border-gold/50 text-gold text-xs font-bold tracking-[0.2em] rounded-sm hover:bg-gold hover:text-navy-base transition-all group"
              >
                <Navigation className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                BUKA DI GOOGLE MAPS
              </a>
            </div>
            <div className="relative rounded-xl overflow-hidden shadow-2xl hover:shadow-gold/10 transition-shadow">
              <img 
                src="/uper.jpg" 
                alt="University Building" 
                className="w-full h-64 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-navy-base/40 flex items-center justify-center">
                 {/* <div className="p-4 bg-navy-base/80 backdrop-blur-md rounded-lg border border-white/10">
                    <MapPin className="w-8 h-8 text-gold" />
                 </div> */}
              </div>
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
              <p className="text-blue-200/70 text-sm md:text-base leading-relaxed max-w-sm mx-auto">
                Silakan Klik tombol di bawah ini untuk mengisi formulir konfirmasi kehadiran melalui Google Form.
              </p>
            </div>

            <a 
              href="https://forms.google.com" // Replace with actual Google Form URL
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
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-serif text-gold mb-4">Wishing Board</h2>
              <p className="text-blue-200/50 mx-auto text-sm">Catatan, Doa, dan Harapan untuk Angkatan #2: Tentang Perjalanan, Perjuangan, dan Mimpi yang Tumbuh Bersama.</p>
            </div>

            <div className="grid md:grid-cols-1 gap-3">
              <AnimatePresence>
                {wishes.map((wish) => (
                  <WishCard key={wish.id} wish={wish} />
                ))}
              </AnimatePresence>
            </div>
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
            <p className="text-blue-200/40 text-[10px] tracking-widest uppercase">
              © Gen 2 . SMK TI BAZMA
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
