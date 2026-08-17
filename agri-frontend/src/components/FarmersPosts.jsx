import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { readJSON, writeJSON } from "../utils/storage";

const SEED_POSTS = [
  {
    id: 1,
    author: "John Farmer",
    content: "Just harvested 2 tons of maize! Great season.",
    date: "2026-08-15",
  },
  {
    id: 2,
    author: "Maria R.",
    content: "Looking for advice on pest control for tomatoes.",
    date: "2026-08-14",
  },
];

export default function FarmersPosts() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    author: user?.role === "member" ? user.username : "",
    content: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = readJSON("posts", null);
    if (saved) {
      setPosts(saved);
    } else {
      setPosts(SEED_POSTS);
      writeJSON("posts", SEED_POSTS);
    }
  }, []);

  const handlePost = (e) => {
    e.preventDefault();
    if (!newPost.author.trim() || !newPost.content.trim()) {
      setError("Add your name and a message before posting.");
      return;
    }
    setError("");
    const post = {
      id: Date.now(),
      author: newPost.author.trim(),
      content: newPost.content.trim(),
      date: new Date().toISOString().split("T")[0],
    };
    const updated = [post, ...posts];
    setPosts(updated);
    writeJSON("posts", updated);
    setNewPost((p) => ({ ...p, content: "" }));
  };

  return (
    <section id="posts" className="card">
      <h2>📢 Farmers Community Posts</h2>
      <form onSubmit={handlePost} className="post-form">
        <input
          placeholder="Your name"
          value={newPost.author}
          onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
        />
        <textarea
          placeholder="Share your experience, tips or questions..."
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          rows={3}
        />
        <button type="submit">Post</button>
        {error && <p className="form-message error">{error}</p>}
      </form>

      <div className="posts-list">
        {posts.map((p) => (
          <div key={p.id} className="post-item">
            <div className="post-header">
              <strong>{p.author}</strong>
              <span>{p.date}</span>
            </div>
            <p>{p.content}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
