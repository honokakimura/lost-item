// components/ui/toaster.tsx
"use client"

import { useToast } from "@/hooks/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg shadow-lg min-w-75 animate-in slide-in-from-top ${
            toast.variant === "destructive"
              ? "bg-destructive text-destructive-foreground"
              : "bg-card text-card-foreground border"
          }`}
        >
          <h3 className="font-semibold">{toast.title}</h3>
          {toast.description && (
            <p className="text-sm mt-1 opacity-90">{toast.description}</p>
          )}
        </div>
      ))}
    </div>
  )
}
