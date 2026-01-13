import { Header } from "@/components/header"
import { StorageInfo } from "@/components/storage-info"

export default function StoragePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        <StorageInfo />
      </main>
    </div>
  )
}
