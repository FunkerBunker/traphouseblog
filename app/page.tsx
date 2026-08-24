import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-5xl font-extrabold mb-4">Willkommen auf meinem Blog!</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
        Hier findest du aktuelle Beiträge rund um Tech, AI und Development.
      </p>
      <Link 
        href="/blog" 
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition"
      >
        Zum Blog →
      </Link>
    </main>
  );
}