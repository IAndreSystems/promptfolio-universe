import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { usePortfolios } from "@/hooks/usePortfolios";
import { Wand2, Sparkles, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";

interface CreatePortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate?: string;
}

const CreatePortfolioDialog = ({ open, onOpenChange, selectedTemplate }: CreatePortfolioDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [useAI, setUseAI] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const { createPortfolio, reload } = usePortfolios();
  const { toast } = useToast();

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadedImages([...uploadedImages, ...files]);
    
    // Upload to Supabase Storage
    const urls: string[] = [];
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data, error } = await supabase.storage
        .from('projects')
        .upload(fileName, file);

      if (!error && data) {
        const { data: { publicUrl } } = supabase.storage
          .from('projects')
          .getPublicUrl(data.path);
        urls.push(publicUrl);
      }
    }
    
    setImageUrls([...imageUrls, ...urls]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!title.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Portfolio title is required",
      });
      return;
    }

    setIsLoading(true);
    console.log('🚀 Starting portfolio creation...');
    
    try {
      console.log('📝 Creating portfolio record...');
      const portfolio = await createPortfolio({
        title: title.trim(),
        description: description.trim() || null,
        template_id: selectedTemplate || null,
        is_public: false,
        is_active: true,
        metadata: {},
      });

      console.log('✅ Portfolio created:', portfolio?.id);

      if (useAI && portfolio) {
        console.log('🤖 Invoking AI generation...');
        const { data, error } = await supabase.functions.invoke('generate-portfolio', {
          body: {
            portfolioId: portfolio.id,
            prompt: prompt.trim() || undefined,
            templateId: selectedTemplate,
            language: 'en',
            images: imageUrls
          }
        });

        console.log('📥 AI generation response:', { data, error });

        if (error) {
          console.error('❌ AI generation error:', error);
          throw new Error(error.message || 'AI generation failed');
        }

        if (!data?.success) {
          console.error('❌ AI generation unsuccessful:', data);
          throw new Error(data?.error || 'AI generation returned unsuccessful response');
        }

        console.log('✅ AI generation successful, sections created:', data.sections?.length);
      }

      // Reload portfolios to get fresh data
      await reload();

      toast({
        title: "Portfolio created",
        description: useAI ? "Your AI-powered portfolio is ready" : "Your new portfolio is ready",
      });

      // Reset form
      setTitle("");
      setDescription("");
      setPrompt("");
      setUploadedImages([]);
      setImageUrls([]);
      onOpenChange(false);
    } catch (error: any) {
      console.error('❌ Portfolio creation error:', error);
      toast({
        variant: "destructive",
        title: "Error creating portfolio",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Portfolio</DialogTitle>
          <DialogDescription>
            {selectedTemplate 
              ? `Create a portfolio using the ${selectedTemplate} template`
              : "Create a new portfolio from scratch"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="useAI" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              AI-Powered Generation
            </Label>
            <Switch
              id="useAI"
              checked={useAI}
              onCheckedChange={setUseAI}
            />
          </div>

          {useAI && (
            <>
              <div className="space-y-2">
                <Label htmlFor="prompt">AI Prompt (optional)</Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe what you want your portfolio to showcase... (e.g., 'Create a portfolio highlighting my web development projects and design skills')"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Portfolio Images (optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="flex-1"
                  />
                  <Upload className="w-4 h-4 text-muted-foreground" />
                </div>
                {uploadedImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {uploadedImages.map((file, index) => (
                      <div key={index} className="relative">
                        <div className="w-16 h-16 rounded-md bg-muted flex items-center justify-center text-xs p-1 overflow-hidden">
                          {file.name}
                        </div>
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Portfolio Title *</Label>
            <Input
              id="title"
              placeholder="My Amazing Portfolio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of your portfolio..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>

          {selectedTemplate && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm text-muted-foreground">
                <Wand2 className="w-4 h-4 inline mr-1" />
                Template: <span className="font-medium">{selectedTemplate}</span>
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            className="flex-1 bg-gradient-primary"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Portfolio"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePortfolioDialog;
