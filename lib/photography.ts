export type GalleryPhoto = {
  id: string;
  image: string;
  label?: string;
  width?: number;
  height?: number;
  link?: string;
};

export type UnsplashPhoto = {
  id: string;
  urls: { regular: string; small?: string };
  alt_description: string | null;
  width: number;
  height: number;
  links?: { html: string };
  likes?: number;
  description?: string | null;
};

/** Swap these for local paths (e.g. /photography/1.jpg) when using your own assets. */
const FALLBACK_PHOTOS: GalleryPhoto[] = [];

function toGalleryItem(photo: UnsplashPhoto): GalleryPhoto {
  return {
    id: photo.id,
    image: photo.urls.regular,
    label: photo.description || photo.alt_description || "",
    width: photo.width,
    height: photo.height,
    link: photo.links?.html,
  };
}

export async function fetchPhotographyPhotos(): Promise<GalleryPhoto[]> {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    return FALLBACK_PHOTOS;
  }
  try {
    const res = await fetch(
      "https://api.unsplash.com/users/junehobart/photos?per_page=30&order_by=latest",
      {
        headers: {
          Authorization: `Client-ID ${key}`,
          "Accept-Version": "v1",
        },
        next: { revalidate: 1800 },
      }
    );
    if (!res.ok) {
      return FALLBACK_PHOTOS;
    }
    const data: UnsplashPhoto[] = await res.json();
    if (!Array.isArray(data) || data.length === 0) {
      return FALLBACK_PHOTOS;
    }
    return data.map(toGalleryItem);
  } catch {
    return FALLBACK_PHOTOS;
  }
}
