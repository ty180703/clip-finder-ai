import ClipFinderForm from "@/components/ClipFinderForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-xl font-semibold tracking-tight">Clip Finder</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Turn long-form video transcripts into short-form clip ideas
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 py-12">
        <ClipFinderForm />
      </main>
    </div>
  );
}
