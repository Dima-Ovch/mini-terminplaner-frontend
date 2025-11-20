import React from 'react'
import { AppointmentsProvider } from './contexts/AppointmentsContext'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage'
import Tabelle from './pages/Tabelle'
import Calendar from './components/Calendar'

export default function App() {
  return (
    <AppointmentsProvider>
     <BrowserRouter>
      <div className="min-h-screen flex items-center justify-center p-6 bg-base-200">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-4 text-center text-gray-500">Mini-Terminplaner</h1>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/tabelle" element={<Tabelle />} />
            <Route path="/kalender" element={<Calendar />} />
          </Routes>
        </div>
      </div>
     </BrowserRouter>
    </AppointmentsProvider>
  )
}