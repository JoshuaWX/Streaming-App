'use client'

import { useSidebar } from '@/context/sidebar-context'
import { ReactNode } from 'react'

export default function MainContent({ children }: { children: ReactNode }) {
  const { isOpen } = useSidebar()

  return (
    <div className={`transition-all duration-300 ${isOpen ? 'ml-16' : 'ml-0'}`}>
      {children}
    </div>
  )
}
