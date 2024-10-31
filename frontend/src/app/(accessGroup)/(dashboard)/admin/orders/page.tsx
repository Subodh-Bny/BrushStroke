"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search } from "lucide-react";
import { useGetOrders } from "@/services/api/orderApi";
import OrdersTable from "@/components/OrdersTable";

const OrderPage = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: orderData } = useGetOrders(currentPage);
  const orders = orderData?.data;

  const completedOrders = orders?.reduce(
    (acc: number, order: Order) =>
      order.status === "Delivered" ? acc + 1 : acc,
    0
  );

  const pendingOrders = orders?.reduce(
    (acc: number, order: Order) => (order.status === "Pending" ? acc + 1 : acc),
    0
  );

  const totalValue =
    orders?.reduce(
      (acc: number, order: { totalPrice: number }) => acc + order.totalPrice,
      0
    ) || 0;
  const orderCount = orders?.length || 0;
  const averageOrderValue = orderCount > 0 ? totalValue / orderCount : 0;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
          <CardDescription>
            View and manage your e-commerce orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="search" className="sr-only">
                Search orders
              </Label>
              <Input
                id="search"
                placeholder="Search orders..."
                className="w-[300px]"
                type="search"
              />
              <Button variant="secondary">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            <Button>Add New Order</Button>
          </div>
          <OrdersTable
            adminPage={true}
            orderData={orderData}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Statistics</CardTitle>
          <CardDescription>Overview of order performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Total Orders</h3>
              <p className="text-2xl font-bold text-blue-900">
                {orders?.length || "0"}
              </p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Completed Orders</h3>
              <p className="text-2xl font-bold text-green-900">
                {completedOrders}
              </p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800">Pending Orders</h3>
              <p className="text-2xl font-bold text-yellow-900">
                {pendingOrders}
              </p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">
                Average Order Value
              </h3>
              <p className="text-2xl font-bold text-purple-900">
                Rs {averageOrderValue.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderPage;
