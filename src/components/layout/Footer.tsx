export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-muted/20 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-sm text-muted md:flex-row md:justify-between">
        <p>© {year} TIMZEE. All rights reserved.</p>
        <a
          href="#top"
          data-cursor="magnetic"
          className="hover:text-foreground"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
