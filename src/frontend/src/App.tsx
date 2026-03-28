import { Toaster } from "@/components/ui/sonner";
import { SortAsc, SortDesc, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { MediaCard } from "./components/MediaCard";
import { UploadModal } from "./components/UploadModal";
import { useMediaStore } from "./hooks/useMediaStore";
import type { MediaItem } from "./hooks/useMediaStore";

type FilterType = "all" | "video" | "photo" | "audio";
type SortType = "latest" | "most_downloaded";

const FILTER_PILLS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Videos", value: "video" },
  { label: "Photos", value: "photo" },
  { label: "Audio", value: "audio" },
];

function FilterPill({
  label,
  active,
  onClick,
  dataOcid,
}: { label: string; active: boolean; onClick: () => void; dataOcid: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
      style={{
        background: active
          ? "oklch(0.58 0.22 250 / 0.2)"
          : "oklch(0.18 0.012 240)",
        color: active ? "oklch(0.8 0.18 250)" : "oklch(0.65 0.012 240)",
        border: active
          ? "1px solid oklch(0.58 0.22 250 / 0.5)"
          : "1px solid rgba(255,255,255,0.06)",
      }}
      data-ocid={dataOcid}
    >
      {label}
    </button>
  );
}

export default function App() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const { items, incrementDownload } = useMediaStore();

  const filteredItems = useMemo(() => {
    let result = items;
    if (filter !== "all")
      result = result.filter((item) => item.type === filter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((item) => item.name.toLowerCase().includes(q));
    }
    if (sort === "latest") {
      result = [...result].sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      );
    } else {
      result = [...result].sort((a, b) => b.downloadCount - a.downloadCount);
    }
    return result;
  }, [items, filter, sort, searchQuery]);

  const handleDownload = async (item: MediaItem) => {
    if (!item.url) return;
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      incrementDownload(item.id);
    } catch {
      window.open(item.url, "_blank");
      incrementDownload(item.id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        onUploadClick={() => setUploadOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1">
        <div className="max-w-[1200px] mx-auto px-6">
          <HeroSection
            onUploadClick={() => setUploadOpen(true)}
            totalFiles={items.length}
          />

          <section className="py-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-foreground">
                Latest Media
              </h2>
              <button
                type="button"
                onClick={() =>
                  setSort(sort === "latest" ? "most_downloaded" : "latest")
                }
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="gallery.sort.toggle"
              >
                {sort === "latest" ? (
                  <>
                    <SortDesc className="w-4 h-4" /> Latest
                  </>
                ) : (
                  <>
                    <SortAsc className="w-4 h-4" /> Top Downloaded
                  </>
                )}
              </button>
            </div>

            <div
              className="flex flex-wrap gap-2 mb-8"
              data-ocid="gallery.filter.tab"
            >
              {FILTER_PILLS.map((pill) => (
                <FilterPill
                  key={pill.value}
                  label={pill.label}
                  active={filter === pill.value}
                  onClick={() => setFilter(pill.value)}
                  dataOcid={`gallery.filter.${pill.value}.tab`}
                />
              ))}
            </div>

            {filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 gap-5"
                data-ocid="media.empty_state"
              >
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: "oklch(0.18 0.012 240)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <Upload className="w-9 h-9 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-foreground">
                    No media yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {filter !== "all" || searchQuery
                      ? "No results match your filters."
                      : "Be the first to upload something!"}
                  </p>
                </div>
                {filter === "all" && !searchQuery && (
                  <button
                    type="button"
                    onClick={() => setUploadOpen(true)}
                    className="px-6 py-2.5 rounded-full text-sm font-semibold text-white"
                    style={{ background: "oklch(0.58 0.22 250)" }}
                    data-ocid="gallery.empty.upload.button"
                  >
                    Upload your first file
                  </button>
                )}
              </motion.div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                data-ocid="media.list"
              >
                {filteredItems.map((item, idx) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    index={idx}
                    onDownload={handleDownload}
                    isBlue={idx % 2 === 0}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
      <UploadModal open={uploadOpen} onOpenChange={setUploadOpen} />
      <Toaster />
    </div>
  );
}
