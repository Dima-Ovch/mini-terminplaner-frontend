import React, { useEffect, useState } from 'react'
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from './api'
import AppointmentList from './components/AppointmentList'
import AppointmentForm from './components/AppointmentForm'
import EditModal from './components/EditModal'

export default function App() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [futureOnly, setFutureOnly] = useState(false)

  const load = async () => {
    setLoading(true)
    const data = await getAppointments(futureOnly)
    setAppointments(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [futureOnly])

  const handleCreate = async (payload) => { 
    await createAppointment(payload)
    load()
  }

  const handleDelete = async (id) => { 
    await deleteAppointment(id)
    load()
  }

  const handleEdit = (item) => setEditing(item)

  const handleUpdate = async (id, payload) => { 
    await updateAppointment(id, payload)
    setEditing(null)
    load()
  }

  return (
    <div className="min-h-screen p-6 bg-base-200">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-4">Mini-Terminplaner</h1>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <AppointmentForm onCreate={handleCreate} />

          <div>
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                className="checkbox"
                checked={futureOnly} 
                onChange={e => setFutureOnly(e.target.checked)} 
              />
              Nur zukünftige Termine
            </label>

            <div className="mt-2">
              <button className="btn" onClick={load}>Aktualisieren</button>
            </div>
          </div>
        </div>

        {loading ? (
          <div>Lädt…</div>
        ) : (
          <AppointmentList 
            items={appointments} 
            onDelete={handleDelete} 
            onEdit={handleEdit} 
          />
        )}

        {editing && (
          <EditModal 
            item={editing} 
            onClose={() => setEditing(null)} 
            onSave={handleUpdate} 
          />
        )}
      </div>
    </div>
  )
}
