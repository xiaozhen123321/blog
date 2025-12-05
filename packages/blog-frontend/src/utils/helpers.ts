export function getImageUrl(imageId: number | null): string {
  if (!imageId) {
    return 'https://via.placeholder.com/400x200?text=No+Image';
  }
  return `/api/images/${imageId}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
