export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const utmUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer
      className="mt-24 border-t border-white/5 py-10"
      style={{ background: "oklch(0.13 0.009 240)" }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
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
                <span className="text-muted-foreground font-normal">
                  .901379
                </span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-[220px]">
              Share videos, photos, and audio with the world. Free forever.
            </p>
          </div>
          <div className="flex gap-16">
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
                Platform
              </p>
              <ul className="space-y-3">
                {["Explore", "Upload", "About"].map((link) => (
                  <li key={link}>
                    <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
                Legal
              </p>
              <ul className="space-y-3">
                {["Terms", "Privacy"].map((link) => (
                  <li key={link}>
                    <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {year} Hacker.901379. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with ❤️ using{" "}
            <a
              href={utmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground underline transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
