import axios from "axios";
import { useSession, signOut, signIn } from "next-auth/react";
import { useState } from "react";

export default function Admin() {
  const { data, status } = useSession();
  const [updating, setUpdating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    axios
      .post("/api/add", {
        domain: e.target[0].value,
        name: e.target[1].value,
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleUpdate = () => {
    setUpdating(true);
    axios.post("/api/updateAll").finally(() => setUpdating(false));
  };

  if (status === "loading") return <div>Loading...</div>;

  if (status === "unauthenticated")
    return (
      <div>
        Unauthenticated<button onClick={() => signIn()}>Sign in</button>
      </div>
    );

  if (status === "authenticated" && data.user.role !== "ADMIN")
    return <div>Not an admin</div>;

  return (
    <div
      style={{
        margin: "0 auto",
        maxWidth: "500px",
        marginTop: "100px",
      }}
    >
      <span>connected as: {data.user.name}</span>{" "}
      <button onClick={() => signOut()}>Sign out</button>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginTop: "20px",
        }}
        onSubmit={handleSubmit}
      >
        <input type="text" placeholder="domain" />
        <input type="text" placeholder="name" />
        <button type="submit">
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
      <button
        style={{ marginTop: "10px" }}
        disabled={updating}
        onClick={handleUpdate}
      >
        {updating ? "Updating..." : "Update all"}
      </button>
    </div>
  );
}
