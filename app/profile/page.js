"use client";
import { useAuth } from "@/lib/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Profile() {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/signin");
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg">
      <h1 className="text-xl font-bold mb-4">Profile</h1>
      <p><b>Email:</b> {user?.email}</p>
      <p><b>Role:</b> {role}</p>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}