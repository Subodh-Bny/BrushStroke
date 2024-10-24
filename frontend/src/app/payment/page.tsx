"use client";

import { useVerifyKhalti } from "@/services/api/payment/khaltiApi";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const CallbackPage = () => {
  const searchParams = useSearchParams();
  const pidx = searchParams.get("pidx");
  const orderId = searchParams.get("purchase_order_id");
  const { mutate } = useVerifyKhalti();

  useEffect(() => {
    if (pidx && orderId) {
      mutate({ pidx, orderId });
    }
  }, [pidx, orderId, mutate]);

  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <ClipLoader size={30} />
    </div>
  );
};

const PaymentPageWrapper = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen w-full">
          <ClipLoader size={30} />
        </div>
      }
    >
      <CallbackPage />
    </Suspense>
  );
};

export default PaymentPageWrapper;
