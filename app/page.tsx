import ClipFinderForm from "@/components/ClipFinderForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <header className="border-b border-slate-200 px-4 py-5 md:px-6">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-bold tracking-tight text-accent-800">✂️ Clip Finder</h1>
          <p className="mt-1 text-sm text-slate-600">
            Turn long-form video transcripts into short-form clip ideas
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <div className="rounded-lg bg-white p-6 shadow-sm md:p-8">
          <ClipFinderForm />
        </div>
      </main>
      <footer className="mx-auto max-w-3xl px-4 pb-10 text-center text-sm text-slate-500 md:px-6">
        Built with Next.js, Claude, and Tailwind.{" "}
        <a
          href="https://github.com/ty180703/clip-finder-ai"
          className="hover:underline"
        >
          View source on GitHub
        </a>
        .
      </footer>
    </div>
  );
}
