import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink, Eye } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface PublicPortfolio {
  id: string;
  title: string;
  description: string | null;
  template_id: string | null;
  created_at: string;
  user_id: string;
}

const Examples = () => {
  const [portfolios, setPortfolios] = useState<PublicPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const examplesEl = document.getElementById("examples");
    examplesEl?.scrollIntoView({ behavior: "smooth" });
    loadPublicPortfolios();
  }, []);

  const loadPublicPortfolios = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolios')
        .select('id, title, description, template_id, created_at, user_id')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(12);

      if (error) throw error;
      setPortfolios(data || []);
    } catch (error) {
      console.error('Error loading public portfolios:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" id="examples">
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Community <span className="bg-gradient-primary bg-clip-text text-transparent">Portfolios</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore stunning portfolios created by our community
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-2xl" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : portfolios.length === 0 ? (
            <div className="text-center py-16">
              <Eye className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-semibold mb-2">No public portfolios yet</h3>
              <p className="text-muted-foreground">
                Be the first to create and share a portfolio!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((portfolio) => (
                <div
                  key={portfolio.id}
                  onClick={() => navigate(`/portfolio/${portfolio.id}`)}
                  className="group relative aspect-video rounded-2xl overflow-hidden border border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer bg-gradient-card backdrop-blur-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-100 group-hover:opacity-90 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-primary font-medium mb-1">
                            {portfolio.template_id || 'Custom'}
                          </p>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                            {portfolio.title}
                          </h3>
                          <p className="text-sm text-gray-300 line-clamp-2">
                            {portfolio.description || 'No description'}
                          </p>
                        </div>
                        <button className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                          <ExternalLink className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none" />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Examples;
