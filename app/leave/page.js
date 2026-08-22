"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";

export default function Leave() {
  const { user, loading } = useAuth();
  const [form, setForm] = useState({ type: "sick", startDate: "", endDate: "", remarks: "" });
  const [myLeaves, setMyLeaves] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (user) fetchMyLeaves();
  }, [user]);

  const fetchMyLeaves = async () => {
    const q = query(
      collection(db, "leaves"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    setMyLeaves(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) {
      setMsg("Please select both dates");
      return;
    }
    setBusy(true);
    await addDoc(collection(db, "leaves"), {
      userId: user.uid,
      userName: user.email,
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      remarks: form.remarks,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
    setForm({ type: "sick", startDate: "", endDate: "", remarks: "" });
    setMsg("Leave request submitted!");
    await fetchMyLeaves();
    setBusy(false);
  };

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Apply for Leave</h1>

      <form onSubmit={handleSubmit} className="border rounded-lg p-4 mb-6 flex flex-col gap-3">
        {msg && <p className="text-sm text-blue-600">{msg}</p>}
        <select
          className="border p-2 rounded"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="sick">Sick</option>
          <option value="casual">Casual</option>
          <option value="earned">Earned</option>
        </select>
        <label className="text-sm">Start Date</label>
        <input
          type="date"
          className="border p-2 rounded"
          value={form.startDate}
          onChange={(e) => setForm({ ...form, startDate: e.target.value })}
        />
        <label className="text-sm">End Date</label>
        <input
          type="date"
          className="border p-2 rounded"
          value={form.endDate}
          onChange={(e) => setForm({ ...form, endDate: e.target.value })}
        />
        <textarea
          placeholder="Remarks"
          className="border p-2 rounded"
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
        />
        <button disabled={busy} className="bg-black text-white py-2 rounded">
          Submit
        </button>
      </form>

      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-2">My Leave Requests</h2>
        {myLeaves.length === 0 && <p className="text-sm text-gray-500">No requests yet.</p>}
        <ul className="text-sm space-y-2">
          {myLeaves.map((l) => (
            <li key={l.id} className="border-b pb-2">
              <div className="flex justify-between">
                <span>{l.type} ({l.startDate} → {l.endDate})</span>
                <span
                  className={
                    l.status === "approved"
                      ? "text-green-600"
                      : l.status === "rejected"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }
                >
                  {l.status}
                </span>
              </div>
              {l.remarks && <p className="text-gray-500">{l.remarks}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
