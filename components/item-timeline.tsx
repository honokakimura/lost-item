"use client"

import { useState, useEffect } from "react"
import { ItemCard } from "@/components/item-card"
import { ItemFilters } from "@/components/item-filters"
import { Package, Loader2 } from "lucide-react"
import { readLostItems, toViewItems, type LostItemView } from "@/lib/lost-items"

export function ItemTimeline() {
  const [items, setItems] = useState<LostItemView[]>([])
  const [filters, setFilters] = useState({
    campus: "",
    building: "",
    category: "",
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const syncItems = () => {
      const storedItems = readLostItems()
      setItems(toViewItems(storedItems))
      setIsLoading(false)
    }

    syncItems()

    const handleStorageChange = () => {
      syncItems()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // クライアント側での建物フィルタリング
  const filteredItems = items.filter((item) => {
    if (filters.campus && item.location.campus !== filters.campus) return false
    if (filters.category && item.category !== filters.category) return false
    if (filters.building && item.location.building !== filters.building) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">落とし物一覧</h1>
        <p className="mt-2 text-muted-foreground">キャンパス内で見つかった落とし物を確認できます</p>
      </div>

      <ItemFilters filters={filters} onFiltersChange={setFilters} />

      <div className="space-y-4">
        {/* ローディング状態 */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        )}

        {/* データ表示 */}
        {!isLoading && filteredItems.length > 0 && (
          filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={{
                ...item,
                location: {
                  campus: item.location.campus,
                  building: item.location.building,
                  detail: item.location.detail,
                },
                imageUrl: item.imageUrl ?? undefined,
                description: item.description,
              }}
            />
          ))
        )}

        {/* 空状態 */}
        {!isLoading && filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">該当する落とし物が見つかりませんでした</p>
            <p className="text-sm text-muted-foreground mt-1">フィルターを変更してお試しください</p>
          </div>
        )}
      </div>
    </div>
  )
}