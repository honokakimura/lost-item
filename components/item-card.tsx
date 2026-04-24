"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Building2, CheckCircle2 } from "lucide-react"
import Image from "next/image"

interface ItemCardProps {
  item: {
    id: string
    category: string
    color: string
    location: {
      campus: string
      building: string
      detail: string
    }
    description: string
    submittedToOffice: boolean
    imageUrl?: string
    createdAt: Date
  }
}

export function ItemCard({ item }: ItemCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="font-semibold">
                {item.category}
              </Badge>
              {item.color ? (
                <Badge variant="outline" className="font-semibold">
                  {item.color}
                </Badge>
              ) : (
                <Badge variant="outline" className="font-semibold">
                  色未設定
                </Badge>
              )}
              {item.submittedToOffice && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  事務室に届出済
                </Badge>
              )}
            </div>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
            <Calendar className="h-3 w-3" />
            {formatDate(item.createdAt)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {item.imageUrl && (
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-muted">
            <Image src={item.imageUrl || "/placeholder.svg"} alt={item.description} fill className="object-cover" />
          </div>
        )}

        <p className="text-base text-foreground">{item.description}</p>

        <div className="space-y-2 pt-2">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <span className="text-muted-foreground font-medium">{item.location.campus}</span>
          </div>
          <div className="flex items-start gap-2 text-sm pl-6">
            <Building2 className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
            <span className="text-muted-foreground">
              {item.location.building} - {item.location.detail}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
