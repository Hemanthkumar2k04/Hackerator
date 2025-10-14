import * as React from "react"

interface DialogProps {
  open: boolean
  onOpenChange: () => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onOpenChange}
    >
      <div
        className="relative w-full max-w-md bg-black border border-emerald-500 rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export function DialogContent({ children }: { children: React.ReactNode }) {
  return <div className="p-6 space-y-6">{children}</div>
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div className="border-b border-gray-700 pb-4">{children}</div>
}

export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold text-white">{children}</h2>
}

export function DialogFooter({ children }: { children: React.ReactNode }) {
  return <div className="border-t border-gray-700 pt-4 flex justify-end gap-4">{children}</div>
}