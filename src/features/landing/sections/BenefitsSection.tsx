import { Globe2, RefreshCw, ShieldCheck, Zap } from "lucide-react";

export const benefits = [
  {
    icon: Zap,
    title: "Fast & reliable",
    text: "Transfers designed to reach your recipient quickly, without unnecessary complexity.",
  },
  {
    icon: RefreshCw,
    title: "Clear exchange rates",
    text: "See the rate, fees and recipient amount before you confirm your transfer.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & secure",
    text: "Security-first experiences help protect your account and transfer details.",
  },
  {
    icon: Globe2,
    title: "Across Africa",
    text: "A simpler way to move money between supported African markets.",
  },
];

export function BenefitsSection() {
  return (
    <section className="benefits section py-20" id="about">
      <div className="container">
        <div className="section-heading text-center max-w-2xl mx-auto mb-14">
          <p className="eyebrow text-xs sm:text-sm font-extrabold tracking-widest text-gray-600 uppercase mb-3">
            Why choose Seattle Africa
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-950 mb-4">
            More than just a transfer
          </h2>
          <p className="text-base sm:text-lg text-gray-700 font-medium leading-relaxed">
            We make international money transfers easier to understand, so you can focus on the people and plans that matter.
          </p>
        </div>

        <div className="benefit-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map(({ icon: Icon, title, text }) => (
            <article className="benefit-card bg-gray-50/70 border border-gray-100 rounded-2xl p-6 transition-transform hover:-translate-y-1" key={title}>
              <div className="icon-circle w-12 h-12 rounded-xl bg-white border border-gray-200 shadow-xs flex items-center justify-center mb-5 text-black">
                <Icon size={24} strokeWidth={2.2} />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-950 mb-2">
                {title}
              </h3>
              <p className="text-sm sm:text-[15px] font-medium text-gray-700 leading-relaxed">
                {text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
