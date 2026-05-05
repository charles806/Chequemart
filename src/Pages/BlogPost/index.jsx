import { Link } from "react-router-dom";

export default function BlogPost() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-black text-gray-900 mb-4">
          Coming Soon
        </h1>
        <p className="text-gray-500 mb-6">
          We're working on something exciting. Check back soon for updates!
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-[#ff5252] text-white font-bold rounded-xl hover:bg-red-600 transition"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}