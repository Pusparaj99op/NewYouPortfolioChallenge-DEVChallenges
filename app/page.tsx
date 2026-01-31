import dynamic from 'next/dynamic';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import Quant from "@/components/sections/Quant";
import Modern from "@/components/sections/Modern";
import AIChatWrapper from "@/components/AIChatWrapper";

// Lazy load AI Chat Assistant - Moved to AIChatWrapper


export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Quant />
        <Modern />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <AIChatWrapper />
    </>
  );
}
