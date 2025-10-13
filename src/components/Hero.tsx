import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Cosmic background" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-glow" />
        <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6 py-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-primary font-medium">AI-Powered Portfolio Builder</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Your Creative Universe,
          <br />
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            Powered by AI
          </span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          Build stunning portfolios, create visual stories, and showcase your AI-generated work 
          with Promptfolio Universe. The ultimate platform for modern creators.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-gradient-primary hover:opacity-90 transition-opacity group"
            onClick={() => navigate('/dashboard')}
          >
            Start Creating
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-border hover:bg-card"
            onClick={() => navigate('/examples')}
          >
            <Wand2 className="mr-2 w-4 h-4" />
            Explore Examples
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-2">10K+</div>
            <div className="text-sm text-muted-foreground">Creators</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-cyan mb-2">50K+</div>
            <div className="text-sm text-muted-foreground">Portfolios</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue mb-2">1M+</div>
            <div className="text-sm text-muted-foreground">AI Creations</div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </section>
  );
};

export default Hero;
