import React, { useEffect, useRef, useState, useContext } from 'react'
import CalendarModal from './CalendarModal'
import { AppointmentsContext } from '../contexts/AppointmentsContext'

const formatDateKey = (d) => {
  if (!d) return null
  const dt = (d instanceof Date) ? d : new Date(d)
  if (isNaN(dt)) return null
  const y = dt.getFullYear()
  const m = String(dt.getMonth() + 1).padStart(2, '0')
  const day = String(dt.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function Calendar({ appointments: propAppointments = null }) {
  const { appointments: contextAppointments = [] } = useContext(AppointmentsContext)
  const appointments = propAppointments ?? contextAppointments

  const calRef = useRef(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const markedDates = (appointments || [])
    .map(a => formatDateKey(a.date))
    .filter(Boolean)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const exist = window.customElements && window.customElements.get('calendar-date')
    if (exist) return
    const s = document.createElement('script')
    s.type = 'module'
    s.src = 'https://unpkg.com/cally'
    s.async = true
    document.head.appendChild(s)
  }, [])

  useEffect(() => {
    const el = calRef.current
    if (!el) return

    const extractDate = (ev) => {
      if (!ev) return null
      const d = ev.detail?.date || ev.detail?.value || ev.detail?.selected || ev.detail?.selectedDate || ev.target?.value || ev.target?.getAttribute?.('date') || ev.target?.getAttribute?.('data-date')
      if (!d) return null
      const parsed = new Date(d)
      return isNaN(parsed) ? null : parsed
    }

    const handler = (ev) => {
      const dt = extractDate(ev)
      if (dt) {
        setSelectedDate(dt)
        setModalOpen(true)
      }
    }

    const events = ['date-change', 'dateChange', 'date-click', 'dateClick', 'select-date', 'selected', 'change']
    events.forEach(evName => el.addEventListener(evName, handler))

    try { el.markedDates = markedDates } catch (e) {}
    try { el.setAttribute('marked-dates', JSON.stringify(markedDates)) } catch (e) {}

    return () => {
      events.forEach(evName => el.removeEventListener(evName, handler))
    }
  }, [markedDates, appointments])

  const appointmentsForSelected = selectedDate
    ? (appointments || []).filter(a => formatDateKey(a.date) === formatDateKey(selectedDate))
    : []

  return (
    <div>
      <div className="card p-4 bg-base-100 shadow-lg rounded-box">
        <calendar-date ref={calRef} class="cally bg-base-100 border border-base-300 shadow-lg rounded-box" style={{ width: '100%' }}>
          <svg aria-label="Previous" slot="previous" class="fill-current size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path></svg>
          <svg aria-label="Next" slot="next" class="fill-current size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path></svg>
          <calendar-month></calendar-month>
        </calendar-date>
      </div>

      {modalOpen && selectedDate && (
        <CalendarModal
          date={selectedDate}
          appointments={appointmentsForSelected}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}