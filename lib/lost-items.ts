import mockItems from "@/data/mock-items.json"

export const LOST_ITEMS_STORAGE_KEY = "lost-items"

export const LOST_PERIOD_OPTIONS = [
    { value: "week", label: "1週間以内", maxDays: 7 },
    { value: "month", label: "1か月以内", maxDays: 30 },
    { value: "3months", label: "3か月以内", maxDays: 90 },
    { value: "6months", label: "6か月以内", maxDays: 180 },
] as const

export const ITEM_COLOR_OPTIONS = ["黒", "白", "青", "赤", "グレー", "茶", "緑", "その他"]

export interface LostItemRecord {
    id: string
    category: string
    categoryOther?: string
    color: string
    location: {
        campus: string
        building: string
        detail: string
    }
    description: string
    submittedToOffice: boolean
    officeDetail?: string
    imageUrl?: string | null
    createdAt: string
}

export interface LostItemView extends Omit<LostItemRecord, "createdAt"> {
    createdAt: Date
}

const defaultItems = mockItems as LostItemRecord[]

const inferColorFromText = (text: string): string => {
    const normalizedText = text.toLowerCase()

    if (/黒|black/.test(normalizedText)) return "黒"
    if (/白|white/.test(normalizedText)) return "白"
    if (/青|紺|ネイビー|blue/.test(normalizedText)) return "青"
    if (/赤|red/.test(normalizedText)) return "赤"
    if (/グレー|灰|gray/.test(normalizedText)) return "グレー"
    if (/茶|brown/.test(normalizedText)) return "茶"
    if (/緑|green/.test(normalizedText)) return "緑"

    return ""
}

const normalizeItem = (item: Partial<LostItemRecord> & { createdAt: string }): LostItemRecord => ({
    id: item.id ?? Math.random().toString(36).slice(2, 10),
    category: item.category ?? "その他",
    categoryOther: item.categoryOther ?? "",
    color: item.color ?? inferColorFromText([item.category, item.categoryOther, item.description].filter(Boolean).join(" ")),
    location: {
        campus: item.location?.campus ?? "",
        building: item.location?.building ?? "",
        detail: item.location?.detail ?? "",
    },
    description: item.description ?? "",
    submittedToOffice: item.submittedToOffice ?? false,
    officeDetail: item.officeDetail ?? "",
    imageUrl: item.imageUrl ?? null,
    createdAt: item.createdAt,
})

export const toViewItems = (items: LostItemRecord[]): LostItemView[] => {
    return items.map((item) => ({
        ...item,
        createdAt: new Date(item.createdAt),
    }))
}

export const readLostItems = (): LostItemRecord[] => {
    if (typeof window === "undefined") {
        return defaultItems
    }

    const rawItems = window.localStorage.getItem(LOST_ITEMS_STORAGE_KEY)

    if (!rawItems) {
        window.localStorage.setItem(LOST_ITEMS_STORAGE_KEY, JSON.stringify(defaultItems))
        return defaultItems
    }

    try {
        const parsedItems = JSON.parse(rawItems) as unknown

        if (!Array.isArray(parsedItems)) {
            throw new Error("Stored items must be an array")
        }

        const normalizedItems = parsedItems.map((item) => normalizeItem(item as Partial<LostItemRecord> & { createdAt: string }))
        window.localStorage.setItem(LOST_ITEMS_STORAGE_KEY, JSON.stringify(normalizedItems))
        return normalizedItems
    } catch {
        window.localStorage.setItem(LOST_ITEMS_STORAGE_KEY, JSON.stringify(defaultItems))
        return defaultItems
    }
}

export const writeLostItems = (items: LostItemRecord[]) => {
    if (typeof window === "undefined") {
        return
    }

    window.localStorage.setItem(LOST_ITEMS_STORAGE_KEY, JSON.stringify(items))
}

export const appendLostItem = (item: LostItemRecord) => {
    const currentItems = readLostItems()
    const nextItems = [item, ...currentItems]

    writeLostItems(nextItems)

    return nextItems
}

export const isWithinLostPeriod = (createdAt: Date, period: string) => {
    const periodOption = LOST_PERIOD_OPTIONS.find((option) => option.value === period)

    if (!periodOption) {
        return true
    }

    const elapsedDays = (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    return elapsedDays <= periodOption.maxDays
}