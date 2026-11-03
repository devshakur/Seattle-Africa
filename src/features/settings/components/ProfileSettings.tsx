"use client";

import { useRef, useState, useMemo } from "react";
import { Camera, Loader2, CheckCircle2, ShieldCheck, Trash2, Mail, Phone, MapPin, Globe } from "lucide-react";
import { toast } from "react-toastify";
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

    // Profile field states
    const [firstName, setFirstName] = useState("Abdulshakur");
    const [lastName, setLastName] = useState("Dauda");
    const [email, setEmail] = useState("devshakur@settleafrica.com");
    const [phone, setPhone] = useState("+234 803 123 4567");
    const [country, setCountry] = useState("Nigeria");
    const [city, setCity] = useState("Lagos, Victoria Island");
    const [bio, setBio] = useState(
        "Individual account holder at Settle Africa. Managing pan-African remittance and supplier payments."
    );

    // Extract first initial of first and last name
    const initials = useMemo(() => {
        const first = firstName.trim().charAt(0) || "";
        const last = lastName.trim().charAt(0) || "";
        return `${first}${last}`.toUpperCase() || "SA";
    }, [firstName, lastName]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);

        const reader = new FileReader();
        reader.onload = (ev) => {
            const src = ev.target?.result as string;

            let progress = 0;
            const interval = setInterval(() => {
                progress += 25;
                if (progress >= 100) {
                    clearInterval(interval);
                    setAvatarSrc(src);
                    setIsUploading(false);
                    toast.success("Profile photo updated successfully!");
                }
                setUploadProgress(Math.min(progress, 100));
            }, 100);
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    const handleRemove = () => {
        setAvatarSrc(null);
        toast.info("Reverted to name initials avatar.");
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave();
        toast.success("Profile changes saved successfully!");
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-8 animate-in fade-in duration-300">
            {/* Profile Avatar Section */}
            <div className="rounded-2xl border border-gray-200/90 bg-gray-50/60 p-6 sm:p-7 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {/* Avatar with Initials */}
                <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-2xl bg-black text-white flex items-center justify-center font-mono font-bold text-3xl shadow-sm border-2 border-white ring-4 ring-black/5 select-none overflow-hidden">
                        {isUploading ? (
                            <div className="flex flex-col items-center gap-1">
                                <Loader2 size={24} className="animate-spin text-white" />
                                <span className="text-[10px] font-mono">{uploadProgress}%</span>
                            </div>
                        ) : avatarSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="tracking-tight">{initials}</span>
                        )}
                    </div>

                    {/* Camera Upload Button */}
                    {!isUploading && (
                        <button
                            type="button"
                            onClick={handleUploadClick}
                            className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-white text-black hover:bg-black hover:text-white rounded-full flex items-center justify-center border border-gray-200 shadow-md transition-colors"
                            title="Upload custom photo"
                            aria-label="Upload custom photo"
                        >
                            <Camera size={14} />
                        </button>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />

                {/* Avatar Info & Controls */}
                <div className="space-y-2 text-center sm:text-left flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="text-base font-bold text-gray-950">
                            {firstName} {lastName}
                        </h3>
                        <span className="inline-flex items-center gap-1 self-center sm:self-auto rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-semibold">
                            <ShieldCheck size={12} />
                            Tier 2 Verified
                        </span>
                    </div>

                    <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                        Avatar displays your name initials (<span className="font-mono font-bold text-black">{initials}</span>) by default. You can upload an optional profile photo.
                    </p>

                    <div className="flex items-center justify-center sm:justify-start gap-2.5 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs rounded-lg border-gray-200 font-semibold"
                            onClick={handleUploadClick}
                        >
                            {avatarSrc ? "Change Photo" : "Upload Custom Photo"}
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
                                Use Initials
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Form Fields in Clean Fintech Grid */}
            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-bold text-gray-950">Legal & Personal Details</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Your registered identity on Settle Africa compliance rails.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* First Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-black tracking-tight">
                            First Name
                        </label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
                        />
                    </div>

                    {/* Last Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-black tracking-tight">
                            Last Name
                        </label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
                        />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-semibold text-black tracking-tight flex items-center gap-1.5">
                                <Mail size={13} className="text-gray-400" />
                                Email Address
                            </label>
                            <span className="text-[10px] font-mono text-emerald-600 font-bold uppercase">
                                Verified
                            </span>
                        </div>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50/80 px-3.5 text-sm font-mono text-gray-600 cursor-not-allowed"
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-black tracking-tight flex items-center gap-1.5">
                            <Phone size={13} className="text-gray-400" />
                            Mobile Phone Number
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-mono text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
                        />
                    </div>

                    {/* Country of Residence */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-black tracking-tight flex items-center gap-1.5">
                            <Globe size={13} className="text-gray-400" />
                            Primary Country
                        </label>
                        <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
                        />
                    </div>

                    {/* City / State */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-black tracking-tight flex items-center gap-1.5">
                            <MapPin size={13} className="text-gray-400" />
                            City / Address
                        </label>
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full h-11 rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors"
                        />
                    </div>
                </div>

                {/* Bio / Description */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-black tracking-tight">
                        Account Description / Purpose
                    </label>
                    <textarea
                        rows={3}
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-white p-3.5 text-sm font-medium text-gray-900 focus:border-black focus:outline-none focus:ring-1 focus:ring-black transition-colors resize-none leading-relaxed"
                    />
                </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                    Changes are synchronized across African correspondent clearing rails.
                </span>
                <Button
                    type="submit"
                    disabled={isSaving}
                    className="h-11 rounded-xl px-7 bg-black text-white hover:bg-zinc-800 text-sm font-semibold transition-all flex items-center gap-2 shadow-xs"
                >
                    {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
                    <span>{isSaving ? "Saving changes..." : "Save Changes"}</span>
                </Button>
            </div>
        </form>
    );
}
