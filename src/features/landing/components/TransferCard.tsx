import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

export function TransferCard() {
  return (
    <div className="transfer-card" aria-label="Illustrative money transfer calculator">
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
          <strong>$ 320.45</strong>
          <span className="currency">
            <span className="flag">🇺🇸</span> USD <ChevronDown size={14} />
          </span>
        </div>
      </div>
      <div className="transfer-meta">
        <span>Exchange rate</span>
        <strong>Indicative rate</strong>
      </div>
      <div className="transfer-meta">
        <span>Transfer fee</span>
        <strong>Shown before payment</strong>
      </div>
      <div className="transfer-meta">
        <span>Delivery estimate</span>
        <strong>Shown at checkout</strong>
      </div>
      <Link href="/send-money" className="card-button">
        Continue <ArrowRight size={15} />
      </Link>
      <p className="demo-note">Illustrative example — rates and fees may vary.</p>
    </div>
  );
}

