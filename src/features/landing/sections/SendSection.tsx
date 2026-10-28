import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SendSection() {
  return (
    <section className="send-section bg-[#0a0a0b] text-white py-16 lg:py-20" id="send-money">
      <div className="container send-inner flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <p className="eyebrow eyebrow-light text-xs sm:text-sm font-extrabold tracking-widest text-gray-400 uppercase mb-3">
            Your next transfer starts here
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
            Make every transfer<br />feel more straightforward.
          </h2>
          <p className="text-base sm:text-lg text-gray-300 font-medium leading-relaxed max-w-xl">
            Review your route, compare the conversion and continue when you&apos;re ready.
          </p>
        </div>
        <Link href="/send-money" className="button button-light rounded-full px-8 py-4 bg-white text-black text-sm sm:text-base font-bold inline-flex items-center gap-2.5 hover:bg-gray-100 transition-colors shrink-0 shadow-lg">
          Get started <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
