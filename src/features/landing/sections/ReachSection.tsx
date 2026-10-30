import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function ReachSection() {
  return (
    <section className="reach-section section py-20" id="rates">
      <div className="container reach-grid">
        <div className="reach-copy">
          <p className="eyebrow text-xs sm:text-sm font-extrabold tracking-widest text-gray-600 uppercase mb-3">
            Our reach
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 mb-4 leading-tight">
            Across Africa.<br />For Africa.
          </h2>
          <p className="text-base sm:text-lg text-gray-700 font-medium leading-relaxed mb-8 max-w-md">
            Bringing people and businesses closer with a simpler way to send money across borders.
          </p>
          <Link href="/send-money" className="button button-outline rounded-full px-7 py-3 bg-white border border-gray-300 text-gray-950 text-sm sm:text-base font-bold inline-flex items-center gap-2 hover:border-black transition-colors">
            Explore supported routes <ArrowRight size={17} />
          </Link>
        </div>

        <div className="africa-art" aria-label="Stylised map of Africa">
          <div className="africa-art mb-4" aria-label="Map of Africa">
            <Image
              src="/images/africa-map.svg"
              alt="Map of Africa"
              width={280}
              height={300}
              priority
            />

          </div>
          <span className="mt-4 map-caption font-bold text-xs sm:text-sm">
            Connected by possibility
          </span>
          <span className="map-caption font-bold text-xs sm:text-sm">Connected by possibility</span>
        </div>

        <div className="reach-stats">
          <div>
            <strong className="text-lg sm:text-xl font-extrabold text-gray-950">Local currencies</strong>
            <span className="text-sm sm:text-base font-semibold text-gray-700">Clear conversion before you confirm</span>
          </div>
          <div>
            <strong className="text-lg sm:text-xl font-extrabold text-gray-950">Across borders</strong>
            <span className="text-sm sm:text-base font-semibold text-gray-700">Transfers between supported markets</span>
          </div>
          <div>
            <strong className="text-lg sm:text-xl font-extrabold text-gray-950">Every step explained</strong>
            <span className="text-sm sm:text-base font-semibold text-gray-700">Know what happens next</span>
          </div>
        </div>

        <div className="city-card">
          <div className="city-skyline">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <p className="text-base sm:text-lg font-medium">
            One continent.<br />
            <strong className="text-lg sm:text-xl font-extrabold">More ways to connect.</strong>
          </p>
        </div>
      </div>
    </section>
  );
}
