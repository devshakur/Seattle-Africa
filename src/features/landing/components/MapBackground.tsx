export function MapBackground() {
    return (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] max-w-[1000px] pointer-events-none -z-10 flex items-center justify-center">
            <svg
                viewBox="0 0 800 800"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full opacity-60"
            >
                {/* Dotted Africa Map Approximation */}
                <path
                    d="M300 150 C 400 100, 550 150, 600 250 C 650 350, 550 500, 500 650 C 450 750, 350 700, 300 600 C 250 500, 200 400, 250 300 C 280 220, 250 180, 300 150 Z"
                    fill="transparent"
                    stroke="#d1d5db"
                    strokeWidth="1.5"
                    strokeDasharray="2 6"
                    strokeLinecap="round"
                />

                {/* Connection Nodes and Line */}
                {/* Node 1 */}
                <circle cx="400" cy="250" r="4" fill="#111827" />
                <circle cx="400" cy="250" r="8" fill="#111827" fillOpacity="0.1" />

                {/* Node 2 */}
                <circle cx="500" cy="450" r="4" fill="#111827" />
                <circle cx="500" cy="450" r="8" fill="#111827" fillOpacity="0.1" />

                {/* Curved connection line */}
                <path
                    d="M400 250 Q 450 350 500 450"
                    fill="transparent"
                    stroke="#9ca3af"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                />
            </svg>
        </div>
    );
}