import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Skills from '../components/Skills';
import Writeups from '../components/Writeups';
import About from '../components/About';
import Subscribe from '../components/Subscribe';
import Contact from '../components/Contact';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Projects />
      <Skills />
      <Writeups />
      <About />
      <Subscribe />
      <Contact />
      <Footer />
    </main>
  );
}
