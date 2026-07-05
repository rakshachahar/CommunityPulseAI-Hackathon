import { useState, useRef, useEffect } from "react";
import { useListComplaints, useUpdateComplaint, useDeleteComplaint } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, Save, Trash2, Eye, ExternalLink, Lock } from "lucide-react";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { getListComplaintsQueryKey, getGetDashboardStatsQueryKey } from "@workspace/api-client-react";

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("admin_auth") === "true"
  );
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editingNotesId, setEditingNotesId] = useState<number | null>(null);
  const [notesText, setNotesText] = useState("");

  const { data: complaints, isLoading } = useListComplaints({
    search: search || undefined,
    status: statusFilter || undefined,
    sort: "createdAt",
    order: "desc"
  }, { query: { enabled: isAuthenticated, queryKey: getListComplaintsQueryKey({ search: search || undefined, status: statusFilter || undefined, sort: "createdAt", order: "desc" }) } });

  const updateMutation = useUpdateComplaint();
  const deleteMutation = useDeleteComplaint();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      toast({ title: "Authenticated", description: "Welcome to the control center." });
    } else {
      toast({ title: "Access Denied", description: "Invalid credentials.", variant: "destructive" });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
  };

  const handleStatusChange = (id: number, newStatus: any) => {
    updateMutation.mutate({ id, data: { status: newStatus } }, {
      onSuccess: () => {
        toast({ title: "Status Updated", description: "The report status has been updated." });
        queryClient.invalidateQueries({ queryKey: getListComplaintsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
      }
    });
  };

  const handlePriorityChange = (id: number, newPriority: any) => {
    updateMutation.mutate({ id, data: { priority: newPriority } }, {
      onSuccess: () => {
        toast({ title: "Priority Updated", description: "The routing priority has been adjusted." });
        queryClient.invalidateQueries({ queryKey: getListComplaintsQueryKey() });
      }
    });
  };

  const handleSaveNotes = (id: number) => {
    updateMutation.mutate({ id, data: { adminNotes: notesText } }, {
      onSuccess: () => {
        toast({ title: "Notes Saved", description: "Official record updated." });
        setEditingNotesId(null);
        queryClient.invalidateQueries({ queryKey: getListComplaintsQueryKey() });
      }
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to permanently delete this report?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          toast({ title: "Report Deleted", description: "Record expunged from the system." });
          queryClient.invalidateQueries({ queryKey: getListComplaintsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetDashboardStatsQueryKey() });
        }
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl border-primary/20">
          <CardHeader className="text-center space-y-2 pb-8">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-2">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Restricted Access</CardTitle>
            <p className="text-muted-foreground text-sm">Authorized municipal personnel only.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="Enter clearance code" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 text-center text-lg"
                />
              </div>
              <Button type="submit" className="w-full h-12 text-lg">Authenticate</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-[1400px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>
          <p className="text-muted-foreground mt-1">Manage and route incoming civic intelligence.</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>Terminate Session</Button>
      </div>

      <Card className="mb-6 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reports by ID, location, or description..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <select 
                className="flex h-10 w-[180px] rounded-md border border-input bg-transparent pl-9 pr-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-semibold">
            <tr>
              <th className="px-4 py-3 w-[80px]">ID</th>
              <th className="px-4 py-3 min-w-[250px]">Issue Intelligence</th>
              <th className="px-4 py-3 w-[150px]">Status</th>
              <th className="px-4 py-3 w-[150px]">Priority</th>
              <th className="px-4 py-3 min-w-[200px]">Admin Notes</th>
              <th className="px-4 py-3 w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center"><div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div></td></tr>
            ) : complaints?.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No reports match the current filters.</td></tr>
            ) : complaints?.map((complaint) => (
              <tr key={complaint.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-4 font-mono font-medium text-xs">#{complaint.id}</td>
                <td className="px-4 py-4">
                  <div className="font-semibold mb-1 truncate max-w-[300px]">
                    {complaint.aiTitle || complaint.category?.replace('_', ' ') || 'Uncategorized'}
                  </div>
                  <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                    {complaint.location}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(complaint.createdAt), 'MMM d, yyyy')}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <select 
                    className={`h-8 w-full rounded border px-2 text-xs font-semibold
                      ${complaint.status === 'resolved' || complaint.status === 'closed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                        complaint.status === 'in_progress' ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20' : 
                        'bg-secondary text-secondary-foreground border-border'}
                    `}
                    value={complaint.status}
                    onChange={(e) => handleStatusChange(complaint.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </td>
                <td className="px-4 py-4">
                  <select 
                    className={`h-8 w-full rounded border px-2 text-xs font-semibold
                      ${complaint.priority === 'critical' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                        complaint.priority === 'high' ? 'bg-orange-500/10 text-orange-600 border-orange-500/20' :
                        complaint.priority === 'medium' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 
                        'bg-secondary text-secondary-foreground border-border'}
                    `}
                    value={complaint.priority}
                    onChange={(e) => handlePriorityChange(complaint.id, e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </td>
                <td className="px-4 py-4">
                  {editingNotesId === complaint.id ? (
                    <div className="flex flex-col gap-2">
                      <Textarea 
                        value={notesText} 
                        onChange={(e) => setNotesText(e.target.value)}
                        className="min-h-[60px] text-xs p-2"
                        placeholder="Add official notes..."
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleSaveNotes(complaint.id)} className="h-7 text-xs px-2"><Save className="w-3 h-3 mr-1" /> Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingNotesId(null)} className="h-7 text-xs px-2">Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="cursor-pointer hover:bg-muted p-2 rounded text-xs min-h-[40px] border border-transparent hover:border-border transition-colors group relative"
                      onClick={() => {
                        setEditingNotesId(complaint.id);
                        setNotesText(complaint.adminNotes || "");
                      }}
                    >
                      {complaint.adminNotes ? (
                        <p className="line-clamp-2">{complaint.adminNotes}</p>
                      ) : (
                        <p className="text-muted-foreground italic">Click to add notes...</p>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <a href={`/complaints/${complaint.id}`} target="_blank" rel="noreferrer">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(complaint.id)} className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}