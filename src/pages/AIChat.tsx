import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AIInterface from "@/components/AIInterface";

const AIChat = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-6 h-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">AI Assistant</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get help with content creation, project descriptions, and creative ideas
            </p>
          </div>

          <AIInterface />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AIChat;
