"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-green-500 to-blue-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">Payment Successful!</h1>
        <h2 className="text-2xl">
          Thank you for your payment of
          <span className="font-bold"> LKR {amount}</span>
        </h2>
        <p className="mt-4 text-lg">
          Your transaction has been completed successfully.
        </p>
      </div>
      
      <div className="mt-8">
        <a 
          href="/"
          className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Return to Home
        </a>
      </div>
    </main>
  );
}
