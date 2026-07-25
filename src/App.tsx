import { useCallback, useEffect, useState } from "react";
import { Contact } from "./components/Contact";
import { Credentials } from "./components/Credentials";
import { Cursor } from "./components/Cursor";
import { Experience } from "./components/Experience";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Marquee } from "./components/Marquee";
import { Nav } from "./components/Nav";
import { PortraitFilters } from "./components/Portrait";
import { Preloader } from "./components/Preloader";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Stats } from "./components/Stats";
import { Systems } from "./components/Systems";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { ScrollTrigger } from "./lib/gsap";

export default function App() {
  const [ready, setReady] = useState(false);
  useSmoothScroll();

  const onPreloaderDone = useCallback(() => setReady(true), []);

  // Layout settles after the curtain lifts and the fonts land; ScrollTrigger
  // needs to remeasure or every pinned start/end is computed against stale
  // positions.
  useEffect(() => {
    if (!ready) return;
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 240);
    return () => window.clearTimeout(id);
  }, [ready]);

  return (
    <div className="grain">
      <PortraitFilters />
      <Preloader onDone={onPreloaderDone} />
      <Cursor />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-5 focus:top-5 focus:z-[110] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2.5 focus:text-sm focus:font-medium focus:text-bg"
      >
        Skip to content
      </a>

      <Nav ready={ready} />

      <main id="main">
        <Hero ready={ready} />
        <Marquee />
        <Stats />
        <Experience />
        <Systems />
        <Skills />
        <Projects />
        <Credentials />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
