"use client";
import React, { useEffect, useState } from "react";

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
import { Button } from "./ui/button";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import routes from "@/config/routes";
import { ChevronLeft, ChevronRight } from "lucide-react";

const OrdersTable = ({
  orderData,
  adminPage,
  setCurrentPage,
  currentPage,
}: {
  orderData?: OrderWithPaginationResponse<Order[]>;
  adminPage: boolean;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  currentPage: number;
}) => {
  const [orders, setOrders] = useState<Order[]>();
  const [totalOrders, setTotalOrders] = useState(0);
  useEffect(() => {
    setOrders(orderData?.data);
    setTotalOrders(orderData?.totalOrders || 0);
  }, [orderData]);

  const handleNextPage = () => {
    if (orderData && currentPage < orderData.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Artworks</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => {
            const orderDate = new Date(order?.createdAt || "");
            return (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>{order?.artworks.length}</TableCell>
                <TableCell>{orderDate.toDateString()}</TableCell>
                <TableCell>{order.totalPrice}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order?.paymentDetails?.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : order?.paymentDetails?.status === "Pending"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {order?.paymentDetails?.status}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === "Delivered"
                        ? "bg-green-100 text-green-800"
                        : order.status === "Shipped"
                        ? "bg-blue-100 text-blue-800"
                        : order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-purple-100 text-purple-800"
                    }`}
                  >
                    {order?.status}
                  </span>
                </TableCell>

                <TableCell>
                  {adminPage ? (
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
                  ) : (
                    <Link
                      href={`${routes.khaltiReturn}?pidx=${order?.paymentDetails?.pidx}&purchase_order_id=${order?._id}`}
                      className="text-blue-800 underline"
                    >
                      Verify Payment
                    </Link>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">
          Showing {orders && orders?.length} of {totalOrders} orders
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePreviousPage()}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleNextPage()}
            disabled={orderData && orderData.totalPages === currentPage}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </>
  );
};

export default OrdersTable;
