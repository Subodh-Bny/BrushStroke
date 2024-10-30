"use client";

import { useRef, useState } from "react";
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
import {
  useCreateOrderKhalti,
  useCreateOrderEsewa,
} from "@/services/api/orderApi";
import ClipLoader from "react-spinners/ClipLoader";
import Cookies from "js-cookie";
import routes from "@/config/routes";
import { useCreateSignature } from "@/services/api/payment/esewaApi";
import toast from "react-hot-toast";
import LoadingPopup from "@/components/LoadingPopup";

export default function CartPage() {
  const cartItems = useAppSelector((state) => state.cart);
  const { mutate: removeItem } = useRemoveCartItem();
  const { mutate: createKhalitOrder, isPending: createKhaltiOrderPending } =
    useCreateOrderKhalti();
  const { mutate: createEsewaOrder, isPending: createEsewaOrderPending } =
    useCreateOrderEsewa();
  const [signature, setSignature] = useState<string>("");
  const createSignatureMutation = useCreateSignature();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({
    shippingAddress: "",
    phoneNumber: "",
  });
  const [phoneError, setPhoneError] = useState("");
  const [paymentData, setPaymentData] = useState<EsewaPayment>();
  const formRef = useRef<HTMLFormElement | null>(null);

  const subtotal = useAppSelector((state) =>
    state.cart.reduce((sum, item) => sum + (item?.artwork?.price || 0), 0)
  );

  const shipping = 0;
  const items = cartItems || [];
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

  const handleGenerateSignature = async () => {
    const artworks = items
      .map((item) => item.artwork._id)
      .filter((id): id is string => id !== undefined);

    const orderData = {
      artworks,
      totalPrice: total,
      shippingAddress: shippingDetails.shippingAddress,
      phoneNumber: shippingDetails.phoneNumber,
    };

    const order = createEsewaOrder(orderData);

    const paymentData = {
      amount: total.toString(),
      tax_amount: "0",
      total_amount: total.toString(),
      //@ts-expect-error couldnot find the correct way to define the type for createEsewaOrder mutation
      transaction_uuid: order?._id,
      product_code: "EPAYTEST",
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: process.env.NEXT_PUBLIC_HOMEURL + routes.khaltiReturn,
      failure_url: process.env.NEXT_PUBLIC_HOMEURL + routes.khaltiReturn,
    };

    setPaymentData(paymentData);
    try {
      const generatedSignature = await createSignatureMutation.mutateAsync(
        paymentData
      );
      setSignature(generatedSignature);
    } catch (error: unknown) {
      toast.error("Error generating signature");
    }
  };

  const handleEsewaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!signature) {
      await handleGenerateSignature();
    }

    // Now, redirect the user to eSewa's payment page
    formRef.current?.submit();
  };

  const handleSubmitKhaltiCheckout = () => {
    const artworks = items
      .map((item) => item.artwork._id)
      .filter((id): id is string => id !== undefined);

    const orderData = {
      artworks,
      totalPrice: total,
      shippingAddress: shippingDetails.shippingAddress,
      phoneNumber: shippingDetails.phoneNumber,
    };

    createKhalitOrder(orderData);
    setIsCheckoutOpen(false);
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
                            Rs.&nbsp;{item.artwork.price.toFixed(2)}
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
              onClick={handleSubmitKhaltiCheckout}
              disabled={
                (phoneError || shippingDetails.phoneNumber === ""
                  ? true
                  : false) || createKhaltiOrderPending
              }
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {createKhaltiOrderPending ? (
                <ClipLoader size={15} />
              ) : (
                "Pay with khalti"
              )}
            </Button>
            <form
              id="esewa-form"
              action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
              method="POST"
              ref={formRef}
              onSubmit={handleEsewaSubmit}
            >
              <input type="hidden" name="amount" value={total} />
              <input type="hidden" name="tax_amount" value={"0"} />
              <input type="hidden" name="total_amount" value={"0"} />
              <input
                type="hidden"
                name="transaction_uuid"
                value={paymentData?.transaction_uuid}
              />
              <input
                type="hidden"
                name="product_code"
                value={paymentData?.product_code}
              />
              <input
                type="hidden"
                name="product_service_charge"
                value={paymentData?.product_service_charge}
              />
              <input
                type="hidden"
                name="product_delivery_charge"
                value={paymentData?.product_delivery_charge}
              />
              <input
                type="hidden"
                name="success_url"
                value={paymentData?.success_url}
              />
              <input
                type="hidden"
                name="failure_url"
                value={paymentData?.failure_url}
              />
              <input
                type="hidden"
                name="signed_field_names"
                value="total_amount,transaction_uuid,product_code"
              />
              <input type="hidden" name="signature" value={signature} />
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700"
                disabled={
                  (phoneError || shippingDetails.phoneNumber === ""
                    ? true
                    : false) || createEsewaOrderPending
                }
              >
                {createEsewaOrderPending ? (
                  <ClipLoader size={15} />
                ) : (
                  "Pay with eSewa"
                )}
              </Button>
            </form>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LoadingPopup isLoading={createKhaltiOrderPending} />
    </Container>
  );
}
