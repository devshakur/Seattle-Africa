"use client";

/**
 * Select — reusable custom dropdown for Settle Africa
 *
 * Two exports:
 *  1. <Select>          — full custom dropdown with search, icons, groups, keyboard nav
 *  2. <NativeSelect>    — lightweight styled <select> wrapper (great for compact/inline uses)
 *
 * Usage – Select:
 *   <Select
 *     label="Destination Country"
 *     placeholder="Choose a country"
 *     value={country}
 *     onChange={setCountry}
 *     leadingIcon={<Globe2 size={16} />}
 *     options={[
 *       { value: "ng", label: "Nigeria", description: "NGN", icon: "🇳🇬" },
 *       { value: "ke", label: "Kenya",   description: "KES", icon: "🇰🇪" },
 *     ]}
 *   />
 *
 * Usage — NativeSelect:
 *   <NativeSelect label="Per page" value={n} onChange={e => setN(+e.target.value)}>
 *     <option value={5}>5</option>
 *     <option value={10}>10</option>
 *   </NativeSelect>
 */

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
    ReactNode,
    SelectHTMLAttributes,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/libs/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SelectOption {
    /** Stored value — passed back via onChange */
    value: string;
    /** Display label */
    label: string;
    /** Optional small text shown below the label */
    description?: string;
    /** Emoji, country flag, or any short string rendered as an icon */
    icon?: string;
    /** Custom React node rendered as the leading icon (overrides `icon`) */
    leadingNode?: ReactNode;
    /** Whether this option is disabled */
    disabled?: boolean;
}

export interface SelectGroup {
    /** Group heading shown above options */
    groupLabel: string;
    options: SelectOption[];
}

type SelectItem = SelectOption | SelectGroup;

function isGroup(item: SelectItem): item is SelectGroup {
    return "groupLabel" in item;
}

// flatten helpers
function flatOptions(items: SelectItem[]): SelectOption[] {
    return items.flatMap((item) => (isGroup(item) ? item.options : [item]));
}

// ---------------------------------------------------------------------------
// Context — passes open/close down to sub-components if needed
// ---------------------------------------------------------------------------

interface SelectCtx {
    open: boolean;
    toggle: () => void;
    close: () => void;
}
const Ctx = createContext<SelectCtx>({ open: false, toggle: () => {}, close: () => {} });

// ---------------------------------------------------------------------------
// Main Select
// ---------------------------------------------------------------------------

export interface SelectProps {
    /** Current value (controlled) */
    value?: string;
    /** Called with new value when user picks an option */
    onChange?: (value: string) => void;

    /** Flat list of options OR grouped options */
    options: SelectItem[];

    label?: string;
    placeholder?: string;
    hint?: string;
    error?: string;

    /** Icon rendered inside the trigger, on the left */
    leadingIcon?: ReactNode;

    /** Whether the trigger is disabled */
    disabled?: boolean;

    /** Whether to show an inline search box inside the dropdown */
    searchable?: boolean;
    searchPlaceholder?: string;

    /** Whether the dropdown allows clearing the selection (shows an × button) */
    clearable?: boolean;

    /** Additional class on the outer wrapper */
    className?: string;

    /** Additional class on the trigger button */
    triggerClassName?: string;

    /** Additional class on the dropdown panel */
    panelClassName?: string;

    /** Max height of the list area (default 260px) */
    listMaxHeight?: number;

    /** id for a11y wiring */
    id?: string;
}

