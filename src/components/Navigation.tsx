import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Promptfolio Universe
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Gallery
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-opacity">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
