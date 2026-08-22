"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";

function getTodayDate() {
  const d = new Date();
  return d.toISOString().split("T")[0]; // "YYYY-MM-DD"
}

export default function Dashboard() {
  const { user, role, loading } = useAuth();
  const [todayRecord, setTodayRecord] = useState(null);
  const [history, setHistory] = useState([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) fetchAttendance();
  }, [user]);

  const fetchAttendance = async () => {
    const q = query(
      collection(db, "attendance"),
      where("userId", "==", user.uid),
      orderBy("date", "desc")
    );
    const snap = await getDocs(q);
    const records = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setHistory(records);
    const today = records.find((r) => r.date === getTodayDate());
    setTodayRecord(today || null);
  };

  const handleCheckIn = async () => {
    setBusy(true);
    await addDoc(collection(db, "attendance"), {
      userId: user.uid,
      date: getTodayDate(),
      checkIn: new Date().toISOString(),
      checkOut: null,
      status: "present",
    });
    await fetchAttendance();
    setBusy(false);
  };

  const handleCheckOut = async () => {
    if (!todayRecord) return;
    setBusy(true);
    const { doc, updateDoc } = await import("firebase/firestore");
    await updateDoc(doc(db, "attendance", todayRecord.id), {
      checkOut: new Date().toISOString(),
    });
    await fetchAttendance();
    setBusy(false);
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-500 mb-6">Welcome, {user?.email} ({role})</p>

      <div className="border rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Today's Attendance</h2>
        {!todayRecord ? (
          <button
            onClick={handleCheckIn}
            disabled={busy}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Check In
          </button>
        ) : !todayRecord.checkOut ? (
          <div>
            <p className="text-sm mb-2">
              Checked in at {new Date(todayRecord.checkIn).toLocaleTimeString()}
            </p>
            <button
              onClick={handleCheckOut}
              disabled={busy}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Check Out
            </button>
          </div>
        ) : (
          <p className="text-sm">
            ✅ Checked in {new Date(todayRecord.checkIn).toLocaleTimeString()} —
            Checked out {new Date(todayRecord.checkOut).toLocaleTimeString()}
          </p>
        )}
      </div>

      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-2">Attendance History</h2>
        {history.length === 0 && <p className="text-sm text-gray-500">No records yet.</p>}
        <ul className="text-sm space-y-1">
          {history.map((r) => (
            <li key={r.id} className="flex justify-between border-b py-1">
              <span>{r.date}</span>
              <span>{r.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
