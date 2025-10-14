import { useState } from "react";
import { Project, usePortfolio } from "@/contexts/PortfolioContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";

interface ProjectFormProps {
  project?: Project;
  onSuccess: () => void;
}

const ProjectForm = ({ project, onSuccess }: ProjectFormProps) => {
  const { addProject, updateProject } = usePortfolio();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(project?.image_url || "");
  
  const [formData, setFormData] = useState({
    title: project?.title || "",
    description: project?.description || "",
    image_url: project?.image_url || "",
    project_url: project?.project_url || "",
    category: project?.category || "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file",
      });
      return;
    }

    if (file.size > 5242880) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('projects')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('projects')
        .getPublicUrl(fileName);

      setFormData({ ...formData, image_url: publicUrl });
      setImagePreview(publicUrl);

      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

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
          className="border-glass-border"
        />
      </div>

      <div>
        <Label htmlFor="category">Category *</Label>
        <Input
          id="category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          placeholder="Digital Art, UI/UX, 3D Design..."
          className="border-glass-border"
        />
      </div>

      <div>
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Describe your project..."
          className="min-h-[100px] border-glass-border"
        />
      </div>

      <div>
        <Label htmlFor="image_url">Project Image</Label>
        <div className="mt-2 space-y-3">
          {imagePreview && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex gap-2">
            <label htmlFor="image-upload" className="flex-1">
              <div className="flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg cursor-pointer hover:bg-accent transition-colors">
                <Upload className="w-4 h-4" />
                <span>{uploading ? "Uploading..." : "Upload Image"}</span>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="text-sm text-muted-foreground">
            Or enter an image URL:
          </div>
          <Input
            id="image_url"
            value={formData.image_url}
            onChange={(e) => {
              setFormData({ ...formData, image_url: e.target.value });
              setImagePreview(e.target.value);
            }}
            placeholder="https://example.com/image.jpg"
            className="border-glass-border"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="project_url">Project Link</Label>
        <Input
          id="project_url"
          value={formData.project_url}
          onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
          placeholder="https://your-project.com"
          className="border-glass-border"
        />
      </div>

      <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90 transition-opacity" disabled={loading}>
        {loading ? "Saving..." : project ? "Update Project" : "Create Project"}
      </Button>
    </form>
  );
};

export default ProjectForm;
