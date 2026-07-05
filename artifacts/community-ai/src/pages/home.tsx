import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Camera, Brain, Zap, Shield, BarChart3 } from "lucide-react";
import heroImage from "@assets/generated_images/hero-illustration.png";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 data-panel-bg opacity-40"></div>
        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 flex flex-col items-start text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                AI-Powered Civic Reporting
              </div>
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Fix your city <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">at the speed of AI.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-[600px] leading-relaxed">
                Snap a photo. Our intelligence engine identifies the issue, assesses severity, and routes it to the right department instantly. No forms, no waiting on hold.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto">
                <Link href="/report">
                  <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full shadow-lg shadow-primary/25">
                    Report an Issue <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full">
                    View Live Dashboard
                  </Button>
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 w-full relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-2 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <img 
                  src={heroImage} 
                  alt="Smart City Illustration" 
                  className="w-full h-auto rounded-xl object-cover aspect-[4/3]"
                />
                <div className="absolute top-6 right-6 bg-background/90 backdrop-blur border border-border p-3 rounded-lg shadow-lg flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 delay-300">
                  <div className="bg-accent/20 p-2 rounded-md text-accent">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-muted-foreground">AI Assessment</div>
                    <div className="text-sm font-bold">Critical Priority</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-muted/30 border-y">
        <div className="container px-4 mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground text-lg">We've replaced bureaucratic red tape with artificial intelligence. Reporting an issue takes less than 30 seconds.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: "1. Snap a Photo",
                description: "See a pothole, broken light, or dumping? Take a picture with your phone. Location is automatically detected."
              },
              {
                icon: Brain,
                title: "2. AI Analysis",
                description: "Our vision model identifies the problem, categorizes it, and calculates a severity score in real-time."
              },
              {
                icon: Zap,
                title: "3. Instant Routing",
                description: "The intelligent report is immediately dispatched to the correct municipal department for prioritized action."
              }
            ].map((step, i) => (
              <div key={i} className="bg-card border rounded-xl p-8 shadow-sm relative overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-500 ease-out"></div>
                <div className="bg-primary/10 text-primary w-14 h-14 rounded-lg flex items-center justify-center mb-6 relative z-10">
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 relative z-10">{step.title}</h3>
                <p className="text-muted-foreground relative z-10">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2 space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold">Built for transparency. <br/>Designed for action.</h2>
              <ul className="space-y-6">
                {[
                  {
                    icon: Shield,
                    title: "Anonymous Reporting",
                    description: "Report sensitive issues without revealing your identity. We care about the problem, not who reported it."
                  },
                  {
                    icon: BarChart3,
                    title: "Public Dashboard",
                    description: "Watch as issues are resolved. Our public dashboard holds city officials accountable with real-time statistics."
                  },
                  {
                    icon: Zap,
                    title: "Predictive Resolution",
                    description: "Our AI estimates repair times and environmental impact, helping communities prioritize effectively."
                  }
                ].map((feature, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="mt-1 bg-accent/10 text-accent p-2 rounded flex-shrink-0 h-fit">
                      <feature.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{feature.title}</h4>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="bg-zinc-900 rounded-2xl p-6 md:p-8 text-zinc-100 shadow-2xl relative overflow-hidden border border-zinc-800">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Brain className="w-48 h-48" />
                </div>
                <h3 className="font-mono text-cyan-400 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  AI_INTELLIGENCE_REPORT
                </h3>
                <div className="space-y-4 font-mono text-sm">
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-500">CATEGORY</span>
                    <span className="text-zinc-200">Road Infrastructure</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-500">CONFIDENCE</span>
                    <span className="text-emerald-400">98.4%</span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className="text-zinc-500">SEVERITY</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 w-4/5"></div>
                      </div>
                      <span className="text-rose-400">8/10</span>
                    </div>
                  </div>
                  <div className="pt-4">
                    <span className="text-zinc-500 block mb-2">SUGGESTED_ACTIONS</span>
                    <ul className="list-square pl-4 text-zinc-300 space-y-2">
                      <li>Dispatch rapid repair team within 24h</li>
                      <li>Deploy temporary traffic cones</li>
                      <li>Check underlying water main for leakage</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div className="absolute inset-0 data-panel-bg opacity-10"></div>
        <div className="container px-4 mx-auto relative z-10 max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">See something? Say something.</h2>
          <p className="text-primary-foreground/80 text-xl mb-10">
            Join thousands of citizens using AI to make their neighborhoods safer, cleaner, and more efficient.
          </p>
          <Link href="/report">
            <Button size="lg" variant="secondary" className="text-lg h-14 px-8 rounded-full">
              Make a Report Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}