import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Sparkles, Zap, Heart } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              About <span className="bg-gradient-primary bg-clip-text text-transparent">Promptfolio</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering creators with AI-powered portfolio tools
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-12">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-2xl border border-border/50 bg-gradient-card">
                <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
                <p className="text-muted-foreground">
                  Leverage cutting-edge AI to enhance your creative work
                </p>
              </div>

              <div className="text-center p-6 rounded-2xl border border-border/50 bg-gradient-card">
                <Zap className="w-12 h-12 text-cyan mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">
                  Build and deploy portfolios in minutes, not hours
                </p>
              </div>

              <div className="text-center p-6 rounded-2xl border border-border/50 bg-gradient-card">
                <Heart className="w-12 h-12 text-blue mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Creator First</h3>
                <p className="text-muted-foreground">
                  Built by creators, for creators who want to stand out
                </p>
              </div>
            </div>

            <div className="prose prose-invert max-w-none">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                At Promptfolio Universe, we believe every creator deserves a stunning portfolio that showcases their unique vision. 
                Our AI-powered platform makes it easy to build, customize, and share your work with the world.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
