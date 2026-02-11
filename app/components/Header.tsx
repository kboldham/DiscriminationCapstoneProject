import Link from "next/link";

export default function Header() {
  return (
    <header className="p-4 bg-black text-white">
      <nav className="flex gap-6">
        <Link href="/">Home</Link>
        <Link href="/about">More Information</Link>
        <Link href="/report">SubmitReport</Link>
        <Link href="/educate">LearnMore</Link>
      </nav>
    </header>
  );
}