export function Select({
    value,
    onChange,
    options,
    label,
    placeholder = "Select an option",
    hint,
    error,
    leadingIcon,
    disabled = false,
    searchable = false,
    searchPlaceholder = "Search…",
    clearable = false,
    className,
    triggerClassName,
    panelClassName,
    listMaxHeight = 260,
    id: externalId,
}: SelectProps) {
    const autoId = useId();
    const inputId = externalId ?? autoId;

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [highlightIdx, setHighlightIdx] = useState<number>(-1);

    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});

    // ── find selected option ──────────────────────────────────────────────
    const allFlat = flatOptions(options);
    const selected = allFlat.find((o) => o.value === value);

    // ── filter options by query ───────────────────────────────────────────
    const filtered: SelectItem[] = query.trim()
        ? options
              .map((item) => {
                  if (isGroup(item)) {
                      const matched = item.options.filter((o) =>
                          `${o.label} ${o.description ?? ""}`.toLowerCase().includes(query.toLowerCase())
                      );
                      return matched.length ? { groupLabel: item.groupLabel, options: matched } : null;
                  }
                  return `${item.label} ${item.description ?? ""}`
                      .toLowerCase()
                      .includes(query.toLowerCase())
                      ? item
                      : null;
              })
              .filter(Boolean) as SelectItem[]
        : options;

    const filteredFlat = flatOptions(filtered);

    // ── position panel below trigger ──────────────────────────────────────
    const reposition = useCallback(() => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const panelHeight = Math.min(listMaxHeight + (searchable ? 52 : 0) + 16, 360);
        const above = spaceBelow < panelHeight && spaceAbove > spaceBelow;

        setPanelStyle({
            position: "fixed",
            width: rect.width,
            left: rect.left,
            ...(above
                ? { bottom: window.innerHeight - rect.top + 4 }
                : { top: rect.bottom + 4 }),
            zIndex: 9999,
        });
    }, [listMaxHeight, searchable]);

    // ── open / close ──────────────────────────────────────────────────────
    const openDropdown = () => {
        if (disabled) return;
        reposition();
        setOpen(true);
        setQuery("");
        setHighlightIdx(-1);
        requestAnimationFrame(() => searchRef.current?.focus());
    };
    const close = () => {
        setOpen(false);
        setQuery("");
        setHighlightIdx(-1);
        triggerRef.current?.focus();
    };
    const toggle = () => (open ? close() : openDropdown());

    // ── close on outside click / escape ──────────────────────────────────
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (
                !triggerRef.current?.contains(e.target as Node) &&
                !panelRef.current?.contains(e.target as Node)
            ) {
                close();
            }
        };
        const keyHandler = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("keydown", keyHandler);
        window.addEventListener("resize", reposition);
        window.addEventListener("scroll", reposition, true);
        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("keydown", keyHandler);
            window.removeEventListener("resize", reposition);
            window.removeEventListener("scroll", reposition, true);
        };
    }, [open, reposition]);

    // ── keyboard navigation ───────────────────────────────────────────────
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open) {
            if (["ArrowDown", "ArrowUp", " ", "Enter"].includes(e.key)) {
                e.preventDefault();
                openDropdown();
            }
            return;
        }
        const enabledFlat = filteredFlat.filter((o) => !o.disabled);
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIdx((i) => Math.min(i + 1, enabledFlat.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIdx((i) => Math.max(i - 1, 0));
        } else if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            const opt = enabledFlat[highlightIdx];
            if (opt) pick(opt.value);
        }
    };

    const pick = (val: string) => {
        onChange?.(val);
        close();
    };

    const clear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange?.("");
    };

    // ── render helpers ────────────────────────────────────────────────────
    const renderOption = (opt: SelectOption, flatIdx: number) => {
        const isSelected = opt.value === value;
        const isHighlighted = filteredFlat.filter((o) => !o.disabled).indexOf(opt) === highlightIdx;

        return (
            <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={opt.disabled}
                onClick={() => pick(opt.value)}
                onMouseEnter={() =>
                    setHighlightIdx(
                        filteredFlat.filter((o) => !o.disabled).indexOf(opt)
                    )
                }
                className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                    "focus:outline-none disabled:cursor-not-allowed disabled:opacity-40",
                    isHighlighted && !isSelected && "bg-gray-100",
                    isSelected
                        ? "bg-black text-white"
                        : "text-gray-800 hover:bg-gray-100"
                )}
            >
                {/* Leading icon / emoji */}
                {(opt.leadingNode || opt.icon) && (
                    <span
                        className={cn(
                            "shrink-0 text-base leading-none",
                            isSelected ? "text-white" : "text-gray-500"
                        )}
                    >
                        {opt.leadingNode ?? opt.icon}
                    </span>
                )}

                {/* Label + description */}
                <span className="flex-1 min-w-0">
                    <span className="block truncate font-medium">{opt.label}</span>
                    {opt.description && (
                        <span
                            className={cn(
                                "block truncate text-[11px] mt-0.5",
                                isSelected ? "text-white/70" : "text-gray-400"
                            )}
                        >
                            {opt.description}
                        </span>
                    )}
                </span>

                {/* Check mark */}
                {isSelected && (
                    <Check size={14} className="shrink-0 text-white" strokeWidth={2.5} />
                )}
            </button>
        );
    };

    const panel = open && (
        <div
            ref={panelRef}
            role="listbox"
            aria-labelledby={`${inputId}-label`}
            style={panelStyle}
            className={cn(
                "overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-black/10",
                "animate-in fade-in zoom-in-95 duration-150",
                panelClassName
            )}
        >
            {/* Search */}
            {searchable && (
                <div className="border-b border-gray-100 p-2">
                    <div className="relative">
                        <Search
                            size={14}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />
                        <input
                            ref={searchRef}
                            type="text"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setHighlightIdx(-1);
                            }}
                            placeholder={searchPlaceholder}
                            className="h-9 w-full rounded-lg bg-gray-50 border border-gray-200 pl-8 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-black focus:ring-2 focus:ring-black/5"
                        />
                    </div>
                </div>
            )}

            {/* Options list */}
            <div
                className="overflow-y-auto p-1.5 space-y-0.5"
                style={{ maxHeight: listMaxHeight }}
            >
                {filtered.length === 0 ? (
                    <p className="py-6 text-center text-sm text-gray-400">No results found</p>
                ) : (
                    filtered.map((item, gi) =>
                        isGroup(item) ? (
                            <div key={`g-${gi}`}>
                                <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                    {item.groupLabel}
                                </p>
                                {item.options.map((opt, oi) =>
                                    renderOption(opt, gi * 100 + oi)
                                )}
                            </div>
                        ) : (
                            renderOption(item, gi)
                        )
                    )
                )}
            </div>
        </div>
    );

    return (
        <Ctx.Provider value={{ open, toggle, close }}>
            <div className={cn("flex flex-col gap-1.5 w-full", className)}>
                {/* Label */}
                {label && (
                    <label
                        id={`${inputId}-label`}
                        htmlFor={inputId}
                        className="text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                        {label}
                    </label>
                )}

                {/* Trigger */}
                <button
                    ref={triggerRef}
                    id={inputId}
                    type="button"
                    role="combobox"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    aria-controls={`${inputId}-panel`}
                    aria-labelledby={label ? `${inputId}-label` : undefined}
                    disabled={disabled}
                    onClick={toggle}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        "relative flex h-11 w-full items-center gap-2.5 rounded-xl border bg-white px-3.5 text-sm text-left",
                        "transition-all focus:outline-none focus-visible:ring-4 focus-visible:ring-black/5",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        open
                            ? "border-black ring-4 ring-black/5"
                            : error
                            ? "border-red-400 ring-4 ring-red-400/10"
                            : "border-gray-200 hover:border-gray-300",
                        triggerClassName
                    )}
                >
                    {/* Leading icon */}
                    {leadingIcon && (
                        <span className="shrink-0 text-gray-400">{leadingIcon}</span>
                    )}

                    {/* Value / placeholder */}
                    <span className="flex flex-1 min-w-0 items-center gap-2 overflow-hidden">
                        {selected ? (
                            <>
                                {(selected.leadingNode || selected.icon) && (
                                    <span className="shrink-0 text-base leading-none">
                                        {selected.leadingNode ?? selected.icon}
                                    </span>
                                )}
                                <span className="truncate font-medium text-gray-900">
                                    {selected.label}
                                </span>
                            </>
                        ) : (
                            <span className="truncate text-gray-400">{placeholder}</span>
                        )}
                    </span>

                    {/* Clear button */}
                    {clearable && value && (
                        <button
                            type="button"
                            onClick={clear}
                            className="shrink-0 rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
                            aria-label="Clear selection"
                        >
                            <X size={13} />
                        </button>
                    )}

                    {/* Chevron */}
                    <ChevronDown
                        size={16}
                        className={cn(
                            "shrink-0 text-gray-400 transition-transform duration-200",
                            open && "rotate-180"
                        )}
                    />
                </button>

                {/* Hint / Error */}
                {(hint || error) && (
                    <p className={cn("text-[11px]", error ? "text-red-500" : "text-gray-400")}>
                        {error ?? hint}
                    </p>
                )}
            </div>

            {/* Portal dropdown panel */}
            {typeof window !== "undefined" &&
                createPortal(
                    <div id={`${inputId}-panel`}>{panel}</div>,
                    document.body
                )}
        </Ctx.Provider>
    );
}

