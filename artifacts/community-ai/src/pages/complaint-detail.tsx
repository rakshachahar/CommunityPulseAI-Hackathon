import { useGetComplaint, getGetComplaintQueryKey } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  ArrowLeft, MapPin, Clock, Brain, User, AlertTriangle, 
  CheckCircle2, Hammer, Image as ImageIcon, ShieldAlert, Loader2
} from "lucide-react";

export default function ComplaintDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  
  const { data: complaint, isLoading, error } = useGetComplaint(id, {
    query: {
      enabled: id > 0,
      queryKey: getGetComplaintQueryKey(id),
    }
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center text-muted-foreground">
          <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
          <p>Retrieving report intelligence...</p>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-5xl text-center">
        <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
        <p className="text-muted-foreground mb-6">This intelligence report does not exist or you don't have access.</p>
        <Link href="/dashboard">
          <Button>Return to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'resolved': case 'closed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'in_progress': return <Hammer className="w-5 h-5 text-cyan-500" />;
      default: return <Clock className="w-5 h-5 text-amber-500" />;
    }
  };

  let parsedActions: string[] = [];
  if (complaint.aiSuggestedActions) {
    try {
      parsedActions = JSON.parse(complaint.aiSuggestedActions);
    } catch(e) {}
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Link href="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {complaint.aiTitle || complaint.category || "Uncategorized Issue"}
            </h1>
            <span className="font-mono text-muted-foreground text-sm bg-muted px-2 py-1 rounded">#{complaint.id}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
            <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {complaint.location}</span>
            <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {format(new Date(complaint.createdAt), 'MMMM d, yyyy h:mm a')}</span>
            <span className="flex items-center"><User className="w-4 h-4 mr-1" /> {complaint.isAnonymous ? 'Anonymous Citizen' : (complaint.reporterName || 'Citizen')}</span>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <Badge className="text-sm px-3 py-1 flex items-center gap-1.5" variant={
            complaint.priority === 'critical' ? 'destructive' :
            complaint.priority === 'high' ? 'destructive' :
            complaint.priority === 'medium' ? 'warning' : 'default'
          }>
            <AlertTriangle className="w-3.5 h-3.5" />
            {complaint.priority.toUpperCase()} PRIORITY
          </Badge>
          <Badge className="text-sm px-3 py-1 flex items-center gap-1.5" variant={
            complaint.status === 'resolved' || complaint.status === 'closed' ? 'success' :
            complaint.status === 'in_progress' ? 'info' : 'secondary'
          }>
            {getStatusIcon(complaint.status)}
            {complaint.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardContent className="p-0 overflow-hidden relative group">
              {complaint.imageData ? (
                <div className="relative aspect-video w-full bg-black">
                  <img src={complaint.imageData} alt="Reported issue" className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="aspect-video w-full bg-muted flex flex-col items-center justify-center text-muted-foreground border-b">
                  <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                  <p>No image attached to this report</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Citizen Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
            </CardContent>
          </Card>

          {complaint.adminNotes && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-primary flex items-center">
                  <ShieldAlert className="w-4 h-4 mr-2" /> Official Administrative Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm">{complaint.adminNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {complaint.aiAnalyzed ? (
            <Card className="border-accent/30 bg-zinc-950 text-zinc-300 font-mono shadow-xl relative overflow-hidden">
              <div className="ai-scanline"></div>
              <CardHeader className="border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Brain className="w-5 h-5" />
                  <CardTitle className="text-base tracking-widest">AI_INTELLIGENCE_REPORT</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6 text-sm">
                <div>
                  <span className="text-zinc-500 text-xs block mb-1">GENERATED_SUMMARY</span>
                  <p className="text-zinc-100">{complaint.aiSummary}</p>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  <div>
                    <span className="text-zinc-500 text-xs block mb-1">DEPARTMENT</span>
                    <span className="text-zinc-200">{complaint.aiDepartment || 'General'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-xs block mb-1">CONFIDENCE</span>
                    <span className="text-cyan-400">{complaint.aiConfidenceScore ? `${(complaint.aiConfidenceScore * 100).toFixed(1)}%` : 'N/A'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-zinc-500 text-xs block mb-1">ESTIMATED_RESOLUTION</span>
                    <span className="text-zinc-200">{complaint.aiResolutionEstimate || 'Unknown'}</span>
                  </div>
                </div>

                {complaint.aiSeverityScore && (
                  <div>
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-zinc-500 text-xs">SEVERITY_METRIC</span>
                      <span className="font-bold text-zinc-100">{complaint.aiSeverityScore}/10</span>
                    </div>
                    <div className="flex h-2 gap-1">
                      {[1,2,3,4,5,6,7,8,9,10].map(i => (
                        <div 
                          key={i} 
                          className={`flex-1 rounded-sm ${
                            i <= (complaint.aiSeverityScore || 0) 
                              ? (i > 7 ? 'bg-rose-500' : i > 4 ? 'bg-amber-500' : 'bg-emerald-500') 
                              : 'bg-zinc-800'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                )}

                {complaint.aiEnvironmentalImpact && (
                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    <span className="text-zinc-500 text-xs block mb-1">ENVIRONMENTAL_IMPACT</span>
                    <span className="text-zinc-300 leading-tight block">{complaint.aiEnvironmentalImpact}</span>
                  </div>
                )}

                {parsedActions.length > 0 && (
                  <div>
                    <span className="text-zinc-500 text-xs block mb-2">SUGGESTED_PROTOCOLS</span>
                    <ul className="space-y-1.5">
                      {parsedActions.map((action, i) => (
                        <li key={i} className="flex gap-2 text-xs">
                          <span className="text-cyan-500 shrink-0">→</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground flex flex-col items-center">
                <Brain className="w-10 h-10 mb-3 opacity-20" />
                <p>This report was not analyzed by the AI system.</p>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm uppercase text-muted-foreground font-semibold tracking-wider">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Category</span>
                <span className="capitalize font-medium">{complaint.category?.replace('_', ' ') || 'None'}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Reported</span>
                <span className="font-medium">{format(new Date(complaint.createdAt), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Updated</span>
                <span className="font-medium">{format(new Date(complaint.updatedAt), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Source</span>
                <span className="font-medium">Citizen Portal</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}