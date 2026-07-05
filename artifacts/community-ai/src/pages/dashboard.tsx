import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetDashboardStats, useListComplaints } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Search, CheckCircle2, Clock, MapPin, Activity, ShieldAlert, Brain, Camera } from "lucide-react";
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid } from "recharts";
import { format } from "date-fns";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [priorityFilter, setPriorityFilter] = useState<string>("");

  const { data: complaints, isLoading: complaintsLoading } = useListComplaints({
    search: search || undefined,
    status: statusFilter || undefined,
    priority: priorityFilter || undefined,
    sort: "createdAt",
    order: "desc"
  });

  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">City Intelligence Dashboard</h1>
          <p className="text-muted-foreground mt-1">Real-time overview of community reported issues.</p>
        </div>
        <Link href="/report">
          <Button className="shrink-0"><Activity className="w-4 h-4 mr-2" /> Report Issue</Button>
        </Link>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse bg-muted/50 h-28 border-transparent"></Card>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-l-4 border-l-primary/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                  <h3 className="text-3xl font-bold mt-2">{stats.total}</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-md text-primary">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-amber-500/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Action</p>
                  <h3 className="text-3xl font-bold mt-2">{stats.pending}</h3>
                </div>
                <div className="p-2 bg-amber-500/10 rounded-md text-amber-500">
                  <Clock className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-emerald-500/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <h3 className="text-3xl font-bold mt-2">{stats.resolved + stats.closed}</h3>
                </div>
                <div className="p-2 bg-emerald-500/10 rounded-md text-emerald-500">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-rose-500/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                  <h3 className="text-3xl font-bold mt-2 text-rose-500">{stats.highPriority}</h3>
                </div>
                <div className="p-2 bg-rose-500/10 rounded-md text-rose-500">
                  <ShieldAlert className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-1 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Reports by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] flex items-center justify-center">
            {statsLoading ? (
              <div className="w-40 h-40 rounded-full border-4 border-muted border-t-primary animate-spin"></div>
            ) : stats?.byCategory?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.byCategory}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="category"
                  >
                    {stats.byCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => [`${value} reports`, 'Count']}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground">No data available</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Resolution Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px]">
            {statsLoading ? (
              <div className="w-full h-full bg-muted/20 animate-pulse rounded-md"></div>
            ) : stats?.byStatus?.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.byStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="status" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    cursor={{ fill: 'hsl(var(--muted)/0.5)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
          <div>
            <CardTitle>Recent Intelligence Feed</CardTitle>
            <CardDescription>Live stream of community reported issues</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search location or description..."
                className="pl-9 w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="flex h-9 w-full sm:w-[130px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </CardHeader>
        <CardContent>
          {complaintsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-24 bg-muted/30 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : complaints?.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground">No issues found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {complaints?.map((complaint) => (
                <Link key={complaint.id} href={`/complaints/${complaint.id}`}>
                  <div className="group flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-border/50 bg-card hover:bg-muted/30 hover:border-primary/30 transition-all cursor-pointer">
                    <div className="h-24 w-full sm:w-32 shrink-0 rounded-lg overflow-hidden bg-muted flex items-center justify-center border">
                      {complaint.imageData ? (
                        <img src={complaint.imageData} alt="Issue" className="h-full w-full object-cover" />
                      ) : (
                        <Camera className="h-8 w-8 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h4 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                          {complaint.aiTitle || complaint.category || "Uncategorized Issue"}
                        </h4>
                        <div className="flex items-center gap-2 shrink-0">
                          {complaint.aiAnalyzed && (
                            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                              <Brain className="w-3 h-3 mr-1" /> AI Analyzed
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {complaint.aiSummary || complaint.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-medium">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5 mr-1" />
                          <span className="truncate max-w-[150px]">{complaint.location}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Clock className="w-3.5 h-3.5 mr-1" />
                          {format(new Date(complaint.createdAt), 'MMM d, h:mm a')}
                        </div>
                        
                        <div className="flex gap-2 ml-auto">
                          <Badge variant={
                            complaint.priority === 'critical' || complaint.priority === 'high' ? 'destructive' :
                            complaint.priority === 'medium' ? 'warning' : 'outline'
                          } className="capitalize">
                            {complaint.priority}
                          </Badge>
                          
                          <Badge variant={
                            complaint.status === 'resolved' || complaint.status === 'closed' ? 'success' :
                            complaint.status === 'in_progress' ? 'info' : 'secondary'
                          } className="capitalize">
                            {complaint.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}