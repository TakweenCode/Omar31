export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#F7F9FC]/90 backdrop-blur-md dark:border-slate-800 dark:bg-[#0F172A]/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        <a
          href="#top"
          className="font-display text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0 dark:text-white"
        >
          عمر · يوم الطفل العالمي
        </a>

        <nav
          aria-label="التنقل الرئيسي"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <a
            href="#wishes"
            className="hover:text-blue-600 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 dark:hover:text-blue-400"
          >
            الأمنيات
          </a>
          <a
            href="#dreams"
            className="hover:text-blue-600 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 dark:hover:text-blue-400"
          >
            أحلامي
          </a>
          <a
            href="#studio"
            className="hover:text-blue-600 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 dark:hover:text-blue-400"
          >
            استوديو البطاقة
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          <a
            href="#studio"
            className="inline-flex min-h-[42px] items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            اصنع بطاقتك
          </a>
        </div>
      </div>
    </header>
  );
}
