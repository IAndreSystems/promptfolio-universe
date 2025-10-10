import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Gallery from "@/components/Gallery";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <Features />
      <Gallery />
      <Footer />
    </div>
  );
};

export default Index;
