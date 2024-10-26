"use client";

import { AuthContext } from "@/context/AuthContext";
import { useAppSelector } from "@/lib/redux/hooks";
import { useVerifyKhalti } from "@/services/api/payment/khaltiApi";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useContext, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";

const CallbackPage = () => {
  const searchParams = useSearchParams();
  const pidx = searchParams.get("pidx");
  const purchaseOrderId = searchParams.get("purchase_order_id");
  const paymentStatus = searchParams.get("status");
  const { mutate: verifyKhalti } = useVerifyKhalti();

  const cart = useAppSelector((state) => state.cart);
  const subtotal = useAppSelector((state) =>
    state?.cart?.items.reduce(
      (sum, item) => sum + (item?.artwork?.price || 0),
      0
    )
  );
  const { user } = useContext(AuthContext);

  const shipping = 0;
  const total = subtotal > 0 ? subtotal + shipping : 0;

  const items = cart.items || [];

  useEffect(() => {
    if (pidx && purchaseOrderId) {
      const artworks = items
        .map((item) => item.artwork._id)
        .filter((id): id is string => id !== undefined);

      const orderData = {
        cartId: cart?._id,
        artworks,
        totalPrice: total,
        shippingAddress: user?.shippingAddress || "",
        phoneNumber: user?.phoneNumber || "",
        status: paymentStatus || "Pending",
      };

      verifyKhalti({
        pidx,
        purchaseOrderId,
        data: orderData,
        userId: user?._id || "",
      });
    }
  }, [pidx, purchaseOrderId, verifyKhalti, user, total, cart, paymentStatus]);

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
