import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Gallery from "@/components/Gallery";
import { useEffect } from "react";

const Examples = () => {
  useEffect(() => {
    const examplesEl = document.getElementById("examples");
    examplesEl.scrollIntoView({ behavior: "smooth" });
  }, []);
  return (
    <div className="min-h-screen bg-background text-foreground" id="examples">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Portfolio <span className="bg-gradient-primary bg-clip-text text-transparent">Examples</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore stunning portfolios created by our community
            </p>
          </div>

          <Gallery />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Examples;
