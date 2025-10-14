import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Layout, Palette, Sparkles, Zap } from "lucide-react";
import { useEffect } from "react";

const templates = [
  {
    id: 1,
    name: "Creative Portfolio",
    description: "Perfect for designers and artists",
    icon: Palette,
    gradient: "from-purple to-blue",
  },
  {
    id: 2,
    name: "Developer Showcase",
    description: "Highlight your coding projects",
    icon: Zap,
    gradient: "from-blue to-cyan",
  },
  {
    id: 3,
    name: "Minimal Portfolio",
    description: "Clean and professional layout",
    icon: Layout,
    gradient: "from-cyan to-purple",
  },
  {
    id: 4,
    name: "AI Gallery",
    description: "Showcase AI-generated artwork",
    icon: Sparkles,
    gradient: "from-purple to-blue",
  },
];

const Templates = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const templatesEl = document.getElementById("templates");
    templatesEl.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground" id="templates">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Portfolio <span className="bg-gradient-primary bg-clip-text text-transparent">Templates</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our beautiful pre-designed templates
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="group relative p-6 rounded-2xl border border-border/50 bg-gradient-card backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,0.2)]"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${template.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <template.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {template.name}
                </h3>
                
                <p className="text-muted-foreground mb-4">
                  {template.description}
                </p>

                <Button 
                  className="w-full bg-gradient-primary hover:opacity-90"
                  onClick={() => navigate('/dashboard')}
                >
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Templates;
