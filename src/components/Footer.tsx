import React from 'react'

const SOURCES = [
  { name: 'Nadlan Gov', sub: 'Source des transactions' },
  { name: 'CBS Israël',  sub: 'Indices officiels' },
  { name: 'GovMap',     sub: 'Données cadastrales' },
  { name: 'Mavat',      sub: 'Plans urbanistiques' },
]

export const Footer: React.FC = () => (
  <footer className="bg-neutral-50 border-t border-neutral-200 px-6 py-8 mt-12">
    <div className="max-w-5xl mx-auto">
      <div className="flex gap-8 flex-wrap justify-around mb-6">
        {SOURCES.map(s => (
          <div key={s.name} className="text-center">
            <div className="text-lg font-semibold text-primary">{s.name}</div>
            <div className="text-xs text-neutral-500 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-neutral-500 text-center leading-relaxed">
        Les estimations sont fournies à titre indicatif. Pour toute décision d'investissement,
        consultez un expert immobilier certifié. Données basées sur les transactions Nadlan Gov
        et l'indice CBS.
      </p>
    </div>
  </footer>
)
