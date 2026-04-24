"use client"

import { useState, useEffect } from "react"
import { ItemCard } from "@/components/item-card"
import { ItemFilters } from "@/components/item-filters"
import { Package, Loader2, Search } from "lucide-react"
import { isWithinLostPeriod, readLostItems, toViewItems, type LostItemView } from "@/lib/lost-items"

type SearchState = {
  category: string
  period: string
  color: string
}

export function ItemTimeline() {
  const [items, setItems] = useState<LostItemView[]>([])
  const [draftSearch, setDraftSearch] = useState<SearchState>({
    category: "",
    period: "",
    color: "",
  })
  const [appliedSearch, setAppliedSearch] = useState<SearchState | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
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

  const filteredItems = appliedSearch
    ? items.filter((item) => {
      if (appliedSearch.category && item.category !== appliedSearch.category) return false
      if (appliedSearch.color && item.color !== appliedSearch.color) return false
      if (appliedSearch.period && !isWithinLostPeriod(item.createdAt, appliedSearch.period)) return false
      return true
    })
    : []

  const handleSearch = () => {
    if (!draftSearch.category && !draftSearch.period && !draftSearch.color) {
      return
    }

    setAppliedSearch(draftSearch)
    setHasSearched(true)
  }

  const handleReset = () => {
    setDraftSearch({ category: "", period: "", color: "" })
    setAppliedSearch(null)
    setHasSearched(false)
  }

  const canSearch = Boolean(draftSearch.category || draftSearch.period || draftSearch.color)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">落とし物検索</h1>
        <p className="mt-2 text-muted-foreground">条件を選んでから、該当する落とし物だけ確認できます</p>
      </div>

      <ItemFilters
        value={draftSearch}
        onValueChange={setDraftSearch}
        onSearch={handleSearch}
        onReset={handleReset}
        canSearch={canSearch}
      />

      <div className="space-y-4">
        {/* ローディング状態 */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">読み込み中...</p>
          </div>
        )}

        {!isLoading && !hasSearched && (
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed rounded-2xl bg-muted/20">
            <Search className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">検索条件を指定してください</p>
            <p className="text-sm text-muted-foreground mt-1">ジャンル・期間・色を組み合わせて絞り込めます</p>
          </div>
        )}

        {/* データ表示 */}
        {!isLoading && hasSearched && filteredItems.length > 0 && (
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
        {!isLoading && hasSearched && filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="text-lg font-medium text-muted-foreground">該当する落とし物が見つかりませんでした</p>
            <p className="text-sm text-muted-foreground mt-1">条件を変えてお試しください</p>
          </div>
        )}
      </div>
    </div>
  )
}