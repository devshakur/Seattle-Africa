import Image from "next/image";
import Link from "next/link";

export function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2">
            <Image
                src="/images/settle-logo.png"
                alt="Settle Africa logo"
                width={32}
                height={32}
                priority
                className="object-contain"
            />

            <span className="text-xl font-bold tracking-tight text-gray-900">
                Settle Africas
            </span>
        </Link>
    );
}