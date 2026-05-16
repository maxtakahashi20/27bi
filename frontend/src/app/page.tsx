import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { About } from "@/components/landing/about";
import { Courses } from "@/components/landing/courses";
import { Gallery } from "@/components/landing/gallery";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <main className="relative">
      <Navbar />
      <Hero />
      <About />
      <Courses />
      <Gallery />
      <Footer />
    </main>
  );
}
