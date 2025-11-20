import React, { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../api'

export const AppointmentsContext = createContext({})

export function AppointmentsProvider({ children }) {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [futureOnly, setFutureOnly] = useState(false)

  const futureOnlyRef = useRef(false)
  const inProgressRef = useRef(false)

  const loadAppointments = useCallback(async () => {
    if (inProgressRef.current) return
    inProgressRef.current = true
    setLoading(true)
    try {
      const data = await getAppointments(futureOnlyRef.current)
      setAppointments(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('loadAppointments failed', err)
      setAppointments([])
    } finally {
      setLoading(false)
      inProgressRef.current = false
    }
  }, [])

  // FutureOnly-Filter überwachen
  useEffect(() => {
    futureOnlyRef.current = futureOnly
    loadAppointments()
  }, [futureOnly, loadAppointments])

  const createAppointmentLocal = useCallback(async (payload) => {
    try {
      await createAppointment(payload)
    } finally {
      await loadAppointments()
    }
  }, [loadAppointments])

  const updateAppointmentLocal = useCallback(async (id, payload) => {
    try {
      await updateAppointment(id, payload)
    } finally {
      await loadAppointments()
    }
  }, [loadAppointments])

  const deleteAppointmentLocal = useCallback(async (id) => {
    try {
      await deleteAppointment(id)
    } finally {
      await loadAppointments()
    }
  }, [loadAppointments])

  // Erste Ladung
  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  const value = useMemo(() => ({
    appointments,
    loading,
    futureOnly,
    setFutureOnly,   
    loadAppointments,
    createAppointment: createAppointmentLocal,
    updateAppointment: updateAppointmentLocal,
    deleteAppointment: deleteAppointmentLocal
  }), [appointments, loading, futureOnly, loadAppointments, createAppointmentLocal, updateAppointmentLocal, deleteAppointmentLocal])

  return (
    <AppointmentsContext.Provider value={value}>
      {children}
    </AppointmentsContext.Provider>
  )
}
