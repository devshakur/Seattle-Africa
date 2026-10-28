import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { BrandMark } from "./BrandMark";

export function NavBar() {
  return (
    <header className="site-header sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="container nav-wrap flex items-center justify-between h-[76px]">
        <BrandMark />

        <nav className="desktop-nav hidden md:flex items-center gap-8 ml-8" aria-label="Main navigation">
          <Link
            href="#send-money"
            className="text-[15px] font-semibold text-gray-800 hover:text-black transition-colors"
          >
            Send money
          </Link>
          <Link
            href="#rates"
            className="text-[15px] font-semibold text-gray-800 hover:text-black transition-colors"
          >
            Rates
          </Link>
          <Link
            href="#support"
            className="text-[15px] font-semibold text-gray-800 hover:text-black transition-colors"
          >
            Support
          </Link>
          <Link
            href="#about"
            className="text-[15px] font-semibold text-gray-800 hover:text-black transition-colors"
          >
            About
          </Link>
        </nav>

        <div className="nav-actions flex items-center gap-5">
          <Link
            href="/login"
            className="login-link text-[15px] font-semibold text-gray-900 hover:text-black transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="button button-dark button-small rounded-full px-5 py-2.5 bg-black text-white text-[13px] font-bold inline-flex items-center gap-2 hover:bg-gray-800 transition-colors"
          >
            Get started <ArrowRight size={15} />
          </Link>
        </div>

        <details className="mobile-menu md:hidden">
          <summary aria-label="Open navigation" className="cursor-pointer p-2">
            <Menu size={24} />
          </summary>
          <nav className="absolute right-4 top-16 bg-white border border-gray-200 rounded-2xl p-4 shadow-xl flex flex-col gap-3 min-w-[200px] z-50">
            <Link href="#send-money" className="text-base font-semibold text-gray-900 py-1">
              Send money
            </Link>
            <Link href="#rates" className="text-base font-semibold text-gray-900 py-1">
              Rates
            </Link>
            <Link href="#support" className="text-base font-semibold text-gray-900 py-1">
              Support
            </Link>
            <Link href="#about" className="text-base font-semibold text-gray-900 py-1">
              About
            </Link>
            <hr className="border-gray-100 my-1" />
            <Link href="/login" className="text-base font-semibold text-gray-900 py-1">
              Log in
            </Link>
            <Link href="/signup" className="text-base font-bold text-black py-1">
              Sign up
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
