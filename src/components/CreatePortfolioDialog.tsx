import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { usePortfolios } from "@/hooks/usePortfolios";
import { Wand2 } from "lucide-react";

interface CreatePortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTemplate?: string;
}

const CreatePortfolioDialog = ({ open, onOpenChange, selectedTemplate }: CreatePortfolioDialogProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createPortfolio } = usePortfolios();
  const { toast } = useToast();

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
    try {
      await createPortfolio({
        title: title.trim(),
        description: description.trim() || null,
        template_id: selectedTemplate || null,
        is_public: false,
        is_active: true,
        metadata: {},
      });

      toast({
        title: "Portfolio created",
        description: "Your new portfolio is ready",
      });

      setTitle("");
      setDescription("");
      onOpenChange(false);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
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
              placeholder="Describe your portfolio..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
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
