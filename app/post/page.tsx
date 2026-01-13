import { Header } from "@/components/header"
import { PostItemForm } from "@/components/post-item-form"

export default function PostPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-2xl">
        <PostItemForm />
      </main>
    </div>
  )
}
