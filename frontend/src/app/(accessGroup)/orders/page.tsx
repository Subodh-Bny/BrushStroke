"use client";

import React from "react";
import { Button } from "@/components/ui/button";
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

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetOrderByUserId } from "@/services/api/orderApi";
import Cookies from "js-cookie";
import Container from "@/components/Container";
import OrdersTable from "@/components/OrdersTable";

const OrderPage = () => {
  const userCookie = Cookies.get("user");
  const user: User | null = userCookie ? JSON.parse(userCookie) : null;

  const { data: ordersData } = useGetOrderByUserId({ userId: user?._id || "" });

  return (
    <Container className="mt-11 min-h-screen">
      {/* <h1 className="text-3xl font-bold mb-6">Orders</h1> */}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Orders</CardTitle>
          <CardDescription>View and manage your orders</CardDescription>
        </CardHeader>
        <CardContent>
          <OrdersTable adminPage={false} orders={ordersData || []} />

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">Showing 5 of 100 orders</p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
};

export default OrderPage;
