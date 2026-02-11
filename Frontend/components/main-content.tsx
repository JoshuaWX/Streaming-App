'use client'

import { ReactNode } from 'react'

export default function MainContent({ children }: { children: ReactNode }) {
  return (
    <div className="ml-16">
      {children}
    </div>
  )
}
