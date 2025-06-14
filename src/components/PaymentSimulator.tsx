
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard, DollarSign, RefreshCw } from "lucide-react";

/**
 * Simulates payment actions (subscription and one-off) for dev/testing.
 * No actual API calls performed, purely UI simulation.
 */
const PaymentSimulator: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulate a subscription checkout
  const handleSubscribe = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      toast.success("Simulated subscription successful! (No real payment processed)");
      setIsProcessing(false);
    }, 1200);
  };

  // Simulate a one-off payment
  const handleOneOffPayment = async () => {
    setIsProcessing(true);
    setTimeout(() => {
      toast.success("Simulated one-off payment successful! (No real payment processed)");
      setIsProcessing(false);
    }, 1200);
  };

  // Simulate a payment status refresh/check
  const handleRefreshStatus = () => {
    setIsProcessing(true);
    setTimeout(() => {
      toast.info("Simulated refresh: payment/subscription is active.");
      setIsProcessing(false);
    }, 700);
  };

  return (
    <div className="max-w-sm mx-auto py-8 flex flex-col gap-4 items-center">
      <Button
        onClick={handleSubscribe}
        disabled={isProcessing}
        className="w-full flex items-center gap-2"
      >
        <CreditCard className="w-4 h-4" />
        {isProcessing ? "Processing Subscription..." : "Simulate Subscription"}
      </Button>
      <Button
        onClick={handleOneOffPayment}
        disabled={isProcessing}
        className="w-full flex items-center gap-2"
        variant="secondary"
      >
        <DollarSign className="w-4 h-4" />
        {isProcessing ? "Processing Payment..." : "Simulate One-Off Payment"}
      </Button>
      <Button
        onClick={handleRefreshStatus}
        disabled={isProcessing}
        className="w-full flex items-center gap-2"
        variant="outline"
      >
        <RefreshCw className="w-4 h-4" />
        {isProcessing ? "Refreshing..." : "Simulate Refresh Payment Status"}
      </Button>
      <div className="pt-2 text-xs text-muted-foreground text-center">
        Payments here are simulated for development only.
      </div>
    </div>
  );
};

export default PaymentSimulator;
