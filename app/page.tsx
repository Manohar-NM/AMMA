"use client";

import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import { loveNotes, memories, Memory, quotes } from "@/lib/memories";

gsap.registerPlugin(ScrollTrigger);

const fadeUp = {
  hidden: { opacity: 0, y: 34, filter: "blur(16px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" }
};

export default function Home() {
  const [openMemory, setOpenMemory] = useState<Memory | null>(null);
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([]);

  useEffect(() => {
    const move = (event: MouseEvent) => {
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-cinema]").forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 70, filter: "blur(18px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.15,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 82%" }
          }
        );
      });
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        gsap.to(el, {
          yPercent: -12,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.2 }
        });
      });
    });
    return () => ctx.revert();
  }, []);

  const popHeart = (x: number, y: number) => {
    const id = Date.now();
    setHearts((items) => [...items, { id, x, y }]);
    window.setTimeout(() => setHearts((items) => items.filter((item) => item.id !== id)), 1200);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-night text-[#fff8f4]">
      <CinematicLoader />
      <AmbientAudio />
      <ParticleField />
      <Hero />
      <QuoteMarquee />
      <JourneyGallery onOpen={setOpenMemory} onHeart={popHeart} />
      <Timeline onOpen={setOpenMemory} />
      <LoveNotes onHeart={popHeart} />
      <EndingScene onOpen={setOpenMemory} />
      <Footer />
      <AnimatePresence>{openMemory && <MemoryModal memory={openMemory} onClose={() => setOpenMemory(null)} />}</AnimatePresence>
      {hearts.map((heart) => (
        <span key={heart.id} className="heart-burst text-3xl" style={{ left: heart.x, top: heart.y }}>
          ❤️
        </span>
      ))}
    </main>
  );
}

function CinematicLoader() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1700);
    return () => window.clearTimeout(timer);
  }, []);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-night"
          exit={{ opacity: 0, filter: "blur(20px)" }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="mx-auto mb-6 h-20 w-20 rounded-full border border-aureate/40 shadow-glow">
              <div className="h-full w-full animate-pulseSoft rounded-full bg-[radial-gradient(circle,rgba(245,183,169,.36),transparent_62%)]" />
            </div>
            <p className="font-display text-4xl text-gradient animate-shimmer">Dear Amma</p>
            <p className="mt-2 text-xs uppercase tracking-[0.45em] text-white/45">loading memories</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AmbientAudio() {
  const [muted, setMuted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const startMusic = () => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.muted = muted;
      if (audio.volume === 0) audio.volume = 0;

      const fade = window.setInterval(() => {
        audio.volume = Math.min(audio.volume + 0.04, 0.45);
        if (audio.volume >= 0.45) window.clearInterval(fade);
      }, 90);

      void audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => undefined);
    };

    window.addEventListener("dear-amma-start-music", startMusic);

    return () => {
      window.removeEventListener("dear-amma-start-music", startMusic);
    };
  }, [muted]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  return (
    <>
      <audio ref={audioRef} src="/music/amma-song.mp3" loop preload="auto" />
      <button
        onClick={() => {
          const audio = audioRef.current;
          if (!audio) return;

          if (audio.paused) {
            audio.volume = audio.volume || 0.45;
            audio.muted = false;
            setMuted(false);
            void audio
              .play()
              .then(() => setPlaying(true))
              .catch(() => undefined);
            return;
          }

          const nextMuted = !muted;
          audio.muted = nextMuted;
          setMuted(nextMuted);
        }}
        className="fixed bottom-5 right-5 z-[9999] inline-flex items-center gap-2 rounded-full border border-white/20 bg-night/75 px-5 py-3 text-sm font-semibold text-white shadow-glow backdrop-blur-xl transition hover:border-aureate/70 hover:bg-white/15"
        aria-label={muted || !playing ? "Play music" : "Mute music"}
      >
        <span className="text-lg">{muted || !playing ? "♪" : "♫"}</span>
        <span>Music</span>
      </button>
    </>
  );
}

