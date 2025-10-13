import { useState } from "react";
import { Save, Globe, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface StoryActionsProps {
  content: string;
  prompt: string;
  onDiscard: () => void;
}

const StoryActions = ({ content, prompt, onDiscard }: StoryActionsProps) => {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSave = async (isPublic: boolean) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to save stories",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your story",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('stories')
        .insert({
          user_id: user.id,
          title: title.trim(),
          content,
          prompt_used: prompt,
          is_public: isPublic,
        });

      if (error) throw error;

      toast({
        title: isPublic ? "Story published" : "Story saved",
        description: isPublic 
          ? "Your story is now public and visible to others"
          : "Your story has been saved as a draft",
      });

      setShowSaveDialog(false);
      setTitle("");
      onDiscard();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onDiscard}
          className="flex-1"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Discard
        </Button>
        <Button
          onClick={() => setShowSaveDialog(true)}
          className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="border-glass-border">
          <DialogHeader>
            <DialogTitle>Save Story</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="title">Story Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your story"
                className="border-glass-border"
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => handleSave(false)}
                disabled={saving}
                className="flex-1"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <Globe className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StoryActions;
