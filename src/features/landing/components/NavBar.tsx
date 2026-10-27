import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function Navbar() {
    return (
        <nav className="w-full py-5 border-b border-gray-100/50 backdrop-blur-sm fixed top-0 z-50 bg-white/80">
            <Container className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4 16L12 20L20 16V8L12 4L4 8V16Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M12 20V12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 8L12 12L20 8" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-xl font-bold tracking-tight text-gray-900">Settle Africa</span>
                </div>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-8">
                    {['Personal', 'Business', 'Developers', 'About'].map((item) => (
                        <Link key={item} href="#" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
                            {item}
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    <Link href="/login" className="hidden sm:block text-sm font-medium text-gray-900 hover:text-gray-600">
                        Log in
                    </Link>
                    <Button className="rounded-lg px-5 h-9 text-sm font-medium">Get started</Button>
                </div>
            </Container>
        </nav>
    );
}