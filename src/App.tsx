import React, { useState } from 'react'
import { Building2 } from 'lucide-react'
import { EstimationTab }  from './components/EstimationTab'
import { UrbanismeTab }   from './components/UrbanismeTab'
import { InvestisseurTab, PromoteurTab } from './components/FinanceTab'

type Tab = 'estimation' | 'urbanisme' | 'investisseur' | 'promoteur'

const TABS: { key: Tab; label: string }[] = [
  { key: 'estimation',   label: 'Estimation'              },
  { key: 'urbanisme',    label: 'Potentiel urbanistique'  },
  { key: 'investisseur', label: 'Analyse investisseur'    },
  { key: 'promoteur',    label: 'Bilan promoteur'         },
]

export default function App() {
  const [active, setActive] = useState<Tab>('estimation')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Building2 size={22} className="text-blue-600" />
          <div>
            <h1 className="text-lg font-medium text-gray-900">Simulateur Immobilier Israël</h1>
            <p className="text-xs text-gray-400">Valorisation marché · Potentiel urbanistique · Analyse financière</p>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <nav className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 flex gap-0">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`px-4 py-3 text-sm border-b-2 transition-colors ${
                active === t.key
                  ? 'border-gray-900 text-gray-900 font-medium'
                  : 'border-transparent text-gray-400 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 py-6">
        {active === 'estimation'   && <EstimationTab />}
        {active === 'urbanisme'    && <UrbanismeTab />}
        {active === 'investisseur' && <InvestisseurTab />}
        {active === 'promoteur'    && <PromoteurTab />}
      </main>
    </div>
  )
}
