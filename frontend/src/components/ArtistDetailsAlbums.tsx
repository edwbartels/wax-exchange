import { useEffect } from 'react'
import useArtistStore from '../stores/artistStore'
import useAlbumStore from '../stores/albumStore'
import AlbumTile from './AlbumTile'

const ArtistDetailsAlbums = () => {
	const artistId = useArtistStore((state) => state.focus?.id)
	const { albums, getByAlbums } = useAlbumStore((state) => state)

	useEffect(() => {
		getByAlbums('artist', Number(artistId))
	}, [artistId])

	return (
		<div className="flex flex-col self-center">
			<div className="flex flex-wrap justify-start gap-4 p-4">
				{Object.keys(albums).map((id) => (
					<AlbumTile key={id} albumId={Number(id)} />
				))}
			</div>
		</div>
	)
}

export default ArtistDetailsAlbums
