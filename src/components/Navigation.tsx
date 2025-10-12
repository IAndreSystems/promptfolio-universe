import { Button } from "@/components/ui/button";
import { Sparkles, Menu, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isHome = location.pathname === "/";

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Promptfolio Universe
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            {isHome ? (
              <>
                <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
                <a href="#gallery" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Gallery
                </a>
              </>
            ) : (
              <>
                <Link to="/dashboard" className={`text-sm transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  Dashboard
                </Link>
                <Link to="/storytelling" className={`text-sm transition-colors ${location.pathname === '/storytelling' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  Storytelling
                </Link>
                <Link to="/ai-chat" className={`text-sm transition-colors ${location.pathname === '/ai-chat' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  AI Chat
                </Link>
                <Link to="/settings" className={`text-sm transition-colors ${location.pathname === '/settings' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                  Settings
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground hidden md:inline">
                  {user.email}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="hidden md:inline-flex"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-opacity">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
