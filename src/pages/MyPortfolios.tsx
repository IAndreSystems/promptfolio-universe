import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { usePortfolios } from "@/hooks/usePortfolios";
import PortfolioCard from "@/components/PortfolioCard";
import CreatePortfolioDialog from "@/components/CreatePortfolioDialog";
import { Skeleton } from "@/components/ui/skeleton";

const MyPortfolios = () => {
  const { portfolios, loading } = usePortfolios();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                My <span className="bg-gradient-primary bg-clip-text text-transparent">Portfolios</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Manage and organize your portfolio collections
              </p>
            </div>
            <Button
              onClick={() => setCreateDialogOpen(true)}
              className="bg-gradient-primary hover:opacity-90"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Portfolio
            </Button>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : portfolios.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">No portfolios yet</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Create your first portfolio to showcase your work and share it with the world
              </p>
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Portfolio
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((portfolio) => (
                <PortfolioCard key={portfolio.id} portfolio={portfolio} />
              ))}
            </div>
          )}
        </div>
      </main>

      <CreatePortfolioDialog 
        open={createDialogOpen} 
        onOpenChange={setCreateDialogOpen}
      />

      <Footer />
    </div>
  );
};

export default MyPortfolios;
