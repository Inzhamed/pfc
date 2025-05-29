import { DashboardLayout } from "@/components/dashboard-layout";
import { AdminUserManagement } from "@/components/admin-user-management";
import { useState } from "react";
import { Defect } from "@/data/defect-data";

export default function AdminPanelPage() {
    const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null);

    return (
        <DashboardLayout onDefectSelect={setSelectedDefect}>
            <div className="p-4 md:p-6 h-full overflow-y-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Admin Panel</h1>
                    <p className="text-muted-foreground">Manage technicians and system settings</p>
                </div>

                <AdminUserManagement />
            </div>
        </DashboardLayout>
    );
}