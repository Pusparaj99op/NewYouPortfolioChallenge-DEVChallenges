import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import AIChatAssistant from "@/components/AIChatAssistant";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>
      <Footer />
      <AIChatAssistant />
    </>
  );
}
