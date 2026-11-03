import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

export function TransferCard() {
  return (
    <div className="transfer-card" aria-label="Illustrative African money transfer calculator">
      <div className="transfer-field">
        <span className="field-label">You send</span>
        <div className="field-main">
          <strong>₦ 500,000</strong>
          <span className="currency">
            <span className="flag">🇳🇬</span> NGN <ChevronDown size={14} />
          </span>
        </div>
      </div>
      <div className="transfer-field recipient-field">
        <span className="field-label">Recipient gets</span>
        <div className="field-main">
          <strong>R 5,471.65</strong>
          <span className="currency">
            <span className="flag">🇿🇦</span> ZAR <ChevronDown size={14} />
          </span>
        </div>
      </div>
      <div className="transfer-meta">
        <span>Exchange rate</span>
        <strong>1 ZAR ≈ ₦ 91.38</strong>
      </div>
      <div className="transfer-meta">
        <span>Transfer fee</span>
        <strong>Zero markup corridor</strong>
      </div>
      <div className="transfer-meta">
        <span>Delivery estimate</span>
        <strong>Instant Settlement</strong>
      </div>
      <Link href="/send-money" className="card-button">
        Continue <ArrowRight size={15} />
      </Link>
      <p className="demo-note">Real-time Pan-African settlement across 8 African corridors.</p>
    </div>
  );
}
