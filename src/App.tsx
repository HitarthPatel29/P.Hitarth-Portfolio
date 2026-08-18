import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Summary } from './components/Summary';
import { Skills } from './components/Skills';
import { WiselySplitSection } from './components/projects/WiselySplitSection';
import { Research } from './components/Research';
import { Experience } from './components/Experience';
import { Education } from './components/Education';
import { LinkedInPosts } from './components/LinkedInPosts';
import { Contact } from './components/Contact';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Summary />
        <Skills />
        <WiselySplitSection />
        <Research />
        <Experience />
        <Education />
        <LinkedInPosts />
      </main>
      <Contact />
    </>
  );
}
