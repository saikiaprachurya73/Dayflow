"use client";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const { user, role } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/signin");
  };

  if (!user) return null;

  return (
    <nav className="border-b px-6 py-3 flex justify-between items-center">
      <div className="flex gap-4 text-sm">
        <Link href="/dashboard">Attendance</Link>
        <Link href="/leave">Leave</Link>
        <Link href="/payroll">Payroll</Link>
        <Link href="/profile">Profile</Link>
        {role === "admin" && <Link href="/admin">Admin</Link>}
      </div>
      <button onClick={handleLogout} className="text-sm text-red-600">
        Logout
      </button>
    </nav>
  );
}