"use client"

import { Pencil, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TechnicianCard({ technician, onEdit, onDelete }) {
  return (
    <Card className="bg-white dark:bg-gray-800 border border-blue-100 dark:border-gray-700 transition-colors">
      <CardContent className="p-5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {technician.email}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {technician.is_admin ? "Administrateur" : "Technicien"}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Pencil className="h-5 w-5 text-blue-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-5 w-5 text-red-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
