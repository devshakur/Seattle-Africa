import Link from "next/link";
import {
  ArrowUpRight,
  Globe2,
  LockKeyhole,
  ShieldCheck,
  CircleDollarSign,
} from "lucide-react";
import { BrandMark } from "./BrandMark";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "About us", href: "#about" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Exchange rates", href: "#rates" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "Send money", href: "#send-money" },
      { label: "Track transfer", href: "#track" },
      { label: "Supported countries", href: "#countries" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help center", href: "#support" },
      { label: "Contact us", href: "mailto:support@settleafrica.com" },
      { label: "FAQs", href: "#faq" },
    ],
  },
];

const trustItems = [
  { icon: LockKeyhole, label: "Security focused" },
  { icon: ShieldCheck, label: "Transparent transfers" },
  { icon: CircleDollarSign, label: "Upfront fees" },
  { icon: Globe2, label: "Cross-border payments" },
];

export function Footer() {
  return (
    <footer
      id="support"
      className="bg-gray-50 border-t border-gray-200"
    >
      <div className="container">

        {/* Main footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-12 lg:gap-16 py-14 lg:py-16">

          {/* Brand */}
          <div className="max-w-sm">
            <BrandMark />

            <p className="mt-5 text-sm leading-7 text-gray-500">
              Moving money across borders, made simpler.
              Experience a clearer, more convenient way to
              send and receive money with Settle Africa.
            </p>

            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 mt-5 text-sm font-semibold text-gray-950 hover:gap-3 transition-all"
            >
              Discover Settle Africa
              <ArrowUpRight size={16} />
            </Link>
          </div>

          {/* Navigation */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-bold text-gray-950 mb-5">
                {group.title}
              </h3>

              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-500 hover:text-gray-950 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </footer>
  );
}