import React from 'react'
import { Link } from 'react-router-dom'

const SearchComponent = ({ 
  searchTerm, 
  setSearchTerm, 
  filteredAppointments, 
  setSearchModalOpen, 
  setEditing 
}) => {
  return (
    <div>
      <label className="flex items-center gap-2">
        <input 
          type="checkbox" 
          className="checkbox"
          // Hier könnte futureOnly sein, wenn du es übergeben möchtest
        />
        Nur zukünftige Termine
      </label>

      <div className="mt-2 flex items-wrap items-center gap-2">
        <button className="btn" onClick={() => {/* load() hier aufrufen */}}>Aktualisieren</button>
        <Link to="/tabelle" className="btn btn-outline">Zur Tabelle</Link>

        <input
          type="search"
          placeholder="Suche nach Titel"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="input input-bordered ml-2"
        />
        
        {searchTerm && (
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => setSearchTerm('')}
            aria-label="Suche zurücksetzen"
          >
            Löschen
          </button>
        )}
      </div>

      {filteredAppointments.length > 0 && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg">Suchergebnisse für „{searchTerm}“</h3>
            <p className="py-2 text-sm text-gray-500">{filteredAppointments.length} Ergebnis(se)</p>

            <div className="overflow-y-auto max-h-64">
              <ul className="space-y-2">
                {filteredAppointments.map(a => (
                  <li key={a.id} className="flex justify-between items-start gap-4 p-2 border rounded">
                    <div>
                      <div className="font-semibold">{a.title}</div>
                      <div className="text-sm text-gray-500">{a.date}</div>
                      {a.description && <div className="text-sm mt-1">{a.description}</div>}
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        className="btn btn-sm"
                        onClick={() => { setEditing(a); setSearchModalOpen(false); }}
                      >
                        Bearbeiten
                      </button>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => setSearchModalOpen(false)}
                      >
                        Schließen
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="modal-action">
              <button className="btn" onClick={() => setSearchModalOpen(false)}>Schließen</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;