import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";
import project4 from "@/assets/project-4.jpg";

const projects = [
  {
    title: "Abstract Dreamscape",
    category: "Digital Art",
    image: project1,
  },
  {
    title: "Neon Horizons",
    category: "AI Landscape",
    image: project2,
  },
  {
    title: "Cosmic Patterns",
    category: "Generative Art",
    image: project3,
  },
  {
    title: "Future Interface",
    category: "UI/UX Design",
    image: project4,
  },
];

const Gallery = () => {
  const navigate = useNavigate();
  
  return (
    <section id="gallery" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Creations</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore stunning portfolios created by our community
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-primary font-medium mb-1">
                        {project.category}
                      </p>
                      <h3 className="text-2xl font-bold text-white">
                        {project.title}
                      </h3>
                    </div>
                    <button 
                      onClick={() => navigate('/examples')}
                      className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Glass border effect */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
