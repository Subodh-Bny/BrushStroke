"use client";

import { useState } from "react";
import { ShoppingCart, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Container from "@/components/Container";
import { useAppSelector } from "@/lib/redux/hooks";
import { useRemoveCartItem } from "@/services/api/cartApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateOrder } from "@/services/api/orderApi";
import ClipLoader from "react-spinners/ClipLoader";
import Cookies from "js-cookie";

export default function CartPage() {
  const cartItems = useAppSelector((state) => state.cart);
  const { mutate: removeItem } = useRemoveCartItem();
  const { mutate: createOrder, isPending: createOrderPending } =
    useCreateOrder();
  const items = cartItems || [];
  const shipping = 0;

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    shippingAddress: "",
    phoneNumber: "",
  });
  const [phoneError, setPhoneError] = useState("");

  const subtotal = useAppSelector((state) =>
    state.cart.reduce((sum, item) => sum + (item?.artwork?.price || 0), 0)
  );

  const total = subtotal > 0 ? subtotal + shipping : 0;

  const handleRemoveItem = (artworkId: string) => {
    removeItem(artworkId);
  };

  const handleCheckout = () => {
    const user: User = JSON.parse(Cookies.get("user") || "");
    if (user) {
      setShippingDetails({
        shippingAddress: user?.shippingAddress || "",
        phoneNumber: user?.phoneNumber || "",
      });
    }
    setIsCheckoutOpen(true);
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      // Regex to validate Nepal phone number (starting with 98 or 97 and has 10 digits)
      const phoneNumberRegex = /^(98|97)\d{8}$/;

      if (!phoneNumberRegex.test(value)) {
        setPhoneError(
          "Phone number must be 10 digits and start with 98 or 97."
        );
      } else {
        setPhoneError(""); // Clear error when valid
      }
    }
    setShippingDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitCheckout = () => {
    const artworks = items
      .map((item) => item.artwork._id)
      .filter((id): id is string => id !== undefined);

    const orderData = {
      artworks,
      totalPrice: total,
      shippingAddress: shippingDetails.shippingAddress,
      phoneNumber: shippingDetails.phoneNumber,
    };

    createOrder(orderData);
    console.log(orderData);
    !createOrderPending && setIsCheckoutOpen(false);
  };

  return (
    <Container className="mt-11 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Cart Items</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-center text-gray-500">Your cart is empty</p>
            ) : (
              <ul className="divide-y">
                {items.map(
                  (item) =>
                    item.artwork && (
                      <li
                        key={item.artwork._id}
                        className="py-4 flex items-center"
                      >
                        <Image
                          src={item.artwork.image || "/notFound.png"}
                          alt={item.artwork.title}
                          width={100}
                          height={100}
                          className="rounded-md mr-4"
                        />
                        <div className="flex-grow">
                          <h3 className="font-semibold">
                            {item.artwork.title}
                          </h3>
                          <p className="text-gray-600">
                            Rs.{item.artwork.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-4"
                          onClick={() =>
                            handleRemoveItem(item.artwork._id || "")
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    )
                )}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs.{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Rs.{subtotal > 0 ? shipping.toFixed(2) : 0}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>Rs.{total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              size="lg"
              disabled={total <= 0}
              onClick={handleCheckout}
            >
              <ShoppingCart className="mr-2 h-5 w-5" /> Proceed to Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Shipping Address</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="shippingAddress">Address</Label>
              <Input
                id="shippingAddress"
                name="shippingAddress"
                placeholder="e.g. Gongabu-2, Kathmandu"
                value={shippingDetails.shippingAddress}
                onChange={handleDetailsChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={shippingDetails.phoneNumber}
                onChange={handleDetailsChange}
                className="col-span-3"
              />
            </div>
            {phoneError && (
              <p className="text-red-500 text-sm mt-1">{phoneError}</p>
            )}
          </div>
          <DialogFooter>
            <Button
              onClick={handleSubmitCheckout}
              disabled={
                (phoneError || shippingDetails.phoneNumber === ""
                  ? true
                  : false) || createOrderPending
              }
            >
              {createOrderPending ? <ClipLoader size={15} /> : "Complete Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
