import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
    isSaving: boolean;
    onSave: () => void;
}

export function ProfileSettings({ isSaving, onSave }: Props) {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">

            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                <p className="text-sm text-gray-500 mt-1">Update your personal details and public profile.</p>
            </div>

            {/* Avatar Section */}
            <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                        <img
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amina"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <button className="absolute bottom-0 right-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-gray-800 transition-colors">
                        <Camera size={14} />
                    </button>
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-900">Profile Photo</h3>
                    <p className="text-xs text-gray-500 mt-1 mb-3">PNG, JPG or GIF. Max size 2MB.</p>
                    <div className="flex gap-3">
                        <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg">Upload New</Button>
                        <Button variant="ghost" size="sm" className="h-8 text-xs rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50">Remove</Button>
                    </div>
                </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">First Name</label>
                    <input
                        type="text"
                        defaultValue="Amina"
                        className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5 transition-all"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                    <input
                        type="text"
                        defaultValue="Yusuf"
                        className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5 transition-all"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        type="email"
                        defaultValue="amina.yusuf@example.com"
                        className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm font-medium text-gray-500 cursor-not-allowed"
                        disabled
                    />
                    <p className="text-[11px] text-gray-400 mt-1">Email cannot be changed. Contact support.</p>
                </div>
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="tel"
                        defaultValue="+234 800 000 0000"
                        className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5 transition-all"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <textarea
                    rows={4}
                    defaultValue="Personal account holder at Settle Africa. Sending money across borders seamlessly."
                    className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm font-medium text-gray-900 focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5 transition-all resize-none"
                />
            </div>

            {/* Action Footer */}
            <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                <Button variant="outline" className="h-11 rounded-xl px-6">Cancel</Button>
                <Button
                    onClick={onSave}
                    disabled={isSaving}
                    className="h-11 rounded-xl px-8 bg-black text-white hover:bg-gray-800 transition-all"
                >
                    {isSaving ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>
        </div>
    );
}