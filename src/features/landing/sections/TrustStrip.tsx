export function TrustStrip() {
  return (
    <section className="trust-strip border-y border-gray-100 bg-gray-50/60 py-9" aria-label="Platform principles">
      <div className="container">
        <p className="eyebrow text-xs sm:text-sm font-extrabold tracking-widest text-gray-600 uppercase mb-5 text-center sm:text-left">
          Designed for modern cross-border payments
        </p>
        <div className="trust-logos flex justify-between items-center gap-6 flex-wrap text-sm sm:text-base lg:text-lg font-extrabold text-gray-800">
          <span className="tracking-wide text-gray-950">PEOPLE</span>
          <span className="tracking-widest font-semibold text-gray-600">BUSINESSES</span>
          <span className="tracking-wide text-gray-950">FAMILIES</span>
          <span className="tracking-widest font-semibold text-gray-600">COMMUNITIES</span>
          <span className="tracking-wide text-gray-950">ACROSS AFRICA</span>
        </div>
      </div>
    </section>
  );
}
