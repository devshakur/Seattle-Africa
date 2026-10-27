import { cn } from "@/libs/utils";

const notifications = [
    { title: "Transfer Updates", desc: "Get notified when your transfer status changes.", email: true, sms: true },
    { title: "Exchange Rate Alerts", desc: "Receive alerts when target exchange rates are hit.", email: true, sms: false },
    { title: "Login Alerts", desc: "Be notified of new logins to your account.", email: true, sms: true },
    { title: "Marketing & Promos", desc: "Receive offers, product updates, and news.", email: false, sms: false },
];

export function NotificationSettings() {
    return (
        <div className="space-y-8 animate-in fade-in duration-300">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-500 mt-1">Choose how you want to be notified about your account activity.</p>
            </div>

            <div className="space-y-4">
                {notifications.map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm">
                        <div>
                            <h3 className="text-sm font-bold text-gray-900">{item.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                        </div>

                        <div className="flex items-center gap-6">
                            {/* Email Toggle */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-500">Email</span>
                                <button className={cn(
                                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none",
                                    item.email ? "bg-black" : "bg-gray-200"
                                )}>
                                    <span className={cn(
                                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                        item.email ? "translate-x-4" : "translate-x-0"
                                    )} />
                                </button>
                            </div>

                            {/* SMS Toggle */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-medium text-gray-500">SMS</span>
                                <button className={cn(
                                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none",
                                    item.sms ? "bg-black" : "bg-gray-200"
                                )}>
                                    <span className={cn(
                                        "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                        item.sms ? "translate-x-4" : "translate-x-0"
                                    )} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}