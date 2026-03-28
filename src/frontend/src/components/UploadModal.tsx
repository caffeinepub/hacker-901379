import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  CheckCircle,
  File,
  FileAudio,
  FileImage,
  FileVideo,
  Upload,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { getMediaType, useMediaStore } from "../hooks/useMediaStore";
import { useStorageClient } from "../hooks/useStorageClient";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type UploadState = "idle" | "uploading" | "success" | "error";

function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith("video/"))
    return (
      <FileVideo
        className="w-8 h-8"
        style={{ color: "oklch(0.58 0.22 250)" }}
      />
    );
  if (mimeType.startsWith("audio/"))
    return (
      <FileAudio
        className="w-8 h-8"
        style={{ color: "oklch(0.65 0.24 300)" }}
      />
    );
  if (mimeType.startsWith("image/"))
    return (
      <FileImage
        className="w-8 h-8"
        style={{ color: "oklch(0.72 0.19 145)" }}
      />
    );
  return <File className="w-8 h-8 text-muted-foreground" />;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface DropzoneProps {
  isDragging: boolean;
  onDrop: (e: React.DragEvent<HTMLLabelElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLLabelElement>) => void;
  onDragLeave: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFileChange: (file: File) => void;
}

function Dropzone({
  isDragging,
  onDrop,
  onDragOver,
  onDragLeave,
  inputRef,
  onFileChange,
}: DropzoneProps) {
  return (
    <label
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      className="border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-colors block"
      style={{
        borderColor: isDragging
          ? "oklch(0.58 0.22 250)"
          : "oklch(0.3 0.015 240)",
        background: isDragging
          ? "oklch(0.58 0.22 250 / 0.05)"
          : "oklch(0.14 0.01 240)",
      }}
      data-ocid="upload.dropzone"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*,audio/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileChange(f);
        }}
        data-ocid="upload.upload_button"
      />
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: "oklch(0.58 0.22 250 / 0.12)",
          border: "1px solid oklch(0.58 0.22 250 / 0.3)",
        }}
      >
        <Upload className="w-7 h-7" style={{ color: "oklch(0.68 0.2 250)" }} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">
          Drop your file here
        </p>
        <p className="text-xs text-muted-foreground mt-1">or click to browse</p>
      </div>
      <p className="text-xs text-muted-foreground">
        Videos, Photos, Audio accepted
      </p>
    </label>
  );
}

export function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { client } = useStorageClient();
  const { addItem } = useMediaStore();

  const handleFile = useCallback((file: File) => {
    const accepted =
      file.type.startsWith("image/") ||
      file.type.startsWith("video/") ||
      file.type.startsWith("audio/");
    if (!accepted) {
      setErrorMsg("Only images, videos, and audio files are supported.");
      setUploadState("error");
      return;
    }
    setSelectedFile(file);
    setUploadState("idle");
    setErrorMsg("");
    setProgress(0);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile],
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile || !client) return;
    setUploadState("uploading");
    setProgress(0);
    try {
      const bytes = new Uint8Array(await selectedFile.arrayBuffer());
      const { hash } = await client.putFile(bytes, (pct) => setProgress(pct));
      const url = await client.getDirectURL(hash);
      addItem(hash, selectedFile, url);
      setUploadState("success");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Upload failed. Please try again.",
      );
      setUploadState("error");
    }
  }, [selectedFile, client, addItem]);

  const reset = useCallback(() => {
    setSelectedFile(null);
    setUploadState("idle");
    setProgress(0);
    setErrorMsg("");
  }, []);

  const handleClose = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) reset();
      onOpenChange(isOpen);
    },
    [onOpenChange, reset],
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-md w-full rounded-2xl border-border/50 p-0 overflow-hidden"
        style={{
          background: "oklch(0.155 0.012 240)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
        }}
        data-ocid="upload.dialog"
      >
        <DialogHeader className="px-6 pt-6 pb-0">
          <DialogTitle className="text-xl font-bold">Upload Media</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6 pt-4">
          <AnimatePresence mode="wait">
            {uploadState === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-8"
                data-ocid="upload.success_state"
              >
                <CheckCircle
                  className="w-16 h-16"
                  style={{ color: "oklch(0.72 0.19 145)" }}
                />
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">
                    Upload Successful!
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedFile?.name} has been uploaded.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={reset}
                    className="rounded-xl"
                    data-ocid="upload.upload_more.button"
                  >
                    Upload More
                  </Button>
                  <Button
                    onClick={() => handleClose(false)}
                    className="rounded-xl border-none"
                    style={{
                      background: "oklch(0.58 0.22 250)",
                      color: "white",
                    }}
                    data-ocid="upload.done.button"
                  >
                    Done
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-5"
              >
                {!selectedFile && (
                  <Dropzone
                    isDragging={isDragging}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={() => setIsDragging(false)}
                    inputRef={fileInputRef}
                    onFileChange={handleFile}
                  />
                )}

                {selectedFile && (
                  <div
                    className="flex items-center gap-3 p-4 rounded-xl"
                    style={{
                      background: "oklch(0.14 0.01 240)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <FileIcon mimeType={selectedFile.type} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatSize(selectedFile.size)} ·{" "}
                        {getMediaType(selectedFile.type)}
                      </p>
                    </div>
                    {uploadState === "idle" && (
                      <button
                        type="button"
                        onClick={reset}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}

                {uploadState === "uploading" && (
                  <div className="space-y-2" data-ocid="upload.loading_state">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Uploading...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                {uploadState === "error" && (
                  <div
                    className="flex items-center gap-2 p-3 rounded-xl text-sm"
                    style={{
                      background: "oklch(0.62 0.22 25 / 0.12)",
                      border: "1px solid oklch(0.62 0.22 25 / 0.3)",
                      color: "oklch(0.75 0.18 25)",
                    }}
                    data-ocid="upload.error_state"
                  >
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>
                      {errorMsg || "Upload failed. Please try again."}
                    </span>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleClose(false)}
                    className="flex-1 rounded-xl"
                    data-ocid="upload.cancel.button"
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={
                      !selectedFile || uploadState === "uploading" || !client
                    }
                    onClick={handleUpload}
                    className="flex-1 rounded-xl font-semibold text-white border-none"
                    style={{ background: "oklch(0.58 0.22 250)" }}
                    data-ocid="upload.submit_button"
                  >
                    {uploadState === "uploading" ? "Uploading..." : "Upload"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
