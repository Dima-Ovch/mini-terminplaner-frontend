import React, { useState } from 'react'

export default function ReminderModal({ appointment, onClose }) {
  const [newReminder, setNewReminder] = useState({
    time: '',
    unit: 'minutes',
    message: ''
  })

  // Lade Erinnerungen aus localStorage beim ersten Render
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem(`reminders_${appointment._id}`)
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to parse reminders', e)
        return []
      }
    }
    return []
  })

  const addReminder = () => {
    if (!newReminder.time || !newReminder.message.trim()) return

    const reminder = {
      id: Date.now().toString(),
      time: parseInt(newReminder.time, 10),
      unit: newReminder.unit,
      message: newReminder.message.trim(),
      createdAt: new Date().toISOString()
    }

    const updated = [...reminders, reminder]
    setReminders(updated)
    localStorage.setItem(`reminders_${appointment._id}`, JSON.stringify(updated))

    // Zurücksetzen
    setNewReminder({ time: '', unit: 'minutes', message: '' })
  }

  const removeReminder = (id) => {
    const updated = reminders.filter(r => r.id !== id)
    setReminders(updated)
    localStorage.setItem(`reminders_${appointment._id}`, JSON.stringify(updated))
  }

  const formatReminder = (r) => {
    const unitLabel = r.unit === 'minutes' ? 'Minuten' : r.unit === 'hours' ? 'Stunden' : 'Tage'
    return `${r.time} ${unitLabel} vorher`
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md">
        <h3 className="font-bold text-lg">Erinnerungen für „{appointment.title}“</h3>

        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Zeit"
              min="1"
              value={newReminder.time}
              onChange={e => setNewReminder({ ...newReminder, time: e.target.value })}
              className="input input-bordered w-24"
            />
            <select
              value={newReminder.unit}
              onChange={e => setNewReminder({ ...newReminder, unit: e.target.value })}
              className="select select-bordered"
            >
              <option value="minutes">Minuten</option>
              <option value="hours">Stunden</option>
              <option value="days">Tage</option>
            </select>
            <input
              placeholder="Nachricht"
              value={newReminder.message}
              onChange={e => setNewReminder({ ...newReminder, message: e.target.value })}
              className="input input-bordered flex-1"
            />
            <button className="btn btn-primary" onClick={addReminder}>Hinzufügen</button>
          </div>

          {reminders.length === 0 ? (
            <div className="text-sm text-gray-500">Keine Erinnerungen</div>
          ) : (
            <ul className="space-y-2">
              {reminders.map(r => (
                <li key={r.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div className="font-medium">{r.message}</div>
                    <div className="text-sm text-gray-500">{formatReminder(r)}</div>
                  </div>
                  <button className="btn btn-sm btn-ghost" onClick={() => removeReminder(r.id)}>Löschen</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="modal-action">
          <button className="btn" onClick={onClose}>Schließen</button>
        </div>
      </div>
    </div>
  )
}