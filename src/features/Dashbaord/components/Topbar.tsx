import { Search, Bell } from "lucide-react";

export function Topbar() {
    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-10">
            {/* Search Bar */}
            <div className="flex items-center max-w-md w-full bg-gray-50/80 rounded-xl px-4 py-2 border border-transparent focus-within:border-gray-200 focus-within:bg-white transition-all">
                <Search size={18} className="text-gray-400 mr-3" />
                <input
                    type="text"
                    placeholder="Search transactions, recipients, or country..."
                    className="w-full bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400"
                />
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-4">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
                    <Bell size={20} />
                    {/* Notification dot */}
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center overflow-hidden cursor-pointer">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amina" alt="User" className="w-full h-full object-cover" />
                </div>
            </div>
        </header>
    );
}