"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Phone, Mail } from "lucide-react"

const storageLocations = [
  {
    id: "1",
    campus: "本郷キャンパス",
    locations: [
      {
        name: "学生支援課",
        building: "本部棟1階",
        hours: "平日 9:00-17:00",
        phone: "03-1234-5678",
        email: "support@campus.ac.jp",
      },
      {
        name: "図書館カウンター",
        building: "総合図書館1階",
        hours: "平日 8:30-20:00 / 土日 10:00-17:00",
        phone: "03-1234-5679",
        email: "library@campus.ac.jp",
      },
    ],
  },
  {
    id: "2",
    campus: "駒場キャンパス",
    locations: [
      {
        name: "教務課窓口",
        building: "学生会館2階",
        hours: "平日 9:00-17:00",
        phone: "03-1234-5680",
        email: "komaba-support@campus.ac.jp",
      },
    ],
  },
]

export function StorageInfo() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-balance">落とし物保管場所</h1>
        <p className="mt-2 text-muted-foreground">各キャンパスの落とし物保管場所と受付時間をご確認いただけます</p>
      </div>

      <div className="space-y-6">
        {storageLocations.map((campus) => (
          <div key={campus.id} className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">{campus.campus}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {campus.locations.map((location, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{location.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {location.building}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">受付時間</p>
                        <p className="text-sm text-muted-foreground">{location.hours}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">電話番号</p>
                        <p className="text-sm text-muted-foreground">{location.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">メールアドレス</p>
                        <p className="text-sm text-muted-foreground">{location.email}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Card className="bg-accent">
        <CardHeader>
          <CardTitle className="text-lg">ご注意事項</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• 落とし物の保管期間は原則として3ヶ月です</p>
          <p>• 受け取りの際は、学生証などの身分証明書をご持参ください</p>
          <p>• 貴重品（財布、携帯電話など）は速やかに事務室にお届けください</p>
          <p>• 詳細なお問い合わせは各キャンパスの窓口までご連絡ください</p>
        </CardContent>
      </Card>
    </div>
  )
}
