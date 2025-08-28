"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const amount = searchParams.get("amount");
  const paymentType = searchParams.get("type");
  const credits = searchParams.get("credits");
  const isCreditsPayment = paymentType === "credits";
  
  const [isProcessing, setIsProcessing] = useState(isCreditsPayment);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isCreditsPayment && credits) {
      // Process the credit purchase
      const processCreditPurchase = async () => {
        try {
          const response = await fetch('/api/credits/purchase', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: parseInt(credits),
              paymentMethod: 'stripe',
              transactionId: `stripe_${Date.now()}`,
              amountPaid: parseInt(amount || '0'),
            }),
          });

          const data = await response.json();
          if (!data.success) {
            setError('Failed to credit your account. Please contact support.');
          }
        } catch (err) {
          console.error('Error processing credit purchase:', err);
          setError('Failed to credit your account. Please contact support.');
        } finally {
          setIsProcessing(false);
          // Clear the pending purchase from localStorage
          localStorage.removeItem('pendingCreditPurchase');
        }
      };

      processCreditPurchase();
    }
  }, [isCreditsPayment, credits, amount]);

  if (isProcessing) {
    return (
      <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
        <div className="mb-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h1 className="text-4xl font-extrabold mb-2">Processing...</h1>
          <p className="text-lg">
            We're adding {credits} credits to your account. Please wait...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-green-500 to-blue-500">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">
          {isCreditsPayment ? "Credits Purchased!" : "Payment Successful!"}
        </h1>
        
        {error ? (
          <div className="bg-red-500 bg-opacity-20 border border-red-300 text-white p-4 rounded-lg mb-4">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {isCreditsPayment ? (
              <>
                <h2 className="text-2xl mb-4">
                  🎉 {credits} learning credits have been added to your account!
                </h2>
                <p className="text-lg">
                  Payment of <span className="font-bold">LKR {amount}</span> completed successfully.
                </p>
                <p className="mt-4 text-lg">
                  You can now book sessions with any mentor on SkillForge!
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl">
                  Thank you for your payment of
                  <span className="font-bold"> LKR {amount}</span>
                </h2>
                <p className="mt-4 text-lg">
                  Your transaction has been completed successfully.
                </p>
              </>
            )}
          </>
        )}
      </div>
      
      <div className="mt-8 space-x-4">
        {isCreditsPayment ? (
          <>
            <button 
              onClick={() => router.push('/guide')}
              className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Back to Guide
            </button>
            <button 
              onClick={() => router.push('/findmentor')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Find Mentors
            </button>
          </>
        ) : (
          <button 
            onClick={() => router.push('/')}
            className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Return to Home
          </button>
        )}
      </div>
    </main>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={
      <main className="max-w-6xl mx-auto p-10 text-white text-center border m-10 rounded-md bg-gradient-to-tr from-blue-500 to-purple-500">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <h1 className="text-4xl font-extrabold mb-2">Loading...</h1>
      </main>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
