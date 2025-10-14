import { useState } from "react";
import { ExternalLink, Pencil, Trash2, Linkedin } from "lucide-react";
import { Project, usePortfolio } from "@/contexts/PortfolioContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProjectForm from "./ProjectForm";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { deleteProject } = usePortfolio();
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(project.id);
        toast({
          title: "Project deleted",
          description: "Your project has been removed",
        });
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message,
        });
      }
    }
  };

  const handleLinkedInShare = async () => {
    const shareUrl = encodeURIComponent(project.project_url || window.location.href);
    const shareTitle = encodeURIComponent(project.title);
    const shareDescription = encodeURIComponent(project.description.slice(0, 200));
    
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}&title=${shareTitle}&summary=${shareDescription}`;
    
    window.open(linkedInUrl, '_blank', 'width=600,height=600');
    
    // Track share event
    await trackEvent('linkedin_share', {
      project_id: project.id,
      project_title: project.title,
    });

    toast({
      title: "Opening LinkedIn",
      description: "Share your project with your network",
    });
  };

  return (
    <>
      <div className="group relative aspect-square rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300">
        <img
          src={project.image_url || '/placeholder.svg'}
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
              {project.project_url && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => window.open(project.project_url, '_blank')}
                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                onClick={handleLinkedInShare}
                className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
              >
                <Linkedin className="w-4 h-4" />
              </Button>
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
        <DialogContent className="max-w-2xl border-glass-border">
          <DialogHeader>
            <DialogTitle className="text-2xl">Edit Project</DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[400px] w-full">
          <ProjectForm 
            project={project} 
            onSuccess={() => setIsEditOpen(false)} 
          />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectCard;
