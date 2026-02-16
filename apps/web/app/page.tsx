"use client";

import { useState, useEffect } from "react";
import { Cadence, EnrollmentState, CadenceStep } from "@repo/types";
import {
  Mail,
  Play,
  RefreshCw,
  Layers,
  CheckCircle,
  XCircle,
  Clock,
  ChevronRight,
  Database,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const API_URL = "http://localhost:4001";

export default function Home() {
  const [cadenceJson, setCadenceJson] = useState(
    JSON.stringify(
      {
        name: "Welcome Flow",
        steps: [
          {
            id: "1",
            type: "SEND_EMAIL",
            subject: "Welcome",
            body: "Hello there",
          },
          { id: "2", type: "WAIT", seconds: 5 },
          {
            id: "3",
            type: "SEND_EMAIL",
            subject: "Follow up",
            body: "Checking in",
          },
        ],
      },
      null,
      2,
    ),
  );

  const [contactEmail, setContactEmail] = useState("test@example.com");
  const [activeEnrollments, setActiveEnrollments] = useState<string[]>([]);
  const [enrollmentStates, setEnrollmentStates] = useState<
    Record<string, EnrollmentState>
  >({});

  // Poll active enrollments
  useEffect(() => {
    const interval = setInterval(async () => {
      for (const id of activeEnrollments) {
        try {
          const res = await fetch(`${API_URL}/enrollments/${id}`);
          if (res.ok) {
            const state = await res.json();
            setEnrollmentStates((prev) => ({ ...prev, [id]: state }));
          }
        } catch (e: any) {
          console.error("Failed to poll enrollment", id, e);
        }
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [activeEnrollments]);

  const handleCreateCadence = async () => {
    try {
      const payload = JSON.parse(cadenceJson);
      const res = await fetch(`${API_URL}/cadences`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      return data.id;
    } catch (e: any) {
      console.error("Invalid JSON or API error", e);
      return null;
    }
  };

  const handleEnroll = async () => {
    const cadenceId = await handleCreateCadence();
    if (!cadenceId) {
      alert("Failed to create cadence. Check JSON format.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/enrollments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cadenceId, contactEmail }),
      });
      const data = await res.json();
      setActiveEnrollments((prev) => [data.enrollmentId, ...prev]);
    } catch (e: any) {
      alert("Failed to enroll");
    }
  };

  const handleUpdateRunning = async (enrollmentId: string) => {
    try {
      const payload = JSON.parse(cadenceJson);
      await fetch(`${API_URL}/enrollments/${enrollmentId}/update-cadence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ steps: payload.steps }),
      });
      alert("Signal sent to update cadence");
    } catch (e: any) {
      alert("Failed to update running workflow");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RUNNING":
        return (
          <Badge
            variant="secondary"
            className="bg-blue-100 text-blue-800 hover:bg-blue-100 gap-1"
          >
            <Clock className="w-3 h-3" /> Running
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-100 gap-1"
          >
            <CheckCircle className="w-3 h-3" /> Completed
          </Badge>
        );
      case "FAILED":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="w-3 h-3" /> Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              <Layers className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              Email Cadence Manager
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
            <span>API Status: </span>
            <Badge
              variant="outline"
              className="text-green-600 border-green-200 bg-green-50"
            >
              Online
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Editor & Configuration */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Define New Cadence
                    </CardTitle>
                    <CardDescription>
                      Setup your sequence of emails and delays
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Tabs defaultValue="editor" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="editor">JSON Editor</TabsTrigger>
                    <TabsTrigger value="preview">Visual Flow</TabsTrigger>
                  </TabsList>
                  <TabsContent value="editor">
                    <Textarea
                      className="font-mono text-xs min-h-[400px] resize-none focus:ring-1"
                      value={cadenceJson}
                      onChange={(e) => setCadenceJson(e.target.value)}
                    />
                  </TabsContent>
                  <TabsContent value="preview">
                    <ScrollArea className="h-[400px] rounded-md border p-4 bg-slate-50">
                      <div className="space-y-4 text-sm">
                        {(() => {
                          try {
                            const data = JSON.parse(cadenceJson);
                            return data.steps.map((step: any, idx: number) => (
                              <div key={idx} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center font-semibold text-xs shadow-sm">
                                    {idx + 1}
                                  </div>
                                  {idx < data.steps.length - 1 && (
                                    <div className="w-px h-full bg-slate-200 my-1" />
                                  )}
                                </div>
                                <div className="flex-1 pb-4">
                                  <div className="p-3 bg-white rounded-lg border shadow-sm">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="font-medium text-primary uppercase text-[10px] tracking-wider">
                                        {step.type === "SEND_EMAIL" ? (
                                          <span className="flex items-center gap-1 text-blue-600">
                                            <Mail className="w-3 h-3" /> EMAIL
                                          </span>
                                        ) : (
                                          <span className="flex items-center gap-1 text-amber-600">
                                            <Clock className="w-3 h-3" /> WAIT
                                          </span>
                                        )}
                                      </span>
                                    </div>
                                    <div className="text-slate-600">
                                      {step.type === "SEND_EMAIL" ? (
                                        <div className="space-y-1">
                                          <p className="font-semibold text-slate-900 border-b pb-1">
                                            Subject: {step.subject}
                                          </p>
                                          <p className="text-xs italic truncate">
                                            "{step.body}"
                                          </p>
                                        </div>
                                      ) : (
                                        <p>
                                          Wait for{" "}
                                          <strong>
                                            {step.seconds} seconds
                                          </strong>
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ));
                          } catch (e) {
                            return (
                              <p className="text-destructive">
                                Invalid JSON format
                              </p>
                            );
                          }
                        })()}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-t-4 border-t-primary">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Play className="w-4 h-4" /> Enroll Contact
                </CardTitle>
                <CardDescription>
                  Start the cadence for a specific email address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Contact Email
                  </label>
                  <Input
                    type="email"
                    placeholder="e.g. contact@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="h-10"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleEnroll} className="w-full h-10 gap-2">
                  <Plus className="w-4 h-4" /> Create & Enroll
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column: Active Enrollments */}
          <div className="lg:col-span-7">
            <div className="flex items-center justify-between mb-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">
                  Active Enrollments
                </h2>
                <p className="text-sm text-muted-foreground font-medium flex items-center gap-1">
                  <Database className="w-4 h-4" /> {activeEnrollments.length}{" "}
                  Running Workflows
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4" /> Refresh All
              </Button>
            </div>

            {activeEnrollments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-white/50 text-muted-foreground animate-in fade-in zoom-in duration-300">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
                  <Layers className="w-6 h-6" />
                </div>
                <p className="font-medium">No active enrollments</p>
                <p className="text-sm">Enroll a contact to see progress here</p>
              </div>
            ) : (
              <ScrollArea className="h-[calc(100vh-280px)] pr-4">
                <div className="space-y-4 pb-8">
                  {activeEnrollments.map((id) => (
                    <Card
                      key={id}
                      className="shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <CardContent className="p-0">
                        <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border">
                              <Mail className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 truncate max-w-[200px] md:max-w-none">
                                {enrollmentStates[id]?.contactEmail ||
                                  "Loading email..."}
                              </p>
                              <code className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                                ID: {id}
                              </code>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {enrollmentStates[id] ? (
                              getStatusBadge(enrollmentStates[id].status)
                            ) : (
                              <Badge variant="outline">Connecting...</Badge>
                            )}
                          </div>
                        </div>

                        {enrollmentStates[id] && (
                          <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/30">
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                Current Step
                              </p>
                              <p className="text-sm font-semibold flex items-center gap-1">
                                {enrollmentStates[id].currentStepIndex} of{" "}
                                {enrollmentStates[id].steps.length}
                                <ChevronRight className="w-3 h-3 text-slate-400" />
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                Version
                              </p>
                              <Badge
                                variant="outline"
                                className="h-5 px-1.5 text-[10px] font-mono"
                              >
                                v{enrollmentStates[id].stepsVersion}
                              </Badge>
                            </div>
                            <div className="col-span-2 flex items-center justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full sm:w-auto gap-2 bg-white"
                                onClick={() => handleUpdateRunning(id)}
                                disabled={
                                  enrollmentStates[id].status !== "RUNNING"
                                }
                              >
                                <RefreshCw
                                  className={cn(
                                    "w-3.5 h-3.5",
                                    enrollmentStates[id].status === "RUNNING"
                                      ? "animate-spin-slow"
                                      : "",
                                  )}
                                />
                                Sync to Latest JSON
                              </Button>
                            </div>
                          </div>
                        )}

                        {enrollmentStates[id] && (
                          <div className="p-4 border-t bg-white">
                            <details className="group">
                              <summary className="text-xs font-semibold cursor-pointer list-none flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
                                <ChevronRight className="w-3.5 h-3.5 transition-transform group-open:rotate-90" />
                                Inspect Step Logic
                              </summary>
                              <div className="mt-3 p-3 bg-slate-900 rounded-lg text-emerald-400 font-mono text-[10px] overflow-auto">
                                <pre className="bg-transparent p-0 m-0">
                                  {JSON.stringify(
                                    enrollmentStates[id].steps,
                                    null,
                                    2,
                                  )}
                                </pre>
                              </div>
                            </details>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
