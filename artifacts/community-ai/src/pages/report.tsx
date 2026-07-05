import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useRef } from "react";
import { useAnalyzeComplaint, useCreateComplaint } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { Upload, X, Brain, Check, ShieldAlert, Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

const CATEGORIES = [
  { id: "pothole", label: "Pothole / Road Damage" },
  { id: "broken_streetlight", label: "Broken Streetlight" },
  { id: "garbage", label: "Garbage / Illegal Dumping" },
  { id: "water_leakage", label: "Water Leakage" },
  { id: "drainage", label: "Drainage / Flooding" },
  { id: "public_safety", label: "Public Safety Hazard" },
  { id: "other", label: "Other" }
];

export default function Report() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    location: "",
    description: "",
    category: "",
    isAnonymous: false,
    reporterName: "",
  });
  
  const [image, setImage] = useState<{ url: string, mime: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const analyzeMutation = useAnalyzeComplaint();
  const createMutation = useCreateComplaint();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image too large", description: "Please upload an image smaller than 5MB", variant: "destructive" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage({
        url: event.target?.result as string,
        mime: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage({
        url: event.target?.result as string,
        mime: file.type
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = () => {
    if (!formData.description) {
      toast({ title: "Description required", description: "Please provide a description for the AI to analyze.", variant: "destructive" });
      return;
    }

    let base64Data = undefined;
    if (image) {
      // Extract just the base64 part
      base64Data = image.url.split(',')[1];
    }

    analyzeMutation.mutate({
      data: {
        description: formData.description,
        category: formData.category || undefined,
        imageData: base64Data,
        imageMimeType: image?.mime
      }
    }, {
      onSuccess: (data) => {
        toast({ title: "Analysis Complete", description: "AI has successfully assessed the issue." });
      },
      onError: () => {
        toast({ title: "Analysis Failed", description: "Could not complete AI analysis. You can still submit the report.", variant: "destructive" });
      }
    });
  };

  const handleSubmit = () => {
    if (!formData.location || !formData.description) {
      toast({ title: "Missing fields", description: "Location and description are required.", variant: "destructive" });
      return;
    }

    // Merge AI data if available
    const aiData = analyzeMutation.data;
    
    createMutation.mutate({
      data: {
        ...formData,
        category: aiData?.category || formData.category || undefined,
        imageData: image?.url,
        imageMimeType: image?.mime,
        priority: aiData?.priority || "medium",
        
        // AI Data
        aiAnalyzed: !!aiData,
        aiTitle: aiData?.title,
        aiSummary: aiData?.summary,
        aiCategory: aiData?.category,
        aiSeverityScore: aiData?.severityScore,
        aiUrgency: aiData?.urgency,
        aiDepartment: aiData?.department,
        aiEnvironmentalImpact: aiData?.environmentalImpact,
        aiResolutionEstimate: aiData?.resolutionEstimate,
        aiSuggestedActions: aiData ? JSON.stringify(aiData.suggestedActions) : undefined,
        aiConfidenceScore: aiData?.confidenceScore,
      }
    }, {
      onSuccess: (data) => {
        toast({ title: "Report Submitted", description: "Thank you for making our community better!" });
        setLocation(`/complaints/${data.id}`);
      },
      onError: () => {
        toast({ title: "Submission Failed", description: "Please try again later.", variant: "destructive" });
      }
    });
  };

  const analysis = analyzeMutation.data;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Report an Issue</h1>
        <p className="text-muted-foreground mt-2">Help improve our city by reporting infrastructure and safety issues.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Column */}
        <div className="lg:w-1/2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Image Upload */}
              <div 
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'} ${image ? 'p-2' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                {image ? (
                  <div className="relative rounded-lg overflow-hidden group">
                    <img src={image.url} alt="Preview" className="w-full max-h-[300px] object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="destructive" size="sm" onClick={() => setImage(null)}>
                        <X className="w-4 h-4 mr-2" /> Remove Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 flex flex-col items-center">
                    <div className="p-4 bg-muted rounded-full mb-4">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="font-medium mb-1">Drag & drop a photo</p>
                    <p className="text-sm text-muted-foreground mb-4">or click to browse from your device</p>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleImageChange}
                    />
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                      Select Image
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Location <span className="text-destructive">*</span></label>
                <Input 
                  placeholder="e.g. 123 Main St, near the crosswalk" 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Description <span className="text-destructive">*</span></label>
                <Textarea 
                  placeholder="Describe what you see in detail..." 
                  className="min-h-[120px]"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Category (Optional)</label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select a category or let AI decide</option>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>

              <div className="pt-4 border-t">
                <label className="flex items-center space-x-2 cursor-pointer mb-4">
                  <input 
                    type="checkbox" 
                    className="rounded border-input text-primary focus:ring-primary h-4 w-4"
                    checked={formData.isAnonymous}
                    onChange={(e) => setFormData({...formData, isAnonymous: e.target.checked})}
                  />
                  <span className="text-sm font-medium">Submit Anonymously</span>
                </label>

                {!formData.isAnonymous && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="text-sm font-medium mb-1 block">Your Name</label>
                    <Input 
                      placeholder="Jane Doe" 
                      value={formData.reporterName}
                      onChange={(e) => setFormData({...formData, reporterName: e.target.value})}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Column */}
        <div className="lg:w-1/2 space-y-6">
          <Card className="border-accent/30 bg-accent/5 relative overflow-hidden h-full flex flex-col">
            {!analysis && !analyzeMutation.isPending && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-8 text-center">
                <div className="bg-background border border-accent/20 p-4 rounded-full shadow-lg mb-6 shadow-accent/10">
                  <Brain className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Intelligence Analysis</h3>
                <p className="text-muted-foreground mb-8 max-w-sm">
                  Our civic AI can automatically categorize this issue, assess its severity, and route it to the right department.
                </p>
                <Button 
                  size="lg" 
                  variant="ai"
                  onClick={handleAnalyze}
                  disabled={!formData.description}
                  className="px-8"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Analyze Issue Now
                </Button>
                {!formData.description && (
                  <p className="text-xs text-muted-foreground mt-4">Please provide a description first</p>
                )}
              </div>
            )}

            {analyzeMutation.isPending && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-zinc-950 text-cyan-400 font-mono p-8">
                <div className="ai-scanline"></div>
                <Loader2 className="w-12 h-12 animate-spin mb-6" />
                <p className="text-lg animate-pulse mb-2">RUNNING_NEURAL_ANALYSIS...</p>
                <div className="text-xs text-cyan-400/50 space-y-1 text-center">
                  <p>Processing visual data...</p>
                  <p>Cross-referencing civic infrastructure patterns...</p>
                  <p>Calculating severity metrics...</p>
                </div>
              </div>
            )}

            <CardHeader className="bg-zinc-950 text-zinc-100 border-b border-zinc-800 rounded-t-xl relative z-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-cyan-400" />
                  <CardTitle className="font-mono tracking-tight">INTELLIGENCE_REPORT</CardTitle>
                </div>
                {analysis && <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono text-xs">ANALYSIS_COMPLETE</Badge>}
              </div>
            </CardHeader>
            
            <CardContent className="p-0 flex-1 bg-zinc-950 text-zinc-300 font-mono text-sm relative z-0">
              <div className="p-6 space-y-6">
                {/* Simulated empty state behind the blur */}
                {!analysis && !analyzeMutation.isPending && (
                  <div className="opacity-20 space-y-6 pointer-events-none">
                    <div className="flex justify-between border-b border-zinc-800 pb-2"><span>SUBJECT_CLASSIFICATION</span><span>...</span></div>
                    <div className="flex justify-between border-b border-zinc-800 pb-2"><span>CONFIDENCE_SCORE</span><span>...</span></div>
                    <div className="flex justify-between border-b border-zinc-800 pb-2"><span>SEVERITY_INDEX</span><span>...</span></div>
                    <div><span className="block mb-2">RECOMMENDED_ACTIONS</span><div className="h-4 bg-zinc-800 rounded w-full mb-2"></div></div>
                  </div>
                )}

                {analysis && (
                  <div className="animate-in fade-in zoom-in-95 duration-500 space-y-6">
                    <div>
                      <h4 className="text-cyan-400 text-xs mb-1">CLASSIFICATION_TITLE</h4>
                      <p className="text-lg text-zinc-100 font-bold tracking-tight">{analysis.title}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                        <span className="text-zinc-500 text-xs block mb-1">CATEGORY</span>
                        <span className="text-zinc-100 capitalize">{analysis.category.replace('_', ' ')}</span>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                        <span className="text-zinc-500 text-xs block mb-1">ROUTING_DEPT</span>
                        <span className="text-zinc-100">{analysis.department}</span>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                        <span className="text-zinc-500 text-xs block mb-1">PRIORITY</span>
                        <span className={`capitalize font-bold ${
                          analysis.priority === 'critical' ? 'text-rose-500' :
                          analysis.priority === 'high' ? 'text-orange-500' :
                          analysis.priority === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                        }`}>{analysis.priority}</span>
                      </div>
                      <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                        <span className="text-zinc-500 text-xs block mb-1">CONFIDENCE</span>
                        <span className="text-cyan-400">{(analysis.confidenceScore * 100).toFixed(1)}%</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-zinc-500 text-xs">SEVERITY_METRIC [1-10]</span>
                        <span className="text-xl font-bold text-zinc-100">{analysis.severityScore}/10</span>
                      </div>
                      <div className="flex h-3 gap-1">
                        {[1,2,3,4,5,6,7,8,9,10].map(i => (
                          <div 
                            key={i} 
                            className={`flex-1 rounded-sm ${
                              i <= analysis.severityScore 
                                ? (i > 7 ? 'bg-rose-500' : i > 4 ? 'bg-amber-500' : 'bg-emerald-500') 
                                : 'bg-zinc-800'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded space-y-2">
                      <div className="flex items-start gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-zinc-500 text-xs block">ENVIRONMENTAL_IMPACT</span>
                          <span className="text-zinc-300 text-sm leading-tight">{analysis.environmentalImpact}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="text-zinc-500 text-xs block mb-2">SUGGESTED_PROTOCOLS</span>
                      <ul className="space-y-2">
                        {analysis.suggestedActions.map((action, i) => (
                          <li key={i} className="flex gap-2 text-sm text-zinc-300">
                            <span className="text-cyan-500 shrink-0">→</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t flex justify-end">
        <Button 
          size="lg" 
          onClick={handleSubmit}
          disabled={createMutation.isPending}
          className="w-full sm:w-auto px-12 h-14 text-lg"
        >
          {createMutation.isPending ? (
            <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Submitting...</>
          ) : (
            <><Check className="w-5 h-5 mr-2" /> Submit Official Report</>
          )}
        </Button>
      </div>
    </div>
  );
}