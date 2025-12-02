import { useState } from "react";
import "./App.css";
import { useEffect } from "react";

function App() {
  const [user, setSetUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    async function loadUsers() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`https://dummyjson.com/users?skip=10&limit=10`);
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
    loadUsers();
  }, []);

  return (
    <>
      <div>
        <h2>Users Listing Page</h2>
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        <ul>
          {user.map((u) => (
            <div>
              <li key={u.id}>{u.firstName}</li>
              <li key={u.id}>{u.email}</li>
              <img src={u.image} alt="error" />
              <button>Delete</button>
            </div>
          ))}
        </ul>
        <div>
          <span>Previous</span>
          <span>Next</span>
        </div>
      </div>
    </>
  );
}

export default App;
