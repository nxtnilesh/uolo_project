import { useState } from "react";
// import "./App.css";
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
      <div>
        <h2 className="bg-red-400">Users Listing Page</h2>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <ul>
          {user.map((u) => (
            <div>
              <li key={u.id}>{u.firstName}</li>
              <li key={u.id}>{u.email}</li>
              <img src={u.image} alt="error" />
              <button onClick={() => deleteUser(u.id)}>Delete</button>
            </div>
          ))}
        </ul>
        <div>
          <button onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>{page}</span>
          <button onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      </div>
    </>
  );
}

export default App;
