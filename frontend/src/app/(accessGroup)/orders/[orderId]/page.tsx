"use client";
import OrderDetails from "@/components/Dashboard/Order/OrderDetails";
import Container from "@/components/Container";
import React from "react";
import { useGetOrderById } from "@/services/api/orderApi";
import ClipLoader from "react-spinners/ClipLoader";

const OrderDetailPage = ({ params }: { params: { orderId: string } }) => {
  const { orderId } = params;

  const { data: order, isLoading: orderLoading } = useGetOrderById({ orderId });
  if (orderLoading) {
    return (
      <Container className="p-8 mt-0 flex justify-center items-center">
        <ClipLoader size={40} />
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className="p-8 mt-0 flex justify-center items-center">
        <p>Error loding Order details. Please try again later.</p>
      </Container>
    );
  }

  return (
    <Container className="p-8 mt-0">
      <OrderDetails orderData={order} />
    </Container>
  );
};

export default OrderDetailPage;
