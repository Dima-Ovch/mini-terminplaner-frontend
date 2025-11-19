import React, { useState } from 'react'

export default function AppointmentForm({ onCreate }) {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [description, setDescription] = useState('')

  const submit = async (e) => {
    e.preventDefault()

    if (!title || !date) {
      return alert('Titel und Datum sind erforderlich!')
    }

    await onCreate({
      title,
      date,
      description,
    })

    // Felder zurücksetzen
    setTitle('')
    setDate('')
    setDescription('')
  }

  return (
    <form className="card p-4 w-120 bg-base-100 shadow mx-auto max-w-md" onSubmit={submit}>
      <h2 className="card-title">Neuen Termin erstellen</h2>

      <input
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="input input-bordered mt-2 w-full"
      />

      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="input input-bordered mt-2 w-full"
      />

      <textarea
        placeholder="Beschreibung"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="textarea textarea-bordered mt-2 w-full"
      />

      <div className="mt-3">
        <button className="btn btn-primary w-full" type="submit">
          Hinzufügen
        </button>
      </div>
    </form>
  )
}
