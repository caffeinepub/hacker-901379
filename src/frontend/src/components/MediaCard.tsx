import { Download, Film, ImageIcon, Music, Play } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { MediaItem } from "../hooks/useMediaStore";

interface MediaCardProps {
  item: MediaItem;
  index: number;
  onDownload: (item: MediaItem) => void;
  isBlue: boolean;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function TypeBadge({ type }: { type: MediaItem["type"] }) {
  const config = {
    video: { label: "Video", Icon: Film, color: "oklch(0.58 0.22 250)" },
    photo: { label: "Photo", Icon: ImageIcon, color: "oklch(0.72 0.19 145)" },
    audio: { label: "Audio", Icon: Music, color: "oklch(0.65 0.24 300)" },
  }[type];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: "oklch(0.2 0.014 240)",
        color: config.color,
        border: `1px solid ${config.color}33`,
      }}
    >
      <config.Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function MediaPreview({ item }: { item: MediaItem }) {
  const [playing, setPlaying] = useState(false);

  if (item.type === "photo" && item.url) {
    return (
      <div className="w-full h-40 overflow-hidden">
        <img
          src={item.url}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  if (item.type === "video" && item.url) {
    return (
      <div className="w-full h-40 relative overflow-hidden bg-black/30 flex items-center justify-center">
        {playing ? (
          <video
            src={item.url}
            className="w-full h-full object-cover"
            autoPlay
            controls
            muted
          >
            <track kind="captions" />
          </video>
        ) : (
          <button
            type="button"
            className="flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors"
            onClick={() => setPlaying(true)}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{
                background: "oklch(0.58 0.22 250 / 0.3)",
                border: "1px solid oklch(0.58 0.22 250 / 0.5)",
              }}
            >
              <Play className="w-5 h-5 fill-current ml-1" />
            </div>
            <span className="text-xs">Preview</span>
          </button>
        )}
      </div>
    );
  }

  if (item.type === "audio") {
    return (
      <div
        className="w-full h-40 flex flex-col items-center justify-center gap-3"
        style={{ background: "oklch(0.14 0.01 240)" }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: "oklch(0.65 0.24 300 / 0.15)",
            border: "1px solid oklch(0.65 0.24 300 / 0.3)",
          }}
        >
          <Music
            className="w-7 h-7"
            style={{ color: "oklch(0.75 0.22 300)" }}
          />
        </div>
        {item.url && (
          // biome-ignore lint/a11y/useMediaCaption: user-uploaded audio content without captions
          <audio controls className="w-full px-3" style={{ height: 32 }}>
            <source src={item.url} type={item.mimeType} />
          </audio>
        )}
      </div>
    );
  }

  return (
    <div
      className="w-full h-40 flex items-center justify-center"
      style={{ background: "oklch(0.14 0.01 240)" }}
    >
      <ImageIcon className="w-10 h-10 text-muted-foreground opacity-40" />
    </div>
  );
}

export function MediaCard({ item, index, onDownload, isBlue }: MediaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        background: "oklch(0.155 0.012 240)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 12px 30px rgba(0,0,0,0.45)",
      }}
      data-ocid={`media.item.${index + 1}`}
    >
      <div className="relative overflow-hidden">
        <MediaPreview item={item} />
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <TypeBadge type={item.type} />
        <p
          className="text-foreground font-semibold text-sm leading-snug line-clamp-2"
          title={item.name}
        >
          {item.name}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatSize(item.size)}</span>
          <span>{formatDate(item.uploadedAt)}</span>
        </div>
        {item.downloadCount > 0 && (
          <p className="text-xs text-muted-foreground">
            {item.downloadCount} download{item.downloadCount !== 1 ? "s" : ""}
          </p>
        )}
        <button
          type="button"
          onClick={() => onDownload(item)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-85 active:scale-95"
          style={{
            background: isBlue
              ? "oklch(0.58 0.22 250)"
              : "oklch(0.72 0.19 145)",
          }}
          data-ocid={`media.download_button.${index + 1}`}
        >
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>
    </motion.div>
  );
}
