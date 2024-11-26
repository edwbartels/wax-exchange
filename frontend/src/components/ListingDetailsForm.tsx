import React, { useState } from 'react'
import { Listing } from '../stores/listingStore'
import useAuthStore from '../stores/authStore'
import ListingModal from './ListingModal'
import fetchWithAuth from '../utils/fetch'

interface ListingDetailsFormProps {
	listing: Listing
}

const ListingDetailsForm: React.FC<ListingDetailsFormProps> = ({ listing }) => {
	const isOwner = listing.seller.id === useAuthStore((state) => state.user?.id)
	const [activeModal, setActiveModal] = useState<'listing' | null>(null)
	const [isEditing, setIsEditing] = useState<boolean>(false)
	const [editDetails, setEditDetails] = useState({
		price: listing.price,
		quality: listing.quality,
		description: listing.description,
	})
	const [tempValuePrice, setTempValuePrice] = useState<Listing['price']>(
		editDetails.price
	)
	const [tempValueQuality, setTempValueQuality] = useState<Listing['quality']>(
		editDetails.quality
	)
	const [tempValueDesc, setTempValueDesc] = useState<Listing['description']>(
		editDetails.description
	)

	const handleSubmit = async () => {
		const newDetails = {
			...listing,
			price: tempValuePrice,
			quality: tempValueQuality,
			description: tempValueDesc,
		}
		try {
			const url = `/api/listings/${listing.id}`
			const res = await fetchWithAuth(url, {
				method: 'PUT',
				body: JSON.stringify(newDetails),
				credentials: 'include',
			})
			if (!res.ok) {
				const error = await res.text()
				console.log(error)
				throw new Error('Failed to update listing')
			}
			const newListing = await res.json()
			listing.price = newListing.price
			listing.quality = newListing.quality
			listing.description = newListing.description
			setEditDetails({
				price: tempValuePrice,
				quality: tempValueQuality,
				description: tempValueDesc,
			})
			setIsEditing(false)
		} catch (e) {
			console.error(e)
		}
	}
	return (
		<div className="flex mt-8 border bg-wax-gray bg-opacity-15 border-wax-silver">
			<div className="flex flex-col p-4">
				<div className="p-10 text-center border w-96 border-wax-black aspect-video">
					Image Upload tbd...
				</div>
			</div>
			<div className="flex w-full justify-evenly">
				<div className="flex w-full p-4 bg-wax-gray bg-opacity-30">
					<div className="flex flex-col justify-between w-1/2">
						<div>
							<div className="flex flex-col w-4/5 ">
								<div className="ml-2 font-semibold">Artist</div>
								<div className="pl-2">{listing.artist.name}</div>
							</div>
							<div className="flex flex-col w-4/5 ">
								<div className="mt-1 ml-2 font-semibold">Album</div>
								<div className="pl-2">{listing.album.title}</div>
							</div>
							<div className="flex flex-col w-4/5 ">
								<div className="mt-1 ml-2 font-semibold">Release Variant</div>
								<div className="pl-2">{listing.release.variant}</div>
							</div>
							<div className="flex flex-col w-4/5">
								<div className="mt-1 ml-2 font-semibold">Format</div>
								<div className="pl-2">{listing.release.media_type}</div>
							</div>
						</div>
					</div>
					<div className="px-4 flex flex-col justify-between">
						<div className="flex flex-col ">
							<div className="flex flex-col ">
								<div className="ml-2 font-semibold">Price</div>
								{isEditing ? (
									<input
										type="number"
										defaultValue={listing.price}
										onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
											setTempValuePrice(Number(e.target.value))
										}
									/>
								) : (
									<div className="pl-2">{listing.price}</div>
								)}
							</div>
							<div className="flex flex-col">
								<div className="mt-1 ml-2 font-semibold">Quality</div>
								{isEditing ? (
									<select
										defaultValue={listing.quality}
										onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
											setTempValueQuality(
												e.target.value as 'm' | 'vg' | 'g' | 'f' | 'ng'
											)
										}
									>
										<option value="" disabled>
											Select Quality
										</option>
										<option value="m">Mint</option>
										<option value="vg">Very Good</option>
										<option value="g">Good</option>
										<option value="f">Fair</option>
										<option value="ng">Not Good</option>
									</select>
								) : (
									<div className="pl-2">{listing.quality}</div>
								)}
							</div>
							<div className="flex flex-col">
								<div className="mt-1 ml-2 font-semibold">Description</div>
								{isEditing ? (
									<textarea
										defaultValue={tempValueDesc || ''}
										onChange={(e) => setTempValueDesc(e.target.value)}
									/>
								) : (
									<div className="pl-2">{listing.description}</div>
								)}
							</div>
						</div>
						<div className="flex">
							{isOwner &&
								(isEditing ? (
									<>
										<button
											className="w-28 mt-4 ml-8 bg-green-700 rounded-md ring-2 ring-wax-cream text-wax-cream hover:ring-wax-gray"
											onClick={handleSubmit}
										>
											Save Changes
										</button>
										<button
											className="w-28 mt-4 ml-8 bg-wax-red rounded-md ring-2 ring-wax-cream text-wax-cream hover:ring-wax-gray"
											onClick={() => {
												setIsEditing(false)
											}}
										>
											Cancel
										</button>
									</>
								) : (
									<button
										className="w-24 mt-4 ml-8 bg-green-700 rounded-md ring-2 ring-wax-cream text-wax-cream hover:ring-wax-gray"
										onClick={() => {
											setIsEditing(true)
										}}
									>
										Edit Listing
									</button>
								))}
						</div>
					</div>
					<div className="flex flex-col items-center justify-between w-1/2">
						<div className="font-semibold">Track List</div>
						<div className="pt-1 text-sm text-left">
							{Object.values(listing.album.track_data).map((track, index) => (
								<div key={index}>
									{index + 1}: {track}
								</div>
							))}
						</div>

						{/* <div
							// onClick={getTracks}
							className="w-3/5 mt-4 text-center rounded-md cursor-pointer ring-2 ring-wax-silver text-wax-gray bg-wax-cream hover:ring-4"
						>
							Update Track Data
						</div> */}
					</div>
					<ListingModal
						isOpen={activeModal === 'listing'}
						onClose={() => setActiveModal(null)}
						data={null}
					/>
				</div>
			</div>
		</div>
	)
}

export default ListingDetailsForm
