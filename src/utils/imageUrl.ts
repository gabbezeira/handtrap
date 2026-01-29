export const getCardImageUrl = (id: number, small = false) => {
	// Strictly use local images as requested
	// Assumes images are in public/card_images and public/card_images_small
	if (small) {
		return `/card_images_small/${id}.jpg`;
	}
	return `/card_images_small/${id}.jpg`;
};
