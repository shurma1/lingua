import { useCallback, useRef } from "react";

import { apiClient } from "@/http";

export const useMedia = () => {
	const audioRef = useRef<HTMLAudioElement | null>(null);

	const playMediaById = useCallback(async (mediaId: string | number) => {
		try {
			if (audioRef.current) {
				audioRef.current.pause();
				audioRef.current = null;
			}

			const mediaUrl = apiClient.media.getMediaUrl(mediaId);

			const audio = new Audio(mediaUrl);
			audioRef.current = audio;

			await audio.play();
		} catch (error) {
			console.error("Failed to play media:", error);
		}
	}, []);

	return {
		playMediaById,
	};
};
