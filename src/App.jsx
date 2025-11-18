import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainPage from './pages/MainPage'
import Tabelle from './pages/Tabelle'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen p-6 bg-base-200">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-4">Mini-Terminplaner</h1>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/tabelle" element={<Tabelle />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}