"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
//MoreHorizontal

import { useGetOrderByUserId } from "@/services/api/orderApi";
import Cookies from "js-cookie";
import Container from "@/components/Container";
import OrdersTable from "@/components/Dashboard/Order/OrdersTable";

const OrderPage = () => {
  const userCookie = Cookies.get("user");
  const user: User | null = userCookie ? JSON.parse(userCookie) : null;

  const [currentPage, setCurrentPage] = useState(1);
  const { data: orderData } = useGetOrderByUserId({
    userId: user?._id || "",
    page: currentPage,
  });

  return (
    <Container className="mt-11 min-h-screen">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>View and manage your orders</CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTable
            adminPage={false}
            orderData={orderData}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </CardContent>
      </Card>
    </Container>
  );
};

export default OrderPage;
