import Link from "next/link";
import Image from "next/image"

export function BrandMark() {
  return (
    <Link
      href="/"
      className="brand inline-flex items-center gap-2.5 font-bold text-lg sm:text-xl tracking-tight text-gray-950"
      aria-label="Seattle Africa home"
    >
      <Image src="/images/settle-logo.png" alt="Settle Africa logo" width={62} height={62} priority className="object-contain" />
      <span>Seattle Africa</span>
    </Link>
  );
}
