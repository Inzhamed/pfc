"use client"

import { useState, useEffect } from "react"
import Layout from "@/components/Layout"
import TechnicianForm from "@/components/AdminTechnicianForm"
import TechnicianCard from "@/components/AdminUserCard"

export default function AdminPage() {
  const [technicians, setTechnicians] = useState([])
  const [editingTechnician, setEditingTechnician] = useState(null)

  const fetchTechnicians = () => {
    fetch("http://127.0.0.1:8000/api/techniciens")
      .then(res => res.json())
      .then(data => setTechnicians(data))
      .catch(err => console.error("Erreur récupération techniciens:", err))
  }

  useEffect(() => {
    fetchTechnicians()
  }, [])

  const handleAddOrUpdate = (technician) => {
    const method = editingTechnician ? "PUT" : "POST"
    const url = editingTechnician
      ? `http://127.0.0.1:8000/api/techniciens/${editingTechnician._id}`
      : "http://127.0.0.1:8000/api/techniciens"

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(technician),
    })
      .then(() => {
        setEditingTechnician(null)
        fetchTechnicians()
      })
      .catch(err => console.error("Erreur ajout/modification:", err))
  }

  const handleDelete = (id) => {
    fetch(`http://127.0.0.1:8000/api/techniciens/${id}`, { method: "DELETE" })
      .then(() => setTechnicians(technicians.filter(t => t._id !== id)))
      .catch(err => console.error("Erreur suppression:", err))
  }

  return (
    <Layout>
      <div className="p-4 md:p-8 max-w-screen-xl mx-auto w-full">
        <h1 className="text-xl md:text-2xl font-bold mb-6 text-center md:text-left">
          Gestion des techniciens
        </h1>

        <TechnicianForm
          onSubmit={handleAddOrUpdate}
          initialData={editingTechnician}
          onCancel={() => setEditingTechnician(null)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {technicians.map(tech => (
            <TechnicianCard
              key={tech._id}
              technician={tech}
              onEdit={() => setEditingTechnician(tech)}
              onDelete={() => handleDelete(tech._id)}
            />
          ))}
        </div>
      </div>
    </Layout>
  )
}
