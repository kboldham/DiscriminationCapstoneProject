import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-8 py-4">
        
        {/* Logo / Brand */}
        <div className="text-xl font-semibold tracking-wide">
          SpeakEqual
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link href="/" className="px-4 py-2 border border-blue-400 rounded-lg text-sm font-medium hover:bg-blue-400 hover:text-gray-900 transition-colors">
            Home
          </Link>
          <Link href="/report" className="px-4 py-2 border border-blue-400 rounded-lg text-sm font-medium hover:bg-blue-400 hover:text-gray-900 transition-colors">
            Report
          </Link>
          <Link href="/educate" className="px-4 py-2 border border-blue-400 rounded-lg text-sm font-medium hover:bg-blue-400 hover:text-gray-900 transition-colors">
            Learn More
          </Link>
          <Link href="/about" className="px-4 py-2 border border-blue-400 rounded-lg text-sm font-medium hover:bg-blue-400 hover:text-gray-900 transition-colors">
            About Us
          </Link>
        </nav>
      </div>
    </header>
  );
}