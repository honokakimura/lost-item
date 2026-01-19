import { ItemTimeline } from "@/components/item-timeline"
import { Header } from "@/components/header"
import InitialSetupDialog from "@/components/initial-dialog"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <ItemTimeline />
        <InitialSetupDialog />
      </main>
    </div>
  )
}
