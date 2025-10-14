import { Palette, Wand2, Zap, Layout, Sparkles, Share2 } from "lucide-react";
import { useEffect } from "react";


const features = [
  {
    icon: Palette,
    title: "AI Visual Storytelling",
    description: "Transform your ideas into compelling visual narratives with AI-powered generation.",
    gradient: "from-purple to-blue",
  },
  {
    icon: Layout,
    title: "Customizable Portfolios",
    description: "Design your portfolio exactly how you want it with flexible layouts and themes.",
    gradient: "from-blue to-cyan",
  },
  {
    icon: Wand2,
    title: "Smart Content Creation",
    description: "Generate descriptions, titles, and metadata automatically with AI assistance.",
    gradient: "from-cyan to-purple",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Build and deploy your portfolio in minutes, not hours. Optimized for speed.",
    gradient: "from-purple to-blue",
  },
  {
    icon: Sparkles,
    title: "AI Enhancement",
    description: "Enhance your images and content with cutting-edge AI technology.",
    gradient: "from-blue to-cyan",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share your portfolio across platforms with optimized previews and links.",
    gradient: "from-cyan to-purple",
  },
];

const Features = () => {
  useEffect(() => {
      const featuresEl = document.getElementById("features");
      featuresEl.scrollIntoView({ behavior: "smooth" });
    }, []);
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Shine</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed for modern creators who want to stand out
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl border border-border/50 bg-gradient-card backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,0.2)]"
            >
              <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
