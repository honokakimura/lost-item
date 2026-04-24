import mockItems from "@/data/mock-items.json"

export const LOST_ITEMS_STORAGE_KEY = "lost-items"

export interface LostItemRecord {
    id: string
    category: string
    categoryOther?: string
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

        return parsedItems as LostItemRecord[]
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