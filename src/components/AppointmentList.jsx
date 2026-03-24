import React from 'react'
import ReminderModal from './ReminderModal'

export default function AppointmentList({ items = [], onDelete, onEdit }) {
  const [reminderModalOpen, setReminderModalOpen] = React.useState(false)
  const [selectedAppointment, setSelectedAppointment] = React.useState(null)

  if (items.length === 0) return <div className="mx-auto w-full max-w-md text-center">Keine Termine</div>

  return (
    <div className="mx-auto w-full max-w-3xl grid grid-cols-1 md:grid-cols-4 gap-4">
      {items.map((it) => (
        <div key={it._id} className="card bg-base-100 shadow w-full">
          <div className="card-body p-4 md:p-6 min-h-[140px]">
            <h3 className="card-title text-lg md:text-xl">{it.title}</h3>

            {it.description && (
              <p className="text-base md:text-md opacity-90 mt-2">{it.description}</p>
            )}

            <p className="text-sm md:text-base mt-3">
              {new Date(it.date).toLocaleString()}
            </p>

            <div className="card-actions justify-center mt-4">
              <button className="btn btn-dash btn-warning btn-md flex-1" onClick={() => onEdit(it)}>
                Bearbeiten
              </button>
              <button className="btn btn-dash btn-error btn-md flex-1" onClick={() => onDelete(it._id)}>
                Löschen
              </button>
              <button className="btn btn-dash btn-info btn-md flex-1" onClick={() => { setSelectedAppointment(it); setReminderModalOpen(true); }}>
                Erinnerungen
              </button>
            </div>
          </div>
        </div>
      ))}

      {reminderModalOpen && selectedAppointment && (
        <ReminderModal
          appointment={selectedAppointment}
          onClose={() => setReminderModalOpen(false)}
        />
      )}
    </div>
  )
}
