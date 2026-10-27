import { Search, Bell, Menu } from "lucide-react";

interface TopbarProps {
    onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 lg:px-10 sticky top-0 z-30">

            <div className="flex items-center gap-3 sm:gap-4 flex-1">
                {/* Mobile Hamburger Menu */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>

                {/* Search Bar */}
                <div className="flex items-center max-w-md w-full bg-gray-50/80 rounded-xl px-3 sm:px-4 py-2 border border-transparent focus-within:border-gray-200 focus-within:bg-white transition-all">
                    <Search size={18} className="text-gray-400 shrink-0 mr-2 sm:mr-3" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4 ml-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-black rounded-full border-2 border-white"></span>
                </button>
                <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer shrink-0">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amina" alt="User" className="w-full h-full object-cover" />
                </div>
            </div>
        </header>
    );
}