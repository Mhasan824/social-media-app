import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.withCredentials = true;
const API = "http://localhost:3000";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts]     = useState([]);
  const [post, setPost]       = useState("");
  const [posting, setPosting] = useState(false);
  const [editId, setEditId]   = useState(null);
  const [editText, setEditText] = useState("");

  // ── Verify session & load posts 
  useEffect(() => {
    axios.get(`${API}/verify`)
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
          fetchPosts();
          setLoading(false);
        } else {
          navigate("/SignIn");
        }
      })
      .catch(() => navigate("/SignIn"));
  }, [navigate]);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${API}/posts`);
      if (res.data.success) setPosts(res.data.posts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  // ── Create post ───────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!post.trim()) return;
    setPosting(true);
    try {
      const res = await axios.post(`${API}/post`, { content: post });
      if (res.data.success) {
        setPost("");
        fetchPosts();
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Error creating post");
    } finally {
      setPosting(false);
    }
  };

  // ── Delete post ───────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`${API}/post/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.msg || "Error deleting post");
    }
  };

  // ── Edit post ─────────────────────────────────────────────────────────────
  const handleEdit = async (id) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.put(`${API}/post/${id}`, { content: editText });
      if (res.data.success) {
        setPosts((prev) =>
          prev.map((p) => (p._id === id ? res.data.post : p))
        );
        setEditId(null);
        setEditText("");
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Error updating post");
    }
  };

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await axios.post(`${API}/logout`);
      setUser(null);
      navigate("/SignIn");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const timeAgo = (date) => {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-9 h-9 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
        <p className="text-sm text-slate-400 tracking-wide">Loading your workspace…</p>
      </div>
    );
  }

  const initials = user?.username?.slice(0, 2).toUpperCase() || "??";

  return (
    <div className="min-h-screen bg-[#f8faff] font-sans relative overflow-x-hidden">

      {/* Background blobs */}
      <div className="fixed -top-28 -right-28 w-96 h-96 rounded-full bg-blue-100 opacity-50 blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-24 -left-24 w-80 h-80 rounded-full bg-sky-100 opacity-50 blur-3xl pointer-events-none z-0" />

      {/* Navbar */}
      <nav className="sticky top-0 z-20 flex items-center justify-between px-6 md:px-10 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 ring-4 ring-blue-100" />
          <span className="text-lg font-bold tracking-tight text-slate-900">nexus</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full pl-1 pr-3 py-1">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              {initials}
            </div>
            <span className="text-xs font-semibold text-blue-700">@{user?.username}</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-slate-500 border border-slate-200 rounded-lg px-4 py-2 bg-white hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all duration-150"
          >
            Sign out
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 py-12 flex flex-col gap-7">

        {/* Welcome */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-blue-500 rounded-2xl px-7 py-6">
          <p className="text-xs font-bold tracking-widest uppercase text-blue-300 mb-2">Good to see you back</p>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">
            Hello, <span className="text-blue-600">{user?.username}</span> 👋
          </h1>
          <p className="text-sm text-slate-400">You have <span className="font-semibold text-blue-500">{posts.length}</span> post{posts.length !== 1 ? "s" : ""} so far.</p>
        </div>

        {/* Compose */}
        <div className="bg-white border border-slate-200 rounded-2xl px-6 py-5 shadow-sm shadow-blue-50">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
              {initials}
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">New post</span>
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              value={post}
              onChange={(e) => setPost(e.target.value)}
              placeholder="What's on your mind today?"
              className="w-full min-h-[100px] bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 resize-none outline-none focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-150"
            />
            <div className="flex items-center justify-between mt-3">
              <span className={`text-xs ${post.length > 260 ? "text-red-400" : "text-slate-300"}`}>
                {post.length} / 280
              </span>
              <button
                type="submit"
                disabled={!post.trim() || posting || post.length > 280}
                className="bg-blue-600 disabled:bg-blue-200 text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed transition-all duration-150 flex items-center gap-2"
              >
                {posting && <span className="w-3 h-3 border-2 border-white/40 border-t-white rounded-full animate-spin" />}
                {posting ? "Publishing…" : "Publish"}
              </button>
            </div>
          </form>
        </div>

        {/* Posts list */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-bold tracking-widest uppercase text-slate-400">
            Your posts {posts.length > 0 && <span className="text-blue-400">({posts.length})</span>}
          </p>

          {posts.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl px-6 py-10 text-center">
              <p className="text-slate-400 text-sm">No posts yet. Write your first one above!</p>
            </div>
          ) : (
            posts.map((p) => (
              <div
                key={p._id}
                className="bg-white border border-slate-200 rounded-2xl px-5 py-5 hover:border-blue-200 hover:shadow-md hover:shadow-blue-50 transition-all duration-150"
              >
                {/* Post header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {initials}
                    </div>
                    <span className="text-xs font-bold text-blue-700">@{user?.username}</span>
                  </div>
                  <span className="text-[11px] text-slate-300 font-medium">{timeAgo(p.createdAt)}</span>
                </div>

                {/* Content or edit mode */}
                {editId === p._id ? (
                  <div className="mb-3">
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="w-full min-h-[80px] bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-slate-800 resize-none outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                      autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEdit(p._id)}
                        className="text-xs font-bold bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition-all"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setEditId(null); setEditText(""); }}
                        className="text-xs font-semibold text-slate-400 px-4 py-1.5 rounded-lg hover:bg-slate-100 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{p.content}</p>
                )}

                {/* Actions */}
                {editId !== p._id && (
                  <div className="flex gap-1 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => { setEditId(p._id); setEditText(p.content); }}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-500 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-all duration-100"
                    >
                      ✎ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all duration-100"
                    >
                      ✕ Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;