export const normalizeImageUrl = (url?: string | null) => {
  if (!url) {
    return url;
  }

  return url.replace(/^http:\/\/hello\.pbi\.web\.id\//, 'https://hello.pbi.web.id/');
};

export const normalizeNewsImage = <T extends { image?: string | null }>(item: T): T => ({
  ...item,
  image: normalizeImageUrl(item.image),
});
