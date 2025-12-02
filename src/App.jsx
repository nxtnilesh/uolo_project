import React, { useEffect, useState } from "react";

const LIMIT = 5;

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    loadUsers(controller);
    return () => controller.abort();
  }, [page]);

  async function loadUsers(controller) {
    const skip = page * LIMIT;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://dummyjson.com/users?skip=${skip}&limit=${LIMIT}`,
      );

      if (!res.ok) throw new Error("Failed to fetch users");

      const data = await res.json();
      setUsers(Array.isArray(data.users) ? data.users : data);
      if (typeof data.total === "number") setTotal(data.total);
    } catch (err) {
      if (err.name === "AbortError") return;
      setError(err.message || "Something went wrong");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  function deleteUser(id) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  const skip = page * LIMIT;
  const isFirstPage = page <= 0;
  const isLastPage =
    total !== null ? skip + users.length >= total : users.length < LIMIT;

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <section className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold mb-4">Users Listing</h1>

        <div className="bg-white rounded-2xl shadow p-4">
          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 rounded-full animate-spin" />
              <p className="text-sm">Loading users...</p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-600 mb-3">Error: {error}</p>
          )}

          {!loading && !error && users.length === 0 && (
            <p className="text-sm text-gray-600">No users found.</p>
          )}

          <ul className="space-y-3 mt-3">
            {users.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between gap-4 bg-slate-100 p-3 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.image}
                    alt={`${u.firstName} ${u.lastName}`}
                    className="rounded-full w-12 h-12 object-cover"
                  />

                  <div>
                    <p className="font-medium">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-gray-600">{u.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 rounded-md bg-red-100 hover:bg-red-200 text-red-700 text-sm"
                    onClick={() => deleteUser(u.id)}
                    aria-label={`Delete ${u.firstName}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <nav className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-600">Total: {total ?? "—"}</div>

            <div className="flex items-center gap-3">
              <button
                className={`px-3 py-1 rounded-md ${isFirstPage ? 'opacity-50 cursor-not-allowed' : 'bg-blue-100 hover:bg-blue-200'}`}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={isFirstPage}
                aria-disabled={isFirstPage}
              >
                Previous
              </button>

              <div className="px-3 py-1 rounded-md bg-white border">Page {page + 1}</div>

              <button
                className={`px-3 py-1 rounded-md ${isLastPage ? 'opacity-50 cursor-not-allowed' : 'bg-blue-100 hover:bg-blue-200'}`}
                onClick={() => !isLastPage && setPage((p) => p + 1)}
                disabled={isLastPage}
              >
                Next
              </button>
            </div>
          </nav>
        </div>
      </section>
    </main>
  );
}
