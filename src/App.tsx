import { Contact } from "./components/Contact";
import { Credentials } from "./components/Credentials";
import { Experience } from "./components/Experience";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Nav } from "./components/Nav";
import { Projects } from "./components/Projects";
import { ScrollProgress } from "./components/ScrollProgress";
import { Skills } from "./components/Skills";
import { Systems } from "./components/Systems";

export default function App() {
  return (
    <>
      <ScrollProgress />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-70 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-bg"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <Experience />
        <Systems />
        <Skills />
        <Projects />
        <Credentials />
        <Contact />
      </main>

      <Footer />
    </>
  );
}
