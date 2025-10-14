import { useState } from "react";
import { ExternalLink, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Portfolio, usePortfolios } from "@/hooks/usePortfolios";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

interface PortfolioCardProps {
  portfolio: Portfolio;
  onEdit?: (portfolio: Portfolio) => void;
}

const PortfolioCard = ({ portfolio, onEdit }: PortfolioCardProps) => {
  const { deletePortfolio, updatePortfolio } = usePortfolios();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this portfolio?")) return;
    
    setIsDeleting(true);
    try {
      await deletePortfolio(portfolio.id);
      toast({
        title: "Portfolio deleted",
        description: "Your portfolio has been removed",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleVisibility = async () => {
    try {
      await updatePortfolio(portfolio.id, { is_public: !portfolio.is_public });
      toast({
        title: portfolio.is_public ? "Portfolio made private" : "Portfolio made public",
        description: portfolio.is_public 
          ? "Only you can view this portfolio" 
          : "Anyone can view this portfolio",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <Card className="group relative overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl group-hover:text-primary transition-colors">
              {portfolio.title}
            </CardTitle>
            <div className="flex gap-2 mt-2">
              {portfolio.is_active && (
                <Badge variant="default" className="bg-primary/20">Active</Badge>
              )}
              {portfolio.is_public ? (
                <Badge variant="outline" className="border-green-500/50 text-green-500">
                  <Eye className="w-3 h-3 mr-1" />
                  Public
                </Badge>
              ) : (
                <Badge variant="outline" className="border-muted">
                  <EyeOff className="w-3 h-3 mr-1" />
                  Private
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {portfolio.description || "No description"}
        </p>
        {portfolio.template_id && (
          <p className="text-xs text-muted-foreground mt-2">
            Template: {portfolio.template_id}
          </p>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/portfolio/${portfolio.id}`)}
          className="flex-1"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={toggleVisibility}
        >
          {portfolio.is_public ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit?.(portfolio)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PortfolioCard;
