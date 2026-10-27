import Link from "next/link";

export function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 16L12 20L20 16V8L12 4L4 8V16Z" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 20V12" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 8L12 12L20 8" stroke="black" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-xl font-bold tracking-tight text-gray-900">Settle Africa</span>
        </Link>
    );
}