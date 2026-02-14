export default function Footer() {
  return (
    <footer className="border-t border-border/50 py-4 mt-auto">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <p>⚠ This tool provides estimates only. Not a substitute for professional occupational health guidance.</p>
        <div className="flex items-center gap-3">
          <span>{new Date().toLocaleDateString()}</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </footer>
  );
}
