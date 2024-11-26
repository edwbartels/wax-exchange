import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Item = {
	id: number
	owner: {
		id: number
		username: string
	}
	listing: {
		id: number
		active: boolean
		status: 'available' | 'closed'
		price: number
		quality: 'm' | 'vg' | 'g' | 'f' | 'vg'
		description: string | null
	} | null
	release: {
		id: number
		media_type: 'vinyl' | 'cassette' | 'cd'
		variant: string | null
	}
	album: {
		id: number
		title: string
		track_data: string[] | Record<number, string>
		art: string | null
	}
	artist: {
		id: number
		name: string
	}
}

interface ItemStore {
	focus: Item | null
	items: {
		[key: number]: Item
	}
	getFocus: (id: number) => Promise<void>
	updateItems: () => Promise<void>
}

const useItemStore = create(
	devtools<ItemStore>(
		(set) => ({
			focus: null,
			items: {},
			getFocus: async (id) => {
				try {
					const url = `/api/items/${id}`
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error(`Failed to fetch item (id:${id})`)
					}
					const item = await res.json()
					set({ focus: item })
				} catch (e) {
					console.error(e)
				}
			},
			updateItems: async () => {
				try {
					const url = '/api/items/full'
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error('Fetch all items failed')
					}
					const allItems = await res.json()
					set({ items: allItems })
				} catch (e) {
					console.error(e)
				}
			},
		}),
		{ name: 'itemStore' }
	)
)

export default useItemStore
