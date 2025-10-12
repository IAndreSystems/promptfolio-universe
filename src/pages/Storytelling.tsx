import { useState } from "react";
import { Sparkles, Wand2 } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import StoryActions from "@/components/StoryActions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const promptTemplates = [
  {
    title: "Project Story",
    description: "Generate an inspiring story about your project",
    prompt: "Write an inspiring story about a creative project. Make it engaging and showcase the creative journey.",
  },
  {
    title: "Artist Bio",
    description: "Create a compelling artist biography",
    prompt: "Write a professional and compelling biography for a creative professional. Highlight their unique approach and vision.",
  },
  {
    title: "Project Description",
    description: "Enhance your project description with AI",
    prompt: "Enhance and expand this project description to make it more engaging and professional.",
  },
  {
    title: "Vision Statement",
    description: "Craft your creative vision statement",
    prompt: "Create an inspiring vision statement for a creative professional. Make it bold and memorable.",
  },
];

const Storytelling = () => {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [usedPrompt, setUsedPrompt] = useState("");

  const handleGenerate = async () => {
    const prompt = customPrompt || selectedTemplate;
    if (!prompt) {
      toast({
        title: "No prompt provided",
        description: "Please select a template or write a custom prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setUsedPrompt(prompt);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-storytelling`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt, stream: false }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate content');
      }

      const data = await response.json();
      setGeneratedContent(data.content);
      
      toast({
        title: "Content generated!",
        description: "Your AI-powered content is ready",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDiscard = () => {
    setGeneratedContent("");
    setUsedPrompt("");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">AI Storytelling</span> Builder
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Generate compelling narratives and descriptions for your creative work
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Templates */}
            <div>
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-primary" />
                Prompt Templates
              </h2>
              
              <div className="space-y-4">
                {promptTemplates.map((template, index) => (
                  <Card 
                    key={index}
                    className={`cursor-pointer transition-all hover:border-primary/50 ${
                      selectedTemplate === template.prompt ? 'border-primary bg-primary/5' : 'border-border/50'
                    }`}
                    onClick={() => {
                      setSelectedTemplate(template.prompt);
                      setCustomPrompt("");
                    }}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{template.title}</h3>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="font-semibold mb-4">Or write a custom prompt:</h3>
                <Textarea
                  value={customPrompt}
                  onChange={(e) => {
                    setCustomPrompt(e.target.value);
                    setSelectedTemplate("");
                  }}
                  placeholder="Describe what you want to generate..."
                  className="min-h-[120px] bg-glass-bg border-glass-border"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full mt-6 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <Wand2 className="w-5 h-5 mr-2" />
                {isGenerating ? "Generating..." : "Generate Content"}
              </Button>
            </div>

            {/* Output */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Generated Content</h2>
              
              <div className="bg-glass-bg border border-glass-border rounded-lg p-6 min-h-[400px]">
                {generatedContent ? (
                  <Textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="min-h-[350px] bg-transparent border-none resize-none focus:ring-0"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Your generated content will appear here</p>
                  </div>
                )}
              </div>

              {generatedContent && (
                <div className="mt-4">
                  <StoryActions
                    content={generatedContent}
                    prompt={usedPrompt}
                    onDiscard={handleDiscard}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Storytelling;
