import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
          <svg viewBox="0 0 280 300" role="img" aria-label="Abstract connected routes across Africa">
            <defs>
              <linearGradient id="africaFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f0f0f0" />
                <stop offset="100%" stopColor="#bdbdbd" />
              </linearGradient>
            </defs>
            <path
              d="M78 20 116 28 139 18 165 42 184 54 174 82 192 105 175 131 164 162 146 188 137 224 118 264 103 244 92 206 76 178 64 150 48 127 39 94 52 68 48 44Z"
              fill="url(#africaFill)"
              stroke="#d0d0d0"
              strokeWidth="1.5"
            />
            <path
              d="M52 68 118 93 174 82M39 94 92 124 192 105M48 127 115 152 164 162M64 150 103 184 146 188M76 178 118 206 137 224M116 28 115 93 115 152 118 206"
              fill="none"
              stroke="#fff"
              strokeWidth="2"
            />
            <path
              d="M62 112 Q103 83 145 130 T174 82M92 190 Q130 165 164 162"
              fill="none"
              stroke="#858585"
              strokeWidth="1.5"
              strokeDasharray="4 5"
            />
            <circle cx="115" cy="93" r="5" fill="#111" />
            <circle cx="145" cy="130" r="5" fill="#111" />
            <circle cx="103" cy="184" r="5" fill="#111" />
            <circle cx="174" cy="82" r="5" fill="#111" />
          </svg>
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
