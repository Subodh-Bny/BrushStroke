"use client";
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

export default function CartPage() {
  const cartItems = useAppSelector((state) => state.cart);
  const { mutate: removeItem } = useRemoveCartItem();
  const items = cartItems || [];
  const subtotal = items.reduce((sum, item) => sum + item?.artwork?.price, 0);
  const shipping = 10;
  const total = subtotal < 0 ? subtotal + shipping : 0;

  const handleRemoveItem = (artworkId: string) => {
    removeItem(artworkId);
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
                          src={item.artwork.image || "notFound.png"}
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
                            ${item.artwork.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="ml-4"
                          onClick={() =>
                            handleRemoveItem(item.artwork._id || "")
                          }
                          // disabled={removeItemPending}
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
            <Button className="w-full" size="lg" disabled={total <= 0}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Proceed to Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Container>
  );
}
