import React, { useState } from 'react'

export default function EditModal({ item, onClose, onSave }) {
  const [title, setTitle] = useState(item.title)
  const [date, setDate] = useState(new Date(item.date).toISOString().slice(0, 16))
  const [description, setDescription] = useState(item.description || '')

  const save = async () => {
    if (!title || !date) return alert('Titel und Datum erforderlich')
    await onSave(item._id, { title, date, description })
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Termin bearbeiten</h3>

        <input
          className="input input-bordered w-full mt-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="datetime-local"
          className="input input-bordered w-full mt-2"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <textarea
          className="textarea textarea-bordered w-full mt-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="modal-action">
          <button className="btn" onClick={onClose}>Abbrechen</button>
          <button className="btn btn-primary" onClick={save}>Speichern</button>
        </div>
      </div>
    </div>
  )
}
