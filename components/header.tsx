"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Package, Home, MapPin } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur supports-backdrop-filter:bg-card/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 max-w-7xl">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-foreground">
          <Package className="h-6 w-6 text-primary" />
          <span>落とし物</span>
        </Link>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">ホーム</span>
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/storage" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">保管場所</span>
            </Link>
          </Button>
          <Button asChild>
            <Link href="/post">投稿する</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
