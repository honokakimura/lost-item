"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { ITEM_COLOR_OPTIONS, LOST_PERIOD_OPTIONS } from "@/lib/lost-items"

interface ItemFiltersProps {
  value: {
    category: string
    period: string
    color: string
  }
  onValueChange: (value: {
    category: string
    period: string
    color: string
  }) => void
  onSearch: () => void
  onReset: () => void
  canSearch: boolean
}

export function ItemFilters({ value, onValueChange, onSearch, onReset, canSearch }: ItemFiltersProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">落とし物検索</CardTitle>
          {canSearch && (
            <Button variant="ghost" size="sm" onClick={onReset} className="h-8 gap-2">
              <X className="h-4 w-4" />
              リセット
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="category">ジャンル</Label>
          <Select
            value={value.category}
            onValueChange={(category) => onValueChange({ ...value, category })}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="財布">財布</SelectItem>
              <SelectItem value="携帯電話">携帯電話</SelectItem>
              <SelectItem value="電子機器">電子機器</SelectItem>
              <SelectItem value="学生証">学生証</SelectItem>
              <SelectItem value="ノートパソコン">ノートパソコン</SelectItem>
              <SelectItem value="衣類">衣類</SelectItem>
              <SelectItem value="文房具・学用品">文房具・学用品</SelectItem>
              <SelectItem value="鍵">鍵</SelectItem>
              <SelectItem value="アクセサリー">アクセサリー</SelectItem>
              <SelectItem value="その他">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="period">期間</Label>
          <Select
            value={value.period}
            onValueChange={(period) => onValueChange({ ...value, period })}
          >
            <SelectTrigger id="period">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {LOST_PERIOD_OPTIONS.map((periodOption) => (
                <SelectItem key={periodOption.value} value={periodOption.value}>
                  {periodOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">色</Label>
          <Select value={value.color} onValueChange={(color) => onValueChange({ ...value, color })}>
            <SelectTrigger id="color">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {ITEM_COLOR_OPTIONS.map((color) => (
                <SelectItem key={color} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="sm:col-span-3 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onReset} className="sm:w-auto w-full">
            条件をクリア
          </Button>
          <Button type="button" onClick={onSearch} disabled={!canSearch} className="sm:w-auto w-full">
            この条件で検索
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
