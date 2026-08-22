"use client";
import { useAuth } from "@/lib/useAuth";

export default function Profile() {
  const { user, role, loading } = useAuth();

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg">
      <h1 className="text-xl font-bold mb-4">Profile</h1>
      <p><b>Email:</b> {user?.email}</p>
      <p><b>Role:</b> {role}</p>
    </div>
  );
}
