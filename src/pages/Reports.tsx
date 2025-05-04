
import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/sonner";
import { mockDefects, type Defect } from "@/data/defect-data";
import { useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, FileText, ClipboardList } from "lucide-react";

interface ReportFormValues {
  title: string;
  description: string;
  action: string;
  materials: string;
  technician: string;
  timeRequired: string;
}

interface LocationState {
  defect?: Defect;
}

export default function ReportsPage() {
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if a defect was passed via location state
  useEffect(() => {
    const state = location.state as LocationState;
    if (state?.defect) {
      setSelectedDefect(state.defect);
    }
  }, [location.state]);

  const form = useForm<ReportFormValues>({
    defaultValues: {
      title: selectedDefect ? `Report for ${selectedDefect.id}` : "",
      description: "",
      action: "",
      materials: "",
      technician: "",
      timeRequired: "",
    }
  });

  const onSubmit = (data: ReportFormValues) => {
    console.log("Report submitted:", { defect: selectedDefect, ...data });
    
    // Show success message
    toast.success("Report submitted successfully");
    
    // Navigate back to dashboard after submission
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
  };

  return (
    <DashboardLayout onDefectSelect={setSelectedDefect}>
      <div className="p-6 h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                <CardTitle>Create Defect Report</CardTitle>
              </div>
              <p className="text-muted-foreground">
                {selectedDefect 
                  ? `Creating report for defect ID: ${selectedDefect.id}`
                  : "Fill out the form to create a defect report"}
              </p>
            </CardHeader>
            <CardContent>
              {selectedDefect && (
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Defect Information</h3>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ID:</span>
                      <span className="font-medium">{selectedDefect.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">{selectedDefect.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Severity:</span>
                      <span className={`font-medium text-severity-${selectedDefect.severity}`}>
                        {selectedDefect.severity.charAt(0).toUpperCase() + selectedDefect.severity.slice(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">{selectedDefect.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Detected:</span>
                      <span className="font-medium">{new Date(selectedDefect.detectedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Report Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter report title" {...field} />
                        </FormControl>
                        <FormDescription>
                          Give your report a descriptive title
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the defect in detail..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="action"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recommended Action</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="What actions should be taken?" 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="materials"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Materials Required</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List required materials..." 
                              className="min-h-[80px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="technician"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Technician Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="timeRequired"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estimated Time Required</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2 hours, 1 day..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <CardFooter className="flex justify-end px-0 pt-4">
                    <Button type="submit" className="w-full md:w-auto">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      Submit Report
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
