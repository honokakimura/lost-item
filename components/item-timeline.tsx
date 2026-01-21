"use client"

import { useState, useEffect } from "react"
import { ItemCard } from "@/components/item-card"
import { ItemFilters } from "@/components/item-filters"
import { Package, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LostItem {
  id: string
  category: string
  categoryOther?: string
  location: {
    campus: string
    building: string | null
    detail: string | null
  }
  description: string | null
  submittedToOffice: boolean
  officeDetail?: string | null
  imageUrl?: string | null
  createdAt: Date
}

export function ItemTimeline() {
  const [items, setItems] = useState<LostItem[]>([])
  const [filters, setFilters] = useState({
    campus: "",
    building: "",
    category: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // データ取得関数
  const fetchItems = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const params = new URLSearchParams()
      if (filters.campus) params.append("campus", filters.campus)
      if (filters.category) params.append("category", filters.category)
      
      const response = await fetch(`/api/items?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error("データの取得に失敗しました")
      }
      
      const result = await response.json()
      
      // APIレスポンスをコンポーネントの形式に変換
      const formattedItems = result.data.map((item: any) => ({
        id: item.id,
        category: item.category,
        categoryOther: item.categoryOther,
        location: {
          campus: item.campus,
          building: item.building,
          detail: item.locationDetail,
        },
        description: item.description,
        submittedToOffice: item.submittedToOffice,
        officeDetail: item.officeDetail,
        imageUrl: item.image,
        createdAt: new Date(item.createdAt),
      }))
      
      setItems(formattedItems)
    } catch (err) {
      console.error("Fetch error:", err)
      setError(err instanceof Error ? err.message : "エラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  // 初回読み込み
  useEffect(() => {
    fetchItems()
  }, [])

  // フィルター変更時に再取得
  useEffect(() => {
    fetchItems()
  }, [filters.campus, filters.category])

  // クライアント側での建物フィルタリング
  const filteredItems = items.filter((item) => {
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

        {/* エラー状態 */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-16 w-16 text-destructive mb-4" />
            <p className="text-lg font-medium text-destructive mb-2">{error}</p>
            <Button onClick={fetchItems} variant="outline">
              再読み込み
            </Button>
          </div>
        )}

        {/* データ表示 */}
        {!isLoading && !error && filteredItems.length > 0 && (
          filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={{
                ...item,
                location: {
                  campus: item.location.campus,
                  building: item.location.building ?? "",
                  detail: item.location.detail ?? "",
                },
                imageUrl: item.imageUrl ?? undefined,
                description: item.description ?? "",
              }}
            />
          ))
        )}

        {/* 空状態 */}
        {!isLoading && !error && filteredItems.length === 0 && (
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