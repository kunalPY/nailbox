"use client"

import { ModeToggle } from "@/components/theme-toggle"
import { UserButton } from "@clerk/nextjs"
import ComposeButton from "@/app/mail/components/compose-button"
import WebhookDebugger from "@/app/mail/components/webhook-debugger"

export default function Header() {

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b bg-background px-4">
      {/* Left side - Logo/Name placeholder */}
      <div className="flex items-center gap-4">
        <span className="font-semibold text-lg">Nailbox</span>
        
        {/* Webhook Debugger - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <WebhookDebugger />
        )}
      </div>

      {/* Right side - Action buttons */}
      <div className="flex items-center gap-2">
        <ComposeButton />
        <ModeToggle />
        <UserButton />
      </div>

    </header>
  )
}