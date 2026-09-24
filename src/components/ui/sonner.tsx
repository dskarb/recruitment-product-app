"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-status-success text-white shadow-2xs">
            <svg
              className="h-3 w-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        ),
        info: (
          <InfoIcon className="h-5 w-5 text-brand shrink-0" />
        ),
        warning: (
          <TriangleAlertIcon className="h-5 w-5 text-status-warning shrink-0" />
        ),
        error: (
          <OctagonXIcon className="h-5 w-5 text-status-error shrink-0" />
        ),
        loading: (
          <Loader2Icon className="h-5 w-5 animate-spin text-text-main shrink-0" />
        ),
      }}
      style={
        {
          "--normal-bg": "#ffffff",
          "--normal-text": "var(--text-main)",
          "--normal-border": "var(--border-subtle)",
          "--success-bg": "#ffffff",
          "--success-text": "var(--text-main)",
          "--success-border": "var(--border-subtle)",
        } as React.CSSProperties
      }
      toastOptions={{
        style: {
          background: "#ffffff",
          backgroundColor: "#ffffff",
          color: "var(--text-main)",
          borderColor: "var(--border-subtle)",
          borderRadius: "10px",
          boxShadow: "0 4px 12px -1px rgba(0, 0, 0, 0.08)",
          padding: "14px 16px",
          gap: "12px",
          minHeight: "52px",
        },
        classNames: {
          toast:
            "group toast !bg-white !text-text-main !border-border-subtle !shadow-[0_4px_12px_-1px_rgba(0,0,0,0.08)] !rounded-[10px] !px-4 !py-3.5 !text-sm !font-medium !gap-3 !min-h-[52px]",
          title: "!text-sm !font-medium !text-text-main",
          description: "!text-xs !text-text-subtle",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
