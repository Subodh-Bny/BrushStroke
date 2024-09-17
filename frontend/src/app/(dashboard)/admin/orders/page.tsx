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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Search,
} from "lucide-react";

// Mock data for orders
const orders = [
  {
    id: "1",
    customer: "John Doe",
    date: "2023-06-01",
    total: "$129.99",
    status: "Completed",
  },
  {
    id: "2",
    customer: "Jane Smith",
    date: "2023-06-02",
    total: "$79.99",
    status: "Processing",
  },
  {
    id: "3",
    customer: "Bob Johnson",
    date: "2023-06-03",
    total: "$199.99",
    status: "Shipped",
  },
  {
    id: "4",
    customer: "Alice Brown",
    date: "2023-06-04",
    total: "$59.99",
    status: "Pending",
  },
  {
    id: "5",
    customer: "Charlie Davis",
    date: "2023-06-05",
    total: "$149.99",
    status: "Completed",
  },
];

const OrderPage = () => {
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

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.total}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "Processing"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "Shipped"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Update status</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Cancel order</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

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

      <Card>
        <CardHeader>
          <CardTitle>Order Statistics</CardTitle>
          <CardDescription>Overview of order performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-100 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">Total Orders</h3>
              <p className="text-2xl font-bold text-blue-900">1,234</p>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Completed Orders</h3>
              <p className="text-2xl font-bold text-green-900">1,089</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800">Pending Orders</h3>
              <p className="text-2xl font-bold text-yellow-900">145</p>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">
                Average Order Value
              </h3>
              <p className="text-2xl font-bold text-purple-900">$85.50</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderPage;
