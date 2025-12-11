// src/components/TrackCard.jsx
'use client';

export default function TrackCard({
                                      track,
                                      index,
                                      isFavorite,
                                      onToggleFavorite,
                                      onRemove,
                                      formatDuration
                                  }) {
    const albumImage = track.album?.images?.[2]?.url || track.album?.images?.[0]?.url;
    const artistNames = track.artists?.map(a => a.name).join(', ') || 'Unknown Artist';
    const trackName = track.name || 'Unknown Track';
    const duration = formatDuration(track.duration_ms || 0);

    return (
        <div className="bg-gray-700 rounded-lg p-3 hover:bg-gray-600 transition-colors group">
            <div className="flex items-center gap-3">
                {/* Index */}
                <span className="text-gray-400 text-sm w-6 text-center">
          {index + 1}
        </span>

                {/* Album Cover */}
                {albumImage && (
                    <img
                        src={albumImage}
                        alt={trackName}
                        className="w-12 h-12 rounded"
                    />
                )}

                {/* Track Info */}
                <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                        {trackName}
                    </p>
                    <p className="text-gray-400 text-sm truncate">
                        {artistNames}
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Duration */}
                    <span className="text-gray-400 text-sm hidden sm:inline">
            {duration}
          </span>

                    {/* Favorite Button */}
                    <button
                        onClick={onToggleFavorite}
                        className={`transition-all transform hover:scale-110 ${
                            isFavorite ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'
                        }`}
                        title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                    >
                        {isFavorite ? '⭐' : '☆'}
                    </button>

                    {/* Remove Button */}
                    <button
                        onClick={onRemove}
                        className="text-red-400 hover:text-red-300 transition-colors opacity-0 group-hover:opacity-100"
                        title="Eliminar de la playlist"
                    >
                        ✕
                    </button>
                </div>
            </div>

            {/* Preview Link (if available) */}
            {track.preview_url && (
                <div className="mt-2 pl-12">
                    <audio
                        controls
                        className="w-full h-8"
                        style={{ maxWidth: '300px' }}
                    >
                        <source src={track.preview_url} type="audio/mpeg" />
                    </audio>
                </div>
            )}
        </div>
    );
}