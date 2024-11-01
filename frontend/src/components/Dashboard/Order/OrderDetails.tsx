"use client";

import { CalendarIcon, PackageIcon, TruckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useUpdateShippingStatus } from "@/services/api/orderApi";

function OrderActions({
  status,
  onStatusChange,
}: {
  status: OrderStatus;
  onStatusChange: (newStatus: OrderStatus) => void;
}) {
  const updateStatus = (newStatus: OrderStatus) => {
    onStatusChange(newStatus);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant={status === "Pending" ? "default" : "outline"}
        size="sm"
        onClick={() => updateStatus("Pending")}
      >
        Pending
      </Button>
      <Button
        variant={status === "Shipped" ? "default" : "outline"}
        size="sm"
        onClick={() => updateStatus("Shipped")}
      >
        Shipped
      </Button>
      <Button
        variant={status === "Delivered" ? "default" : "outline"}
        size="sm"
        onClick={() => updateStatus("Delivered")}
      >
        Delivered
      </Button>
    </div>
  );
}

const OrderDetails = ({
  orderData,
  adminPage,
}: {
  orderData: Order;
  adminPage?: boolean;
}) => {
  const { mutate: updateStatusMutate } = useUpdateShippingStatus();
  const handleStatusChange = (newStatus: OrderStatus) => {
    updateStatusMutate({ id: orderData._id || "", status: newStatus });
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
            <CardDescription>Order #{orderData._id}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Customer Name</Label>
                <span>{orderData.user?.username}</span>
              </div>
              <div className="flex justify-between">
                <Label>Email</Label>
                <span>{orderData.user?.email}</span>
              </div>
              <div className="flex justify-between">
                <Label>Phone</Label>
                <span>{orderData.user?.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <Label>Order Date</Label>
                <span>
                  {format(
                    orderData.createdAt || "0000-00-00T06:25:55.807Z",
                    "yyyy-MM-dd"
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <Label>Status</Label>
                <span className="font-semibold">{orderData.status}</span>
              </div>
            </div>
          </CardContent>
          {adminPage && (
            <CardFooter>
              <OrderActions
                status={orderData.status || "Pending"}
                onStatusChange={handleStatusChange}
              />
            </CardFooter>
          )}
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Shipping Address</Label>
              <p className="text-sm">{orderData.shippingAddress}</p>
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderData.artworks.map((item) => (
                <TableRow
                  key={
                    typeof item === "object" && item._id
                      ? item._id
                      : crypto.randomUUID()
                  }
                >
                  <TableCell>
                    {typeof item === "object" && item.title
                      ? item.title
                      : "Unknown Title"}
                  </TableCell>
                  <TableCell className="text-right">1</TableCell>
                  <TableCell className="text-right">
                    Rs&nbsp;
                    {typeof item === "object" && item.price
                      ? item.price.toFixed(2)
                      : "0.00"}
                  </TableCell>
                  <TableCell className="text-right">
                    Rs&nbsp;
                    {typeof item === "object" && item.price
                      ? (1 * item.price).toFixed(2)
                      : "0.00"}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell colSpan={3} className="text-right font-medium">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold">
                  Rs&nbsp;{orderData.totalPrice.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center">
              <CalendarIcon className="h-6 w-6 text-blue-500" />
              <div className="h-14 w-px bg-blue-500" />
            </div>
            <div>
              <p className="font-semibold">Order Placed</p>
              <p className="text-sm text-gray-500">
                {format(
                  orderData.createdAt || "0000-00-00T06:25:55.807Z",
                  "yyyy-MM-dd"
                )}
              </p>
            </div>
          </div>
          {(orderData.status === "Shipped" ||
            orderData.status === "Delivered") && (
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center">
                <PackageIcon className="h-6 w-6 text-blue-500" />
                <div className="h-14 w-px bg-blue-500" />
              </div>
              <div>
                <p className="font-semibold">Order Processed</p>
                <p className="text-sm text-gray-500">Processing complete</p>
              </div>
            </div>
          )}

          {orderData.status === "Delivered" && (
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center">
                <TruckIcon className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold">Order {orderData.status}</p>
                <p className="text-sm text-gray-500">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default OrderDetails;
