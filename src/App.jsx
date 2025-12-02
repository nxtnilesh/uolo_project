import { useState } from "react";
import { useEffect } from "react";
const Limit = 5;
function App() {
  const [user, setSetUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    loadUsers();
  }, [page]);
  async function loadUsers() {
    const skip = page * Limit;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://dummyjson.com/users?skip=${skip}&limit=${Limit}`
      );
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      console.log("data", data);

      setSetUser(data.users || data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }
  function deleteUser(id) {
    setSetUser((prev) => prev.filter((u) => u.id !== id));
  }
  const isLastPage = user.length < Limit;

  return (
    <>
      <div className="min-h-screen">
        <h2>Users Listing Page</h2>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <ul className="bg-gray-300 p-3">
          {user.map((u) => (
            <div className="bg-green-50 rounded-2xl p-4 m-2 flex justify-between">
              <div className="flex items-center">
                <img src={u.image} alt="error" className="rounded-full h-11" />
                <div className="">
                  <li key={u.id}>{u.firstName}</li>
                  <li key={u.id}>{u.email}</li>
                </div>
              </div>
              <span>
                <button
                  className="hover:bg-red-200 bg-gray-200 rounded-2xl font-light p-3 cursor-pointer"
                  onClick={() => deleteUser(u.id)}
                >
                  Delete
                </button>
              </span>
            </div>
          ))}
        </ul>
        <div className="flex items-center justify-center m-5 gap-4">
          <button className="bg-blue-300 rounded-sm cursor-pointer p-2" onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>{page}</span>
          <button className="bg-blue-300 rounded-sm cursor-pointer p-2" onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      </div>
    </>
  );
}

export default App;
