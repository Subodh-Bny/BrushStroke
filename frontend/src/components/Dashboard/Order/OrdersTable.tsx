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
import { Button } from "../../ui/button";
import { Check, ChevronDown, Trash } from "lucide-react";
import Link from "next/link";
import routes from "@/config/routes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import {
  useDeleteOrder,
  useUpdateShippingStatus,
} from "@/services/api/orderApi";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUpdatePaymentStatus } from "@/services/api/payment/paymentDetailsApi";
import LoadingPopup from "@/components/LoadingPopup";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

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
  const [status, setStatus] = useState<OrderStatus>("Pending");
  const [paymentStatus, setPaymentStatus] = useState("Pending");

  const router = useRouter();

  const { mutate: updateStatusMutate } = useUpdateShippingStatus();
  const { mutate: updatePaymentStatusMutate } = useUpdatePaymentStatus();
  const { mutate: deleteOrderMutate, isPending: deleteOrderPending } =
    useDeleteOrder();

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

  const updateStatus = (id: string, newStatus: OrderStatus) => {
    setStatus(newStatus);
    updateStatusMutate({ id, status: newStatus });
  };

  const updatePaymentStatus = (orderId: string, newStatus: string) => {
    updatePaymentStatusMutate({ orderId, status: newStatus });
  };

  const handleDeleteOrder = (orderId: string) => {
    deleteOrderMutate({ orderId });
  };
  return (
    <>
      {deleteOrderPending && <LoadingPopup />}
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
              <TableRow
                key={order._id}
                onClick={() =>
                  router.push(
                    adminPage
                      ? routes.admin.orders + "/" + order._id
                      : routes.orders + "/" + order._id
                  )
                }
                className="hover:cursor-pointer"
              >
                <TableCell>{order._id}</TableCell>
                <TableCell>{order?.artworks.length}</TableCell>
                <TableCell>{format(orderDate, "yyyy-MMM-dd")}</TableCell>
                <TableCell>{order.totalPrice}</TableCell>
                <TableCell>
                  {!adminPage ? (
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
                  ) : (
                    <Popover>
                      <PopoverTrigger
                        className={`px-2 py-1 rounded-full text-xs font-semibold flex gap-1  items-center ${
                          order?.paymentDetails?.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : order?.paymentDetails?.status === "Refunded"
                            ? "bg-blue-100 text-blue-800"
                            : order?.paymentDetails?.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setPaymentStatus(
                            order.paymentDetails?.status || "Pending"
                          );
                        }}
                      >
                        {order?.paymentDetails?.status}
                        <ChevronDown size={15} />
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-0">
                        <div className="flex flex-col">
                          {(["Completed", "Pending", "Refunded"] as const).map(
                            (option) => (
                              <Button
                                key={option}
                                variant="ghost"
                                className="justify-start rounded-none"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updatePaymentStatus(order._id || "", option);
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    paymentStatus === option
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />
                                {option}
                              </Button>
                            )
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </TableCell>
                <TableCell>
                  {!adminPage ? (
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
                  ) : (
                    <Popover>
                      <PopoverTrigger
                        className={`px-2 py-1 rounded-full text-xs font-semibold flex gap-1  items-center ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                        onClick={(e) => {
                          {
                            e.stopPropagation();
                            setStatus(order?.status || "Pending");
                          }
                        }}
                      >
                        {order?.status}
                        <ChevronDown size={15} />
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-0">
                        <div className="flex flex-col">
                          {(["Pending", "Shipped", "Delivered"] as const).map(
                            (option) => (
                              <Button
                                key={option}
                                variant="ghost"
                                className="justify-start rounded-none"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatus(order._id || "", option);
                                }}
                              >
                                <Check
                                  className={`mr-2 h-4 w-4 ${
                                    status === option
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }`}
                                />
                                {option}
                              </Button>
                            )
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                </TableCell>

                <TableCell>
                  {adminPage ? (
                    <AlertDialog>
                      <AlertDialogTrigger
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <Button>
                          <Trash size={17} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the order from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={(e) => e.stopPropagation()}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteOrder(order._id || "");
                            }}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : order.paymentDetails?.status === "Completed" ? (
                    <p className="underline text-gray-400 cursor-not-allowed">
                      Verify Payment
                    </p>
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
