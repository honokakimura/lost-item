"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { MapPin, Package, CheckCircle, ArrowLeft, X, ChevronRight, Loader2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "../hooks/use-toast"

// 貴重品リスト
const VALUABLES = ["財布", "携帯電話", "ノートパソコン", "学生証", "鍵", "電子機器"]

export function PostItemForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // フォームデータ
  const [formData, setFormData] = useState({
    campus: "",
    building: "",
    locationDetail: "",
    category: "",
    categoryOther: "",
    description: "",
    submittedToOffice: null as boolean | null,
    officeDetail: "",
    image: null as string | null,
  })

  // カメラ関連
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  // ステップ1でカメラを自動起動
  useEffect(() => {
    if (step === 1 && !formData.image) {
      startCamera()
    }
    return () => stopCamera()
  }, [step])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (err) {
      console.error("Camera error:", err)
      setIsCameraActive(false)
      toast({
        title: "カメラエラー",
        description: "カメラにアクセスできませんでした",
        variant: "destructive",
      })
    }
  }

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream
    stream?.getTracks().forEach(track => track.stop())
    setIsCameraActive(false)
  }

  const takePhoto = () => {
    if (!videoRef.current) return
    const canvas = document.createElement("canvas")
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0)
    const photoUrl = canvas.toDataURL("image/jpeg", 0.8)
    
    setFormData(prev => ({ ...prev, image: photoUrl }))
    stopCamera()
    setStep(2)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "投稿に失敗しました")
      }

      toast({
        title: "投稿完了",
        description: "落とし物を投稿しました",
      })

      // 投稿成功後、ホームへ遷移
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Submit error:", error)
      toast({
        title: "投稿エラー",
        description: error instanceof Error ? error.message : "投稿に失敗しました",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    } else {
      router.push("/")
    }
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <Button variant="ghost" size="sm" onClick={handleBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {step === 1 ? "ホームへ" : "戻る"}
        </Button>
        <span className="text-sm text-muted-foreground font-medium">
          Step {step} / 4
        </span>
      </div>

      <Card className="overflow-hidden">
        {/* STEP 1: カメラ撮影 */}
        {step === 1 && (
          <div className="relative flex flex-col h-[70vh] sm:h-150 bg-black">
             {!formData.image ? (
              <>
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="absolute inset-0 w-full h-full object-cover" 
                />
                {!isCameraActive && (
                   <div className="absolute inset-0 flex items-center justify-center text-white bg-gray-900/80">
                     <p>カメラを起動中...</p>
                   </div>
                )}
                
                <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center items-center bg-linear-to-t from-black/80 to-transparent pt-20">
                  <button 
                    onClick={takePhoto}
                    className="w-20 h-20 rounded-full border-4 border-white bg-white/20 hover:bg-white/40 transition-all shadow-lg"
                    aria-label="写真を撮る"
                  />
                </div>
                
                <Button 
                  variant="secondary" 
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm border-none"
                  onClick={() => { stopCamera(); setStep(2); }}
                >
                  撮らずに進む <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </>
             ) : (
               <div className="relative h-full w-full">
                 <Image src={formData.image} alt="Preview" fill className="object-cover" />
                 <div className="absolute bottom-8 w-full flex justify-center gap-4">
                   <Button variant="destructive" onClick={() => setFormData(prev => ({...prev, image: null}))}>
                     撮り直す
                   </Button>
                   <Button onClick={() => setStep(2)}>
                     この写真を使う
                   </Button>
                 </div>
               </div>
             )}
          </div>
        )}

        {/* STEP 2: カテゴリ・詳細 */}
        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                何を見つけましたか?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {formData.image && (
                <div className="relative h-48 w-full rounded-md overflow-hidden bg-muted group">
                  <Image src={formData.image} alt="Taken photo" fill className="object-cover" />
                  
                  {VALUABLES.includes(formData.category) && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-4 text-center animate-in fade-in duration-200">
                      <p className="font-bold text-lg mb-1">写真非表示</p>
                      <p className="text-sm text-gray-200">貴重品カテゴリのため、この写真は投稿に含まれません。</p>
                    </div>
                  )}

                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-2 right-2 h-8 w-8 z-10"
                    onClick={() => setFormData(prev => ({...prev, image: null}))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <Label>カテゴリ <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="財布">財布(貴重品)</SelectItem>
                    <SelectItem value="携帯電話">携帯電話(貴重品)</SelectItem>
                    <SelectItem value="鍵">鍵(貴重品)</SelectItem>
                    <SelectItem value="学生証">学生証(貴重品)</SelectItem>
                    <SelectItem value="ノートパソコン">ノートパソコン(貴重品)</SelectItem>
                    <SelectItem value="電子機器">電子機器</SelectItem>
                    <SelectItem value="衣類">衣類</SelectItem>
                    <SelectItem value="文房具・学用品">文房具・学用品</SelectItem>
                    <SelectItem value="アクセサリー">アクセサリー</SelectItem>
                    <SelectItem value="その他">その他</SelectItem>
                  </SelectContent>
                </Select>
                
                {VALUABLES.includes(formData.category) && (
                  <p className="text-xs text-orange-600 font-medium flex items-center gap-1">
                    ※セキュリティのため、貴重品類の写真はアップロードされません。
                  </p>
                )}
              </div>

              {formData.category === "その他" && (
                <div className="space-y-2">
                  <Label>その他の詳細</Label>
                  <Input
                    placeholder="具体的な名称"
                    value={formData.categoryOther}
                    onChange={(e) => setFormData({ ...formData, categoryOther: e.target.value })}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>特徴・詳細(任意)</Label>
                <Textarea
                  placeholder="色、ブランド、形状など"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <Button 
                className="w-full" 
                onClick={() => setStep(3)}
                disabled={!formData.category}
              >
                次へ
              </Button>
            </CardContent>
          </>
        )}

        {/* STEP 3: 場所 */}
        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                どこで見つけましたか?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>キャンパス <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.campus}
                  onValueChange={(value) => setFormData({ ...formData, campus: value, building: "" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="鶴甲第一キャンパス">鶴甲第一キャンパス</SelectItem>
                    <SelectItem value="六甲台第一キャンパス">六甲台第一キャンパス</SelectItem>
                    <SelectItem value="六甲台第二キャンパス">六甲台第二キャンパス</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>建物</Label>
                <Select
                  value={formData.building}
                  onValueChange={(value) => setFormData({ ...formData, building: value })}
                  disabled={!formData.campus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="建物(キャンパス選択後に有効)" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.campus === "六甲台第一キャンパス" && (
                      <>
                        <SelectItem value="工学部1号館">工学部1号館</SelectItem>
                        <SelectItem value="工学部2号館">工学部2号館</SelectItem>
                        <SelectItem value="図書館">図書館</SelectItem>
                        <SelectItem value="学生食堂">学生食堂</SelectItem>
                      </>
                    )}
                    {formData.campus === "鶴甲第一キャンパス" && (
                      <>
                        <SelectItem value="食堂">食堂</SelectItem>
                        <SelectItem value="B棟">B棟</SelectItem>
                        <SelectItem value="図書館">図書館</SelectItem>
                        <SelectItem value="体育館">体育館</SelectItem>
                      </>
                    )}
                    {formData.campus === "六甲台第二キャンパス" && (
                      <>
                        <SelectItem value="理学部1号館">理学部1号館</SelectItem>
                        <SelectItem value="その他・屋外">その他・屋外</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  詳細な場所 {!formData.building && <span className="text-destructive">*</span>}
                </Label>
                <Input
                  placeholder="例: 2階の講義室A、入り口付近など"
                  value={formData.locationDetail}
                  onChange={(e) => setFormData({ ...formData, locationDetail: e.target.value })}
                />
                {!formData.building && !formData.locationDetail && (
                  <p className="text-xs text-destructive">建物が未選択の場合、詳細は必須です。</p>
                )}
              </div>

              <Button 
                className="w-full" 
                onClick={() => setStep(4)}
                disabled={!formData.campus || (!formData.building && !formData.locationDetail)}
              >
                次へ
              </Button>
            </CardContent>
          </>
        )}

        {/* STEP 4: 届け出確認 & 送信 */}
        {step === 4 && (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                事務室などに届けましたか?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, submittedToOffice: true })}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    formData.submittedToOffice === true
                      ? "border-primary bg-primary/5 text-primary font-bold"
                      : "border-muted hover:border-primary/50"
                  }`}
                >
                  はい
                  <span className="block text-xs font-normal text-muted-foreground mt-1">届け出済み</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, submittedToOffice: false })}
                  className={`p-4 rounded-xl border-2 text-center transition-all ${
                    formData.submittedToOffice === false
                      ? "border-primary bg-primary/5 text-primary font-bold"
                      : "border-muted hover:border-primary/50"
                  }`}
                >
                  いいえ
                  <span className="block text-xs font-normal text-muted-foreground mt-1">その場にある</span>
                </button>
              </div>

              {formData.submittedToOffice === true && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                  <Label>どこの窓口ですか?(任意)</Label>
                  <Input 
                    placeholder="工学部教務課、学生センターなど"
                    value={formData.officeDetail}
                    onChange={(e) => setFormData({...formData, officeDetail: e.target.value})}
                  />
                </div>
              )}

              {/* 確認事項サマリー */}
              <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">物:</span>
                  <span className="font-medium">{formData.category}</span>
                </div>
                {VALUABLES.includes(formData.category) && formData.image && (
                  <div className="flex justify-between text-orange-600">
                    <span className="text-xs">※貴重品のため写真は送信されません</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">場所:</span>
                  <span className="font-medium">{formData.building} {formData.locationDetail}</span>
                </div>
              </div>

              {formData.submittedToOffice !== null && (
                <Button 
                  size="lg" 
                  className="w-full mt-4" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      投稿中...
                    </>
                  ) : (
                    "この内容で投稿する"
                  )}
                </Button>
              )}
            </CardContent>
          </>
        )}
      </Card>
    </div>
  )
}