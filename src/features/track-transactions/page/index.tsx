"use client";

import { useTrackTransaction } from "../hooks/useTrackTransaction";
import { TrackSearch } from "../components/TrackSearch";
import { TrackSummary } from "../components/TrackSummary";
import { TrackTimeline } from "../components/TrackTimeline";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function TrackTransactionPage() {
  const flow = useTrackTransaction();

  return (
    <div className="animate-in fade-in duration-300 max-w-4xl mx-auto py-8">

      {/* Search Area */}
      <TrackSearch
        query={flow.query}
        setQuery={flow.setQuery}
        onSearch={flow.searchTransaction}
        status={flow.status}
      />

      {/* Error State */}
      {flow.status === "error" && (
        <div className="max-w-xl mx-auto flex flex-col items-center justify-center p-8 bg-red-50 border border-red-100 rounded-2xl animate-in zoom-in-95">
          <AlertCircle className="text-red-500 mb-3" size={32} />
          <h3 className="text-lg font-bold text-gray-900 mb-1">Transaction Not Found</h3>
          <p className="text-sm text-gray-600 text-center mb-4">{flow.error}</p>
          <Button variant="outline" onClick={flow.resetSearch} className="rounded-xl">
            Try Again
          </Button>
        </div>
      )}

      {/* Success State */}
      {flow.status === "success" && flow.transaction && (
        <div className="animate-in slide-in-from-bottom-8 duration-500">

          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={flow.resetSearch}
              className="text-gray-500 hover:text-black hover:bg-gray-100 -ml-3"
            >
              <ArrowLeft size={16} className="mr-2" /> Track another
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left Column: Timeline */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8">
              <TrackTimeline transaction={flow.transaction} />
            </div>

            {/* Right Column: Summary */}
            <div className="space-y-6">
              <TrackSummary transaction={flow.transaction} />

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 flex flex-col items-center text-center">
                <p className="text-sm text-gray-500 mb-4">Need help with this transaction?</p>
                <Button variant="outline" className="w-full h-11 rounded-xl bg-white">
                  Contact Support
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}