import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { TransferCard } from "../components/TransferCard";

export function HeroSection() {
  return (
    <section className="hero section pt-12 pb-16 lg:py-20" id="home">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow text-xs sm:text-sm font-extrabold tracking-widest text-gray-700 uppercase mb-4">
            International money transfers
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight text-gray-950 leading-[1.08] mb-6">
            Send money<br className="desktop-break" /> across Africa,<br className="desktop-break" /> with ease.
          </h1>
          <p className="hero-description text-base sm:text-lg lg:text-[19px] text-gray-700 leading-relaxed max-w-xl mb-8 font-medium">
            <strong className="text-gray-950 font-bold">Seattle Africa</strong> helps you send money across supported African markets. Review the conversion, understand the fees and know what your recipient should receive before you confirm.
          </p>
          <div className="hero-actions flex items-center gap-4 flex-wrap">
            <Link href="/send-money" className="button button-dark rounded-full px-7 py-3.5 bg-black text-white text-sm sm:text-base font-bold inline-flex items-center gap-2.5 shadow-md hover:bg-gray-800 transition-transform hover:-translate-y-0.5">
              Send money now <ArrowRight size={18} />
            </Link>
            <Link href="#how-it-works" className="button button-outline rounded-full px-7 py-3.5 bg-white border border-gray-300 text-gray-900 text-sm sm:text-base font-bold inline-flex items-center gap-2 hover:border-black transition-colors">
              See how it works
            </Link>
          </div>
          <div className="hero-proof flex items-center gap-2.5 text-xs sm:text-sm font-bold text-gray-800 mt-7">
            <span className="proof-icon w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-black shrink-0">
              <Check size={15} strokeWidth={3} />
            </span>
            <span>Clear rates. Upfront fees. More confidence.</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-wrap">
            <Image
              src="/hero-art.jpg"
              alt="A customer using her phone to review an international money transfer"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 55vw"
              className="hero-image"
            />
          </div>
          <div className="floating-card">
            <TransferCard />
          </div>
          <div className="hero-stamp font-bold text-xs sm:text-sm">
            <Sparkles size={18} className="text-black shrink-0" />
            <span>
              Move money<br />with clarity.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
