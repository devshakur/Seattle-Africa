"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, X } from "lucide-react";

export interface AuthAlertProps {
    type: "success" | "error" | null;
    message: string | null;
    onClose?: () => void;
    showProgress?: boolean;
}

export function AuthAlert({
    type,
    message,
    onClose,
    showProgress = false,
}: AuthAlertProps) {
    if (!type || !message) return null;

    const isSuccess = type === "success";

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={`${type}-${message}`}
                role="status"
                aria-live="polite"
                initial={{ opacity: 0, y: -12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative overflow-hidden rounded-xl border border-zinc-900 bg-black text-white p-3.5 shadow-lg mb-5"
            >
                <div className="flex items-start gap-3">
                    <div className="shrink-0 mt-0.5">
                        {isSuccess ? (
                            <CheckCircle2 size={16} className="text-white stroke-[2.2]" />
                        ) : (
                            <AlertTriangle size={16} className="text-white stroke-[2.2]" />
                        )}
                    </div>

                    <div className="flex-1 text-xs font-medium leading-relaxed tracking-tight text-white">
                        {message}
                    </div>

                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="shrink-0 p-0.5 text-zinc-400 hover:text-white transition-colors"
                            aria-label="Dismiss alert"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Simulated redirection progress line for success state */}
                {isSuccess && showProgress && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-zinc-800 overflow-hidden">
                        <motion.div
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.8, ease: "linear" }}
                            className="h-full bg-white"
                        />
                    </div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}

