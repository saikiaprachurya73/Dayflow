"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, doc, updateDoc } from "firebase/firestore";

export default function Admin() {
  const { user, role, loading } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (user) fetchLeaves();
  }, [user]);

  const fetchLeaves = async () => {
    const q = query(collection(db, "leaves"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setLeaves(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  const handleAction = async (id, status) => {
    setBusyId(id);
    await updateDoc(doc(db, "leaves", id), { status });
    await fetchLeaves();
    setBusyId(null);
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  if (role !== "admin") {
    return (
      <p className="text-center mt-20 text-red-600">
        Access denied — Admins only.
      </p>
    );
  }

  const pending = leaves.filter((l) => l.status === "pending");
  const others = leaves.filter((l) => l.status !== "pending");

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Admin — Leave Requests</h1>

      <h2 className="font-semibold mb-2">Pending ({pending.length})</h2>
      {pending.length === 0 && <p className="text-sm text-gray-500 mb-6">No pending requests.</p>}
      <ul className="space-y-3 mb-8">
        {pending.map((l) => (
          <li key={l.id} className="border rounded-lg p-4">
            <div className="flex justify-between mb-1">
              <span className="font-medium">{l.userName}</span>
              <span className="text-yellow-600">{l.status}</span>
            </div>
            <p className="text-sm text-gray-600">
              {l.type} • {l.startDate} → {l.endDate}
            </p>
            {l.remarks && <p className="text-sm text-gray-500 mt-1">"{l.remarks}"</p>}
            <div className="flex gap-2 mt-3">
              <button
                disabled={busyId === l.id}
                onClick={() => handleAction(l.id, "approved")}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm"
              >
                Approve
              </button>
              <button
                disabled={busyId === l.id}
                onClick={() => handleAction(l.id, "rejected")}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="font-semibold mb-2">History</h2>
      <ul className="space-y-2">
        {others.map((l) => (
          <li key={l.id} className="border-b pb-2 text-sm flex justify-between">
            <span>{l.userName} — {l.type} ({l.startDate} → {l.endDate})</span>
            <span className={l.status === "approved" ? "text-green-600" : "text-red-600"}>
              {l.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
