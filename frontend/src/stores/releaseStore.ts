import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

export type Release = {
	id: number
	media_type: string
	variant: string
	album: {
		id: number
		title: string
		track_data: {
			[key: number]: string
		}
	}
	artist: {
		id: number
		name: string
	}
	listings: {
		[key: number]: {
			id: number
			price: number
			quality: string
			description: string
			status: string
			active: boolean
			seller: {
				id: number
				username: string
			}
		}
	}
	items: {
		[key: number]: {
			id: number
			username: string
		}
	}
}
interface ReleaseStore {
	focus: Release | null
	getFocus: (id: number) => Promise<void>
}

const useReleaseStore = create(
	devtools<ReleaseStore>(
		(set) => ({
			focus: null,
			getFocus: async (id) => {
				try {
					const url = `/api/releases/${id}`
					const res = await fetch(url)
					if (!res.ok) {
						throw new Error(`Failed to fetch release (id: ${id})`)
					}
					const release = await res.json()
					console.log(release)
					set({ focus: release })
				} catch (e) {
					console.error(e)
				}
			},
		}),
		{ name: 'Releases' }
	)
)

export default useReleaseStore