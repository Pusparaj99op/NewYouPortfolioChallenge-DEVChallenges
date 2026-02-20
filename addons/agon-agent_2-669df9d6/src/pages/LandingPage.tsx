import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { About } from '../components/About';
import { Schedule } from '../components/Schedule';
import { Prizes } from '../components/Prizes';
import { ProblemStatements } from '../components/ProblemStatements';
import { Register } from '../components/Register';
import { Footer } from '../components/Footer';

export const LandingPage = () => {
  return (
    <div className="bg-dark-bg min-h-screen text-white selection:bg-neon-green selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Schedule />
        <Prizes />
        <ProblemStatements />
        <Register />
      </main>
      <Footer />
    </div>
  );
};
