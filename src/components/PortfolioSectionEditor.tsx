import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Edit2, Save, X, Trash2 } from "lucide-react";
import { PortfolioSection } from "@/hooks/usePortfolios";

interface PortfolioSectionEditorProps {
  section: PortfolioSection;
  onUpdate: (id: string, updates: Partial<PortfolioSection>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  canEdit: boolean;
}

export const PortfolioSectionEditor = ({ 
  section, 
  onUpdate, 
  onDelete, 
  canEdit 
}: PortfolioSectionEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title || "");
  const [content, setContent] = useState(section.content || "");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdate(section.id, { title, content });
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTitle(section.title || "");
    setContent(section.content || "");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this section?")) {
      await onDelete(section.id);
    }
  };

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        {isEditing ? (
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Section Title"
            className="text-xl font-semibold"
          />
        ) : (
          <h3 className="text-xl font-semibold">{section.title}</h3>
        )}
        
        {canEdit && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSaving}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-gradient-primary"
                >
                  <Save className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent>
        {isEditing ? (
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Section content..."
            rows={6}
            className="w-full"
          />
        ) : (
          <div className="prose prose-sm max-w-none">
            {section.content?.split('\n').map((paragraph, idx) => (
              <p key={idx} className="text-muted-foreground mb-2">
                {paragraph}
              </p>
            ))}
          </div>
        )}
        
        {section.image_url && (
          <img
            src={section.image_url}
            alt={section.title || "Section image"}
            className="mt-4 rounded-lg w-full object-cover max-h-64"
          />
        )}
      </CardContent>
    </Card>
  );
};
