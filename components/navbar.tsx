"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MessageSquare, BookOpen, Layers, Keyboard, Mic } from "lucide-react"

const navItems = [
  { name: "Chat", href: "/", icon: MessageSquare },
  { name: "Quiz", href: "/quiz", icon: BookOpen },
  { name: "Text Matching", href: "/text-matching", icon: Layers },
  { name: "Typing Practice", href: "/typing-practice", icon: Keyboard },
  { name: "Voice Practice", href: "/voice-practice", icon: Mic },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <h1 className="text-2xl font-bold">Telugu Chatbot</h1>
          </div>
          <nav className="flex flex-wrap gap-2 justify-center">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link href={item.href} key={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`flex items-center gap-2 ${isActive ? "bg-primary-foreground text-primary" : ""}`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
