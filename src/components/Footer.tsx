import { Button } from "@/components/ui/button";
import { Sparkles, Github, Twitter, Instagram } from "lucide-react";

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
              <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Examples</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-border/50 gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 Promptfolio Universe. All rights reserved.
          </p>
          
          <div className="flex items-center gap-4">
            <a href="#" className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
              <Twitter className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
            </a>
            <a href="#" className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
              <Github className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
            </a>
            <a href="#" className="p-2 rounded-lg hover:bg-primary/10 transition-colors">
              <Instagram className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
