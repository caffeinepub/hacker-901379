import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search, Upload } from "lucide-react";

interface HeaderProps {
  onUploadClick: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export function Header({
  onUploadClick,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-white/5"
      style={{
        background: "oklch(0.14 0.009 240 / 0.9)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-6">
        <div className="flex items-center gap-2 flex-shrink-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black text-white"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.58 0.22 250), oklch(0.65 0.24 300))",
            }}
          >
            H
          </div>
          <span className="text-foreground font-bold text-lg tracking-tight">
            Hacker
            <span className="text-muted-foreground font-normal">.901379</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-1 ml-2">
          {["Explore", "About"].map((link) => (
            <button
              type="button"
              key={link}
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md transition-colors"
              data-ocid={`nav.${link.toLowerCase()}.link`}
            >
              {link}
            </button>
          ))}
        </nav>

        <div className="flex-1 max-w-sm relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-secondary border-border/50 text-sm h-9"
            data-ocid="header.search_input"
          />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <Button
            onClick={onUploadClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-sm h-9 px-4 rounded-full"
            data-ocid="header.upload.button"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <Bell className="w-5 h-5" />
          </button>
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-secondary text-xs font-bold">
              U
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
