import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { usePortfolios, PortfolioSection } from "@/hooks/usePortfolios";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PortfolioSectionEditor } from "@/components/PortfolioSectionEditor";
import { useAuth } from "@/hooks/useAuth";
import { Share2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PortfolioView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { portfolios, getSections, updateSection, deleteSection, updatePortfolio, loading } = usePortfolios();
  const [sections, setSections] = useState<PortfolioSection[]>([]);
  const [loadingSections, setLoadingSections] = useState(true);

  const portfolio = portfolios.find(p => p.id === id);
  const canEdit = user && portfolio?.user_id === user.id;

  // Generate OG image from first section image or use a default
  const ogImage = sections[0]?.image_url || '/placeholder.svg';
  const ogDescription = portfolio?.description || sections[0]?.content?.substring(0, 160) || 'View my portfolio';

  useEffect(() => {
    const loadSections = async () => {
      if (id) {
        setLoadingSections(true);
        try {
          const data = await getSections(id);
          setSections(data || []);
        } catch (error) {
          console.error('Error loading sections:', error);
        } finally {
          setLoadingSections(false);
        }
      }
    };

    loadSections();
  }, [id]);

  const handleUpdateSection = async (sectionId: string, updates: Partial<PortfolioSection>) => {
    try {
      await updateSection(sectionId, updates);
      setSections(sections.map(s => s.id === sectionId ? { ...s, ...updates } : s));
      toast({ title: "Section updated" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      await deleteSection(sectionId);
      setSections(sections.filter(s => s.id !== sectionId));
      toast({ title: "Section deleted" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleToggleVisibility = async () => {
    if (!portfolio) return;
    try {
      await updatePortfolio(portfolio.id, { is_public: !portfolio.is_public });
      toast({
        title: portfolio.is_public ? "Portfolio made private" : "Portfolio made public",
      });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copied to clipboard" });
  };

  if (loading || loadingSections) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6">
            <Skeleton className="h-12 w-64 mb-4" />
            <Skeleton className="h-6 w-96 mb-8" />
            <div className="space-y-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-4xl font-bold mb-4">Portfolio Not Found</h1>
            <p className="text-muted-foreground mb-8">The portfolio you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/examples')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{portfolio?.title || 'Portfolio'} | AI Portfolio Generator</title>
        <meta name="description" content={ogDescription} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={portfolio?.title || 'Portfolio'} />
        <meta property="og:description" content={ogDescription} />
        <meta property="og:image" content={ogImage} />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={window.location.href} />
        <meta property="twitter:title" content={portfolio?.title || 'Portfolio'} />
        <meta property="twitter:description" content={ogDescription} />
        <meta property="twitter:image" content={ogImage} />
      </Helmet>
      
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-12">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  {portfolio.title}
                </span>
              </h1>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                {canEdit && (
                  <Button variant="outline" size="sm" onClick={handleToggleVisibility}>
                    {portfolio.is_public ? (
                      <><Eye className="w-4 h-4 mr-2" />Public</>
                    ) : (
                      <><EyeOff className="w-4 h-4 mr-2" />Private</>
                    )}
                  </Button>
                )}
              </div>
            </div>
            
            {portfolio.description && (
              <p className="text-xl text-muted-foreground">{portfolio.description}</p>
            )}
          </div>

          {sections.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">
                  {canEdit 
                    ? "No sections yet. This portfolio was just created!" 
                    : "This portfolio is empty."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {sections.map((section) => (
                <PortfolioSectionEditor
                  key={section.id}
                  section={section}
                  onUpdate={handleUpdateSection}
                  onDelete={handleDeleteSection}
                  canEdit={!!canEdit}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PortfolioView;
