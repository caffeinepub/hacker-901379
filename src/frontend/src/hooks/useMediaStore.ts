import { useCallback, useEffect, useState } from "react";

export type MediaType = "video" | "photo" | "audio";

export interface MediaItem {
  id: string;
  hash: string;
  name: string;
  type: MediaType;
  mimeType: string;
  size: number;
  uploadedAt: string;
  downloadCount: number;
  url?: string;
}

const STORAGE_KEY = "hacker_901379_media";

export function getMediaType(mimeType: string): MediaType {
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("audio/")) return "audio";
  return "photo";
}

export function useMediaStore() {
  const [items, setItems] = useState<MediaItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((hash: string, file: File, url: string) => {
    const item: MediaItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      hash,
      name: file.name,
      type: getMediaType(file.type),
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      downloadCount: 0,
      url,
    };
    setItems((prev) => [item, ...prev]);
    return item;
  }, []);

  const incrementDownload = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, downloadCount: item.downloadCount + 1 }
          : item,
      ),
    );
  }, []);

  return { items, addItem, incrementDownload };
}
