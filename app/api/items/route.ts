import { NextRequest, NextResponse } from "next/server"
import { redis } from "@/lib/redis" // さっき作ったファイルをインポート

const VALUABLES = ["財布", "携帯電話", "ノートパソコン", "学生証", "鍵", "電子機器"]
const REDIS_KEY = "lost_items_list"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // --- バリデーション (変更なし) ---
    if (!body.category) return NextResponse.json({ error: "カテゴリ必須" }, { status: 400 })
    if (!body.campus) return NextResponse.json({ error: "キャンパス必須" }, { status: 400 })
    // ... 他のバリデーションは省略 ...

    // 貴重品画像の処理
    let imageData = body.image
    if (VALUABLES.includes(body.category)) {
      imageData = null
    }

    const newItem = {
      id: Math.random().toString(36).substring(7),
      ...body,
      image: imageData,
      createdAt: new Date().toISOString(),
    }

    // ★重要: Redisは文字列しか保存できないので、JSON.stringify する
    await redis.lpush(REDIS_KEY, JSON.stringify(newItem))

    console.log("Redisに追加しました:", newItem)

    return NextResponse.json(
      { success: true, message: "投稿しました", data: newItem },
      { status: 201 }
    )
  } catch (error) {
    console.error("Redis Error:", error)
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const campus = searchParams.get("campus")
    const category = searchParams.get("category")

    // ★Redisから全件取得 (文字列の配列として返ってくる)
    const rawItems = await redis.lrange(REDIS_KEY, 0, -1)
    
    // ★文字列をJSONオブジェクトに戻す
    let items = rawItems.map((item) => JSON.parse(item))

    // フィルタリング
    if (campus) items = items.filter((item: any) => item.campus === campus)
    if (category) items = items.filter((item: any) => item.category === category)

    return NextResponse.json({ success: true, data: items })
  } catch (error) {
    console.error("Redis Error:", error)
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}