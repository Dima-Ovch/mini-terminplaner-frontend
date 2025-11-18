import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAppointments } from '../api'

function Tabelle() {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const data = await getAppointments()
      setAppointments(data)
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">Alle Termine</h2>
        <Link to="/" className="btn btn-outline mb-4">Zurück zur Hauptseite</Link>
      {loading ? (
        <div>Lädt…</div>
      ) : (
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Titel</th>
              <th>Datum</th>
              <th>Beschreibung</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map(a => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.date}</td>
                <td>{a.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Tabelle;