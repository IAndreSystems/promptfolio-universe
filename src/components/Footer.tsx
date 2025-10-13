import { Button } from "@/components/ui/button";
import { Sparkles, Github, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-12">
        {/* CTA Section */}
        <div className="text-center mb-12 py-12 px-6 rounded-2xl bg-gradient-card border border-primary/20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Your
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Universe?</span>
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join thousands of creators showcasing their AI-powered work
          </p>
          <Button size="lg" className="bg-gradient-primary hover:opacity-90 transition-opacity">
            Get Started Free
          </Button>
        </div>

        {/* Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold">Promptfolio Universe</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              The ultimate platform for creators to showcase AI-generated portfolios 
              and build compelling visual stories.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/#features" className="hover:text-foreground transition-colors">Features</Link></li>
              <li><Link to="/templates" className="hover:text-foreground transition-colors">Templates</Link></li>
              <li><Link to="/examples" className="hover:text-foreground transition-colors">Examples</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50 gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Promptfolio Universe. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <a href="https://www.linkedin.com/in/andres-mustafa-505779359/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
            </a>
            <a href="https://github.com/IAndreSystems" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
              <Github className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
            </a>
            <a href="https://www.instagram.com/iandresystems/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
              <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
