import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { API_BASE_URL } from "../api"

// Validation schema
const technicianSchema = z.object({
  username: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["technician", "admin"]),
});

type TechnicianFormData = z.infer<typeof technicianSchema> & { _id?: string };

export function AdminUserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTechnician, setEditingTechnician] = useState<TechnicianFormData | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch technicians
  const { data: technicians = [], isLoading } = useQuery({
    queryKey: ["technicians"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/users`);
      return response.data;
    },
  });

  // Add technician
  const addTechnicianMutation = useMutation({
    mutationFn: async (data: TechnicianFormData) => {
      const response = await axios.post(`${API_BASE_URL}/users`, {
        ...data,
        password: "password123",
      });
      return response.data;
    },
    onSuccess: () => {
      console.log("Technician added successfully");
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
      toast({ title: "Technician Added", description: "The technician has been added successfully." });
      setIsAddDialogOpen(false);
    },
  });

  // Update technician
  const updateTechnicianMutation = useMutation({
    mutationFn: async ({ _id, data }: { _id: string; data: TechnicianFormData }) => {
      const response = await axios.put(`${API_BASE_URL}/users/${_id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
      toast({ title: "Technician Updated", description: "The technician has been updated successfully." });
      setEditingTechnician(null);
    },
  });

  // Delete technician
  const deleteTechnicianMutation = useMutation({
    mutationFn: async (_id: string) => {
      await axios.delete(`${API_BASE_URL}/users/${_id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technicians"] });
      toast({ title: "Technician Removed", description: "The technician has been removed successfully." });
    },
  });

  const form = useForm<TechnicianFormData>({
    resolver: zodResolver(technicianSchema),
    defaultValues: {
      username: "",
      email: "",
      role: "technician",
    },
  });

  const filteredTechnicians = technicians.filter(
    (tech: TechnicianFormData) =>
      tech.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddTechnician = (data: TechnicianFormData) => {
    console.log("Form submitted", data);
    addTechnicianMutation.mutate(data);
    form.reset();
  };

  const handleEditTechnician = (data: TechnicianFormData) => {
    if (!editingTechnician || !editingTechnician._id) return;
    updateTechnicianMutation.mutate({ _id: editingTechnician._id, data });
    form.reset();
  };

  const handleDeleteTechnician = (_id: string) => {
    deleteTechnicianMutation.mutate(_id);
  };

  const openEditDialog = (technician: TechnicianFormData) => {
    setEditingTechnician(technician);
    form.reset(technician);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "technician":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage technician accounts and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Search and Add */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search technicians..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Technician
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Technician</DialogTitle>
                <DialogDescription>Create a new technician account</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddTechnician)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="technician">Technician</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Add Technician</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Technician Table */}
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTechnicians.map((technician: TechnicianFormData) => (
                <TableRow key={technician._id}>
                  <TableCell>{technician.username}</TableCell>
                  <TableCell>{technician.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeColor(technician.role)}>{technician.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="icon" variant="ghost" onClick={() => openEditDialog(technician)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDeleteTechnician(technician._id!)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}