import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Portfolio, PortfolioSection } from "@/hooks/usePortfolios";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";

const PortfolioView = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [sections, setSections] = useState<PortfolioSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPortfolio();
    }
  }, [id]);

  const loadPortfolio = async () => {
    if (!id) return;

    setLoading(true);
    try {
      // Load portfolio
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolios')
        .select('*')
        .eq('id', id)
        .single();

      if (portfolioError) throw portfolioError;

      // Check if user can view this portfolio
      if (!portfolioData.is_public && portfolioData.user_id !== user?.id) {
        setError("You don't have permission to view this portfolio");
        setLoading(false);
        return;
      }

      setPortfolio({ ...portfolioData, metadata: portfolioData.metadata as Record<string, any> });

      // Load sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('portfolio_sections')
        .select('*')
        .eq('portfolio_id', id)
        .order('order_index', { ascending: true });

      if (sectionsError) throw sectionsError;
      setSections((sectionsData || []).map(s => ({ ...s, metadata: s.metadata as Record<string, any> })));
    } catch (error: any) {
      console.error('Error loading portfolio:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const canEdit = user && portfolio && user.id === portfolio.user_id;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-4xl">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-full mb-8" />
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <h1 className="text-4xl font-bold mb-4">Portfolio Not Found</h1>
            <p className="text-muted-foreground mb-8">{error || "This portfolio doesn't exist or has been removed."}</p>
            <Button onClick={() => navigate('/examples')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Examples
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            {canEdit && (
              <Button
                variant="outline"
                onClick={() => navigate(`/portfolio/${id}/edit`)}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Portfolio
              </Button>
            )}
          </div>

          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {portfolio.title}
            </h1>
            {portfolio.description && (
              <p className="text-xl text-muted-foreground">
                {portfolio.description}
              </p>
            )}
            {portfolio.template_id && (
              <p className="text-sm text-muted-foreground mt-2">
                Template: {portfolio.template_id}
              </p>
            )}
          </div>

          <div className="space-y-8">
            {sections.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border rounded-2xl">
                <p className="text-muted-foreground">
                  {canEdit 
                    ? "This portfolio is empty. Add some sections to get started!"
                    : "This portfolio doesn't have any content yet."}
                </p>
              </div>
            ) : (
              sections.map((section) => (
                <div
                  key={section.id}
                  className="p-6 rounded-2xl border border-border/50 bg-gradient-card backdrop-blur-sm"
                >
                  {section.title && (
                    <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
                  )}
                  {section.image_url && (
                    <img
                      src={section.image_url}
                      alt={section.title || 'Section image'}
                      className="w-full rounded-lg mb-4 object-cover"
                      loading="lazy"
                    />
                  )}
                  {section.content && (
                    <div className="prose prose-invert max-w-none">
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {section.content}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PortfolioView;
