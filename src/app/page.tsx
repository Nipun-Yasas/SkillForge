"use client";

import CheckoutPage from "@/app/_components/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined");
}
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const urlAmount = searchParams.get("amount");
  const paymentType = searchParams.get("type");
  const credits = searchParams.get("credits");
  
  // Use URL amount if provided, otherwise default amount
  const amount = urlAmount ? parseInt(urlAmount) : 1500;
  const isCreditsPurchase = paymentType === "credits";

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
      <div className="mb-10">
        {isCreditsPurchase ? (
          <>
            <h1 className="text-4xl font-extrabold mb-2">SkillForge</h1>
            <h2 className="text-2xl">
              Purchase Learning Credits
            </h2>
            <p className="text-lg mt-2">
              {credits} Credits for <span className="font-bold">LKR {amount}</span>
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl font-extrabold mb-2">Sonny</h1>
            <h2 className="text-2xl">
              has requested
              <span className="font-bold"> LKR {amount}</span>
            </h2>
          </>
        )}
      </div>

      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: convertToSubcurrency(amount),
          currency: "lkr",
        }}
      >
        <CheckoutPage 
          amount={amount} 
          isCreditsPayment={isCreditsPurchase}
          credits={credits ? parseInt(credits) : undefined}
        />
      </Elements>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}