function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.22]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 110]);

  return (
    <section ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-20">
      <motion.div style={{ scale, y }} className="absolute inset-0">
        <Image src="/memories/amma-beach.jpeg" alt="Amma and son by the sea" fill priority className="object-cover opacity-45 blur-[2px]" />
      </motion.div>
      <div className="cinematic-vignette absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-night to-transparent" />
      <motion.div
        initial="hidden"
        animate="show"
        transition={{ staggerChildren: 0.45, delayChildren: 1.55 }}
        className="relative z-10 mx-auto max-w-5xl text-center"
      >
        <motion.p variants={fadeUp} className="mb-5 text-xs uppercase tracking-[0.42em] text-aureate/70">
          A Mother&apos;s Day surprise
        </motion.p>
        <motion.h1 variants={fadeUp} className="font-display text-[clamp(3.6rem,13vw,10rem)] font-semibold leading-[0.86] text-gradient animate-shimmer">
          Dear Amma
        </motion.h1>
        <motion.p variants={fadeUp} className="mx-auto mt-9 max-w-2xl font-display text-3xl leading-tight text-white/90 md:text-5xl">
          To the woman who gave me everything...
        </motion.p>
        <motion.p variants={fadeUp} className="mt-5 font-display text-3xl text-rosegold md:text-5xl">
          Happy Mother&apos;s Day Amma ❤️
        </motion.p>
        <motion.div variants={fadeUp} className="mt-10">
          <a
            href="#journey"
            onClick={() => {
              window.dispatchEvent(new Event("dear-amma-start-music"));
            }}
            className="gold-border inline-flex rounded-full bg-white/10 px-8 py-4 text-sm font-semibold uppercase tracking-[0.28em] text-white shadow-glow backdrop-blur-xl transition hover:scale-[1.03] hover:bg-white/16"
          >
            Open Your Surprise
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 72 }, (_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${Math.random() * 3 + 1}px`,
        delay: `${Math.random() * 9}s`
      })),
    []
  );
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute animate-drift rounded-full bg-aureate/70 shadow-[0_0_18px_rgba(247,213,138,.8)]"
          style={{ left: p.left, top: p.top, width: p.size, height: p.size, animationDelay: p.delay }}
        />
      ))}
    </div>
  );
}

function QuoteMarquee() {
  return (
    <section className="relative z-10 border-y border-white/10 bg-white/[0.03] py-8">
      <div className="flex animate-drift gap-10 whitespace-nowrap font-display text-3xl text-white/70 md:text-5xl">
        {[...quotes, ...quotes].map((quote, index) => (
          <span key={`${quote}-${index}`} className="px-4">
            {quote}
          </span>
        ))}
      </div>
    </section>
  );
}

function JourneyGallery({ onOpen, onHeart }: { onOpen: (memory: Memory) => void; onHeart: (x: number, y: number) => void }) {
  return (
    <section id="journey" className="relative z-10 px-5 py-28 md:py-36">
      <SectionIntro eyebrow="Our Journey Together" title="A gallery of the moments that still feel warm." />
      <div className="mx-auto mt-16 grid max-w-7xl gap-5 md:grid-cols-12">
        {memories.map((memory, index) => (
          <motion.button
            data-cinema
            key={memory.id}
            onClick={(event) => {
              onHeart(event.clientX, event.clientY);
              onOpen(memory);
            }}
            whileHover={{ y: -10, scale: 1.015 }}
            className={`gold-border glass group relative min-h-[420px] overflow-hidden rounded-[2rem] text-left ${index === 0 || index === 3 ? "md:col-span-7" : "md:col-span-5"}`}
          >
            <Image src={memory.image} alt={memory.title} fill sizes="(max-width: 768px) 100vw, 55vw" className="object-cover transition duration-[1800ms] group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/22 to-transparent" />
            <div className="absolute bottom-0 p-7">
              <p className="text-xs uppercase tracking-[0.32em] text-aureate/80">{memory.year}</p>
              <h3 className="mt-3 font-display text-4xl">{memory.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-white/72">{memory.caption}</p>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

function Timeline({ onOpen }: { onOpen: (memory: Memory) => void }) {
  return (
    <section className="relative z-10 px-5 py-28">
      <SectionIntro eyebrow="Moments I&apos;ll Never Forget" title="Every photo is a small chapter of gratitude." />
      <div className="mx-auto mt-16 max-w-6xl">
        {memories.map((memory) => (
          <div key={memory.id} data-cinema className={`mb-16 flex flex-col gap-8 md:flex-row ${memory.align === "right" ? "md:flex-row-reverse" : ""}`}>
            <button onClick={() => onOpen(memory)} className="group relative min-h-[440px] flex-1 overflow-hidden rounded-[2rem] shadow-rose" style={{ transform: `rotate(${memory.rotate})` }}>
              <Image src={memory.image} alt={memory.title} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover transition duration-[1600ms] group-hover:scale-110" />
              <div className="absolute inset-0 ring-1 ring-inset ring-aureate/35" />
            </button>
            <div className="glass gold-border flex flex-1 flex-col justify-center rounded-[2rem] p-8 md:p-10">
              <p className="text-xs uppercase tracking-[0.32em] text-rosegold/75">{memory.year}</p>
              <h3 className="mt-4 font-display text-4xl md:text-6xl">{memory.title}</h3>
              <p className="mt-6 text-lg leading-8 text-white/72">{memory.caption}</p>
              <blockquote className="mt-8 border-l border-aureate/50 pl-6 font-display text-2xl leading-snug text-aureate/90">
                &ldquo;{memory.quote}&rdquo;
              </blockquote>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LoveNotes({ onHeart }: { onHeart: (x: number, y: number) => void }) {
  return (
    <section className="relative z-10 px-5 py-28">
      <SectionIntro eyebrow="Little Love Notes" title="Reasons I love you, Amma." />
      <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-4">
        {loveNotes.map((note) => (
          <button
            key={note.front}
            data-cinema
            onClick={(event) => onHeart(event.clientX, event.clientY)}
            className="perspective h-72 text-left"
          >
            <div className="preserve-3d group relative h-full w-full transition duration-700 hover:[transform:rotateY(180deg)]">
              <div className="glass gold-border backface-hidden absolute inset-0 grid place-items-center rounded-[1.6rem] p-6 text-center">
                <p className="font-display text-4xl text-gradient animate-shimmer">{note.front}</p>
              </div>
              <div className="glass gold-border backface-hidden rotate-y-180 absolute inset-0 grid place-items-center rounded-[1.6rem] p-7">
                <p className="text-center text-base leading-7 text-white/78">{note.back}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function EndingScene({ onOpen }: { onOpen: (memory: Memory) => void }) {
  return (
    <section className="relative z-10 min-h-screen overflow-hidden px-5 py-28">
      <StarCanvas />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(191,123,255,.12),transparent_38rem)]" />
      <div className="relative mx-auto max-w-7xl text-center">
      <SectionIntro eyebrow="Final Scene" title="In every lifetime, I&apos;d still choose you as my mother." />
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-5">
          {memories.map((memory, index) => (
            <button
              key={memory.id}
              onClick={() => onOpen(memory)}
              className="gold-border relative aspect-[3/4] overflow-hidden rounded-[1.6rem] shadow-glow"
              style={{ transform: `translateY(${index % 2 ? 28 : 0}px) rotate(${memory.rotate})` }}
            >
              <Image src={memory.image} alt={memory.title} fill sizes="(max-width: 768px) 45vw, 18vw" className="object-cover animate-float" />
            </button>
          ))}
        </div>
        <div data-cinema className="mt-24">
          <p className="font-display text-4xl text-rosegold md:text-6xl">Happy Mother&apos;s Day ❤️</p>
          <p className="mt-5 font-display text-3xl text-white/85 md:text-5xl">Thank you for everything, Amma.</p>
          <p className="mt-10 font-script text-3xl text-aureate">From your son ❤️</p>
        </div>
      </div>
    </section>
  );
}

function StarCanvas() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(65, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 48;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(900);
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] = (Math.random() - 0.5) * 120;
      positions[i + 1] = (Math.random() - 0.5) * 80;
      positions[i + 2] = (Math.random() - 0.5) * 80;
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0xf7d58a, size: 0.18, transparent: true, opacity: 0.85 }));
    scene.add(stars);
    let frame = 0;
    const animate = () => {
      frame = requestAnimationFrame(animate);
      stars.rotation.y += 0.0009;
      stars.rotation.x += 0.00035;
      renderer.render(scene, camera);
    };
    animate();
    const resize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);
  return <div ref={mountRef} className="absolute inset-0 opacity-70" />;
}

function MemoryModal({ memory, onClose }: { memory: Memory; onClose: () => void }) {
  return (
    <motion.div className="fixed inset-0 z-[90] grid place-items-center bg-night/88 p-4 backdrop-blur-2xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.96, opacity: 0 }} className="glass gold-border relative grid max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[2rem] md:grid-cols-[1.1fr_.9fr]">
        <div className="relative min-h-[55vh]">
          <Image src={memory.image} alt={memory.title} fill sizes="90vw" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center p-8 md:p-12">
          <p className="text-xs uppercase tracking-[0.32em] text-aureate/75">{memory.year}</p>
          <h2 className="mt-4 font-display text-5xl">{memory.title}</h2>
          <p className="mt-6 text-lg leading-8 text-white/72">{memory.caption}</p>
          <p className="mt-8 font-display text-3xl leading-tight text-rosegold">&ldquo;{memory.quote}&rdquo;</p>
          <button onClick={onClose} className="mt-10 w-fit rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm uppercase tracking-[0.22em] text-white/70 hover:bg-white/15">
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SectionIntro({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div data-cinema className="mx-auto max-w-4xl text-center">
      <p className="text-xs uppercase tracking-[0.38em] text-aureate/70">{eyebrow}</p>
      <h2 className="mt-5 font-display text-5xl leading-tight md:text-7xl">{title}</h2>
    </div>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 px-5 py-10 text-center text-sm text-white/45">
      Made with love for Amma. Replace photos in public/memories and edit lib/memories.ts whenever you want to add new chapters.
    </footer>
  );
}
