import React from 'react'

export default function AppointmentList({ items = [], onDelete, onEdit }) {
  if (items.length === 0) return <div>Keine Termine</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((it) => (
        <div key={it._id} className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">{it.title}</h3>

            {it.description && (
              <p className="text-sm opacity-80">{it.description}</p>
            )}

            <p className="text-sm">
              📅 {new Date(it.date).toLocaleString()}
            </p>

            <div className="card-actions justify-end mt-2">
              <button className="btn btn-dash btn-warning" onClick={() => onEdit(it)}>
                Bearbeiten
              </button>
              <button className="btn btn-dash btn-error" onClick={() => onDelete(it._id)}>
                Löschen
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
