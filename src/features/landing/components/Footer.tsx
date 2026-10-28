import Link from "next/link";
import { CircleDollarSign, Globe2, LockKeyhole, ShieldCheck } from "lucide-react";
import { BrandMark } from "./BrandMark";

export const trustItems = [
  { icon: LockKeyhole, text: "Security-first experience" },
  { icon: ShieldCheck, text: "Transparent transfer details" },
  { icon: CircleDollarSign, text: "Fees shown upfront" },
  { icon: Globe2, text: "Built for cross-border payments" },
];

export function Footer() {
  return (
    <footer className="footer bg-gray-50/70 border-t border-gray-200/80 pt-14 pb-10" id="support">
      <div className="container">
        {/* Top: Brand, Tagline, Navigation */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-10 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <BrandMark />
            <p className="text-sm sm:text-base font-semibold text-gray-700">
              Money moves better when everything is clear.
            </p>
          </div>
          <nav className="flex items-center gap-6 sm:gap-8 flex-wrap">
            <Link
              href="#about"
              className="text-sm sm:text-base font-bold text-gray-900 hover:text-black transition-colors"
            >
              About
            </Link>
            <Link
              href="#rates"
              className="text-sm sm:text-base font-bold text-gray-900 hover:text-black transition-colors"
            >
              Rates
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm sm:text-base font-bold text-gray-900 hover:text-black transition-colors"
            >
              How it works
            </Link>
            <Link
              href="mailto:support@seattleafrica.example"
              className="text-sm sm:text-base font-bold text-gray-900 hover:text-black transition-colors"
            >
              Support
            </Link>
          </nav>
        </div>

        {/* Security / Trust Row: Larger, bolder and clearly visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 py-9 border-b border-gray-200">
          {trustItems.map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex items-center gap-3.5 bg-white/80 border border-gray-200/90 rounded-xl px-4 py-3 shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                <Icon size={19} strokeWidth={2.4} />
              </div>
              <span className="text-sm sm:text-[15px] font-bold text-gray-950">
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom: Copyright & Legal Disclaimer */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pt-8 text-xs sm:text-sm font-semibold text-gray-600">
          <span>© {new Date().getFullYear()} Seattle Africa. All rights reserved.</span>
          <span className="max-w-xl text-gray-500">
            Transfer availability, fees and delivery times depend on the supported route.
          </span>
        </div>
      </div>
    </footer>
  );
}
