import React, { useEffect, useMemo, useContext } from 'react'
import { Link } from 'react-router-dom'
import AppointmentList from '../components/AppointmentList'
import AppointmentForm from '../components/AppointmentForm'
import EditModal from '../components/EditModal'
import { AppointmentsContext } from '../contexts/AppointmentsContext'

function MainPage() {
  const {
    appointments,
    loading,
    loadAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment
  } = useContext(AppointmentsContext)

  const [editing, setEditing] = React.useState(null)
  const [futureOnly, setFutureOnly] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [searchModalOpen, setSearchModalOpen] = React.useState(false)

  useEffect(() => { loadAppointments(futureOnly) }, [futureOnly])

  const handleCreate = async (payload) => {
    await createAppointment(payload)
  }

  const handleDelete = async (id) => {
    await deleteAppointment(id)
  }

  const handleEdit = (item) => setEditing(item)

  const handleUpdate = async (id, payload) => {
    await updateAppointment(id, payload)
    setEditing(null)
  }

  const filteredAppointments = useMemo(
    () => (appointments || []).filter(a =>
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
      <div className="mx-auto w-full max-w-3xl flex flex-col gap-6 mb-6 items-center">
        <AppointmentForm onCreate={handleCreate} />

        <div className="card p-4 bg-base-100 shadow mx-auto max-w-md w-full">
          <label className="flex items-center gap-2">
            <input 
              type="checkbox" 
              className="checkbox"
              checked={futureOnly} 
              onChange={e => setFutureOnly(e.target.checked)} 
            />
            Nur zukünftige Termine
          </label>
          <button className="btn" onClick={() => loadAppointments(futureOnly)}>Aktualisieren</button>
          <Link to="/tabelle" className="btn btn-outline">Zur Tabelle</Link>
          <Link to="/kalender" className="btn btn-outline">Zum Kalender</Link>

          <div className="mt-2 flex items-wrap items-center gap-2">
            <input
              type="search"
              placeholder="Suche nach Titel"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input input-bordered flex-1 min-w-[180px]"
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

      <div className="w-full">
        {loading ? (
          <div className="text-center py-8">Lädt…</div>
        ) : (
          <AppointmentList
            items={filteredAppointments}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </div>

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

export default MainPage