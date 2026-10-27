import { SendMoneyFlow } from "@/features/send-money/page/index";

export const metadata = {
    title: "Send Money | Settle Africa",
};

export default function SendMoney() {
    return (
        <div className="animate-in fade-in duration-300">
            <SendMoneyFlow />
        </div>
    );
}