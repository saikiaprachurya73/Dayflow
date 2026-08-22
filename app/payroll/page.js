"use client";
import { useAuth } from "@/lib/useAuth";

export default function Payroll() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Payroll</h1>
      <div className="border rounded-lg p-6">
        <p className="text-sm text-gray-500 mb-1">{user?.email}</p>
        <p className="text-3xl font-bold mb-4">₹45,000<span className="text-base font-normal">/month</span></p>
        <div className="text-sm space-y-1 border-t pt-3">
          <div className="flex justify-between">
            <span>Basic</span><span>₹25,000</span>
          </div>
          <div className="flex justify-between">
            <span>HRA</span><span>₹12,000</span>
          </div>
          <div className="flex justify-between">
            <span>Allowances</span><span>₹8,000</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">* Sample data for demo purposes</p>
      </div>
    </div>
  );
}
