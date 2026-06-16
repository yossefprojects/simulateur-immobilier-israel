import React, { useState } from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [visible, setVisible] = useState(false)
  return (
    <span className="relative inline-flex items-center gap-1">
      {children}
      <button
        type="button"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        aria-label="Aide contextuelle"
        className="text-neutral-500 hover:text-primary text-xs leading-none"
      >
        ⓘ
      </button>
      {visible && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 pointer-events-none w-[240px] max-w-[80vw]"
        >
          <div className="bg-primary text-white text-xs leading-relaxed rounded-lg px-3 py-2 shadow-lg">
            {content}
          </div>
          <div className="w-2 h-2 bg-primary rotate-45 mx-auto -mt-1" />
        </div>
      )}
    </span>
  )
}
