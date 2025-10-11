import { useState } from "react";
import { Project, usePortfolio } from "@/contexts/PortfolioContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ProjectFormProps {
  project?: Project;
  onSuccess: () => void;
}

const ProjectForm = ({ project, onSuccess }: ProjectFormProps) => {
  const { addProject, updateProject } = usePortfolio();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    image_url: project?.image_url || "",
    project_url: project?.project_url || "",
    category: project?.category || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (project) {
        await updateProject(project.id, { ...formData, is_public: true });
        toast({
          title: "Project updated",
          description: "Your changes have been saved",
        });
      } else {
        await addProject({ ...formData, is_public: true });
        toast({
          title: "Project created",
          description: "Your new project has been added",
        });
      }
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="My Amazing Project"
          className="bg-glass-bg border-glass-border"
        />
      </div>

      <div>
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="Digital Art, UI/UX, 3D Design..."
          className="bg-glass-bg border-glass-border"
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your project..."
          className="min-h-[100px] bg-glass-bg border-glass-border"
        />
      </div>

      <div>
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://example.com/image.jpg"
          className="bg-glass-bg border-glass-border"
        />
      </div>

      <div>
        <Label htmlFor="project_url">Project Link</Label>
        <Input
          id="project_url"
          value={formData.project_url}
          onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
          placeholder="https://your-project.com"
          className="bg-glass-bg border-glass-border"
        />
      </div>

      <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity" disabled={loading}>
        {loading ? "Saving..." : project ? "Update Project" : "Create Project"}
      </Button>
    </form>
  );
};

export default ProjectForm;
