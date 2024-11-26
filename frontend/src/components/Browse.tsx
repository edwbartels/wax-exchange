import { useEffect } from 'react'
import ItemTileMain from './ItemTileMain'
import useItemStore from '../stores/itemStore'
import useUserStore from '../stores/userStore'
import useAuthStore from '../stores/authStore'

const Browse: React.FC = () => {
	const updateItems = useItemStore((state) => state.updateItems)
	const updateUserItems = useUserStore((state) => state.updateItemIds)
	const userId = useAuthStore((state) => state.user?.id)

	useEffect(() => {
		updateItems().then(() => {
			if (userId) {
				updateUserItems()
			}
		})
	}, [updateItems])
	const dummyIds: number[] = Object.keys(useItemStore((state) => state.items))
		.slice(0, 30)
		.map(Number)
	return (
		<div className="flex flex-col self-center">
			<div className="pb-8 text-center text-9xl">Homepage</div>
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{dummyIds.map((id) => (
					<ItemTileMain key={id} itemId={id} />
				))}
			</div>
		</div>
	)
}

export default Browse
