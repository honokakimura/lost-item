"use client"

import { useState } from "react"
import { ItemCard } from "@/components/item-card"
import { ItemFilters } from "@/components/item-filters"
import { Package } from "lucide-react" // Import Package component

// Mock data for demonstration
const mockItems = [
  {
    id: "1",
    category: "財布・小物類",
    location: {
      campus: "六甲台第一キャンパス",
      building: "工学部1号館",
      detail: "2階の講義室A",
    },
    description: "黒い革製の財布を見つけました",
    submittedToOffice: true,
    imageUrl: "/black-leather-wallet.png",
    createdAt: new Date("2024-01-15T10:30:00"),
  },
  {
    id: "2",
    category: "傘",
    location: {
      campus: "六甲台第一キャンパス",
      building: "図書館",
      detail: "1階入り口付近",
    },
    description: "青い折りたたみ傘",
    submittedToOffice: false,
    createdAt: new Date("2024-01-15T09:15:00"),
  },
  {
    id: "3",
    category: "電子機器",
    location: {
      campus: "鶴甲第一キャンパス",
      building: "学生会館",
      detail: "カフェテリア",
    },
    description: "iPhone（黒色、ケース付き）",
    submittedToOffice: true,
    imageUrl: "/black-iphone-with-case.jpg",
    createdAt: new Date("2024-01-14T16:45:00"),
  },
  {
    id: "4",
    category: "衣類",
    location: {
      campus: "六甲台第一キャンパス",
      building: "総合図書館",
      detail: "3階閲覧室",
    },
    description: "グレーのパーカー、サイズM",
    submittedToOffice: false,
    createdAt: new Date("2024-01-14T14:20:00"),
  },
  {
    id: "5",
    category: "文房具・学用品",
    location: {
      campus: "鶴甲第一キャンパス",
      building: "教養学部棟",
      detail: "講義室305",
    },
    description: "青いペンケースと筆記用具一式",
    submittedToOffice: true,
    createdAt: new Date("2024-01-14T11:00:00"),
  },
]

export function ItemTimeline() {
  const [items, setItems] = useState(mockItems)
  const [filters, setFilters] = useState({
    campus: "",
    building: "",
    category: "",
  })

  const filteredItems = items.filter((item) => {
    if (filters.campus && item.location.campus !== filters.campus) return false
    if (filters.building && item.location.building !== filters.building) return false
    if (filters.category && item.category !== filters.category) return false
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
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => <ItemCard key={item.id} item={item} />)
        ) : (
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
