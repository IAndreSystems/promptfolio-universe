import { useState } from "react";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Project, usePortfolio } from "@/contexts/PortfolioContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProjectForm from "./ProjectForm";
import { useToast } from "@/hooks/use-toast";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { deleteProject } = usePortfolio();
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(project.id);
      toast({
        title: "Project deleted",
        description: "Your project has been removed",
      });
    }
  };

  return (
    <>
      <div className="group relative aspect-square rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="mb-4">
              <p className="text-sm text-primary font-medium mb-1">
                {project.category}
              </p>
              <h3 className="text-2xl font-bold text-white mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-gray-300 line-clamp-2">
                {project.description}
              </p>
            </div>
            
            <div className="flex gap-2">
              {project.link && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => window.open(project.link, '_blank')}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setIsEditOpen(true)}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                className="bg-destructive/80 hover:bg-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl bg-glass-bg border-glass-border">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Project</DialogTitle>
          </DialogHeader>
          <ProjectForm 
            project={project} 
            onSuccess={() => setIsEditOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectCard;
