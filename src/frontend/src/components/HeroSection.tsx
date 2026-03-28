import { Button } from "@/components/ui/button";
import { Sparkles, Upload } from "lucide-react";
import { motion } from "motion/react";

interface HeroSectionProps {
  onUploadClick: () => void;
  totalFiles: number;
}

export function HeroSection({ onUploadClick, totalFiles }: HeroSectionProps) {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-3xl opacity-20"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.58 0.22 250), oklch(0.65 0.24 300), oklch(0.55 0.22 200))",
          }}
        />
      </div>

      <div
        className="relative max-w-[1200px] mx-auto px-6 rounded-2xl py-14 flex flex-col items-center text-center"
        style={{
          background: "oklch(0.155 0.012 240 / 0.8)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="flex items-center gap-2 mb-5">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: "oklch(0.58 0.22 250 / 0.15)",
                color: "oklch(0.72 0.18 250)",
                border: "1px solid oklch(0.58 0.22 250 / 0.3)",
              }}
            >
              <Sparkles className="w-3 h-3" />
              Public Media Platform
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
            Share Anything.
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.72 0.18 250), oklch(0.75 0.22 300))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Download Everything.
            </span>
          </h1>

          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto mb-8">
            Upload videos, photos, and audio files. Share with anyone. No
            account required to download.
          </p>

          <div className="flex items-center gap-4 justify-center flex-wrap">
            <Button
              onClick={onUploadClick}
              className="h-12 px-8 rounded-full font-bold text-base border-none"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.58 0.22 250), oklch(0.65 0.24 300))",
                color: "white",
              }}
              data-ocid="hero.upload.primary_button"
            >
              <Upload className="w-5 h-5 mr-2" />
              Start Uploading
            </Button>
            <div className="text-sm text-muted-foreground">
              {totalFiles > 0 ? (
                <span>
                  <strong className="text-foreground">{totalFiles}</strong>{" "}
                  files shared so far
                </span>
              ) : (
                <span>Be the first to upload!</span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
