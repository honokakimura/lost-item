"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Upload, ArrowLeft } from "lucide-react"
import Link from "next/link"

export function PostItemForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    campus: "",
    building: "",
    locationDetail: "",
    category: "",
    categoryOther: "",
    description: "",
    submittedToOffice: false,
    image: null as File | null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
    router.push("/")
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
    }
  }

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" asChild className="mb-2">
        <Link href="/" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          戻る
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">落とし物の投稿</CardTitle>
          <CardDescription>見つけた落とし物の情報を入力してください。必須項目は必ず入力してください。</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Location Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campus">
                  キャンパス <span className="text-destructive">*</span>
                </Label>
                <Select
                  required
                  value={formData.campus}
                  onValueChange={(value) => setFormData({ ...formData, campus: value, building: "" })}
                >
                  <SelectTrigger id="campus">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="六甲台第一キャンパス">六甲台第一キャンパス</SelectItem>
                    <SelectItem value="鶴甲第一キャンパス">鶴甲第一キャンパス</SelectItem>
                    <SelectItem value="六甲台第二キャンパス">六甲台第二キャンパス</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="building">建物</Label>
                <Select
                  value={formData.building}
                  onValueChange={(value) => setFormData({ ...formData, building: value })}
                  disabled={!formData.campus}
                >
                  <SelectTrigger id="building">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.campus === "六甲台第一キャンパス" && (
                      <>
                        <SelectItem value="工学部1号館">工学部1号館</SelectItem>
                        <SelectItem value="工学部2号館">工学部2号館</SelectItem>
                        <SelectItem value="図書館">図書館</SelectItem>
                        <SelectItem value="総合図書館">総合図書館</SelectItem>
                        <SelectItem value="学生食堂">学生食堂</SelectItem>
                      </>
                    )}
                    {formData.campus === "鶴甲第一キャンパス" && (
                      <>
                        <SelectItem value="学生会館">学生会館</SelectItem>
                        <SelectItem value="教養学部棟">教養学部棟</SelectItem>
                        <SelectItem value="図書館">図書館</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="locationDetail">
                  詳細な場所 {!formData.building && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  id="locationDetail"
                  required={!formData.building}
                  placeholder="例: 2階の講義室A、入り口付近など"
                  value={formData.locationDetail}
                  onChange={(e) => setFormData({ ...formData, locationDetail: e.target.value })}
                />
              </div>
            </div>

            {/* Category Section */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">
                  物の種類 <span className="text-destructive">*</span>
                </Label>
                <Select
                  required
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="財布">財布</SelectItem>
                    <SelectItem value="携帯電話">携帯電話</SelectItem>
                    <SelectItem value="ノートパソコン">ノートパソコン</SelectItem>
                    <SelectItem value="学生証">学生証</SelectItem>
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

              {formData.category === "その他" && (
                <div className="space-y-2">
                  <Label htmlFor="categoryOther">その他の詳細</Label>
                  <Input
                    id="categoryOther"
                    placeholder="物の種類を入力してください"
                    value={formData.categoryOther}
                    onChange={(e) => setFormData({ ...formData, categoryOther: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">詳細説明</Label>
                <Textarea
                  id="description"
                  placeholder="色、ブランド、特徴などできるだけ詳しく記入してください"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            {/* Optional Section */}
            <div className="space-y-4">
              {!["財布", "鍵", "携帯電話", "ノートパソコン", "学生証"].includes(formData.category) && (
                <div className="space-y-2">
                  <Label htmlFor="image">写真（任意）</Label>
                  <div className="flex items-center gap-4">
                    <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("image")?.click()}
                      className="w-full sm:w-auto gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {formData.image ? formData.image.name : "写真を選択"}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">落とし物の写真があると見つけやすくなります</p>
                </div>
              )}

              {["財布", "鍵", "携帯電話", "ノートパソコン", "学生証"].includes(formData.category) && (
                <div className="rounded-md bg-muted p-3">
                  <p className="text-sm text-muted-foreground">
                    貴重品のため、写真のアップロードはできません
                  </p>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="submittedToOffice"
                  checked={formData.submittedToOffice}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      submittedToOffice: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="submittedToOffice" className="text-sm font-normal cursor-pointer">
                  事務室に届けました
                </Label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                投稿する
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/">キャンセル</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}