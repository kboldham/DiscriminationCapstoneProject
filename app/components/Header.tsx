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
        <nav className="flex items-center space-x-8 text-sm font-medium">
          <Link href="/" className="hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link href="/educate" className="hover:text-blue-400 transition-colors">
            Learn More
          </Link>
          <Link href="/report" className="hover:text-blue-400 transition-colors">
            Report
          </Link>
          <Link href="/about" className="hover:text-blue-400 transition-colors">
            About Us
          </Link>
        </nav>
      </div>
    </header>
  );
}