"use client";

import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/libs/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: ReactNode;
    error?: string;
    hint?: string;
    tabular?: boolean;
    containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            containerClassName,
            label,
            icon,
            error,
            hint,
            tabular = false,
            id,
            required,
            ...props
        },
        ref
    ) => {
        const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
        const errorId = inputId ? `${inputId}-error` : undefined;
        const hintId = inputId ? `${inputId}-hint` : undefined;

        return (
            <div className={cn("flex flex-col w-full text-left", containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-xs font-semibold text-black tracking-tight mb-1.5 flex items-center justify-between"
                    >
                        <span>
                            {label}
                            {required && <span className="ml-1 text-zinc-400">*</span>}
                        </span>
                    </label>
                )}

                <div className="relative w-full">
                    <input
                        ref={ref}
                        id={inputId}
                        required={required}
                        aria-invalid={Boolean(error)}
                        aria-describedby={error ? errorId : hint ? hintId : undefined}
                        className={cn(
                            "flex h-11 w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-black placeholder:text-zinc-400 transition-colors duration-150 focus:outline-none focus:ring-1",
                            tabular && "font-tabular-nums tabular-nums font-mono tracking-tight",
                            error
                                ? "border-black ring-1 ring-black bg-zinc-50/40"
                                : "border-[#E5E5E5] hover:border-zinc-400 focus:border-black focus:ring-black",
                            icon && "pr-10",
                            "disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500",
                            className
                        )}
                        {...props}
                    />

                    {icon && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-zinc-500 hover:text-black transition-colors">
                            {icon}
                        </div>
                    )}
                </div>

                {error ? (
                    <p
                        id={errorId}
                        role="alert"
                        className="mt-1.5 flex items-center gap-1.5 text-[11px] font-mono font-medium text-black"
                    >
                        <AlertCircle size={13} className="shrink-0 stroke-[2.2]" />
                        <span>{error}</span>
                    </p>
                ) : hint ? (
                    <p id={hintId} className="mt-1.5 text-[11px] text-zinc-500">
                        {hint}
                    </p>
                ) : null}
            </div>
        );
    }
);

Input.displayName = "Input";

export { Input };
