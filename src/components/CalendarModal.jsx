import React, { useMemo, useState } from 'react'
import CalendarModal from './CalendarModal'

const formatDateKey = (d) => {
  const dt = new Date(d)
  if (isNaN(dt)) return null
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const day = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const monthName = (date) => date.toLocaleString('default', { month: 'long', year: 'numeric' })

export default function Calendar({ appointments = [] }) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const [listModalOpen, setListModalOpen] = useState(false)
  const [selectedDayAppointments, setSelectedDayAppointments] = useState([])
  const [detailAppointment, setDetailAppointment] = useState(null)

  // group appointments by YYYY-MM-DD
  const byDate = useMemo(() => {
    const map = {}
    appointments.forEach(a => {
      const key = formatDateKey(a.date)
      if (!key) return
      map[key] = map[key] || []
      map[key].push(a)
    })
    return map
  }, [appointments])

  const prevMonth = () => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1))
  const nextMonth = () => setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1))

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay() // 0..6 (Sun..Sat)
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // build grid array including leading blanks
  const cells = []
  for (let i = 0; i < firstWeekday; i++) cells.push(null)
  for (let day = 1; day <= daysInMonth; day++) {
    const d = new Date(year, month, day)
    const key = formatDateKey(d)
    const items = byDate[key] || []
    cells.push({ date: d, key, items })
  }

  const handleDayClick = (cell) => {
    if (!cell) return
    if ((cell.items || []).length === 0) return
    setSelectedDayAppointments(cell.items)
    setListModalOpen(true)
  }

  return (
    <div className="card p-4 bg-base-100 shadow">
      <div className="flex items-center justify-between mb-3">
        <button className="btn btn-sm" onClick={prevMonth} aria-label="Vorheriger Monat">‹</button>
        <div className="font-semibold">{monthName(currentMonth)}</div>
        <button className="btn btn-sm" onClick={nextMonth} aria-label="Nächster Monat">›</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center mb-2 text-sm text-gray-500">
        {['So','Mo','Di','Mi','Do','Fr','Sa'].map(d => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((cell, idx) => {
          if (!cell) return <div key={idx} className="h-20 p-2 border rounded bg-base-200"></div>
          const has = (cell.items || []).length > 0
          return (
            <button
              key={cell.key + idx}
              className={
                `h-20 p-2 text-left border rounded flex flex-col justify-between ${has ? 'bg-yellow-50' : 'bg-gray'}`
              }
              onClick={() => handleDayClick(cell)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{cell.date.getDate()}</span>
                {has && <span className="badge badge-sm">{cell.items.length}</span>}
              </div>
              <div className="text-xs text-gray-600">
                {cell.items.slice(0,2).map(a => (
                  <div key={a.id} className="truncate">{a.title}</div>
                ))}
                {cell.items.length > 2 && <div className="text-xs text-gray-400">+{cell.items.length - 2}</div>}
              </div>
            </button>
          )
        })}
      </div>

      {/* list modal for selected day */}
      {listModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg">Termine am {selectedDayAppointments[0] ? formatDateKey(selectedDayAppointments[0].date) : ''}</h3>
            <div className="py-2 space-y-2">
              {selectedDayAppointments.map(a => (
                <div key={a.id} className="p-2 border rounded flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{a.title}</div>
                    {a.description && <div className="text-sm text-gray-500 truncate">{a.description}</div>}
                  </div>
                  <div className="flex gap-2">
                    {/* <button className="btn btn-sm" onClick={() => { setDetailAppointment(a); setListModalOpen(false); }}>Anzeigen</button>
                    <button className="btn btn-sm btn-ghost" onClick={() => setListModalOpen(false)}>Schließen</button> */}
                  </div>
                </div>
              ))}
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setListModalOpen(false)}>Schließen</button>
            </div>
          </div>
        </div>
      )}

      {/* detail modal (reuses your CalendarModal component) */}
      {detailAppointment && (
        <CalendarModal appointment={detailAppointment} onClose={() => setDetailAppointment(null)} />
      )}
    </div>
  )
}