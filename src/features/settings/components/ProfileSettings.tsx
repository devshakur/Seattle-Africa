"use client";

import { useRef, useState } from "react";
import { Camera, Loader2, CheckCircle2, User, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props {
    isSaving: boolean;
    onSave: () => void;
}

export function ProfileSettings({ isSaving, onSave }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadDone, setUploadDone] = useState(false);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset states
        setIsUploading(true);
        setUploadDone(false);
        setUploadProgress(0);

        // Read file for preview
        const reader = new FileReader();
        reader.onload = (ev) => {
            const src = ev.target?.result as string;

            // Simulate upload progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.floor(Math.random() * 18) + 8;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setUploadProgress(100);
                    setTimeout(() => {
                        setAvatarSrc(src);
                        setIsUploading(false);
                        setUploadDone(true);
                        setTimeout(() => setUploadDone(false), 2500);
                    }, 400);
                }
                setUploadProgress(progress);
            }, 120);
        };
        reader.readAsDataURL(file);

        // Reset the input so the same file can be re-uploaded
        e.target.value = "";
    };

    const handleRemove = () => {
        setAvatarSrc(null);
        setUploadDone(false);
        setUploadProgress(0);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-300">

            {/* Header */}
            <div>
                <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                <p className="text-sm text-gray-500 mt-1">Update your personal details and profile photo.</p>
            </div>

            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-6 pb-8 border-b border-gray-100">
                {/* Avatar preview + progress ring */}
                <div className="relative shrink-0 w-24 h-24">
                    {/* Progress ring overlay during upload */}
                    {isUploading && (
                        <svg
                            className="absolute inset-0 w-full h-full -rotate-90"
                            viewBox="0 0 96 96"
                        >
                            <circle
                                cx="48" cy="48" r="44"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="4"
                            />
                            <circle
                                cx="48" cy="48" r="44"
                                fill="none"
                                stroke="#000"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 44}`}
                                strokeDashoffset={`${2 * Math.PI * 44 * (1 - uploadProgress / 100)}`}
                                className="transition-all duration-150"
                            />
                        </svg>
                    )}

                    <div className={`w-24 h-24 rounded-full overflow-hidden border-2 ${isUploading ? "border-black/20" : "border-gray-200"} bg-gray-100 flex items-center justify-center`}>
                        {isUploading ? (
                            <div className="flex flex-col items-center gap-1">
                                <Loader2 size={22} className="text-black animate-spin" />
                                <span className="text-[10px] font-bold text-black">{uploadProgress}%</span>
                            </div>
                        ) : avatarSrc ? (
                            <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amina"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>

                    {/* Camera button (only when not uploading) */}
                    {!isUploading && (
                        <button
                            type="button"
                            onClick={handleUploadClick}
                            className="absolute bottom-0 right-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-gray-800 transition-colors"
                            aria-label="Upload profile photo"
                        >
                            <Camera size={14} />
                        </button>
                    )}
                </div>

                {/* Hidden file input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Upload info & actions */}
                <div className="flex flex-col justify-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">Profile Photo</h3>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF or WEBP. Max size 2 MB.</p>

                    {/* Upload progress bar */}
                    {isUploading && (
                        <div className="mt-1 w-48">
                            <div className="flex justify-between mb-1">
                                <span className="text-[11px] font-semibold text-gray-700">Uploading…</span>
                                <span className="text-[11px] font-bold text-black">{uploadProgress}%</span>
                            </div>
                            <div className="h-1.5 w-full rounded-full bg-gray-200 overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-black transition-all duration-150"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Success message */}
                    {uploadDone && !isUploading && (
                        <div className="flex items-center gap-1.5 text-[12px] font-semibold text-green-700">
                            <CheckCircle2 size={14} />
                            Photo updated successfully
                        </div>
                    )}

                    {!isUploading && (
                        <div className="flex gap-3 mt-1">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs rounded-lg"
                                onClick={handleUploadClick}
                            >
                                {avatarSrc ? "Change Photo" : "Upload Photo"}
                            </Button>
                            {avatarSrc && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-xs rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 gap-1"
                                    onClick={handleRemove}
                                >
                                    <Trash2 size={12} />
                                    Remove
                                </Button>
                            )}
                        </div>
                    )}
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
                    <p className="text-[11px] text-gray-400">Email cannot be changed. Contact support.</p>
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
                    rows={3}
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
