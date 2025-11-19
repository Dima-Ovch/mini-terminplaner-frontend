import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../api'
import AppointmentList from '../components/AppointmentList'
import AppointmentForm from '../components/AppointmentForm'
import EditModal from '../components/EditModal'

function MainPage() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [futureOnly, setFutureOnly] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchModalOpen, setSearchModalOpen] = useState(false)

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

  const filteredAppointments = useMemo(
    () => appointments.filter(a =>
    a.title?.toLowerCase().includes(searchTerm.trim().toLowerCase())
    ),
    [appointments, searchTerm]
  )

    useEffect(() => {
      if (searchTerm.trim() !== '' && filteredAppointments.length > 0) {
        setSearchModalOpen(true)
      } else {
        setSearchModalOpen(false)
      }
    }, [searchTerm, filteredAppointments])

  return (
    <div>
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

          <div className="mt-2 flex items-wrap items-center gap-2">
            <button className="btn" onClick={load}>Aktualisieren</button>
            <Link to="/tabelle" className="btn btn-outline">Zur Tabelle</Link>

            <input
              type="search"
              placeholder="Suche nach Titel"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input input-bordered ml-2"
            />
            
            {searchTerm && (
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => setSearchTerm('')}
                aria-label="Suche zurücksetzen"
              >
                Löschen
              </button>
            )}

          </div>
        </div>
      </div>

      {loading ? (
        <div>Lädt…</div>
      ) : (
        <AppointmentList 
          items={filteredAppointments} 
          onDelete={handleDelete} 
          onEdit={handleEdit} 
        />
      )}

      {searchModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg">Suchergebnisse für „{searchTerm}“</h3>
            <p className="py-2 text-sm text-gray-500">{filteredAppointments.length} Ergebnis(se)</p>

            <div className="overflow-y-auto max-h-64">
              <ul className="space-y-2">
                {filteredAppointments.map(a => (
                  <li key={a.id} className="flex justify-between items-start gap-4 p-2 border rounded">
                    <div>
                      <div className="font-semibold">{a.title}</div>
                      <div className="text-sm text-gray-500">{a.date}</div>
                      {a.description && <div className="text-sm mt-1">{a.description}</div>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        className="btn btn-sm"
                        onClick={() => { setEditing(a); setSearchModalOpen(false); }}
                      >
                        Bearbeiten
                      </button>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => setSearchModalOpen(false)}
                      >
                        Schließen
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setSearchModalOpen(false)}>Schließen</button>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <EditModal 
          item={editing} 
          onClose={() => setEditing(null)} 
          onSave={handleUpdate} 
        />
      )}
    </div>
  )
}

export default MainPage;
