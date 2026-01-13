"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ItemFiltersProps {
  filters: {
    campus: string
    building: string
    category: string
  }
  onFiltersChange: (filters: any) => void
}

export function ItemFilters({ filters, onFiltersChange }: ItemFiltersProps) {
  const handleReset = () => {
    onFiltersChange({ campus: "", building: "", category: "" })
  }

  const hasActiveFilters = filters.campus || filters.building || filters.category

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">絞り込み検索</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 gap-2">
              <X className="h-4 w-4" />
              リセット
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="campus">キャンパス</Label>
          <Select
            value={filters.campus}
            onValueChange={(value) => onFiltersChange({ ...filters, campus: value, building: "" })}
          >
            <SelectTrigger id="campus">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="本郷キャンパス">本郷キャンパス</SelectItem>
              <SelectItem value="駒場キャンパス">駒場キャンパス</SelectItem>
              <SelectItem value="柏キャンパス">柏キャンパス</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="building">建物</Label>
          <Select
            value={filters.building}
            onValueChange={(value) => onFiltersChange({ ...filters, building: value })}
            disabled={!filters.campus}
          >
            <SelectTrigger id="building">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {filters.campus === "本郷キャンパス" && (
                <>
                  <SelectItem value="工学部1号館">工学部1号館</SelectItem>
                  <SelectItem value="図書館">図書館</SelectItem>
                  <SelectItem value="総合図書館">総合図書館</SelectItem>
                </>
              )}
              {filters.campus === "駒場キャンパス" && (
                <>
                  <SelectItem value="学生会館">学生会館</SelectItem>
                  <SelectItem value="教養学部棟">教養学部棟</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">物の種類</Label>
          <Select value={filters.category} onValueChange={(value) => onFiltersChange({ ...filters, category: value })}>
            <SelectTrigger id="category">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="財布・小物類">財布・小物類</SelectItem>
              <SelectItem value="傘">傘</SelectItem>
              <SelectItem value="電子機器">電子機器</SelectItem>
              <SelectItem value="衣類">衣類</SelectItem>
              <SelectItem value="文房具・学用品">文房具・学用品</SelectItem>
              <SelectItem value="鍵">鍵</SelectItem>
              <SelectItem value="アクセサリー">アクセサリー</SelectItem>
              <SelectItem value="その他">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
