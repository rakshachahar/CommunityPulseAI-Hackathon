import { Shield, Brain, Zap, Users, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Building a Smarter, <br/>More Responsive City</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          The Smart Community AI Assistant was built to eliminate the friction between citizens noticing a problem and the city fixing it.
        </p>
      </div>

      <div className="prose prose-zinc dark:prose-invert max-w-none mb-16">
        <h3>Our Mission</h3>
        <p>
          For decades, reporting local issues like potholes, broken streetlights, or illegal dumping meant navigating confusing municipality websites, waiting on hold, or filling out endless paper forms. Often, these reports disappeared into a bureaucratic void with no feedback loop for the citizen.
        </p>
        <p>
          We believe civic engagement shouldn't feel like a chore. By leveraging modern artificial intelligence, we've created a platform that instantly understands the problem you're reporting, assesses its severity objectively, and routes it directly to the people equipped to fix it.
        </p>
      </div>

      <h3 className="text-2xl font-bold mb-8 text-center">Core Principles</h3>
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <Card className="bg-card shadow-sm">
          <CardContent className="p-6">
            <Brain className="w-8 h-8 text-accent mb-4" />
            <h4 className="text-lg font-bold mb-2">Objective Assessment</h4>
            <p className="text-muted-foreground text-sm">
              Our AI vision model analyzes images to provide unbiased severity scores, ensuring critical infrastructure issues are prioritized accurately, regardless of who reports them.
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card shadow-sm">
          <CardContent className="p-6">
            <Zap className="w-8 h-8 text-amber-500 mb-4" />
            <h4 className="text-lg font-bold mb-2">Frictionless Action</h4>
            <p className="text-muted-foreground text-sm">
              From snapping a photo to official municipal routing takes less than 30 seconds. We've removed every unnecessary step in the reporting process.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-6">
            <Shield className="w-8 h-8 text-emerald-500 mb-4" />
            <h4 className="text-lg font-bold mb-2">Privacy First</h4>
            <p className="text-muted-foreground text-sm">
              You can report issues entirely anonymously. The platform is designed to focus on the problem that needs solving, not harvesting citizen data.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-6">
            <Globe className="w-8 h-8 text-primary mb-4" />
            <h4 className="text-lg font-bold mb-2">Radical Transparency</h4>
            <p className="text-muted-foreground text-sm">
              Every reported issue appears on our public dashboard. Citizens can see exactly what city officials see, holding government accountable for resolution times.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
        <Users className="w-12 h-12 text-primary mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Join the Network</h3>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          A smart city isn't just about technology—it's about the people who use it. Start reporting today and help shape the future of your neighborhood.
        </p>
      </div>
    </div>
  );
}