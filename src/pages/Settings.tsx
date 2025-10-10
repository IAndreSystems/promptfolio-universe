import { Palette, Type } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { usePortfolio } from "@/contexts/PortfolioContext";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { themeSettings, updateThemeSettings } = usePortfolio();
  const { toast } = useToast();

  const themePresets = [
    { name: 'Futuristic', mode: 'futuristic' as const, primary: '270 100% 70%', accent: '190 100% 50%' },
    { name: 'Minimalist', mode: 'minimalist' as const, primary: '220 13% 18%', accent: '220 9% 46%' },
    { name: 'Artistic', mode: 'artistic' as const, primary: '340 75% 55%', accent: '45 93% 58%' },
  ];

  const handleThemeChange = (preset: typeof themePresets[0]) => {
    updateThemeSettings({
      mode: preset.mode,
      primaryColor: preset.primary,
      accentColor: preset.accent,
    });
    toast({
      title: "Theme updated",
      description: `Switched to ${preset.name} theme`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">Settings</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Customize your portfolio appearance
            </p>
          </div>

          <div className="space-y-6">
            <Card className="bg-glass-bg border-glass-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="w-5 h-5 mr-2 text-primary" />
                  Visual Theme
                </CardTitle>
                <CardDescription>Choose a visual style for your portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {themePresets.map((preset) => (
                    <div
                      key={preset.mode}
                      onClick={() => handleThemeChange(preset)}
                      className={`cursor-pointer rounded-lg p-6 border-2 transition-all ${
                        themeSettings.mode === preset.mode
                          ? 'border-primary bg-primary/10'
                          : 'border-border/50 hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div 
                          className="w-8 h-8 rounded-full"
                          style={{ background: `hsl(${preset.primary})` }}
                        />
                        <div 
                          className="w-8 h-8 rounded-full"
                          style={{ background: `hsl(${preset.accent})` }}
                        />
                      </div>
                      <h3 className="font-semibold text-lg">{preset.name}</h3>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-glass-bg border-glass-border">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Type className="w-5 h-5 mr-2 text-primary" />
                  Typography
                </CardTitle>
                <CardDescription>Current font: {themeSettings.fontFamily}</CardDescription>
              </CardHeader>
              <CardContent>
                <Label className="text-sm text-muted-foreground">
                  Font customization coming soon
                </Label>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Settings;
