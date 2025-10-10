import { useState } from "react";
import { Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";
import ProjectForm from "@/components/ProjectForm";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePortfolio } from "@/contexts/PortfolioContext";

const Dashboard = () => {
  const { projects } = usePortfolio();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your <span className="bg-gradient-primary bg-clip-text text-transparent">Portfolio</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage and showcase your creative projects
              </p>
            </div>
            
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-gradient-primary hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Project
            </Button>
          </div>

          {projects.length === 0 ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-glass-bg border border-glass-border mb-6">
                <Plus className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-8">Create your first project to get started</p>
              <Button onClick={() => setIsDialogOpen(true)} className="bg-gradient-primary">
                Create Project
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl bg-glass-bg border-glass-border">
          <DialogHeader>
            <DialogTitle className="text-2xl">Create New Project</DialogTitle>
          </DialogHeader>
          <ProjectForm onSuccess={() => setIsDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Dashboard;