// ---------------------------------------------------------------------------
// NativeSelect — thin wrapper around <select> for simple/compact cases
// ---------------------------------------------------------------------------

export interface NativeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    hint?: string;
    error?: string;
    leadingIcon?: ReactNode;
    /** Additional class on the outer wrapper */
    wrapperClassName?: string;
}

export function NativeSelect({
    label,
    hint,
    error,
    leadingIcon,
    wrapperClassName,
    className,
    id: externalId,
    children,
    disabled,
    ...rest
}: NativeSelectProps) {
    const autoId = useId();
    const inputId = externalId ?? autoId;

    return (
        <div className={cn("flex flex-col gap-1.5 w-full", wrapperClassName)}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="text-xs font-semibold uppercase tracking-wider text-gray-500"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {leadingIcon && (
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                        {leadingIcon}
                    </span>
                )}

                <select
                    id={inputId}
                    disabled={disabled}
                    className={cn(
                        "h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pr-9 text-sm font-medium text-gray-900",
                        "transition-all focus:border-black focus:outline-none focus:ring-4 focus:ring-black/5",
                        "hover:border-gray-300",
                        "disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400",
                        error && "border-red-400 focus:ring-red-400/10",
                        leadingIcon ? "pl-10" : "pl-4",
                        className
                    )}
                    {...rest}
                >
                    {children}
                </select>

                {/* Custom chevron (hides browser default arrow via appearance-none) */}
                <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
            </div>

            {(hint || error) && (
                <p className={cn("text-[11px]", error ? "text-red-500" : "text-gray-400")}>
                    {error ?? hint}
                </p>
            )}
        </div>
    );
}

