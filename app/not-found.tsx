import Link from "next/link";

function NotFound() {
  return (
    <main className="text-center space-y-6 mt-4 h-[calc(100vh-200px)] flex flex-col justify-center items-center">
      <h1 className="text-3xl font-semibold">
        This page could not be found 
      </h1>
      <Link href="/" className="inline-block bg-orange-400 text-white rounded-2xl px-6 py-3 text-lg">
        Go back home
      </Link>
    </main>
  );
}

export default NotFound;
