import Link from "next/link";
import { ArrowDownLeft, ArrowRight, ArrowUpRight } from "lucide-react";

export const steps = [
  {
    title: "Enter transfer details",
    text: "Choose where you're sending from, your destination and the amount.",
  },
  {
    title: "Review the conversion",
    text: "See the exchange rate, fees and the amount your recipient should receive.",
  },
  {
    title: "Send with confidence",
    text: "Confirm the details and follow your transfer until it reaches its destination.",
  },
];

export function HowItWorksSection() {
  return (
    <section className="how-section section bg-[#090a0b] text-white py-20 overflow-hidden" id="how-it-works">
      <div className="container how-grid">
        <div className="how-copy">
          <p className="eyebrow eyebrow-light text-xs sm:text-sm font-extrabold tracking-widest text-gray-300 uppercase mb-3">
            Simple steps
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4">
            How it works
          </h2>
          <p className="how-intro text-base sm:text-lg text-gray-300 font-medium leading-relaxed max-w-lg mb-8">
            A clear, guided process from the first detail to the final confirmation.
          </p>

          <div className="steps flex flex-col gap-6 mb-10">
            {steps.map((step, index) => (
              <article className="step flex items-start gap-4" key={step.title}>
                <div className="step-number w-9 h-9 rounded-full bg-white text-black font-extrabold text-sm flex items-center justify-center shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-[15px] font-medium text-gray-300 leading-relaxed max-w-md">
                    {step.text}
                  </p>
                </div>
              </article>
            ))}
          </div>

          <Link href="/send-money" className="button button-light rounded-full px-7 py-3.5 bg-white text-black text-sm sm:text-base font-bold inline-flex items-center gap-2 hover:bg-gray-100 transition-colors">
            Start a transfer <ArrowRight size={17} />
          </Link>
        </div>

        <div className="phone-scene">
          <div className="scene-orbit orbit-one" />
          <div className="scene-orbit orbit-two" />
          <div className="mini-person mini-person-left">
            <span className="person-avatar avatar-one">A</span>
            <strong>Sender</strong>
            <small>Choose amount</small>
          </div>
          <div className="phone">
            <div className="phone-notch" />
            <div className="phone-top">
              <ArrowDownLeft size={17} />
              <span>Send money</span>
              <span>•••</span>
            </div>
            <p className="phone-label">You send</p>
            <div className="phone-amount">
              ₦ 500,000 <span>🇳🇬</span>
            </div>
            <div className="phone-divider" />
            <p className="phone-label">Recipient gets</p>
            <div className="phone-amount">
              $ 320.45 <span>🇺🇸</span>
            </div>
            <div className="phone-rate">Rate and fees shown before you pay</div>
            <div className="phone-cta">
              Review transfer <ArrowRight size={13} />
            </div>
          </div>
          <div className="mini-person mini-person-right">
            <span className="person-avatar avatar-two">K</span>
            <strong>Recipient</strong>
            <small>Receive locally</small>
          </div>
          <div className="route-label">
            <ArrowUpRight size={16} /> Across borders
          </div>
        </div>
      </div>
    </section>
  );
}
