import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { usePortfolio } from "@/contexts/PortfolioContext";

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  homepage?: string;
  language: string;
  stargazers_count: number;
}

interface GitHubSyncModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  repos: GitHubRepo[];
}

const GitHubSyncModal = ({ open, onOpenChange, repos }: GitHubSyncModalProps) => {
  const [selectedRepos, setSelectedRepos] = useState<Set<number>>(new Set());
  const [importing, setImporting] = useState(false);
  const { addProject } = usePortfolio();
  const { toast } = useToast();

  const handleToggleRepo = (repoId: number) => {
    const newSelected = new Set(selectedRepos);
    if (newSelected.has(repoId)) {
      newSelected.delete(repoId);
    } else {
      newSelected.add(repoId);
    }
    setSelectedRepos(newSelected);
  };

  const handleImport = async () => {
    if (selectedRepos.size === 0) {
      toast({
        title: "No repos selected",
        description: "Please select at least one repository to import",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    try {
      const reposToImport = repos.filter(r => selectedRepos.has(r.id));
      
      for (const repo of reposToImport) {
        await addProject({
          title: repo.name,
          description: repo.description || `A ${repo.language || 'project'} repository`,
          project_url: repo.homepage || repo.html_url,
          github_repo: repo.html_url,
          category: repo.language || 'Other',
          image_url: '',
          github_synced: true,
          is_public: true,
        });
      }

      toast({
        title: "Import successful",
        description: `Imported ${selectedRepos.size} repository(ies) as projects`,
      });
      
      onOpenChange(false);
      setSelectedRepos(new Set());
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Import failed",
        description: error.message,
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto bg-glass-bg border-glass-border">
        <DialogHeader>
          <DialogTitle className="text-2xl">Import GitHub Repositories</DialogTitle>
          <DialogDescription>
            Select repositories to import as portfolio projects
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="flex items-start gap-4 p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors"
            >
              <Checkbox
                checked={selectedRepos.has(repo.id)}
                onCheckedChange={() => handleToggleRepo(repo.id)}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{repo.name}</h3>
                  {repo.language && (
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                      {repo.language}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    ⭐ {repo.stargazers_count}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {repo.description || 'No description'}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={importing}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImport}
            disabled={importing || selectedRepos.size === 0}
            className="bg-gradient-primary hover:opacity-90 transition-opacity"
          >
            {importing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Import {selectedRepos.size} Selected
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GitHubSyncModal;
