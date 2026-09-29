import { useEffect, useMemo, useRef, useState } from "react";

import dripcheckLogo from "./assets/DRIPCHECK LOGO.png";

import linenBlazer from "./assets/linen-blazer.png";
import silkBlouse from "./assets/silk-blouse.png";
import highWaistTrousers from "./assets/high-waist-trousers.png";
import midiWrapDress from "./assets/midi-wrap-dress.png";
import cashmereSweater from "./assets/cashmere-sweater.png";
import wideLegPants from "./assets/wide-leg-pants.png";
import leatherLoafers from "./assets/leather-loafers.png";
import goldNecklace from "./assets/gold-necklace.png";

import wardrobeBanner from "./assets/wardrobe-banner.png";
import styleHero from "./assets/style-hero.png";
import chatBackground from "./assets/chat background.png";
import dripcheckHome from "./assets/dripcheck ai home.png";
import communityBackground from "./assets/community background.png";
const API_BASE = "http://localhost:3000";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("dripcheck-token")}`,
});

// Community feed media — automatically picks up .png/.jpg/.jpeg/.webp/.mp4 files
// whose names start with "community post".
const communityMediaModules = import.meta.glob("./assets/community post*", {
  eager: true,
  query: "?url",
  import: "default",
});

const communityAsset = (stem) => {
  const wanted = stem.toLowerCase();
  const match = Object.entries(communityMediaModules).find(([path]) => {
    const file = path.split("/").pop()?.replace(/\.[^.]+$/, "").toLowerCase();
    return file === wanted;
  });
  return match?.[1] || "";
};


const initialWardrobe = [
  {
    id: 1,
    name: "Linen Blazer",
    category: "Tops",
    type: "Jacket",
    image: linenBlazer,
  },
  {
    id: 2,
    name: "Silk Blouse",
    category: "Tops",
    type: "Top",
    image: silkBlouse,
  },
  {
    id: 3,
    name: "High-Waist Trousers",
    category: "Bottoms",
    type: "Bottom",
    image: highWaistTrousers,
  },
  {
    id: 4,
    name: "Midi Wrap Dress",
    category: "Dresses",
    type: "Dress",
    image: midiWrapDress,
  },
  {
    id: 5,
    name: "Cashmere Sweater",
    category: "Tops",
    type: "Top",
    image: cashmereSweater,
  },
  {
    id: 6,
    name: "Wide-Leg Pants",
    category: "Bottoms",
    type: "Bottom",
    image: wideLegPants,
  },
  {
    id: 7,
    name: "Leather Loafers",
    category: "Shoes",
    type: "Shoes",
    image: leatherLoafers,
  },
  {
    id: 8,
    name: "Gold Pendant Necklace",
    category: "Accessories",
    type: "Accessory",
    image: goldNecklace,
  },
];


const categories = [
  { name: "All Items", icon: "▦" },
  { name: "Tops", icon: "♧" },
  { name: "Bottoms", icon: "♜" },
  { name: "Dresses", icon: "♙" },
  { name: "Shoes", icon: "⌒" },
  { name: "Accessories", icon: "◎" },
];


function Navbar({ page, setPage }) {
  const links = ["Home", "Wardrobe", "Style", "Chat", "Profile"];

  return (
    <header className="relative flex h-[78px] w-full items-center border-b border-[#E4DCCE] bg-[#F8F4EB] px-[30px]">

      {/* REAL DRIPCHECK LOGO */}
      <div className="flex w-[250px] items-center">
        <img
          src={dripcheckLogo}
          alt="DripCheck"
          className="w-[195px] object-contain"
        />
      </div>

      {/* NAVIGATION */}
      <nav className="absolute left-1/2 flex h-full -translate-x-1/2 items-center gap-[42px]">

        {links.map((link) => {
          const key = link.toLowerCase();

          const working = ["home", "wardrobe", "style", "chat", "profile"].includes(key);

          return (
            <button
              key={link}
              onClick={() => working && setPage(key)}
              className={`relative h-full border-none bg-transparent px-0 text-[15px] text-[#2E2924]
                ${page === key ? "font-semibold" : "font-normal"}
              `}
            >
              {link}

              {page === key && (
                <span className="absolute bottom-[18px] left-0 h-[2px] w-full bg-[#647553]" />
              )}
            </button>
          );
        })}

      </nav>
    </header>
  );
}


/* =========================================================
   HOME / COMMUNITY
========================================================= */
function CommunityPostMedia({ post }) {
  const [slide, setSlide] = useState(0);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef(null);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  if (post.mediaType === "carousel" && post.images?.length) {
    const images = post.images;
    const previous = (e) => {
      e.stopPropagation();
      setSlide((i) => (i === 0 ? images.length - 1 : i - 1));
    };
    const next = (e) => {
      e.stopPropagation();
      setSlide((i) => (i === images.length - 1 ? 0 : i + 1));
    };

    return (
      <div className="relative w-full overflow-hidden bg-[#F3EEE5]">
        <img
          src={images[slide]}
          alt={`${post.user} post ${slide + 1}`}
          className="block h-auto w-full object-contain"
        />
        <div className="absolute right-4 top-4 rounded-full bg-black/55 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-sm">
          {slide + 1}/{images.length}
        </div>
        <button type="button" onClick={previous} aria-label="Previous image" className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#FFF9F0]/90 text-[#302821] shadow-md backdrop-blur-sm transition hover:scale-105 hover:bg-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <button type="button" onClick={next} aria-label="Next image" className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#FFF9F0]/90 text-[#302821] shadow-md backdrop-blur-sm transition hover:scale-105 hover:bg-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="m9 18 6-6-6-6" /></svg>
        </button>
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-3 py-2 backdrop-blur-sm">
          {images.map((_, index) => (
            <button key={index} type="button" aria-label={`Go to image ${index + 1}`} onClick={(e) => { e.stopPropagation(); setSlide(index); }} className={`h-[7px] w-[7px] rounded-full transition-all ${index === slide ? "scale-125 bg-white" : "bg-white/50"}`} />
          ))}
        </div>
      </div>
    );
  }

  if (post.mediaType === "video" || post.video) {
    return (
      <div className="flex w-full justify-center bg-[#F8F4EB] py-[14px]">
        <div className="relative aspect-[9/16] w-[330px] max-w-[88%] overflow-hidden rounded-[12px] bg-black shadow-sm">
          <video
            ref={videoRef}
            src={post.video || post.image}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onClick={toggleVideo}
            className="absolute inset-0 h-full w-full cursor-pointer object-cover"
          />

          {/* Only show the centre control while the reel is PAUSED. */}
          {!playing && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); toggleVideo(); }}
              aria-label="Play reel"
              className="absolute left-1/2 top-1/2 flex h-[58px] w-[58px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white shadow-lg backdrop-blur-sm transition hover:scale-105 hover:bg-black/60"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7"><path d="M8 5v14l11-7L8 5Z" /></svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-[#F3EEE5]">
      <img src={post.image} alt={post.caption || "Community post"} className="block h-auto w-full object-contain" />
    </div>
  );
}

function HomePage({ setPage, openChatWith }) {
  const [backendPosts, setBackendPosts] = useState([]);

useEffect(() => {
  async function loadBackendPosts() {
    try {
      const response = await fetch(`${API_BASE}/posts`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Community API:", data);
        return;
      }

      const realPosts = data.posts || data || [];
      setBackendPosts(Array.isArray(realPosts) ? realPosts : []);

      console.log("✅ Real community posts loaded:", realPosts);
    } catch (error) {
      console.error("❌ Community API error:", error);
    }
  }

  loadBackendPosts();
}, []);
  const people = [
    { id: "atiya", name: "Atiya Fathima", username: "@atiya.f", initial: "A", style: "Minimal · Casual", online: true, mutuals: 6 },
    { id: "sara", name: "Sara", username: "@sara.styles", initial: "S", style: "Classic · Feminine", online: true, mutuals: 8 },
    { id: "maya", name: "Maya", username: "@maya.styles", initial: "M", style: "Neutral · Minimal", online: false, mutuals: 5 },
    { id: "aanya", name: "Aanya", username: "@aanyawears", initial: "A", style: "Streetwear · Everyday", online: false, mutuals: 4 },
    { id: "zoya", name: "Zoya", username: "@zoyawears", initial: "Z", style: "Modest · Chic", online: false, mutuals: 7 },
    { id: "meher", name: "Meher", username: "@meher.edit", initial: "M", style: "Earthy · Elegant", online: true, mutuals: 9 },
    { id: "aisha", name: "Aisha", username: "@aishalooks", initial: "A", style: "Modest · Everyday", online: false, mutuals: 6 },
    { id: "kiara", name: "Kiara", username: "@kiara.closet", initial: "K", style: "Clean · Contemporary", online: true, mutuals: 3 },
    { id: "noor", name: "Noor", username: "@noorwears", initial: "N", style: "Soft · Modest", online: false, mutuals: 8 },
    { id: "riya", name: "Riya", username: "@riya.daily", initial: "R", style: "Casual · College", online: true, mutuals: 5 },
    { id: "sana", name: "Sana", username: "@sana.styles", initial: "S", style: "Chic · Minimal", online: false, mutuals: 7 },
    { id: "myra", name: "Myra", username: "@myra.mood", initial: "M", style: "Vintage · Feminine", online: false, mutuals: 4 },
  ];

  const starterPosts = [
    { id: "community-1", userId: "maya", user: "Maya", username: "@maya.styles", caption: "Soft neutrals for a slow Sunday.", tags: "#minimal #neutralstyle #weekend", mediaType: "image", image: communityAsset("community post 1"), likes: 128, comments: [], liked: false, saved: false, mine: false },
    { id: "community-reel-2", userId: "aanya", user: "Aanya", username: "@aanyawears", caption: "A little outfit reel for the style circle ✦", tags: "#reel #outfitinspo #dripcheck", mediaType: "video", video: communityAsset("community post reel (2)"), likes: 184, comments: [], liked: false, saved: false, mine: false },
    { id: "community-3", userId: "sara", user: "Sara", username: "@sara.styles", caption: "Texture, layers and timeless neutrals.", tags: "#classicstyle #layers #fashion", mediaType: "image", image: communityAsset("community post 3"), likes: 216, comments: [], liked: false, saved: false, mine: false },
    { id: "community-4", userId: "zoya", user: "Zoya", username: "@zoyawears", caption: "Traditional, timeless, always a mood.", tags: "#ethnicwear #timeless #modeststyle", mediaType: "carousel", images: [communityAsset("community post 4 (1)"), communityAsset("community post 4 (2)"), communityAsset("community post 4(3)")].filter(Boolean), likes: 302, comments: [], liked: false, saved: false, mine: false },
    { id: "community-5", userId: "maya", user: "Maya", username: "@maya.styles", caption: "Saved this fit to the moodboard immediately.", tags: "#moodboard #everydaystyle #outfitideas", mediaType: "image", image: communityAsset("community post 5"), likes: 193, comments: [], liked: false, saved: false, mine: false },
  ];

  const [posts, setPosts] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("dripcheck-community-posts")) || [];
      // Keep posts created by the user, but refresh the built-in Community feed
      // so the old Unsplash demo posts are replaced by the new local assets.
      const myPosts = Array.isArray(stored) ? stored.filter((post) => post.mine) : [];
      let savedIds = [];
      try { savedIds = (JSON.parse(localStorage.getItem("dripcheck-saved-posts")) || []).map((p) => String(p.id)); } catch {}
      let likedIds = [];
      try { likedIds = (JSON.parse(localStorage.getItem("dripcheck-liked-posts")) || []).map((p) => String(p.id)); } catch {}
      return [...myPosts, ...starterPosts].map((post) => ({ ...post, saved: savedIds.includes(String(post.id)) || !!post.saved, liked: likedIds.includes(String(post.id)) || !!post.liked }));
    } catch {
      return starterPosts;
    }
  });
  const [following, setFollowing] = useState(() => { try { return JSON.parse(localStorage.getItem("dripcheck-following")) || ["atiya"]; } catch { return ["atiya"]; } });
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [postForm, setPostForm] = useState({ caption: "", tags: "", image: "", originalImage: "" });
  const [commentPost, setCommentPost] = useState(null);
  const [comment, setComment] = useState("");
  const [collaborators, setCollaborators] = useState([]);
  const [suggestionShuffle, setSuggestionShuffle] = useState(0);
  const [saveToast, setSaveToast] = useState(null);
  const [showCollectionPicker, setShowCollectionPicker] = useState(false);
  const [collectionPost, setCollectionPost] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [collections, setCollections] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dripcheck-save-collections")) || []; } catch { return []; }
  });

  useEffect(() => localStorage.setItem("dripcheck-community-posts", JSON.stringify(posts)), [posts]);
  useEffect(() => localStorage.setItem("dripcheck-save-collections", JSON.stringify(collections)), [collections]);
  useEffect(() => localStorage.setItem("dripcheck-following", JSON.stringify(following)), [following]);

  const toggleFollow = (id) => setFollowing((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const toggleLike = (id) => {
    setPosts((prev) => {
      const next = prev.map((x) => x.id === id ? { ...x, liked: !x.liked, likes: x.likes + (x.liked ? -1 : 1) } : x);
      const likedPosts = next.filter((x) => x.liked).map((x) => ({ ...x, liked: true }));
      localStorage.setItem("dripcheck-liked-posts", JSON.stringify(likedPosts));
      return next;
    });
  };
  const toggleSave = (id) => {
    const post = posts.find((x) => x.id === id);
    if (!post) return;
    const willSave = !post.saved;
    setPosts((p) => p.map((x) => x.id === id ? { ...x, saved: willSave } : x));
    let savedPosts = [];
    try { savedPosts = JSON.parse(localStorage.getItem("dripcheck-saved-posts")) || []; } catch {}
    if (willSave) {
      const snapshot = { ...post, saved: true, savedAt: Date.now() };
      const next = [snapshot, ...savedPosts.filter((x) => String(x.id) !== String(id))];
      localStorage.setItem("dripcheck-saved-posts", JSON.stringify(next));
      setSaveToast({ post: snapshot });
      setTimeout(() => setSaveToast(null), 4200);
    } else {
      localStorage.setItem("dripcheck-saved-posts", JSON.stringify(savedPosts.filter((x) => String(x.id) !== String(id))));
      setCollections((prev) => prev.map((c) => ({ ...c, postIds: (c.postIds || []).filter((pid) => String(pid) !== String(id)) })));
      setSaveToast(null);
    }
  };
  const openCollectionsFor = (post) => { setCollectionPost(post); setNewCollectionName(""); setShowCollectionPicker(true); setSaveToast(null); };
  const addPostToCollection = (collectionId) => {
    if (!collectionPost) return;
    setCollections((prev) => prev.map((c) => c.id === collectionId ? { ...c, postIds: [...new Set([...(c.postIds || []).map(String), String(collectionPost.id)])] } : c));
    setShowCollectionPicker(false); setCollectionPost(null);
  };
  const createCollectionAndAdd = () => {
    const name = newCollectionName.trim(); if (!name || !collectionPost) return;
    const created = { id: Date.now(), name, postIds: [String(collectionPost.id)], createdAt: Date.now() };
    setCollections((prev) => [created, ...prev]); setNewCollectionName(""); setShowCollectionPicker(false); setCollectionPost(null);
  };
  const handlePostImage = (e) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => setPostForm((p) => ({ ...p, image: r.result, originalImage: r.result })); r.readAsDataURL(f); };
  const createPost = () => {
    if (!postForm.caption.trim() || !postForm.image) { alert("Add an image and caption first."); return; }
    let profile = {}; try { profile = JSON.parse(localStorage.getItem("dripcheck-social-profile")) || {}; } catch {}
    setPosts((p) => [{ id: Date.now(), userId: "me", user: profile.name || "You", username: profile.username || "@dripcheck.me", caption: postForm.caption.trim(), tags: postForm.tags.trim(), image: postForm.image, likes: 0, comments: [], liked: false, saved: false, mine: true, collaborators }, ...p]);
    setPostForm({ caption: "", tags: "", image: "", originalImage: "" }); setCollaborators([]); setShowCreate(false);
  };
  const addComment = () => { if (!comment.trim() || !commentPost) return; setPosts((p) => p.map((x) => x.id === commentPost.id ? { ...x, comments: [...(x.comments || []), comment.trim()] } : x)); setComment(""); setCommentPost(null); };
  const deletePost = (id) => { if (window.confirm("Delete this post?")) setPosts((p) => p.filter((x) => x.id !== id)); };

  const q = search.trim().toLowerCase();
  const searchResults = q ? people.filter((p) => p.name.toLowerCase().includes(q) || p.username.toLowerCase().includes(q) || p.style.toLowerCase().includes(q)) : [];
  // One combined Community feed: discover + followed accounts together.
  const visiblePosts = posts;

  // Suggested accounts: never show Atiya, never show people already followed,
  // and prioritize people with more mutual connections. Refresh rotates the order.
  const suggestionPool = people
    .filter((person) => person.id !== "atiya" && !following.includes(person.id))
    .sort((a, b) => {
      const aScore = (a.mutuals || 0) * 10 + ((a.id.charCodeAt(0) + suggestionShuffle * 7) % 17);
      const bScore = (b.mutuals || 0) * 10 + ((b.id.charCodeAt(0) + suggestionShuffle * 11) % 17);
      return bScore - aScore;
    });
  const suggestedPeople = suggestionPool.length
    ? [...suggestionPool.slice(suggestionShuffle % suggestionPool.length), ...suggestionPool.slice(0, suggestionShuffle % suggestionPool.length)].slice(0, 4)
    : [];

  const shuffleSuggestions = () => setSuggestionShuffle((n) => n + 1);

  return (
    <div className="min-h-[calc(100vh-78px)] bg-[#F8F4EB]">
      {/* FULL-SCREEN DRIPCHECK AI HOME — fills everything below the 78px navbar */}
      <section className="relative h-[calc(100vh-78px)] w-full overflow-hidden bg-[#E9E2D5]">
        <img
          src={dripcheckHome}
          alt="DripCheck AI — Your Style. Smarter."
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Subtle bottom fade only for the controls */}
        <div className="absolute inset-x-0 bottom-0 h-[170px] bg-gradient-to-t from-[#1F291A]/75 via-[#1F291A]/25 to-transparent" />

        <div className="absolute bottom-[30px] right-[42px] z-10 flex gap-[10px]">
          <button onClick={()=>setPage("style")} className="rounded-full border border-white/70 bg-[#F8F4EB]/95 px-[22px] py-[12px] text-[11px] font-semibold tracking-[.09em] text-[#35442B] shadow-sm transition hover:bg-white">✦ ASK AI STYLIST</button>
          <button onClick={()=>document.getElementById("dripcheck-community-feed")?.scrollIntoView({behavior:"smooth"})} className="rounded-full border border-white/60 bg-[#40542E]/95 px-[22px] py-[12px] text-[11px] font-semibold tracking-[.09em] text-white shadow-sm transition hover:bg-[#35472A]">EXPLORE COMMUNITY ↓</button>
        </div>
      </section>

      {/* COMMUNITY STARTS ONLY AFTER THE FULL FIRST SCREEN */}
      <div
        className="relative bg-cover bg-top bg-no-repeat px-[55px] py-[34px]"
        style={{
          backgroundImage: `linear-gradient(rgba(248,244,235,0.78), rgba(248,244,235,0.78)), url(${communityBackground})`,
          backgroundAttachment: "fixed",
        }}
      >
        <div className="mx-auto max-w-[1260px]">
        <section id="dripcheck-community-feed" className="mb-[28px] flex items-end justify-between border-b border-[#DDD4C6] pb-[25px]">
          <div><p className="mb-[8px] text-[11px] font-semibold tracking-[.22em] text-[#60744F]">DRIPCHECK COMMUNITY</p><h1 className="m-0 text-[42px] font-medium leading-tight" style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>Your style circle.</h1><p className="mt-[10px] text-[14px] text-[#817970]">Follow people, discover outfits and message your fashion friends.</p></div>
          <button onClick={()=>setShowCreate(true)} className="rounded-full bg-[#60744F] px-[22px] py-[12px] text-[12px] font-semibold tracking-[.1em] text-white">＋ CREATE POST</button>
        </section>

        <div className="mb-[28px] rounded-[18px] border border-[#DDD4C6] bg-[#FFFCF8] p-[18px]">
          <div className="flex h-[48px] items-center rounded-full border border-[#DDD4C6] bg-[#F8F4EB] px-[17px]"><span className="mr-[10px]">⌕</span><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search people by name, username or style..." className="w-full bg-transparent text-[14px] outline-none"/></div>
          {q && <div className="mt-[14px] grid gap-[8px]">{searchResults.length ? searchResults.map((person)=><div key={person.id} className="flex items-center rounded-[13px] border border-[#E7E0D5] bg-white px-[14px] py-[11px]"><div className="relative flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#D8C7AF] font-serif text-[18px]">{person.initial}</div><div className="ml-[12px] flex-1"><p className="m-0 text-[14px] font-semibold">{person.name}</p><p className="mt-[2px] text-[11px] text-[#8B8379]">{person.username} · {person.style}</p></div><button onClick={()=>toggleFollow(person.id)} className={`mr-[8px] rounded-full px-[15px] py-[8px] text-[12px] ${following.includes(person.id)?"border border-[#D6CEBF] bg-white text-[#60744F]":"bg-[#60744F] text-white"}`}>{following.includes(person.id)?"Following":"Follow"}</button><button onClick={()=>openChatWith(person)} className="rounded-full border border-[#60744F] px-[15px] py-[8px] text-[12px] text-[#60744F]">Message</button></div>) : <p className="m-0 p-[8px] text-[13px] text-[#95836F]">No DripCheck users found.</p>}</div>}
        </div>

        <div className="grid grid-cols-[minmax(0,580px)_300px] justify-center gap-[36px]">
          <section>
            <div className="mb-[18px] flex items-center justify-end"><span className="text-[12px] text-[#95836F]">{visiblePosts.length} posts</span></div>
            <div className="space-y-[28px]">{visiblePosts.map((post)=>{const person=people.find((p)=>p.id===post.userId);return <article key={post.id} className="overflow-hidden rounded-[18px] border border-[#DDD4C6] bg-[#FFFCF8] shadow-[0_3px_12px_rgba(65,45,30,.05)]">
              <div className="flex items-center px-[18px] py-[14px]"><div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-[#D8C7AF] font-serif">{post.user?.[0]||"D"}</div><div className="ml-[11px] flex-1"><p className="m-0 text-[14px] font-semibold">{post.user}{post.collaborators?.length ? ` + ${post.collaborators.join(" + ")}` : ""}</p><p className="mt-[2px] text-[11px] text-[#958B80]">{post.username}{post.collaborators?.length ? " · Collab" : ""}</p></div>{!post.mine&&person&&<><button onClick={()=>toggleFollow(person.id)} className="mr-[12px] text-[12px] font-semibold text-[#60744F]">{following.includes(person.id)?"Following":"Follow"}</button><button onClick={()=>openChatWith(person)} className="mr-[12px] text-[12px] text-[#817970]">Message</button></>}{post.mine&&<button onClick={()=>deletePost(post.id)} className="text-[20px] text-[#9B625A]">×</button>}</div>
              <CommunityPostMedia post={post} />
              <div className="flex items-center justify-between px-[18px] pt-[14px]"><div className="flex gap-[19px]"><button onClick={()=>toggleLike(post.id)} className={`text-[14px] ${post.liked?"font-semibold text-[#60744F]":""}`}>{post.liked?"♥":"♡"} {post.likes}</button><button onClick={()=>setCommentPost(post)} className="text-[14px]">◯ {(post.comments||[]).length}</button></div><button onClick={()=>toggleSave(post.id)} aria-label={post.saved?"Remove from saved":"Save post"} title={post.saved?"Saved":"Save"} className={`flex h-8 w-8 items-center justify-center transition ${post.saved?"text-[#60744F]":"text-[#302821] hover:text-[#60744F]"}`}><svg viewBox="0 0 24 24" className="h-[23px] w-[23px]" fill={post.saved?"currentColor":"none"} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3.75h12v16.5l-6-4.2-6 4.2V3.75Z"/></svg></button></div>
              <div className="px-[18px] pb-[19px] pt-[11px]"><p className="m-0 text-[14px] leading-6"><b className="mr-[7px]">{post.user}</b>{post.caption}</p><p className="mb-0 mt-[6px] text-[11px] text-[#60744F]">{post.tags}</p></div>
            </article>})}</div>
          </section>
          <aside className="space-y-[20px]">
            <div className="rounded-[18px] border border-[#DDD4C6] bg-[#FFFCF8] p-[20px]">
              <div className="mb-[12px] flex items-center justify-between">
                <div>
                  <h3 className="m-0 text-[18px]" style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>Suggested for you</h3>
                  <p className="mb-0 mt-[3px] text-[10px] text-[#95836F]">Based on people in your style circle</p>
                </div>
                <button
                  type="button"
                  onClick={shuffleSuggestions}
                  title="Refresh suggestions"
                  aria-label="Refresh suggestions"
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#D8D0C3] bg-[#F8F4EB] text-[18px] text-[#60744F] transition hover:rotate-180 hover:bg-[#E8EDDF]"
                >
                  ↻
                </button>
              </div>

              {suggestedPeople.length ? suggestedPeople.map((person)=>(
                <div key={person.id} className="flex items-center py-[10px]">
                  <div className="flex h-[39px] w-[39px] items-center justify-center rounded-full bg-[#D8C7AF] font-serif">{person.initial}</div>
                  <div className="ml-[10px] flex-1">
                    <p className="m-0 text-[13px] font-semibold">{person.name}</p>
                    <p className="m-0 text-[10px] text-[#95836F]">{person.username}</p>
                    <p className="mb-0 mt-[2px] text-[9px] text-[#A59684]">{person.mutuals || 0} mutual connections</p>
                  </div>
                  <button onClick={()=>toggleFollow(person.id)} className="text-[11px] font-semibold text-[#60744F]">Follow</button>
                </div>
              )) : (
                <p className="py-[12px] text-[11px] text-[#95836F]">You're all caught up with suggestions.</p>
              )}
            </div>
            <div className="rounded-[18px] border border-[#D8D2C5] bg-[#E8EDDF] p-[24px]"><div className="mb-[14px] flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#60744F] text-white">✦</div><p className="text-[10px] font-semibold tracking-[.2em] text-[#60744F]">DRIPCHECK AI</p><h3 className="mt-[9px] text-[24px]" style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>Need help styling a look?</h3><button onClick={()=>setPage("style")} className="mt-[10px] border-b border-[#60744F] text-[11px] font-semibold text-[#60744F]">ASK YOUR STYLIST →</button></div>
          </aside>
        </div>
        </div>
      </div>
      {showCreate&&<ModalShell wide close={()=>setShowCreate(false)}><h2 className="mt-0 text-[30px]" style={{fontFamily:"Georgia, serif"}}>Create a post</h2><input type="file" accept="image/*" onChange={handlePostImage} className="w-full rounded-[10px] border border-[#DDD4C6] bg-white p-[10px]"/>{postForm.originalImage&&<PostEditor src={postForm.originalImage} onChange={(image)=>setPostForm(p=>({...p,image}))}/>}<div className="mt-[14px] grid grid-cols-1 gap-[12px] md:grid-cols-2"><textarea value={postForm.caption} onChange={(e)=>setPostForm({...postForm,caption:e.target.value})} placeholder="Write a caption..." className="h-[100px] w-full rounded-[10px] border border-[#DDD4C6] bg-[#FFFCF8] p-[12px]"/><div><input value={postForm.tags} onChange={(e)=>setPostForm({...postForm,tags:e.target.value})} placeholder="#collegefit #minimal" className="h-[46px] w-full rounded-[10px] border border-[#DDD4C6] bg-[#FFFCF8] px-[12px]"/><div className="mt-[10px] rounded-[12px] border border-[#DDD4C6] bg-white p-[12px]"><p className="mb-[8px] mt-0 text-[12px] font-semibold">Add collaborators</p><div className="flex flex-wrap gap-[7px]">{["Atiya","Sara","Zoya","Meher","Aisha"].map(name=><button key={name} onClick={()=>setCollaborators(prev=>prev.includes(name)?prev.filter(x=>x!==name):[...prev,name])} className={`rounded-full border px-[11px] py-[6px] text-[11px] ${collaborators.includes(name)?"border-[#60744F] bg-[#E8EDDF] text-[#40542E]":"border-[#DDD4C6]"}`}>{collaborators.includes(name)?"✓ ":"+ "}{name}</button>)}</div></div></div></div><button onClick={createPost} className="mt-[16px] h-[48px] w-full rounded-[10px] bg-[#60744F] text-white">Publish Post</button></ModalShell>}
      {saveToast&&<div className="fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-5 rounded-[14px] bg-[#302821] px-5 py-3 text-white shadow-2xl"><span className="text-[13px] font-medium">Saved</span><button onClick={()=>openCollectionsFor(saveToast.post)} className="text-[12px] font-semibold text-[#DDE8D1]">+ New collection</button></div>}
      {showCollectionPicker&&<ModalShell close={()=>{setShowCollectionPicker(false);setCollectionPost(null)}}><h2 className="mt-0 font-serif text-[27px]">Save to collection</h2><p className="mt-[-8px] text-[12px] text-[#8D8174]">Choose a collection or make a new one.</p>{collections.length>0&&<div className="mb-4 grid max-h-[220px] gap-2 overflow-auto">{collections.map(c=><button key={c.id} onClick={()=>addPostToCollection(c.id)} className="flex items-center justify-between rounded-xl border border-[#DED6C9] bg-[#FFFCF8] px-4 py-3 text-left"><span className="text-[14px] font-medium">{c.name}</span><span className="text-[11px] text-[#948575]">{(c.postIds||[]).length} saved</span></button>)}</div>}<div className="flex gap-2 border-t border-[#E6DED2] pt-4"><input autoFocus value={newCollectionName} onChange={e=>setNewCollectionName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&createCollectionAndAdd()} placeholder="New collection name" className="h-11 flex-1 rounded-xl border border-[#D8CFC1] bg-[#F8F4EB] px-3 text-[13px] outline-none focus:border-[#60744F]"/><button onClick={createCollectionAndAdd} className="rounded-xl bg-[#60744F] px-4 text-[12px] font-semibold text-white">Create</button></div></ModalShell>}
      {commentPost&&<ModalShell close={()=>setCommentPost(null)}><h2 className="mt-0 text-[24px]">Comments</h2><div className="max-h-[220px] overflow-auto">{(commentPost.comments||[]).length?(commentPost.comments||[]).map((c,i)=><p key={i} className="rounded-[9px] bg-[#F1EDE4] p-[10px] text-[13px]">{c}</p>):<p className="text-[13px] text-[#95836F]">No comments yet.</p>}</div><div className="mt-[15px] flex gap-[8px]"><input value={comment} onChange={(e)=>setComment(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&addComment()} placeholder="Add a comment..." className="h-[43px] flex-1 rounded-[9px] border border-[#DDD4C6] px-[12px]"/><button onClick={addComment} className="rounded-[9px] bg-[#60744F] px-[18px] text-white">Send</button></div></ModalShell>}
    </div>
  );
}

function PostEditor({src,onChange}) {
  const canvasRef=useRef(null);
  const [tab,setTab]=useState("Edit");
  const [crop,setCrop]=useState("Original");
  const [rotation,setRotation]=useState(0);
  const [mirror,setMirror]=useState(false);
  const [adjust,setAdjust]=useState({brightness:100,contrast:100,tones:100,whitepoint:0,highlights:0,shadows:0,pop:0,sharpen:0});
  const [filter,setFilter]=useState("Original");
  const [filterStrength,setFilterStrength]=useState(70);
  const [tool,setTool]=useState("none");
  const [textValue,setTextValue]=useState("");
  const [textItems,setTextItems]=useState([]);
  const [strokes,setStrokes]=useState([]);
  const drawing=useRef(null);

  const filters={Original:"",Warm:"warm",Editorial:"editorial",Soft:"soft",Olive:"olive",Mono:"mono",Vintage:"vintage"};
  const ratioMap={"1:1":1,"4:5":4/5,"3:4":3/4,"16:9":16/9};
  const cssFilter=()=>{
    const a=adjust,k=filterStrength/100;
    let extra="";
    if(filter==="Warm")extra=`sepia(${.18*k}) saturate(${1+.12*k})`;
    if(filter==="Editorial")extra=`contrast(${1+.12*k}) saturate(${1-.18*k})`;
    if(filter==="Soft")extra=`brightness(${1+.05*k}) contrast(${1-.08*k}) saturate(${1-.1*k})`;
    if(filter==="Olive")extra=`sepia(${.14*k}) hue-rotate(${25*k}deg) saturate(${1-.14*k})`;
    if(filter==="Mono")extra=`grayscale(${k})`;
    if(filter==="Vintage")extra=`sepia(${.28*k}) contrast(${1-.08*k}) saturate(${1-.18*k})`;
    return `brightness(${a.brightness+a.whitepoint*.25}%) contrast(${a.contrast+a.pop*.35}%) saturate(${a.tones}%) ${extra}`;
  };

  const render=()=>{
    const canvas=canvasRef.current;if(!canvas||!src)return;
    const img=new Image();img.onload=()=>{
      let sw=img.width,sh=img.height,sx=0,sy=0;
      const wanted=ratioMap[crop]; if(wanted){const current=sw/sh;if(current>wanted){const nw=sh*wanted;sx=(sw-nw)/2;sw=nw}else{const nh=sw/wanted;sy=(sh-nh)/2;sh=nh}}
      const sideways=Math.abs(rotation%180)===90;
      const max=900, baseW=sw,baseH=sh,scale=Math.min(1,max/Math.max(baseW,baseH));
      const dw=Math.round(baseW*scale),dh=Math.round(baseH*scale);
      canvas.width=sideways?dh:dw;canvas.height=sideways?dw:dh;
      const ctx=canvas.getContext("2d");ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();ctx.translate(canvas.width/2,canvas.height/2);ctx.rotate(rotation*Math.PI/180);ctx.scale(mirror?-1:1,1);ctx.filter=cssFilter();ctx.drawImage(img,sx,sy,sw,sh,-dw/2,-dh/2,dw,dh);ctx.restore();
      // subtle highlight/shadow approximation
      if(adjust.highlights!==0){ctx.save();ctx.globalCompositeOperation=adjust.highlights>0?"screen":"multiply";ctx.globalAlpha=Math.abs(adjust.highlights)/300;ctx.fillStyle=adjust.highlights>0?"white":"black";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.restore()}
      if(adjust.shadows!==0){ctx.save();ctx.globalCompositeOperation=adjust.shadows>0?"screen":"multiply";ctx.globalAlpha=Math.abs(adjust.shadows)/450;ctx.fillStyle=adjust.shadows>0?"#777":"#111";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.restore()}
      if(adjust.sharpen>0){
        const imageData=ctx.getImageData(0,0,canvas.width,canvas.height),d=imageData.data,w=canvas.width,h=canvas.height,srcData=new Uint8ClampedArray(d),amt=(adjust.sharpen/100)*.65;
        for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){const i=(y*w+x)*4;for(let c=0;c<3;c++){const center=srcData[i+c]*5,left=srcData[i-4+c],right=srcData[i+4+c],up=srcData[i-w*4+c],down=srcData[i+w*4+c];const sharp=center-left-right-up-down;d[i+c]=Math.max(0,Math.min(255,srcData[i+c]*(1-amt)+sharp*amt));}}
        ctx.putImageData(imageData,0,0);
      }
      textItems.forEach(t=>{ctx.save();ctx.font=`600 ${Math.max(22,canvas.width*.045)}px Arial`;ctx.textAlign="center";ctx.lineWidth=4;ctx.strokeStyle="rgba(0,0,0,.35)";ctx.fillStyle="#fff";ctx.strokeText(t.text,t.x*canvas.width,t.y*canvas.height);ctx.fillText(t.text,t.x*canvas.width,t.y*canvas.height);ctx.restore()});
      strokes.forEach(st=>{if(st.points.length<2)return;ctx.save();ctx.lineCap="round";ctx.lineJoin="round";ctx.strokeStyle=st.kind==="highlighter"?"rgba(255,230,80,.38)":"#fff";ctx.lineWidth=st.kind==="highlighter"?Math.max(18,canvas.width*.035):Math.max(3,canvas.width*.006);ctx.beginPath();st.points.forEach((pt,i)=>{const x=pt.x*canvas.width,y=pt.y*canvas.height;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();ctx.restore()});
      onChange(canvas.toDataURL("image/jpeg",.92));
    };img.src=src;
  };
  useEffect(render,[src,crop,rotation,mirror,adjust,filter,filterStrength,textItems,strokes]);
  const reset=()=>{setCrop("Original");setRotation(0);setMirror(false);setAdjust({brightness:100,contrast:100,tones:100,whitepoint:0,highlights:0,shadows:0,pop:0,sharpen:0});setFilter("Original");setFilterStrength(70);setTextItems([]);setStrokes([]);setTool("none")};
  const pos=(e)=>{const r=canvasRef.current.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height}};
  const down=e=>{if(tool!=="markup"&&tool!=="highlighter")return;drawing.current={kind:tool,points:[pos(e)]};setStrokes(v=>[...v,drawing.current])};
  const move=e=>{if(!drawing.current)return;drawing.current.points.push(pos(e));setStrokes(v=>[...v.slice(0,-1),{...drawing.current,points:[...drawing.current.points]}])};
  const up=()=>drawing.current=null;
  const addText=()=>{if(!textValue.trim())return;setTextItems(v=>[...v,{text:textValue.trim(),x:.5,y:.5}]);setTextValue("");setTool("none")};
  const slider=(key,label,min=0,max=200)=><label className="block"><div className="mb-1 flex justify-between text-[11px]"><span>{label}</span><span>{adjust[key]}</span></div><input type="range" min={min} max={max} value={adjust[key]} onChange={e=>setAdjust(a=>({...a,[key]:+e.target.value}))} className="w-full accent-[#60744F]"/></label>;
  return <div className="mt-[14px] overflow-hidden rounded-[16px] border border-[#DDD4C6] bg-[#F2EEE6]">
    <div className="flex border-b border-[#DDD4C6] bg-[#FFFCF8]">{["Edit","Filters"].map(x=><button key={x} onClick={()=>setTab(x)} className={`px-[22px] py-[12px] text-[12px] font-semibold ${tab===x?"border-b-2 border-[#60744F] text-[#40542E]":"text-[#8B8379]"}`}>{x}</button>)}<button onClick={reset} className="ml-auto px-[18px] text-[11px] text-[#8E5B52]">Reset</button></div>
    <div className="grid min-h-[430px] grid-cols-1 lg:grid-cols-[1fr_300px]">
      <div className="flex min-h-[420px] items-center justify-center bg-[#DDD7CC] p-[18px]"><canvas ref={canvasRef} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerLeave={up} className={`max-h-[500px] max-w-full rounded-[8px] shadow-lg ${tool==="markup"||tool==="highlighter"?"cursor-crosshair":""}`}/></div>
      <div className="max-h-[500px] overflow-y-auto bg-[#FFFCF8] p-[16px]">
        {tab==="Edit"?<div className="space-y-[16px]">
          <div><p className="mb-2 text-[11px] font-semibold tracking-[.12em] text-[#60744F]">CROP</p><div className="flex flex-wrap gap-2">{["Original","1:1","4:5","3:4","16:9"].map(x=><button key={x} onClick={()=>setCrop(x)} className={`rounded-full border px-3 py-1.5 text-[10px] ${crop===x?"border-[#60744F] bg-[#E8EDDF]":"border-[#DDD4C6]"}`}>{x}</button>)}</div></div>
          <div><p className="mb-2 text-[11px] font-semibold tracking-[.12em] text-[#60744F]">TRANSFORM</p><div className="grid grid-cols-3 gap-2"><button onClick={()=>setRotation(r=>(r-90)%360)} className="rounded-lg border p-2 text-[11px]">↶ Rotate</button><button onClick={()=>setRotation(r=>(r+90)%360)} className="rounded-lg border p-2 text-[11px]">↷ Rotate</button><button onClick={()=>setMirror(v=>!v)} className={`rounded-lg border p-2 text-[11px] ${mirror?"bg-[#E8EDDF]":""}`}>↔ Mirror</button></div></div>
          <div className="space-y-3"><p className="mb-0 text-[11px] font-semibold tracking-[.12em] text-[#60744F]">ADJUST</p>{slider("brightness","Brightness",40,160)}{slider("contrast","Contrast",40,180)}{slider("tones","Tones / Saturation",0,200)}{slider("whitepoint","White Point",-100,100)}{slider("highlights","Highlights",-100,100)}{slider("shadows","Shadows",-100,100)}{slider("pop","Pop",0,100)}{slider("sharpen","Sharpen",0,100)}</div>
          <div><p className="mb-2 text-[11px] font-semibold tracking-[.12em] text-[#60744F]">CREATE</p><div className="grid grid-cols-3 gap-2"><button onClick={()=>setTool("text")} className={`rounded-lg border p-2 text-[11px] ${tool==="text"?"bg-[#E8EDDF]":""}`}>T Text</button><button onClick={()=>setTool("markup")} className={`rounded-lg border p-2 text-[11px] ${tool==="markup"?"bg-[#E8EDDF]":""}`}>✎ Markup</button><button onClick={()=>setTool("highlighter")} className={`rounded-lg border p-2 text-[11px] ${tool==="highlighter"?"bg-[#E8EDDF]":""}`}>▰ Highlight</button></div>{tool==="text"&&<div className="mt-2 flex gap-2"><input value={textValue} onChange={e=>setTextValue(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addText()} placeholder="Type text..." className="min-w-0 flex-1 rounded-lg border px-2 text-[11px]"/><button onClick={addText} className="rounded-lg bg-[#60744F] px-3 py-2 text-[10px] text-white">Add</button></div>}<div className="mt-2 flex gap-2">{textItems.length>0&&<button onClick={()=>setTextItems(v=>v.slice(0,-1))} className="text-[10px] text-[#8E5B52]">Undo text</button>}{strokes.length>0&&<button onClick={()=>setStrokes(v=>v.slice(0,-1))} className="text-[10px] text-[#8E5B52]">Undo stroke</button>}</div></div>
        </div>:<div><p className="mb-3 text-[11px] font-semibold tracking-[.12em] text-[#60744F]">FILTERS</p><div className="grid grid-cols-2 gap-2">{Object.keys(filters).map(x=><button key={x} onClick={()=>setFilter(x)} className={`rounded-xl border px-3 py-3 text-[11px] ${filter===x?"border-[#60744F] bg-[#E8EDDF] text-[#40542E]":"border-[#DDD4C6]"}`}>{x}</button>)}</div><label className="mt-5 block"><div className="mb-1 flex justify-between text-[11px]"><span>Filter strength</span><span>{filterStrength}%</span></div><input type="range" min="0" max="100" value={filterStrength} onChange={e=>setFilterStrength(+e.target.value)} className="w-full accent-[#60744F]"/></label><p className="mt-5 text-[10px] leading-5 text-[#95836F]">Tip: use Edit for crop, rotate, mirror and detailed adjustments. Your published post uses the edited image.</p></div>}
      </div>
    </div>
  </div>
}

/* =========================================================
   CHAT / MESSAGES
========================================================= */
function ChatPage({ chatTarget, clearChatTarget }) {
  const [backendConversations, setBackendConversations] = useState([]);

useEffect(() => {
  async function loadBackendConversations() {
    try {
      const response = await fetch(`${API_BASE}/conversations`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Chat API:", data);
        return;
      }

      const realConversations =
        data.conversations || data.items || data || [];

      setBackendConversations(
        Array.isArray(realConversations) ? realConversations : []
      );

      console.log(
        "✅ Real conversations loaded:",
        realConversations
      );
    } catch (error) {
      console.error("❌ Chat API error:", error);
    }
  }

  loadBackendConversations();
}, []);
  const people = [
    { id:"atiya", name:"Atiya Fathima", username:"@atiya.f", initial:"A", bio:"minimal fits, coffee & college days ✦", followers:400, following:453, online:true },
    { id:"sara", name:"Sara", username:"@sara.styles", initial:"S", bio:"soft silhouettes + everyday style", followers:286, following:319, online:true },
    { id:"zoya", name:"Zoya", username:"@zoyawears", initial:"Z", bio:"modest fashion & little details ♡", followers:198, following:245, online:false },
    { id:"meher", name:"Meher", username:"@meher.edit", initial:"M", bio:"college fits & colour", followers:154, following:211, online:false },
    { id:"aisha", name:"Aisha", username:"@aisha.looks", initial:"A", bio:"outfit repeats are cool actually", followers:321, following:276, online:true },
  ];

  const starter = [
    { id:1, personId:"atiya", name:"Atiya", username:"@atiya.f", initial:"A", online:true, group:false, nickname:"", members:[], messages:[
      {id:1,from:"them",sender:"Atiya",type:"text",text:"Heyyy! Did you decide what you're wearing tomorrow?"},
      {id:2,from:"me",sender:"You",type:"text",text:"Not yet 😭 I'm deciding between two outfits."},
      {id:3,from:"them",sender:"Atiya",type:"text",text:"Send both! I'll help you choose 👀"},
      {id:4,from:"them",sender:"Atiya",type:"text",text:"Omg yes this one!! 🤎"}
    ]},
    { id:2, personId:"sara", name:"Sara", username:"@sara.styles", initial:"S", online:true, group:false, nickname:"", members:[], messages:[{id:1,from:"them",sender:"Sara",type:"text",text:"Where did you get that top?"}] },
    { id:3, name:"College Fits", username:"4 members", initial:"C", online:false, group:true, nickname:"", members:["Atiya","Sara","Meher","You"], messages:[{id:1,from:"them",sender:"Meher",type:"text",text:"sending my outfit now"}] },
    { id:4, personId:"zoya", name:"Zoya", username:"@zoyawears", initial:"Z", online:false, group:false, nickname:"", members:[], messages:[{id:1,from:"them",sender:"Zoya",type:"text",text:"Loved the look you posted!"}] },
    { id:5, name:"Fashion Girls", username:"6 members", initial:"F", online:false, group:true, nickname:"", members:["Aisha","Atiya","Sara","Zoya","Meher","You"], messages:[{id:1,from:"them",sender:"Aisha",type:"text",text:"What are we wearing tomorrow?"}] }
  ];

  const [chats,setChats]=useState(()=>{try{return JSON.parse(localStorage.getItem("dripcheck-chats"))||starter}catch{return starter}});
  const [selectedId,setSelectedId]=useState(null);
  const [text,setText]=useState("");
  const [search,setSearch]=useState("");
  const [messageSearch,setMessageSearch]=useState("");
  const [showNew,setShowNew]=useState(false);
  const [newMode,setNewMode]=useState("chat");
  const [newName,setNewName]=useState("");
  const [groupMembers,setGroupMembers]=useState([]);
  const [showDetails,setShowDetails]=useState(false);
  const [showProfile,setShowProfile]=useState(false);
  const [showPayment,setShowPayment]=useState(false);
  const [showCall,setShowCall]=useState(null);
  const [showMedia,setShowMedia]=useState(false);
  const [nickname,setNickname]=useState("");
  const [payment,setPayment]=useState({amount:"",note:""});
  const [showEmojiPicker,setShowEmojiPicker]=useState(false);
  const [showCamera,setShowCamera]=useState(false);
  const [cameraError,setCameraError]=useState("");
  const videoRef=useRef(null);
  const cameraStreamRef=useRef(null);
  const [reactionTarget,setReactionTarget]=useState(null);
  const [showReactionPicker,setShowReactionPicker]=useState(false);
  const [editingQuickReactions,setEditingQuickReactions]=useState(false);
  const [quickReactions,setQuickReactions]=useState(()=>{try{return JSON.parse(localStorage.getItem("dripcheck-quick-reactions"))||["❤️","😂","😭","🔥","👍","😮"]}catch{return ["❤️","😂","😭","🔥","👍","😮"]}});
  const [recentEmojis,setRecentEmojis]=useState(()=>{try{return JSON.parse(localStorage.getItem("dripcheck-recent-emojis"))||["😂","❤️","😭","✨","🔥","🥹","😍","🤎"]}catch{return ["😂","❤️","😭","✨","🔥","🥹","😍","🤎"]}});
  const [following,setFollowing]=useState(()=>{try{return JSON.parse(localStorage.getItem("dripcheck-following"))||["atiya"]}catch{return ["atiya"]}});
  const [messageRequests,setMessageRequests]=useState(()=>{try{return JSON.parse(localStorage.getItem("dripcheck-message-requests"))||[
    {id:"req-riya",personId:"riya",name:"Riya",username:"@riya.wears",initial:"R",online:true,preview:"Hey! I loved your last outfit post ✦"},
    {id:"req-noor",personId:"noor",name:"Noor",username:"@noor.styles",initial:"N",online:false,preview:"Hi! Can I ask where your blazer is from?"}
  ]}catch{return []}});
  const [showRequests,setShowRequests]=useState(false);
  const [communityPosts]=useState(()=>{try{return JSON.parse(localStorage.getItem("dripcheck-community-posts"))||[]}catch{return []}});
  const [savedChatMedia,setSavedChatMedia]=useState(()=>{try{return JSON.parse(localStorage.getItem("dripcheck-saved-chat-media"))||[]}catch{return []}});
  const [messageMenu,setMessageMenu]=useState(null);
  const [selectedMessages,setSelectedMessages]=useState([]);
  const [selectionMode,setSelectionMode]=useState(false);
  const [editingMessage,setEditingMessage]=useState(null);
  const [replyingTo,setReplyingTo]=useState(null);

  useEffect(()=>localStorage.setItem("dripcheck-chats",JSON.stringify(chats)),[chats]);
  useEffect(()=>localStorage.setItem("dripcheck-following",JSON.stringify(following)),[following]);
  useEffect(()=>localStorage.setItem("dripcheck-message-requests",JSON.stringify(messageRequests)),[messageRequests]);
  useEffect(()=>localStorage.setItem("dripcheck-quick-reactions",JSON.stringify(quickReactions)),[quickReactions]);
  useEffect(()=>localStorage.setItem("dripcheck-recent-emojis",JSON.stringify(recentEmojis)),[recentEmojis]);
  useEffect(()=>localStorage.setItem("dripcheck-saved-chat-media",JSON.stringify(savedChatMedia)),[savedChatMedia]);

  // Close floating emoji/reaction/message menus when clicking elsewhere or pressing Escape.
  useEffect(()=>{
    const closeFloating=(e)=>{
      if(e.target.closest?.("[data-drip-popover='true']"))return;
      setShowEmojiPicker(false);
      setReactionTarget(null);
      setShowReactionPicker(false);
      setMessageMenu(null);
    };
    const onKey=(e)=>{
      if(e.key!=="Escape")return;
      setShowEmojiPicker(false);setReactionTarget(null);setShowReactionPicker(false);setMessageMenu(null);
      if(selectionMode){setSelectionMode(false);setSelectedMessages([]);}
    };
    document.addEventListener("mousedown",closeFloating);
    document.addEventListener("keydown",onKey);
    return()=>{document.removeEventListener("mousedown",closeFloating);document.removeEventListener("keydown",onKey);};
  },[selectionMode]);

  useEffect(()=>{
    if(!chatTarget)return;
    const personId=chatTarget.id||chatTarget.username;
    if(!following.includes(personId)){
      alert(`Follow ${chatTarget.name} first before messaging them.`);
      clearChatTarget?.();
      return;
    }
    setChats(prev=>{
      const found=prev.find(c=>c.username===chatTarget.username);
      if(found){setSelectedId(found.id);return prev;}
      const created={id:Date.now(),personId,name:chatTarget.name,username:chatTarget.username,initial:chatTarget.initial||chatTarget.name?.[0]?.toUpperCase()||"D",online:!!chatTarget.online,group:false,nickname:"",members:[],messages:[]};
      setSelectedId(created.id);
      return [created,...prev];
    });
    clearChatTarget?.();
  },[chatTarget,following]);

  const acceptMessageRequest=(req)=>{
    setFollowing(prev=>prev.includes(req.personId)?prev:[...prev,req.personId]);
    const storedFollowers=(()=>{try{return JSON.parse(localStorage.getItem("dripcheck-followers"))||[]}catch{return []}})();
    if(!storedFollowers.some(x=>x.id===req.personId)) localStorage.setItem("dripcheck-followers",JSON.stringify([...storedFollowers,{id:req.personId,name:req.name,username:req.username,bio:"DripCheck community member ✦",initial:req.initial}]));
    setChats(prev=>{
      const found=prev.find(c=>c.username===req.username);
      if(found){setSelectedId(found.id);return prev;}
      const c={id:Date.now(),personId:req.personId,name:req.name,username:req.username,initial:req.initial,online:req.online,group:false,nickname:"",members:[],messages:[{id:Date.now()+1,from:"them",sender:req.name,type:"text",text:req.preview}]};
      setSelectedId(c.id);return [c,...prev];
    });
    setMessageRequests(prev=>prev.filter(x=>x.id!==req.id));
    setShowRequests(false);
  };
  const declineMessageRequest=(id)=>setMessageRequests(prev=>prev.filter(x=>x.id!==id));

  const active=chats.find(c=>c.id===selectedId)||null;
  const displayName=active?.nickname?.trim()||active?.name||"";
  const visible=chats.filter(c=>{
    const q=search.toLowerCase();
    const last=c.messages?.[c.messages.length-1];
    return c.name.toLowerCase().includes(q)||(c.nickname||"").toLowerCase().includes(q)||c.username.toLowerCase().includes(q)||(last?.text||"").toLowerCase().includes(q);
  });
  const shownMessages=(active?.messages||[]).filter(m=>!messageSearch.trim()||(m.text||m.note||"").toLowerCase().includes(messageSearch.toLowerCase()));
  const activePerson=people.find(p=>p.id===active?.personId||p.username===active?.username)||{
    id:active?.personId||active?.username,name:active?.name,username:active?.username,initial:active?.initial||"D",bio:"DripCheck community member ✦",followers:128,following:176,online:active?.online
  };
  const personPosts=communityPosts.filter(p=>!p.mine&&(p.userId===activePerson?.id||p.username===activePerson?.username)).slice(0,9);
  const fallbackPosts=[
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80"
  ];
  const media=(active?.messages||[]).filter(m=>m.type==="image"||m.type==="video");

  const send=()=>{
    if(!text.trim()||!active)return;
    if(editingMessage){
      setChats(prev=>prev.map(c=>c.id!==active.id?c:{...c,messages:c.messages.map(m=>m.id===editingMessage.id?{...m,text:text.trim(),edited:true}:m)}));
      setEditingMessage(null);setText("");return;
    }
    const msg={id:Date.now(),from:"me",sender:"You",type:"text",text:text.trim(),replyTo:replyingTo?{id:replyingTo.id,sender:replyingTo.sender||replyingTo.from,text:replyingTo.text||replyingTo.note||replyingTo.type}:null};
    setChats(p=>p.map(c=>c.id===active.id?{...c,messages:[...c.messages,msg]}:c));
    setText("");setReplyingTo(null);
  };

  const unsendMessage=(m)=>{
    if(!active||m.from!=="me")return;
    setChats(prev=>prev.map(c=>c.id!==active.id?c:{...c,messages:c.messages.map(x=>x.id===m.id?{id:x.id,from:x.from,sender:x.sender,type:"text",text:"You unsent a message",unsent:true}:x)}));
    setMessageMenu(null);
  };
  const editMessage=(m)=>{if(m.from!=="me"||m.type!=="text"||m.unsent)return;setEditingMessage(m);setReplyingTo(null);setText(m.text||"");setMessageMenu(null);};
  const copyMessage=async(m)=>{const value=m.text||m.note||"";if(!value)return;try{await navigator.clipboard.writeText(value);}catch{}setMessageMenu(null);};
  const pinMessage=(m)=>{setChats(prev=>prev.map(c=>c.id!==active.id?c:{...c,messages:c.messages.map(x=>x.id===m.id?{...x,pinned:!x.pinned}:x)}));setMessageMenu(null);};
  const replyMessage=(m)=>{setReplyingTo(m);setEditingMessage(null);setMessageMenu(null);};
  const shareMessage=async(m)=>{
    const value=m.text||m.note||(m.type==="image"?"Photo shared on DripCheck":m.type==="video"?"Reel shared on DripCheck":"DripCheck message");
    try{if(navigator.share)await navigator.share({title:"DripCheck message",text:value});else await navigator.clipboard.writeText(value);}catch{}
    setMessageMenu(null);
  };
  const toggleSelectMessage=(id)=>setSelectedMessages(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const beginSelect=(m)=>{setSelectionMode(true);setSelectedMessages([m.id]);setMessageMenu(null);};
  const deleteSelected=()=>{
    if(!active||!selectedMessages.length)return;
    if(!window.confirm(`Delete ${selectedMessages.length} selected message${selectedMessages.length>1?"s":""}?`))return;
    setChats(prev=>prev.map(c=>c.id!==active.id?c:{...c,messages:c.messages.filter(m=>!selectedMessages.includes(m.id))}));
    setSelectedMessages([]);setSelectionMode(false);
  };

  const sendMedia=(e)=>{
    const file=e.target.files?.[0]; if(!file||!active)return;
    const isVideo=file.type.startsWith("video/");
    const reader=new FileReader();
    reader.onload=()=>setChats(p=>p.map(c=>c.id===active.id?{...c,messages:[...c.messages,{id:Date.now(),from:"me",sender:"You",type:isVideo?"video":"image",image:reader.result,text:isVideo?"Reel / video":"Photo"}]}:c));
    reader.readAsDataURL(file); e.target.value="";
  };

  const saveSharedMedia=(m)=>{
    if(!m?.image)return;
    setSavedChatMedia(prev=>prev.some(x=>x.messageId===m.id&&x.chatId===active?.id)?prev:[{messageId:m.id,chatId:active?.id,type:m.type,src:m.image,sender:m.sender||active?.name,savedAt:Date.now()},...prev]);
  };

  const downloadSharedMedia=(m)=>{
    if(!m?.image)return;
    const a=document.createElement("a");
    a.href=m.image;
    a.download=`dripcheck-${m.type==="video"?"reel":"photo"}-${m.id}.${m.type==="video"?"mp4":"jpg"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const stopCamera=()=>{
    cameraStreamRef.current?.getTracks().forEach(track=>track.stop());
    cameraStreamRef.current=null;
    if(videoRef.current)videoRef.current.srcObject=null;
    setShowCamera(false);
  };

  const openCamera=async()=>{
    if(!active)return;
    setCameraError("");
    setShowCamera(true);
    try{
      if(!navigator.mediaDevices?.getUserMedia)throw new Error("Camera access is not supported in this browser.");
      const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"user"}},audio:false});
      cameraStreamRef.current=stream;
      setTimeout(()=>{
        if(videoRef.current){
          videoRef.current.srcObject=stream;
          videoRef.current.play().catch(()=>{});
        }
      },0);
    }catch(err){
      console.error(err);
      setCameraError(err?.name==="NotAllowedError"?"Camera permission was blocked. Allow camera access in your browser and try again.":"Could not open the camera. Make sure a camera is connected and camera permission is allowed.");
    }
  };

  const capturePhoto=()=>{
    const video=videoRef.current;
    if(!video||!active||!video.videoWidth||!video.videoHeight)return;
    const canvas=document.createElement("canvas");
    canvas.width=video.videoWidth;
    canvas.height=video.videoHeight;
    const ctx=canvas.getContext("2d");
    ctx.translate(canvas.width,0);
    ctx.scale(-1,1);
    ctx.drawImage(video,0,0,canvas.width,canvas.height);
    const image=canvas.toDataURL("image/jpeg",0.92);
    setChats(p=>p.map(c=>c.id===active.id?{...c,messages:[...c.messages,{id:Date.now(),from:"me",sender:"You",type:"image",image,text:"Camera photo"}]}:c));
    stopCamera();
  };

  useEffect(()=>()=>{
    cameraStreamRef.current?.getTracks().forEach(track=>track.stop());
  },[]);

  const openNew=(mode)=>{setNewMode(mode);setNewName("");setGroupMembers([]);setShowNew(true)};
  const addChat=()=>{
    if(newMode==="chat"){
      if(!newName.trim())return;
      const match=people.find(p=>p.name.toLowerCase().includes(newName.trim().toLowerCase())||p.username.toLowerCase()===newName.trim().toLowerCase());
      const personId=match?.id||newName.trim().toLowerCase().replace(/\s+/g,"-");
      if(!following.includes(personId)){alert("You need to follow this person before starting a chat.");return;}
      const c={id:Date.now(),personId,name:match?.name||newName.trim(),username:match?.username||"@"+newName.trim().toLowerCase().replace(/\s+/g,"."),initial:(match?.initial||newName.trim()[0]).toUpperCase(),online:!!match?.online,group:false,nickname:"",members:[],messages:[]};
      setChats(p=>[c,...p]);setSelectedId(c.id);
    }else{
      if(!newName.trim()||groupMembers.length<2){alert("Add a group name and at least 2 people.");return;}
      const c={id:Date.now(),name:newName.trim(),username:`${groupMembers.length+1} members`,initial:newName.trim()[0].toUpperCase(),online:false,group:true,nickname:"",members:[...groupMembers,"You"],messages:[]};
      setChats(p=>[c,...p]);setSelectedId(c.id);
    }
    setShowNew(false);setNewName("");setGroupMembers([]);
  };

  const saveNickname=()=>{
    if(!active)return;
    setChats(p=>p.map(c=>c.id===active.id?{...c,nickname:nickname.trim()}:c));
    setShowDetails(false);
  };

  const removeChat=()=>{
    if(!active||!window.confirm(`Delete ${active.group?"group":"conversation"} ${active.name}?`))return;
    const next=chats.filter(c=>c.id!==active.id);setChats(next);setSelectedId(next[0]?.id||null);setShowDetails(false);
  };

  const addPaymentCard=()=>{
    if(!active||!payment.amount.trim())return;
    const msg={id:Date.now(),from:"me",sender:"You",type:"payment",amount:payment.amount.trim(),note:payment.note.trim(),text:`Payment request ₹${payment.amount.trim()}`};
    setChats(p=>p.map(c=>c.id===active.id?{...c,messages:[...c.messages,msg]}:c));
    setPayment({amount:"",note:""});setShowPayment(false);
  };

  const toggleFollow=()=>setFollowing(prev=>prev.includes(activePerson.id)?prev.filter(x=>x!==activePerson.id):[...prev,activePerson.id]);

  const emojiGroups = {
    "Smileys": ["😀","😃","😄","😁","😆","😅","😂","🤣","😊","😇","🙂","🙃","😉","😌","😍","🥰","😘","😗","😙","😚","😋","😛","😝","😜","🤪","🤨","🧐","🤓","😎","🥳","😏","😒","😞","😔","😟","😕","🙁","☹️","😣","😖","😫","😩","🥺","🥹","😢","😭","😤","😠","😡","🤬","🤯","😳","🥵","🥶","😱","😨","😰","😥","😓","🤗","🤔","🫣","🤭","🫢","🫡","🤫","🫠","🤥","😶","😐","😑","😬","🙄","😯","😦","😧","😮","😲","🥱","😴","🤤","😪"],
    "People": ["👋","🤚","🖐️","✋","🖖","👌","🤌","🤏","✌️","🤞","🫰","🤟","🤘","🤙","👈","👉","👆","👇","☝️","👍","👎","✊","👊","🤛","🤜","👏","🙌","🫶","👐","🤲","🤝","🙏","✍️","💅","🤳","💪","🫂","👀","🧠","🫀"],
    "Hearts": ["❤️","🩷","🧡","💛","💚","💙","🩵","💜","🤎","🖤","🩶","🤍","💔","❤️‍🔥","❤️‍🩹","💕","💞","💓","💗","💖","💘","💝","💟","♥️","❣️","💋","💯"],
    "Fashion": ["👗","👚","👕","👖","🩳","👔","🧥","🥼","🦺","👘","🥻","🩱","👙","👛","👜","👝","🎒","🩴","👠","👡","👢","👞","👟","🥿","🧢","👒","🎩","👑","💍","💎","🕶️","🧣","🧤","🧦","✨","🪞","🪡","🧵"],
    "Food": ["☕","🧋","🥤","🍵","🍰","🧁","🍫","🍓","🍒","🍉","🍕","🍟","🍔","🥗","🍜","🍝","🍣","🍪","🍩","🍿","🥐","🥑","🌮","🍦"],
    "Activities": ["🎉","🎊","🎀","🎁","🎈","🎨","🎧","🎵","🎶","📸","🎬","🛍️","🏃‍♀️","🏋️‍♀️","🧘‍♀️","⚽","🏸","🏆","🥇","🎯","🎮","📚","✈️","🌙"],
    "Objects": ["📱","💻","⌚","📷","💡","💸","💳","💰","🛒","🛍️","📦","🎁","🔑","🔒","🔔","📌","✏️","📝","💬","💌","📍","🪄","🪞","🧸","🌂","☂️"],
    "Symbols": ["✨","⭐","🌟","💫","⚡","🔥","🌈","☀️","🌙","☁️","❄️","🌸","🌷","🌹","🌻","🍀","🦋","🕊️","✓","✔️","❌","❗","❓","‼️","⁉️","➕","➖","♾️","💯"]
  };
  const allEmojis = Object.values(emojiGroups).flat();

  const rememberEmoji=(emoji)=>{
    setRecentEmojis(prev=>[emoji,...prev.filter(x=>x!==emoji)].slice(0,16));
  };

  const insertEmoji=(emoji)=>{
    setText(t=>t+emoji);
    rememberEmoji(emoji);
  };

  const reactToMessage=(messageId,emoji)=>{
    if(!active)return;
    setChats(prev=>prev.map(c=>c.id!==active.id?c:{...c,messages:c.messages.map(m=>{
      if(m.id!==messageId)return m;
      const reactions={...(m.reactions||{})};
      const mine=[...(m.myReactions||[])];
      const already=mine.includes(emoji);
      if(already){
        reactions[emoji]=Math.max(0,(reactions[emoji]||1)-1);
        if(!reactions[emoji])delete reactions[emoji];
        return {...m,reactions,myReactions:mine.filter(x=>x!==emoji)};
      }
      reactions[emoji]=(reactions[emoji]||0)+1;
      return {...m,reactions,myReactions:[...mine,emoji]};
    })}));
    rememberEmoji(emoji);
    setReactionTarget(null);
    setShowReactionPicker(false);
  };

  const setQuickReaction=(index,emoji)=>{
    setQuickReactions(prev=>prev.map((x,i)=>i===index?emoji:x));
    rememberEmoji(emoji);
  };

  const renderMessage=(m)=>(
    <div key={m.id} className={`group/msg relative mb-[13px] flex items-center gap-[8px] ${m.from==="me"?"justify-end":"justify-start"}`}>
      {selectionMode&&<button onClick={()=>toggleSelectMessage(m.id)} className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border text-[11px] ${selectedMessages.includes(m.id)?"border-[#60744F] bg-[#60744F] text-white":"border-[#BEB4A5] bg-white"}`}>{selectedMessages.includes(m.id)?"✓":""}</button>}
      <div className={`relative max-w-[64%] ${m.from==="me"?"text-right":"text-left"}`}
        onContextMenu={(e)=>{e.preventDefault();e.stopPropagation();setReactionTarget(m.id);setMessageMenu(null);setShowReactionPicker(false)}}>
        {active?.group&&m.from!=="me"&&<p className="mb-[4px] ml-[6px] text-[10px] font-semibold text-[#7D725F]">{m.sender||"Member"}</p>}
        {m.pinned&&<p className={`mb-[4px] text-[9px] font-semibold tracking-[.1em] text-[#8B7A63] ${m.from==="me"?"text-right":"text-left"}`}>📌 PINNED</p>}
        {reactionTarget===m.id&&<div data-drip-popover="true" className={`absolute z-[100] ${m.from==="me"?"right-0":"left-0"} bottom-[calc(100%+7px)] flex items-center gap-[3px] rounded-full border border-[#DDD4C6] bg-[#FFFCF8] p-[5px] shadow-[0_7px_24px_rgba(65,45,30,.18)]`}>
          {quickReactions.map((emoji,i)=><button key={i} onClick={()=>reactToMessage(m.id,emoji)} className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-[19px] transition hover:bg-[#E8EDDF] hover:scale-110">{emoji}</button>)}
          <button onClick={()=>setShowReactionPicker(true)} title="More reactions" className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#F1EDE4] text-[18px] text-[#60744F] hover:bg-[#E8EDDF]">＋</button>
          <button onClick={()=>setEditingQuickReactions(true)} title="Customize quick reactions" className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-[14px] text-[#7D725F] hover:bg-[#E8EDDF]">⚙</button>
        </div>}
        {m.replyTo&&<div className={`mb-[4px] rounded-[10px] border-l-2 border-[#879778] bg-[#F1EDE4] px-[10px] py-[7px] text-[10px] text-[#766E65] ${m.from==="me"?"text-left":""}`}><b>{m.replyTo.sender==="You"||m.replyTo.sender==="me"?"You":m.replyTo.sender}</b><div className="mt-[2px] max-w-[250px] truncate">{m.replyTo.text}</div></div>}
        {m.type==="image" ? <div className="group/media relative inline-block"><img src={m.image} alt="Shared" className={`max-h-[330px] max-w-[330px] rounded-[18px] object-cover ${m.from==="me"?"rounded-br-[4px]":"rounded-bl-[4px]"}`}/>{m.from!=="me"&&<div className="absolute bottom-[8px] right-[8px] flex gap-[6px] opacity-0 transition group-hover/media:opacity-100"><button onClick={()=>saveSharedMedia(m)} title="Save in DripCheck" className="rounded-full bg-black/65 px-[9px] py-[6px] text-[11px] text-white">♡ Save</button><button onClick={()=>downloadSharedMedia(m)} title="Download" className="rounded-full bg-black/65 px-[9px] py-[6px] text-[11px] text-white">↓</button></div>}</div>
        : m.type==="video" ? <div className="group/media relative inline-block"><video src={m.image} controls playsInline className={`max-h-[380px] max-w-[330px] rounded-[18px] bg-black object-cover ${m.from==="me"?"rounded-br-[4px]":"rounded-bl-[4px]"}`}/>{m.from!=="me"&&<div className="absolute right-[8px] top-[8px] flex gap-[6px] opacity-0 transition group-hover/media:opacity-100"><button onClick={()=>saveSharedMedia(m)} title="Save in DripCheck" className="rounded-full bg-black/65 px-[9px] py-[6px] text-[11px] text-white">♡ Save</button><button onClick={()=>downloadSharedMedia(m)} title="Download" className="rounded-full bg-black/65 px-[9px] py-[6px] text-[11px] text-white">↓</button></div>}</div>
        : m.type==="payment" ? <div className={`min-w-[235px] rounded-[17px] p-[15px] ${m.from==="me"?"rounded-br-[4px] bg-[#3F542F] text-white shadow-sm":"rounded-bl-[4px] border border-[#D8CDBD] bg-[#FFF9F0]/95 text-[#302821] shadow-sm"}`}><p className="m-0 text-[10px] font-semibold tracking-[.12em] opacity-70">PAYMENT REQUEST</p><p className="my-[5px] text-[24px] font-semibold">₹{m.amount}</p><p className="m-0 text-[12px] opacity-80">{m.note||"DripCheck payment"}</p><p className="mb-0 mt-[8px] text-[10px] opacity-70">Demo card · connect a payment provider for real transfers</p></div>
        : <div className={`rounded-[17px] px-[15px] py-[11px] text-[14px] leading-6 ${m.from==="me"?"rounded-br-[4px] bg-[#3F542F] text-white shadow-sm":"rounded-bl-[4px] border border-[#D8CDBD] bg-[#FFF9F0]/95 text-[#302821] shadow-sm"} ${m.unsent?"italic opacity-65":""}`}>{m.text}{m.edited&&!m.unsent&&<span className="ml-[6px] text-[9px] opacity-60">edited</span>}</div>}
        {m.reactions&&Object.keys(m.reactions).length>0&&<div className={`mt-[4px] flex flex-wrap gap-[4px] ${m.from==="me"?"justify-end":"justify-start"}`}>{Object.entries(m.reactions).map(([emoji,count])=><button key={emoji} onClick={()=>reactToMessage(m.id,emoji)} className={`rounded-full border px-[7px] py-[3px] text-[12px] ${m.myReactions?.includes(emoji)?"border-[#60744F] bg-[#E8EDDF]":"border-[#DDD4C6] bg-[#FFFCF8]"}`}>{emoji}{count>1?` ${count}`:""}</button>)}</div>}
        {!selectionMode&&<button data-drip-popover="true" onClick={(e)=>{e.stopPropagation();setMessageMenu(messageMenu===m.id?null:m.id);setReactionTarget(null)}} className={`absolute top-1/2 -translate-y-1/2 rounded-full px-[7px] py-[3px] text-[18px] text-[#8C8277] opacity-0 transition hover:bg-[#EEE9DF] group-hover/msg:opacity-100 ${m.from==="me"?"right-[calc(100%+7px)]":"left-[calc(100%+7px)]"}`}>⋯</button>}
        {messageMenu===m.id&&<div data-drip-popover="true" className={`absolute z-[110] top-[calc(100%+7px)] ${m.from==="me"?"right-0":"left-0"} w-[185px] overflow-hidden rounded-[14px] border border-[#DDD4C6] bg-[#FFFCF8] p-[5px] text-left shadow-[0_10px_30px_rgba(65,45,30,.18)]`}>
          {m.from==="me"&&m.type==="text"&&!m.unsent&&<button onClick={()=>editMessage(m)} className="w-full rounded-[9px] px-[11px] py-[8px] text-left text-[12px] hover:bg-[#F1EDE4]">✎ Edit</button>}
          {m.from==="me"&&!m.unsent&&<button onClick={()=>unsendMessage(m)} className="w-full rounded-[9px] px-[11px] py-[8px] text-left text-[12px] text-[#9B4E46] hover:bg-[#F8EAE7]">↶ Unsend</button>}
          <button onClick={()=>replyMessage(m)} className="w-full rounded-[9px] px-[11px] py-[8px] text-left text-[12px] hover:bg-[#F1EDE4]">↩ Reply</button>
          {(m.text||m.note)&&<button onClick={()=>copyMessage(m)} className="w-full rounded-[9px] px-[11px] py-[8px] text-left text-[12px] hover:bg-[#F1EDE4]">▣ Copy</button>}
          <button onClick={()=>shareMessage(m)} className="w-full rounded-[9px] px-[11px] py-[8px] text-left text-[12px] hover:bg-[#F1EDE4]">↗ Share</button>
          <button onClick={()=>pinMessage(m)} className="w-full rounded-[9px] px-[11px] py-[8px] text-left text-[12px] hover:bg-[#F1EDE4]">📌 {m.pinned?"Unpin":"Pin"}</button>
          <button onClick={()=>beginSelect(m)} className="w-full rounded-[9px] px-[11px] py-[8px] text-left text-[12px] hover:bg-[#F1EDE4]">☑ Select</button>
        </div>}
      </div>
    </div>
  );

  return <div className="min-h-[calc(100vh-78px)] bg-[#F8F4EB] px-[38px] py-[26px]">
    <div className="mx-auto flex h-[760px] max-w-[1400px] overflow-hidden rounded-[22px] border border-[#DDD4C6] bg-[#FFFCF8] shadow-[0_5px_18px_rgba(65,45,30,.05)]">
      <aside className="w-[350px] shrink-0 border-r border-[#DDD4C6]">
        <div className="border-b border-[#DDD4C6] p-[20px]">
          <div className="flex items-center justify-between"><h2 className="m-0 text-[24px]" style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>Conversations</h2><div className="flex gap-[7px]"><button onClick={()=>openNew("group")} title="New group" className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#60744F] text-[#60744F]">♟</button><button onClick={()=>openNew("chat")} title="New chat" className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#60744F] text-[20px] text-white">+</button></div></div>
          <button onClick={()=>setShowRequests(true)} className="mt-[12px] flex w-full items-center justify-between rounded-[11px] bg-[#E8EDDF] px-[13px] py-[10px] text-left text-[12px] font-semibold text-[#40542E]"><span>Message requests</span>{messageRequests.length>0&&<span className="flex h-[22px] min-w-[22px] items-center justify-center rounded-full bg-[#60744F] px-[6px] text-[10px] text-white">{messageRequests.length}</span>}</button>
          <div className="mt-[10px] flex h-[42px] items-center rounded-full bg-[#F1EDE4] px-[14px]"><span className="mr-[8px]">⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search conversations..." className="w-full bg-transparent text-[12px] outline-none"/></div>
        </div>
        <div className="h-[660px] overflow-auto">{visible.map(c=>{const last=c.messages?.[c.messages.length-1];return <button key={c.id} onClick={()=>{setSelectedId(c.id);setMessageSearch("")}} className={`flex w-full items-center gap-[12px] border-b border-[#EEE8DD] px-[18px] py-[15px] text-left ${active?.id===c.id?"bg-[#E8EDDF]":"hover:bg-[#F5F1E9]"}`}><div className="relative flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#D8C7AF] font-serif text-[17px]">{c.initial}{c.online&&<span className="absolute bottom-0 right-0 h-[10px] w-[10px] rounded-full border-2 border-white bg-[#60744F]"/>}</div><div className="min-w-0"><p className="m-0 truncate text-[14px] font-semibold">{c.nickname||c.name}</p><p className="mt-[4px] truncate text-[11px] text-[#8B8379]">{last?.type==="image"?"📷 Photo":last?.type==="video"?"🎬 Reel / video":last?.text||c.username}</p></div></button>})}</div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">{active?<>
        <div className="flex min-h-[78px] items-center border-b border-[#DDD4C6] px-[22px]">
          <button onClick={()=>!active.group&&setShowProfile(true)} className="flex items-center text-left">
            <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#D8C7AF] font-serif text-[17px]">{active.initial}</div>
            <div className="ml-[11px]"><p className="m-0 text-[14px] font-semibold">{displayName}</p><p className="mt-[3px] text-[11px] text-[#8B8379]">{active.group?active.username:(active.online?"Active now":active.username)}</p></div>
          </button>
          <div className="mx-auto hidden w-[300px] items-center rounded-full bg-[#F1EDE4] px-[12px] lg:flex"><span>⌕</span><input value={messageSearch} onChange={e=>setMessageSearch(e.target.value)} placeholder="Search in this chat..." className="h-[36px] w-full bg-transparent px-[8px] text-[11px] outline-none"/></div>
          <div className="ml-auto flex items-center gap-[8px]">
            <button onClick={()=>setShowPayment(true)} title="Payment request" className="group flex h-[38px] w-[38px] items-center justify-center rounded-full text-[#5B5147] transition hover:bg-[#E8EDDF] hover:text-[#60744F]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[19px] w-[19px]">
                <path d="M4 7.5h15a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-11a2 2 0 0 1 2-2h12"/>
                <path d="M16 12h5v4h-5a2 2 0 0 1 0-4Z"/>
                <circle cx="17.5" cy="14" r=".6" fill="currentColor" stroke="none"/>
              </svg>
            </button>
            <button onClick={()=>setShowCall("voice")} title="Voice call" className="group flex h-[38px] w-[38px] items-center justify-center rounded-full text-[#5B5147] transition hover:bg-[#E8EDDF] hover:text-[#60744F]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[19px] w-[19px]">
                <path d="M22 16.92v2.5a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 3.7 2 2 0 0 1 4.11 1.5h2.5a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.61a2 2 0 0 1-.45 2.11L7.72 9a16 16 0 0 0 7.28 7.28l1.06-1.06a2 2 0 0 1 2.11-.45c.84.29 1.71.5 2.61.62A2 2 0 0 1 22 16.92Z"/>
              </svg>
            </button>
            <button onClick={()=>setShowCall("video")} title="Video call" className="group flex h-[38px] w-[38px] items-center justify-center rounded-full text-[#5B5147] transition hover:bg-[#E8EDDF] hover:text-[#60744F]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[20px] w-[20px]">
                <rect x="3" y="6" width="13" height="12" rx="2"/>
                <path d="m16 10 5-3v10l-5-3"/>
              </svg>
            </button>
            <button onClick={()=>{setNickname(active.nickname||"");setShowDetails(true)}} title="Chat settings" className="group flex h-[38px] w-[38px] items-center justify-center rounded-full text-[#5B5147] transition hover:bg-[#E8EDDF] hover:text-[#60744F]">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-[19px] w-[19px]">
                <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
              </svg>
            </button>
          </div>
        </div>

        {selectionMode&&<div className="flex min-h-[52px] items-center gap-[10px] border-b border-[#DDD4C6] bg-[#F1EDE4] px-[22px]"><button onClick={()=>{setSelectionMode(false);setSelectedMessages([])}} className="text-[20px]">×</button><span className="flex-1 text-[12px] font-semibold">{selectedMessages.length} selected</span><button onClick={()=>setSelectedMessages((active?.messages||[]).map(m=>m.id))} className="rounded-full border border-[#CFC5B6] bg-white px-[13px] py-[7px] text-[11px]">Select all</button><button disabled={!selectedMessages.length} onClick={deleteSelected} className="rounded-full bg-[#9B4E46] px-[14px] py-[7px] text-[11px] text-white disabled:opacity-40">Delete selected</button></div>}

        <div
          className="relative flex-1 overflow-y-auto bg-[#FCFAF6] bg-cover bg-center px-[28px] py-[25px]"
          style={{
            backgroundImage: `linear-gradient(rgba(248,244,235,.42), rgba(248,244,235,.42)), url(${chatBackground})`,
            backgroundBlendMode: "normal",
          }}
        >
          <p className="mb-[25px] text-center text-[10px] tracking-[.15em] text-[#746B60]">TODAY</p>
          {shownMessages.length?shownMessages.map(renderMessage):<div className="mt-[150px] text-center text-[13px] text-[#95836F]">{messageSearch?"No matching messages.":"Start the conversation ✦"}</div>}
        </div>

        <div className="border-t border-[#DDD4C6] p-[16px]">
          {(replyingTo||editingMessage)&&<div className="mb-[9px] flex items-center rounded-[12px] border border-[#DDD4C6] bg-[#F1EDE4] px-[12px] py-[8px]"><div className="min-w-0 flex-1"><p className="m-0 text-[10px] font-semibold text-[#60744F]">{editingMessage?"EDITING MESSAGE":`REPLYING TO ${replyingTo?.sender||displayName}`}</p><p className="mb-0 mt-[2px] truncate text-[11px] text-[#766E65]">{editingMessage?.text||replyingTo?.text||replyingTo?.note||replyingTo?.type}</p></div><button onClick={()=>{setReplyingTo(null);setEditingMessage(null);setText("")}} className="ml-[8px] text-[20px] text-[#766E65]">×</button></div>}
          <div className="flex items-center gap-[7px] rounded-full border border-[#D8D0C3] bg-[#F8F4EB] px-[11px] py-[7px]">
            <label title="Send photo or reel" className="flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full text-[#5B5147] transition hover:bg-[#E8EDDF] hover:text-[#60744F]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[19px] w-[19px]">
                <rect x="3" y="4" width="18" height="16" rx="2"/>
                <circle cx="8.5" cy="9" r="1.5"/>
                <path d="m4 17 5-5 4 4 2-2 5 5"/>
              </svg>
              <input type="file" accept="image/*,video/*" onChange={sendMedia} className="hidden"/>
            </label>

            <button type="button" onClick={openCamera} title="Open selfie camera" className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-[#5B5147] transition hover:bg-[#E8EDDF] hover:text-[#60744F]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="h-[20px] w-[20px]">
                <path d="M8.5 6.5 10 4.5h4l1.5 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h3.5Z"/>
                <circle cx="12" cy="13" r="3.5"/>
                <circle cx="18" cy="9.5" r=".7" fill="currentColor" stroke="none"/>
              </svg>
            </button>

            <div data-drip-popover="true" className="relative">
              <button onClick={(e)=>{e.stopPropagation();setShowEmojiPicker(v=>!v)}} title="Emojis" className={`flex h-[34px] w-[34px] items-center justify-center rounded-full text-[18px] ${showEmojiPicker?"bg-[#E8EDDF] text-[#60744F]":"hover:bg-[#E8EDDF]"}`}>☺</button>
              {showEmojiPicker&&<div className="absolute bottom-[48px] left-0 z-[90] w-[390px] overflow-hidden rounded-[18px] border border-[#DDD4C6] bg-[#FFFCF8] shadow-[0_12px_35px_rgba(65,45,30,.18)]">
                <div className="border-b border-[#E7E0D5] px-[14px] py-[11px]"><p className="m-0 text-[13px] font-semibold">Emojis</p><p className="mb-0 mt-[2px] text-[10px] text-[#95836F]">Click an emoji to add it to your message</p></div>
                <div className="max-h-[330px] overflow-y-auto p-[12px]">
                  <p className="mb-[7px] mt-0 text-[10px] font-semibold tracking-[.12em] text-[#95836F]">RECENT</p><div className="mb-[13px] grid grid-cols-8 gap-[3px]">{recentEmojis.map((emoji,i)=><button key={i} onClick={()=>insertEmoji(emoji)} className="flex h-[36px] items-center justify-center rounded-[7px] text-[21px] hover:bg-[#E8EDDF]">{emoji}</button>)}</div>
                  {Object.entries(emojiGroups).map(([group,emojis])=><div key={group} className="mb-[13px]"><p className="mb-[6px] text-[10px] font-semibold tracking-[.12em] text-[#95836F]">{group.toUpperCase()}</p><div className="grid grid-cols-8 gap-[3px]">{emojis.map((emoji,i)=><button key={i} onClick={()=>insertEmoji(emoji)} className="flex h-[36px] items-center justify-center rounded-[7px] text-[21px] hover:bg-[#E8EDDF]">{emoji}</button>)}</div></div>)}
                </div>
              </div>}
            </div>
            <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={`Message ${displayName}...`} className="flex-1 bg-transparent py-[7px] text-[14px] outline-none"/>
            <button onClick={send} className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#60744F] text-white">➤</button>
          </div>
        </div>
      </>:<div
        className="relative flex h-full min-h-[620px] items-center justify-center overflow-hidden bg-cover bg-center px-[28px] text-center"
        style={{ backgroundImage: `linear-gradient(rgba(39,51,31,.74), rgba(39,51,31,.78)), url(${chatBackground})` }}
      >
        <div className="relative z-10 max-w-[560px] rounded-[28px] border border-white/20 bg-[#F8F4EB]/95 px-[48px] py-[46px] shadow-[0_22px_60px_rgba(25,35,20,.24)] backdrop-blur-[3px]">
          <div className="mx-auto mb-[18px] flex h-[76px] w-[76px] items-center justify-center rounded-full border border-[#8D9B7D] bg-[#E8EDDF] text-[#506342]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-[36px] w-[36px]">
              <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z"/>
              <path d="M8 9h8M8 13h5"/>
            </svg>
          </div>
          <p className="mb-[7px] text-[10px] font-semibold tracking-[.24em] text-[#7D8B6E]">DRIPCHECK CHAT</p>
          <h2 className="m-0 text-[34px] leading-tight text-[#302821]" style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>Your style circle ✦</h2>
          <p className="mx-auto mb-0 mt-[13px] max-w-[430px] text-[13px] leading-6 text-[#766E65]">Share fits, swap styling ideas, send outfit inspo and plan looks with your people.</p>
          <div className="mt-[24px] flex flex-wrap justify-center gap-[10px]">
            <button onClick={()=>{setNewMode("chat");setShowNew(true)}} className="rounded-full bg-[#60744F] px-[22px] py-[11px] text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#506342]">Start a conversation</button>
            <button onClick={()=>{setNewMode("group");setShowNew(true)}} className="rounded-full border border-[#AEB99F] bg-[#FFFCF8] px-[22px] py-[11px] text-[12px] font-semibold text-[#506342] transition hover:bg-[#E8EDDF]">Create style group</button>
          </div>
          <p className="mb-0 mt-[19px] text-[10px] tracking-[.08em] text-[#9A8E81]">Choose a conversation on the left whenever you're ready.</p>
        </div>
      </div>}</section>
    </div>

    {showCamera&&<div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/55 p-4" onMouseDown={stopCamera}>
      <div className="relative w-full max-w-[620px] rounded-[22px] border border-[#DDD4C6] bg-[#FFFCF8] p-[20px] shadow-2xl" onMouseDown={e=>e.stopPropagation()}>
        <div className="mb-[14px] flex items-center justify-between">
          <div><h2 className="m-0 text-[25px]" style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>Take a photo</h2><p className="mb-0 mt-[3px] text-[11px] text-[#95836F]">Selfie camera · capture and send it in this chat</p></div>
          <button type="button" onClick={stopCamera} className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-[22px] text-[#5B5147] hover:bg-[#E8EDDF]">×</button>
        </div>
        <div className="overflow-hidden rounded-[16px] bg-[#27231F]">
          {!cameraError?<video ref={videoRef} autoPlay playsInline muted className="aspect-[4/3] w-full -scale-x-100 object-cover"/>:<div className="flex aspect-[4/3] items-center justify-center p-[35px] text-center text-[13px] leading-6 text-white">{cameraError}</div>}
        </div>
        <div className="mt-[16px] flex items-center justify-center gap-[10px]">
          <button type="button" onClick={stopCamera} className="rounded-full border border-[#D8D0C3] px-[20px] py-[10px] text-[12px] text-[#5B5147] hover:bg-[#F1EDE4]">Cancel</button>
          {!cameraError&&<button type="button" onClick={capturePhoto} className="flex items-center gap-[8px] rounded-full bg-[#60744F] px-[22px] py-[10px] text-[12px] font-semibold text-white hover:bg-[#506342]"><span className="h-[13px] w-[13px] rounded-full border-2 border-white"/> Capture</button>}
          {cameraError&&<button type="button" onClick={()=>{stopCamera();setTimeout(openCamera,50)}} className="rounded-full bg-[#60744F] px-[22px] py-[10px] text-[12px] font-semibold text-white">Try again</button>}
        </div>
      </div>
    </div>}

    {showRequests&&<ModalShell close={()=>setShowRequests(false)}><h2 className="mt-0 text-[25px]" style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>Message requests</h2><p className="mt-[-6px] text-[12px] leading-5 text-[#817970]">People you haven't approved appear here. Accepting follows them back and unlocks chat.</p><div className="mt-[14px] max-h-[390px] overflow-auto">{messageRequests.length?messageRequests.map(req=><div key={req.id} className="border-b border-[#E7E0D5] py-[14px]"><div className="flex items-center"><div className="flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[#D8C7AF] font-serif text-[18px]">{req.initial}</div><div className="ml-[11px] flex-1"><p className="m-0 text-[14px] font-semibold">{req.name}</p><p className="mt-[2px] text-[11px] text-[#95836F]">{req.username}</p></div></div><p className="mb-[10px] mt-[9px] rounded-[10px] bg-[#F5F1E9] p-[10px] text-[12px] text-[#5B5147]">{req.preview}</p><div className="flex gap-[8px]"><button onClick={()=>acceptMessageRequest(req)} className="h-[38px] flex-1 rounded-[9px] bg-[#60744F] text-[12px] font-semibold text-white">Accept</button><button onClick={()=>declineMessageRequest(req.id)} className="h-[38px] flex-1 rounded-[9px] border border-[#DDD4C6] text-[12px]">Delete</button></div></div>):<p className="py-[30px] text-center text-[13px] text-[#95836F]">No message requests.</p>}</div></ModalShell>}

    {showNew&&<ModalShell close={()=>setShowNew(false)}>
      <h2 className="mt-0 text-[25px]" style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>{newMode==="group"?"Create group":"New conversation"}</h2>
      <input autoFocus value={newName} onChange={e=>setNewName(e.target.value)} placeholder={newMode==="group"?"Group name":"Search/name a person"} className="h-[45px] w-full rounded-[9px] border border-[#DDD4C6] bg-white px-[12px] outline-none"/>
      {newMode==="group"&&<div className="mt-[15px]"><p className="mb-[8px] text-[12px] font-semibold">Add people</p><div className="max-h-[230px] overflow-auto rounded-[12px] border border-[#DDD4C6] bg-white p-[8px]">{people.map(p=><button key={p.id} onClick={()=>setGroupMembers(prev=>prev.includes(p.name)?prev.filter(x=>x!==p.name):[...prev,p.name])} className={`mb-[5px] flex w-full items-center rounded-[9px] px-[10px] py-[9px] text-left ${groupMembers.includes(p.name)?"bg-[#E8EDDF]":"hover:bg-[#F5F1E9]"}`}><span className="mr-[9px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-[#D8C7AF]">{p.initial}</span><span className="flex-1 text-[13px]">{p.name}</span><span>{groupMembers.includes(p.name)?"✓":"+"}</span></button>)}</div></div>}
      <button onClick={addChat} className="mt-[14px] h-[44px] w-full rounded-[9px] bg-[#60744F] text-white">{newMode==="group"?"Create Group":"Start Chat"}</button>
    </ModalShell>}

    {showDetails&&active&&<ModalShell close={()=>setShowDetails(false)}>
      <h2 className="mt-0 text-[25px]" style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>{active.group?"Group settings":"Chat settings"}</h2>
      {!active.group&&<><label className="mb-[6px] block text-[12px] font-semibold">Nickname / pet name</label><input value={nickname} onChange={e=>setNickname(e.target.value)} placeholder={active.name} className="h-[44px] w-full rounded-[9px] border border-[#DDD4C6] bg-white px-[12px] outline-none"/><button onClick={saveNickname} className="mt-[10px] h-[42px] w-full rounded-[9px] bg-[#60744F] text-white">Save nickname</button></>}
      {active.group&&<div className="rounded-[12px] border border-[#DDD4C6] bg-white p-[14px]"><p className="mt-0 text-[12px] font-semibold">Members</p><div className="flex flex-wrap gap-[7px]">{active.members.map(m=><span key={m} className="rounded-full bg-[#E8EDDF] px-[10px] py-[6px] text-[11px]">{m}</span>)}</div></div>}
      <button onClick={()=>{setShowDetails(false);setShowMedia(true)}} className="mt-[10px] h-[42px] w-full rounded-[9px] border border-[#DDD4C6]">Shared photos & media</button>
      {!active.group&&<button onClick={()=>{setShowDetails(false);setShowProfile(true)}} className="mt-[10px] h-[42px] w-full rounded-[9px] border border-[#DDD4C6]">View profile</button>}
      <button onClick={removeChat} className="mt-[10px] h-[42px] w-full rounded-[9px] border border-[#D9B8B2] text-[#9B4E46]">Delete {active.group?"group":"conversation"}</button>
    </ModalShell>}

    {showMedia&&<ModalShell close={()=>setShowMedia(false)}><h2 className="mt-0 text-[25px]">Shared media</h2>{media.length?<div className="grid grid-cols-3 gap-[5px]">{media.map(m=><div key={m.id} className="relative">{m.type==="video"?<video src={m.image} controls className="aspect-square w-full rounded-[8px] bg-black object-cover"/>:<img src={m.image} className="aspect-square w-full rounded-[8px] object-cover"/>}{m.from!=="me"&&<button onClick={()=>saveSharedMedia(m)} className="absolute bottom-[6px] right-[6px] rounded-full bg-black/65 px-[8px] py-[5px] text-[10px] text-white">Save</button>}</div>)}</div>:<p className="text-[13px] text-[#95836F]">No photos shared in this chat yet.</p>}</ModalShell>}

    {showPayment&&<ModalShell close={()=>setShowPayment(false)}>
      <h2 className="mt-0 text-[25px]">Payment request</h2><p className="text-[12px] leading-5 text-[#817970]">This creates a payment card in the chat. Real transfers require a payment gateway/backend integration.</p>
      <div className="mt-[14px] flex items-center rounded-[10px] border border-[#DDD4C6] bg-white px-[12px]"><span className="text-[20px]">₹</span><input value={payment.amount} onChange={e=>setPayment({...payment,amount:e.target.value.replace(/[^0-9.]/g,"")})} placeholder="Amount" className="h-[48px] flex-1 px-[8px] text-[18px] outline-none"/></div>
      <input value={payment.note} onChange={e=>setPayment({...payment,note:e.target.value})} placeholder="What is it for?" className="mt-[10px] h-[44px] w-full rounded-[9px] border border-[#DDD4C6] bg-white px-[12px] outline-none"/>
      <button onClick={addPaymentCard} className="mt-[14px] h-[44px] w-full rounded-[9px] bg-[#60744F] text-white">Add payment request to chat</button>
    </ModalShell>}

    {showCall&&active&&<div className="fixed inset-0 z-[160] flex items-center justify-center bg-[#292D27]/90 p-4"><div className="w-full max-w-[420px] rounded-[28px] bg-[#F8F4EB] p-[35px] text-center shadow-2xl"><div className="mx-auto flex h-[100px] w-[100px] items-center justify-center rounded-full bg-[#D8C7AF] font-serif text-[38px]">{active.initial}</div><h2 className="mb-[4px] mt-[20px] text-[27px]">{displayName}</h2><p className="text-[13px] text-[#817970]">{showCall==="video"?"Video call":"Voice call"} preview</p><p className="mx-auto mt-[20px] max-w-[310px] text-[12px] leading-5 text-[#95836F]">The call interface is ready. Real calling needs WebRTC/signalling or a calling service connected to your backend.</p><button onClick={()=>setShowCall(null)} className="mt-[24px] h-[52px] w-[52px] rounded-full bg-[#A65A51] text-xl text-white">✕</button></div></div>}

    {showReactionPicker&&reactionTarget&&<ModalShell close={()=>setShowReactionPicker(false)}>
      <h2 className="mt-0 text-[24px]" style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>Choose a reaction</h2>
      <div className="max-h-[390px] overflow-y-auto">
        <div className="mb-[15px]"><p className="mb-[7px] text-[10px] font-semibold tracking-[.12em] text-[#95836F]">RECENT</p><div className="grid grid-cols-9 gap-[4px]">{recentEmojis.map((emoji,i)=><button key={i} onClick={()=>reactToMessage(reactionTarget,emoji)} className="flex h-[38px] items-center justify-center rounded-[8px] text-[21px] hover:bg-[#E8EDDF]">{emoji}</button>)}</div></div>
        {Object.entries(emojiGroups).map(([group,emojis])=><div key={group} className="mb-[15px]"><p className="mb-[7px] text-[10px] font-semibold tracking-[.12em] text-[#95836F]">{group.toUpperCase()}</p><div className="grid grid-cols-9 gap-[4px]">{emojis.map((emoji,i)=><button key={i} onClick={()=>reactToMessage(reactionTarget,emoji)} className="flex h-[38px] items-center justify-center rounded-[8px] text-[21px] hover:bg-[#E8EDDF]">{emoji}</button>)}</div></div>)}
      </div>
    </ModalShell>}

    {editingQuickReactions&&<ModalShell close={()=>setEditingQuickReactions(false)}>
      <h2 className="mt-0 text-[24px]" style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>Customize quick reactions</h2>
      <p className="text-[12px] leading-5 text-[#817970]">These are the six reactions that appear when you right-click a message. Your choices are saved for this user.</p>
      <div className="my-[16px] flex justify-center gap-[7px]">{quickReactions.map((emoji,i)=><div key={i} className="flex h-[48px] w-[48px] items-center justify-center rounded-[12px] border border-[#60744F] bg-[#E8EDDF] text-[24px]">{emoji}</div>)}</div>
      <p className="mb-[7px] text-[11px] font-semibold">Choose a slot, then choose an emoji:</p>
      {quickReactions.map((current,index)=><details key={index} className="mb-[7px] rounded-[10px] border border-[#DDD4C6] bg-white"><summary className="cursor-pointer px-[12px] py-[9px] text-[13px]">Reaction {index+1}: <span className="text-[20px]">{current}</span></summary><div className="max-h-[180px] overflow-y-auto border-t border-[#EEE8DD] p-[8px]"><div className="grid grid-cols-10 gap-[3px]">{allEmojis.map((emoji,i)=><button key={i} onClick={()=>setQuickReaction(index,emoji)} className="flex h-[34px] items-center justify-center rounded-[6px] text-[19px] hover:bg-[#E8EDDF]">{emoji}</button>)}</div></div></details>)}
      <button onClick={()=>setEditingQuickReactions(false)} className="mt-[10px] h-[43px] w-full rounded-[9px] bg-[#60744F] text-white">Done</button>
    </ModalShell>}

    {showProfile&&!active?.group&&<div className="fixed inset-0 z-[150] overflow-y-auto bg-black/45 p-[35px]" onClick={()=>setShowProfile(false)}><div onClick={e=>e.stopPropagation()} className="mx-auto max-w-[900px] overflow-hidden rounded-[24px] bg-[#F8F4EB] shadow-2xl">
      <div className="relative p-[35px]"><button onClick={()=>setShowProfile(false)} className="absolute right-[20px] top-[14px] text-[28px]">×</button>
        <div className="flex items-center gap-[28px]"><div className="flex h-[130px] w-[130px] items-center justify-center rounded-full bg-[#D8C7AF] font-serif text-[42px]">{activePerson.initial}</div><div className="flex-1"><h2 className="m-0 text-[29px]">{activePerson.username}</h2><p className="mt-[5px] text-[14px] font-semibold">{activePerson.name}</p><div className="my-[13px] flex gap-[25px] text-[13px]"><span><b>{personPosts.length||3}</b> posts</span><span><b>{activePerson.followers}</b> followers</span><span><b>{activePerson.following}</b> following</span></div><p className="text-[13px]">{activePerson.bio}</p></div></div>
        <div className="mt-[24px] grid grid-cols-2 gap-[10px]"><button onClick={toggleFollow} className="h-[43px] rounded-[9px] bg-[#60744F] text-white">{following.includes(activePerson.id)?"Following":"Follow"}</button><button onClick={()=>setShowProfile(false)} className="h-[43px] rounded-[9px] border border-[#DDD4C6] bg-white">Message</button></div>
      </div>
      <div className="border-t border-[#DDD4C6] p-[3px]"><div className="grid grid-cols-3 gap-[3px]">{(personPosts.length?personPosts.map(p=>p.image):fallbackPosts).map((img,i)=><img key={i} src={img} className="aspect-square w-full object-cover"/>)}</div></div>
    </div></div>}
  </div>;
}

function ModalShell({children,close,wide=false}) { return <div onClick={close} className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[2px]"><div onClick={e=>e.stopPropagation()} className={`relative my-6 w-full ${wide?"max-w-[1040px]":"max-w-[470px]"} rounded-[20px] bg-[#F8F4EB] p-[28px] shadow-2xl`}><button onClick={close} className="absolute right-[17px] top-[10px] text-[28px] text-[#746C63]">×</button>{children}</div></div> }


function Wardrobe({ setPage }) {
  const defaultForm = { name: "", category: "Tops", image: null };
  const [wardrobe, setWardrobe] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

const loadWardrobe = async () => {
  try {
    const response = await fetch(`${API_BASE}/wardrobe`, {
      headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Failed to load wardrobe:", data);
      return;
    }

    const items = (data.items || []).map((item) => ({
      ...item,

      name:
        item.name ||
        `${item.color || ""} ${item.category || "Item"}`.trim(),

      image: `${API_BASE}/images/${item.image_url.split("/").pop()}`,

      type: categoryType(item.category),
    }));

    setWardrobe(items);
    console.log("✅ Real wardrobe loaded:", items);

  } catch (error) {
    console.error("❌ Wardrobe API error:", error);
  }
};

useEffect(() => {
  loadWardrobe();
}, []);
  const [category, setCategory] = useState("All Items");
  const [search, setSearch] = useState("");
  const [showItemModal, setShowItemModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [wardrobeCategories, setWardrobeCategories] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("dripcheck-categories"));
      return Array.isArray(saved) && saved.length ? saved : categories;
    } catch { return categories; }
  });
  const [categoryMenu, setCategoryMenu] = useState(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    localStorage.setItem("dripcheck-categories", JSON.stringify(wardrobeCategories));
  }, [wardrobeCategories]);

  useEffect(() => {
    localStorage.setItem("dripcheck-wardrobe", JSON.stringify(wardrobe));
  }, [wardrobe]);

  // Repair older saved items that were incorrectly stored as type "Top"
  // when they belonged to a custom category such as Bags.
  useEffect(() => {
    setWardrobe((prev) => {
      let changed = false;
      const repaired = prev.map((item) => {
        const correctType = categoryType(item.category);
        if (item.type !== correctType) {
          changed = true;
          return { ...item, type: correctType };
        }
        return item;
      });
      return changed ? repaired : prev;
    });
  }, []);

  const openCategoryModal = () => {
    setNewCategoryName("");
    setCategoryError("");
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setNewCategoryName("");
    setCategoryError("");
  };

  const addCategory = () => {
    const newName = newCategoryName.trim();

    if (!newName) {
      setCategoryError("Please enter a category name.");
      return;
    }

    if (newName.toLowerCase() === "all items") {
      setCategoryError('"All Items" is already used. Choose another name.');
      return;
    }

    if (wardrobeCategories.some((x) => x.name.toLowerCase() === newName.toLowerCase())) {
      setCategoryError("That category already exists.");
      return;
    }

    const newCategory = { name: newName, icon: "◇" };
    setWardrobeCategories((prev) => [...prev, newCategory]);
    setCategory(newName);
    setForm((prev) => ({ ...prev, category: newName }));
    closeCategoryModal();
  };

  const renameCategory = (oldName) => {
    if (oldName === "All Items") return;
    const nextName = window.prompt("Change category name", oldName)?.trim();
    if (!nextName || nextName === oldName) { setCategoryMenu(null); return; }
    if (wardrobeCategories.some((x) => x.name.toLowerCase() === nextName.toLowerCase())) { alert("That category already exists."); return; }
    setWardrobeCategories((prev) => prev.map((x) => x.name === oldName ? { ...x, name: nextName } : x));
    setWardrobe((prev) => prev.map((x) => x.category === oldName ? { ...x, category: nextName } : x));
    if (category === oldName) setCategory(nextName);
    if (form.category === oldName) setForm((p) => ({ ...p, category: nextName }));
    setCategoryMenu(null);
  };

  const deleteCategory = (name) => {
    if (name === "All Items") return;
    const itemsInCategory = wardrobe.filter((x) => x.category === name).length;
    const message = itemsInCategory ? `Delete ${name}? ${itemsInCategory} item(s) in it will also be deleted.` : `Delete ${name}?`;
    if (!window.confirm(message)) return;
    setWardrobeCategories((prev) => prev.filter((x) => x.name !== name));
    setWardrobe((prev) => prev.filter((x) => x.category !== name));
    if (category === name) setCategory("All Items");
    setCategoryMenu(null);
  };

  const filteredItems = useMemo(() => {
    return wardrobe.filter((item) => {
      const matchesCategory = category === "All Items" || item.category === category;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        categoryType(item.category).toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [wardrobe, category, search]);

  const countCategory = (cat) =>
    wardrobe.filter((item) => item.category === cat).length;

  const categoryType = (cat) => {
    if (cat === "Tops") return "Top";
    if (cat === "Bottoms") return "Bottom";
    if (cat === "Dresses") return "Dress";
    if (cat === "Shoes") return "Shoes";
    if (cat === "Accessories") return "Accessory";
    // Custom categories such as Bags, Jewellery, Outerwear, etc.
    // should display their real category instead of falling back to Top.
    return cat;
  };

  function openAdd() {
    setEditingId(null);
    setForm(defaultForm);
    setShowItemModal(true);
  }

  function openEdit(item) {
    setEditingId(item.id);
    setForm({ name: item.name, category: item.category, image: item.image });
    setViewItem(null);
    setShowItemModal(true);
  }

  function closeModal() {
    setShowItemModal(false);
    setEditingId(null);
    setForm(defaultForm);
  }

  async function saveItem() {
  // Keep the existing edit flow for now
  if (editingId !== null) {
    setWardrobe((prev) =>
      prev.map((item) =>
        item.id === editingId
          ? {
              ...item,
              name: form.name.trim(),
              category: form.category,
              type: categoryType(form.category),
              image: form.image || item.image,
            }
          : item
      )
    );

    closeModal();
    return;
  }

  // A real image is required for AI classification
  if (!selectedFile) {
    alert("Please choose a clothing photo.");
    return;
  }

  try {
    const uploadData = new FormData();
    uploadData.append("image", selectedFile);

    const response = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: uploadData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Upload failed");
    }

    console.log("✅ AI job submitted:", data);

setSelectedFile(null);
closeModal();

const jobId = data.job_id;

if (!jobId) {
  throw new Error("Backend did not return a job ID.");
}

let completed = false;

for (let attempt = 0; attempt < 20; attempt++) {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const resultResponse = await fetch(`${API_BASE}/result/${jobId}`);
  const result = await resultResponse.json();

  console.log("AI status:", result);

  if (result.status === "completed") {
    completed = true;

    // AI worker has now created the PostgreSQL wardrobe item
    await loadWardrobe();

    alert("✨ DripCheck AI analysed your item and added it to your wardrobe!");
    break;
  }

  if (result.status === "error" || result.status === "failed") {
    throw new Error("AI could not analyse this item.");
  }
}

if (!completed) {
  alert(
    "Your image was uploaded and is still being analysed. It will appear when processing finishes."
  );
}

  } catch (error) {
    console.error("❌ Upload error:", error);
    alert(`Could not upload item: ${error.message}`);
  }
}

  function deleteItem(item) {
    if (!window.confirm(`Delete "${item.name}" from your wardrobe?`)) return;
    setWardrobe((prev) => prev.filter((x) => x.id !== item.id));
    if (viewItem?.id === item.id) setViewItem(null);
  }

  function handleImageUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  // Keep the real file for sending to the backend/AI
  setSelectedFile(file);

  // Keep the preview for the existing UI
  const reader = new FileReader();
  reader.onload = () =>
    setForm((p) => ({
      ...p,
      image: reader.result,
    }));

  reader.readAsDataURL(file);
}

  return (
    <div className="flex h-[calc(100vh-78px)] overflow-hidden bg-[#F8F4EB]">
      <aside className="flex h-full w-[240px] flex-shrink-0 flex-col rounded-r-[18px] bg-[#F1EBDF] px-[20px] pb-[24px] pt-[47px]">
        <div className="min-h-0 flex-1 space-y-[7px] overflow-hidden">
          {wardrobeCategories.map((item) => (
            <button
              key={item.name}
              onClick={() => setCategory(item.name)}
              onContextMenu={(e) => { e.preventDefault(); if (item.name !== "All Items") setCategoryMenu({ name:item.name, x:e.clientX, y:e.clientY }); }}
              className={`flex h-[54px] w-full items-center gap-[15px] rounded-[11px] px-[17px] text-left text-[14px] transition ${
                category === item.name ? "bg-[#DDDDCA]" : "bg-transparent hover:bg-[#E8E4D7]"
              }`}
            >
              <span className="w-[17px] text-[20px] text-[#6B7C58]">{item.icon}</span>
              <span className="text-[#312B26]">{item.name}</span>
            </button>
          ))}
        </div>

        <button onClick={openCategoryModal} className="mt-[18px] flex h-[52px] flex-shrink-0 items-center justify-center gap-[6px] rounded-[9px] border border-[#60744F] bg-transparent text-[14px] font-medium text-[#60744F] transition hover:bg-[#E4E8DC]">
          <span className="text-[20px] font-light">+</span> Add Category
        </button>
      </aside>

      <main className="flex h-full min-w-0 flex-1 overflow-hidden">
        <section className="min-w-0 flex-1 overflow-y-auto px-[32px] pb-[60px] pt-[31px]">
          <h1 className="m-0 text-[35px] font-medium leading-[1.2] text-[#302821]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
            My Wardrobe
          </h1>
          <p className="mb-[23px] mt-[8px] text-[14px] text-[#7C746C]">Your digital closet, organized your way.</p>

          <div className="mb-[24px] flex items-center gap-[12px]">
            <div className="flex h-[45px] min-w-[270px] max-w-[320px] flex-1 items-center rounded-[8px] border border-[#DDD4C6] bg-white px-[15px]">
              <svg viewBox="0 0 24 24" className="mr-[10px] h-[18px] w-[18px] flex-shrink-0 stroke-[#746D65]" fill="none" strokeWidth="2">
                <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
              </svg>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search your wardrobe..." className="w-full border-none bg-transparent text-[14px] text-[#39332E] outline-none placeholder:text-[#817A73]" />
            </div>

            <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-[45px] w-[125px] rounded-[8px] border border-[#DDD4C6] bg-white px-[14px] text-[14px] text-[#302B27] outline-none">
              {wardrobeCategories.map((item) => <option key={item.name}>{item.name}</option>)}
            </select>

            <button onClick={openAdd} className="flex h-[45px] items-center gap-[7px] whitespace-nowrap rounded-[8px] bg-[#60744F] px-[17px] text-[14px] text-white transition hover:bg-[#536544]">
              <span className="text-[19px]">+</span> Add Item
            </button>
          </div>

          <div className="mb-[23px] flex items-center justify-between">
            <h2 className="m-0 text-[18px] font-medium text-[#332D28]">{category}</h2>
            <span className="text-[14px] text-[#81786F]">{filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}</span>
          </div>

          <div className="grid grid-cols-4 gap-x-[24px] gap-y-[24px]">
            {filteredItems.map((item) => (
              <article key={item.id} onClick={() => setViewItem(item)} className="group relative min-w-0 cursor-pointer overflow-hidden rounded-[10px] border border-[#E0D7CA] bg-[#FFFCF7] shadow-[0_3px_8px_rgba(65,45,30,0.05)] transition duration-200 hover:-translate-y-[2px] hover:shadow-[0_8px_18px_rgba(65,45,30,0.10)]">
                <div className="absolute right-[9px] top-[9px] z-10 flex translate-y-[-5px] gap-[6px] opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                  <button
                    onClick={(e) => { e.stopPropagation(); openEdit(item); }}
                    title="Edit item"
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#E3D9CB] bg-[#FFFCF7]/95 text-[15px] shadow-sm hover:bg-white"
                  >✎</button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteItem(item); }}
                    title="Delete item"
                    className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[#E3D9CB] bg-[#FFFCF7]/95 text-[15px] text-[#8B4E45] shadow-sm hover:bg-white"
                  >×</button>
                </div>

                <div className="aspect-[194/240] w-full overflow-hidden bg-[#C1A184]">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.015]" />
                </div>
                <div className="h-[70px] bg-[#FFFCF7] px-[11px] py-[10px]">
                  <h3 className="m-0 truncate text-[14px] font-medium leading-[18px] text-[#302A25]">{item.name}</h3>
                  <div className="mt-[4px] flex items-center justify-between">
                    <p className="m-0 text-[12px] text-[#817970]">{categoryType(item.category)}</p>
                    <span className="text-[10px] text-[#A08F7D] opacity-0 transition group-hover:opacity-100">Click to view</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-[90px] text-center">
              <p className="mb-[16px] text-[14px] text-[#817970]">No wardrobe items found.</p>
              <button onClick={openAdd} className="rounded-[8px] bg-[#60744F] px-[18px] py-[10px] text-[13px] text-white">+ Add your first item</button>
            </div>
          )}
        </section>

        <aside className="flex h-full w-[280px] flex-shrink-0 flex-col gap-[18px] overflow-hidden py-[10px]">
          <div className="relative min-h-0 flex-[1.45] overflow-hidden rounded-l-[15px]">
            <img src={wardrobeBanner} alt="Wardrobe inspiration" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/10 to-black/45" />
            <div className="absolute inset-x-[12px] bottom-[25px] z-10 text-white">
              <h2 className="mb-[25px] text-[30px] font-semibold leading-[1.2]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Need outfit ideas?</h2>
              <p className="mb-[33px] text-[30px] leading-[1.35] text-[#F0EBE2]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Let AI style your<br />wardrobe</p>
              <button onClick={() => setPage("style")} className="h-[55px] w-full rounded-[9px] border-none bg-[#60744F] text-[14px] font-bold text-white transition hover:bg-[#536544]">GENERATE IDEAS →</button>
            </div>
          </div>

          <div className="min-h-0 flex-1 rounded-l-[18px] bg-[#FFFCF7] px-[22px] py-[14px]">
            <h2 className="mb-[20px] mt-0 text-[21px] font-semibold" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>Quick Stats</h2>
            <Stat label="Total Items" value={wardrobe.length} />
            <Stat label="Tops" value={countCategory("Tops")} />
            <Stat label="Dresses" value={countCategory("Dresses")} />
            <Stat label="Bottoms" value={countCategory("Bottoms")} />
            <Stat label="Shoes" value={countCategory("Shoes")} />
            <Stat label="Accessories" value={countCategory("Accessories")} />
          </div>
        </aside>
      </main>

      {categoryMenu && (
        <div className="fixed inset-0 z-[120]" onMouseDown={()=>setCategoryMenu(null)} onContextMenu={(e)=>e.preventDefault()}>
          <div onMouseDown={(e)=>e.stopPropagation()} style={{left:Math.min(categoryMenu.x, window.innerWidth-210),top:Math.min(categoryMenu.y, window.innerHeight-130)}} className="fixed w-[195px] overflow-hidden rounded-[13px] border border-[#DDD4C6] bg-[#FFFCF8] py-2 shadow-xl">
            <button onClick={()=>renameCategory(categoryMenu.name)} className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] hover:bg-[#E8EDDF]">✎ <span>Rename category</span></button>
            <button onClick={()=>deleteCategory(categoryMenu.name)} className="flex w-full items-center gap-3 px-4 py-3 text-left text-[13px] text-[#9B4E46] hover:bg-[#F4E7E3]">× <span>Delete category</span></button>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div
          onClick={closeCategoryModal}
          className="fixed inset-0 z-[130] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[455px] rounded-[18px] border border-[#E0D7CA] bg-[#F8F4EB] p-[30px] shadow-2xl"
          >
            <button
              onClick={closeCategoryModal}
              className="absolute right-[18px] top-[12px] border-none bg-transparent text-[28px] text-[#625B54]"
              aria-label="Close"
            >
              ×
            </button>

            <p className="mb-[7px] mt-0 text-[10px] font-semibold tracking-[.18em] text-[#60744F]">YOUR WARDROBE</p>
            <h2
              className="m-0 text-[27px] font-semibold text-[#302821]"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              Add a category
            </h2>
            <p className="mb-[24px] mt-[7px] text-[13px] leading-[1.6] text-[#817970]">
              Create a new section to keep your wardrobe organised your way.
            </p>

            <label className="mb-[7px] block text-[13px] font-semibold text-[#302B27]">Category name</label>
            <input
              autoFocus
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                if (categoryError) setCategoryError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") addCategory();
                if (e.key === "Escape") closeCategoryModal();
              }}
              placeholder="e.g. Jackets, Ethnic Wear, Scarves"
              className={`h-[46px] w-full rounded-[9px] border bg-white px-[13px] text-[14px] text-[#39332E] outline-none transition placeholder:text-[#A29A91] ${
                categoryError ? "border-[#A85C50]" : "border-[#DDD4C6] focus:border-[#60744F]"
              }`}
            />

            {categoryError && (
              <p className="mb-0 mt-[7px] text-[12px] text-[#9B4E46]">{categoryError}</p>
            )}

            <div className="mt-[24px] flex gap-[10px]">
              <button
                onClick={closeCategoryModal}
                className="h-[46px] flex-1 rounded-[8px] border border-[#D8CFC1] bg-[#FFFCF8] text-[14px] text-[#4A433D] transition hover:bg-[#F2ECE3]"
              >
                Cancel
              </button>
              <button
                onClick={addCategory}
                className="h-[46px] flex-1 rounded-[8px] border-none bg-[#60744F] text-[14px] font-medium text-white transition hover:bg-[#536544]"
              >
                + Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {showItemModal && (
        <div onClick={closeModal} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
          <div onClick={(e) => e.stopPropagation()} className="relative w-full max-w-[455px] rounded-[18px] bg-[#F8F4EB] p-[30px] shadow-2xl">
            <button onClick={closeModal} className="absolute right-[18px] top-[12px] border-none bg-transparent text-[28px] text-[#625B54]">×</button>
            <h2 className="m-0 text-[27px] font-semibold text-[#302821]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              {editingId !== null ? "Edit wardrobe item" : "Add to your wardrobe"}
            </h2>
            <p className="mb-[24px] mt-[7px] text-[13px] text-[#817970]">
              {editingId !== null ? "Update the item's details and save your changes." : "Upload a clothing item to your DripCheck wardrobe."}
            </p>

            <label className="mb-[6px] block text-[13px] font-semibold">Item name</label>
            <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Black oversized shirt" className="mb-[16px] h-[44px] w-full rounded-[8px] border border-[#DDD4C6] bg-white px-[12px] text-[14px] outline-none focus:border-[#60744F]" />

            <label className="mb-[6px] block text-[13px] font-semibold">Category</label>
            <select value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} className="mb-[16px] h-[44px] w-full rounded-[8px] border border-[#DDD4C6] bg-white px-[12px] text-[14px] outline-none">
              {wardrobeCategories.filter((x)=>x.name!=="All Items").map((x)=><option key={x.name} value={x.name}>{x.name}</option>)}
            </select>

            <label className="mb-[6px] block text-[13px] font-semibold">Clothing photo</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full rounded-[8px] border border-[#DDD4C6] bg-white p-[9px] text-[13px]" />

            {form.image && (
              <div className="mt-[16px] h-[170px] overflow-hidden rounded-[10px] border border-[#DDD4C6] bg-white">
                <img src={form.image} alt="Preview" className="h-full w-full object-contain" />
              </div>
            )}

            <div className="mt-[22px] flex gap-[10px]">
              <button onClick={closeModal} className="h-[46px] flex-1 rounded-[8px] border border-[#D8CFC1] bg-[#FFFCF8] text-[14px]">Cancel</button>
              <button onClick={saveItem} className="h-[46px] flex-1 rounded-[8px] border-none bg-[#60744F] text-[14px] font-medium text-white hover:bg-[#536544]">
                {editingId !== null ? "Save Changes" : "Add Item"}
              </button>
            </div>
          </div>
        </div>
      )}

      {viewItem && (
        <div onClick={() => setViewItem(null)} className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">
          <div onClick={(e) => e.stopPropagation()} className="relative grid w-full max-w-[720px] grid-cols-[1fr_0.9fr] overflow-hidden rounded-[20px] bg-[#FFFCF7] shadow-2xl">
            <button onClick={() => setViewItem(null)} className="absolute right-[16px] top-[10px] z-10 text-[28px] text-[#625B54]">×</button>
            <div className="min-h-[430px] bg-[#E9E1D5]">
              <img src={viewItem.image} alt={viewItem.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center p-[32px]">
              <span className="mb-[12px] w-fit rounded-full bg-[#E8EDDF] px-[11px] py-[5px] text-[11px] text-[#40542E]">{viewItem.category}</span>
              <h2 className="mb-[6px] mt-0 text-[29px]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>{viewItem.name}</h2>
              <p className="mt-0 text-[14px] text-[#817970]">{viewItem.type}</p>
              <div className="mt-[28px] flex gap-[10px]">
                <button onClick={() => openEdit(viewItem)} className="flex-1 rounded-[9px] bg-[#60744F] px-[16px] py-[11px] text-[14px] text-white">Edit Item</button>
                <button onClick={() => deleteItem(viewItem)} className="flex-1 rounded-[9px] border border-[#D7C8BA] bg-white px-[16px] py-[11px] text-[14px] text-[#8B4E45]">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div
      className="mb-[12px] flex items-center justify-between text-[16px] text-[#251F1B]"
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
      }}
    >
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}


function StylePage() {
  const [prompt, setPrompt] = useState("");
  const [recommendation, setRecommendation] = useState(null);
const [styleLoading, setStyleLoading] = useState(false);
const [styleError, setStyleError] = useState("");
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
  const [showWardrobePicker, setShowWardrobePicker] = useState(false);
  const [tryOnItems, setTryOnItems] = useState([]);
  const [tryOnWardrobe] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dripcheck-wardrobe")) || initialWardrobe; }
    catch { return initialWardrobe; }
  });

  const toggleTryOnItem = (item) => {
    setTryOnItems((prev) => {
      const withoutSameCategory = prev.filter((x) => x.category !== item.category);
      return prev.some((x) => x.id === item.id) ? prev.filter((x) => x.id !== item.id) : [...withoutSameCategory, item];
    });
  };

  const quickPrompts = [
    "Outfit for a date",
    "Dress for today's weather",
    "Use my wardrobe",
    "Something casual",
  ];

  async function askStylist() {
  if (!prompt.trim()) {
    alert("Tell DripCheck what kind of outfit you need.");
    return;
  }

  try {
    setStyleLoading(true);
    setStyleError("");
    setRecommendation(null);

    const response = await fetch(`${API_BASE}/style/recommend`, {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || "Could not generate outfit.");
    }

    console.log("✨ DripCheck Style AI:", data);
    setRecommendation(data);

  } catch (error) {
    console.error("Style AI error:", error);
    setStyleError(error.message);
  } finally {
    setStyleLoading(false);
  }
}

  return (
    <div className="min-h-[calc(100vh-78px)] bg-[#F8F4EB]">

      {/* REAL STYLE HERO */}

      <section className="relative h-[460px] overflow-hidden">

        <img
          src={styleHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />


        <div className="relative z-10 px-[80px] pt-[72px]">

          <p className="m-0 text-[12px] font-medium text-[#60744F]">
            ✦ AI STYLIST
          </p>


          <h1
            className="mb-[23px] mt-[33px] text-[52px] font-medium leading-none text-[#302821]"
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            Ask your stylist.
          </h1>


          <p className="mb-[24px] text-[15px] leading-[1.45] text-[#716A63]">
            Get outfit recommendations, style advice and more –
            <br />
            all based on your wardrobe, preferences and the weather.
          </p>


          <div className="flex h-[55px] w-[580px] items-center rounded-full bg-[#FFFCF8] py-[5px] pl-[20px] pr-[7px]">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth="2"
              className="h-[18px] w-[18px] flex-shrink-0 stroke-[#746D65]"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>


            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={'e.g. "What should I wear to college tomorrow?"'}
              className="min-w-0 flex-1 border-none bg-transparent px-[12px] text-[14px] text-[#39332E] outline-none placeholder:text-[#777068]"
            />


            <button
  type="button"
  onClick={askStylist}
  disabled={styleLoading}
  className="flex h-[42px] w-[42px] flex-shrink-0 items-center justify-center rounded-full border-none bg-[#60744F] text-[24px] text-white disabled:opacity-60"
>
  {styleLoading ? "…" : "→"}
</button>

          </div>


          <div className="mt-[26px] flex gap-[12px]">

            {quickPrompts.map((item) => (

              <button
                key={item}
                onClick={() => setPrompt(item)}
                className="rounded-full border border-[#E1D7C8] bg-[#FFFCF8] px-[17px] py-[9px] text-[13px] text-[#403A35] transition hover:bg-[#F3EDE3]"
              >
                {item}
              </button>

            ))}

          </div>

        </div>

        <button
          type="button"
          onClick={() => setShowVirtualTryOn(true)}
          className="absolute right-[34px] top-1/2 z-20 flex -translate-y-1/2 items-center gap-[10px] rounded-full border border-white/60 bg-[#60744F] px-[22px] py-[13px] text-[12px] font-semibold tracking-[.08em] text-white shadow-lg transition hover:scale-[1.03] hover:bg-[#40542E]"
        >
          <span className="text-[16px]">✦</span>
          VIRTUAL TRY-ON
        </button>

      </section>


      {/* LOWER STYLE CONTENT */}

      <section className="px-[80px] py-[40px]">

        <h2 className="mb-[20px] text-[20px] font-semibold text-[#302A25]">
          Try these suggestions
        </h2>


        <div className="grid grid-cols-4 gap-[20px] border-t border-[#E2D9CB] pt-[20px]">

          <SuggestionCard
            icon="🌤️"
            title="Today's weather"
            line1="28°C · Partly cloudy"
            line2="Light layers recommended"
          />

          <SuggestionCard
            icon="💚"
            title="College fit"
            line1="Comfortable · Trendy"
            line2="Perfect for your campus vibe"
          />

          <SuggestionCard
            icon="💗"
            title="Date night"
            line1="Chic · Effortless"
            line2="Feel confident & comfortable"
          />

          <SuggestionCard
            icon="🪞"
            title="Use my wardrobe"
            line1="Create outfits from"
            line2="what you already own"
          />

        </div>


        <div className="mt-[35px] flex items-center justify-between border-b border-[#E2D9CB] pb-[12px]">

          <h2 className="m-0 text-[20px] font-semibold">
            Recent searches
          </h2>

          <button className="border-none bg-transparent text-[13px] text-[#60744F]">
            View all →
          </button>

        </div>


        <div className="flex gap-[12px] pt-[20px]">

          {[
            "College outfit",
            "Dinner date",
            "Rainy day look",
            "Festival outfit",
            "Work from home",
          ].map((item) => (

            <button
              key={item}
              onClick={() => setPrompt(item)}
              className="rounded-full border border-[#E1D7C8] bg-[#FFFCF8] px-[16px] py-[9px] text-[13px] text-[#403A35]"
            >
              ◷ &nbsp; {item}
            </button>

          ))}

        </div>

      </section>

      {showVirtualTryOn && (
        <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/45 p-[24px] backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setShowVirtualTryOn(false);
          }}
        >
          <div className="relative max-h-[92vh] w-full max-w-[920px] overflow-y-auto rounded-[28px] border border-[#DDD4C6] bg-[#F8F4EB] p-[30px] shadow-2xl">
            <button
              type="button"
              onClick={() => setShowVirtualTryOn(false)}
              className="absolute right-[22px] top-[18px] flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#EEE8DE] text-[26px] text-[#6F655B] hover:bg-[#E2DACE]"
            >
              ×
            </button>

            <div className="mb-[24px] pr-[50px]">
              <p className="mb-[7px] text-[10px] font-semibold tracking-[.22em] text-[#60744F]">✦ DRIPCHECK AI</p>
              <h2 className="m-0 text-[38px] font-medium text-[#302821]" style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>Virtual Try-On</h2>
              <p className="mb-0 mt-[8px] text-[13px] text-[#817970]">Preview your wardrobe looks on your DripCheck avatar.</p>
            </div>

            <div className="grid gap-[26px] md:grid-cols-2">
              <div className="relative flex min-h-[470px] items-center justify-center overflow-hidden rounded-[24px] border border-[#DDD4C6] bg-gradient-to-b from-[#EFE9DF] to-[#E5DDCF] p-[24px]">
                <div className="absolute left-[20px] top-[18px] rounded-full bg-[#FFFCF8]/90 px-[12px] py-[6px] text-[10px] font-semibold tracking-[.12em] text-[#60744F]">YOUR AVATAR</div>
                <div className="text-center">
                  <div className="relative mx-auto mb-[18px] flex h-[330px] w-[205px] items-center justify-center rounded-[100px_100px_42px_42px] border border-[#D4C7B5] bg-[#DCCDB8] shadow-inner">
                    <div className="absolute top-[38px] h-[82px] w-[82px] rounded-full bg-[#C6AE91]" />
                    <div className="absolute top-[108px] h-[178px] w-[116px] rounded-[58px_58px_34px_34px] bg-[#60744F]" />
                    <div className="absolute bottom-[24px] left-[58px] h-[118px] w-[35px] rounded-full bg-[#4B5E3D]" />
                    <div className="absolute bottom-[24px] right-[58px] h-[118px] w-[35px] rounded-full bg-[#4B5E3D]" />
                    {tryOnItems.map((item, index) => (
                      <div key={item.id} className="absolute inset-x-[18px] z-20 flex justify-center" style={{ top: `${92 + index * 22}px` }}>
                        <img src={item.image} alt={item.name} title={item.name} className="max-h-[155px] max-w-[155px] rounded-[14px] border border-white/70 bg-white/80 object-contain shadow-lg mix-blend-multiply" />
                      </div>
                    ))}
                  </div>
                  <p className="m-0 text-[14px] font-semibold text-[#302821]">Your DripCheck Avatar</p>
                  <p className="mb-0 mt-[5px] text-[11px] text-[#8A8177]">Customize your avatar from Profile → Settings.</p>
                </div>
              </div>

              <div className="flex flex-col justify-center rounded-[24px] border border-[#DDD4C6] bg-[#FFFCF8] p-[28px]">
                <p className="mb-[7px] text-[10px] font-semibold tracking-[.2em] text-[#60744F]">BUILD YOUR LOOK</p>
                <h3 className="m-0 text-[29px] font-medium text-[#302821]" style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>Try your wardrobe.</h3>
                <p className="mb-0 mt-[12px] text-[13px] leading-[1.7] text-[#817970]">Choose pieces you already own, or let DripCheck AI suggest an outfit and preview the look on your avatar.</p>
                <button type="button" onClick={() => setShowWardrobePicker(true)} className="mt-[26px] h-[48px] w-full rounded-full bg-[#60744F] px-[20px] text-[12px] font-semibold tracking-[.05em] text-white hover:bg-[#40542E]">CHOOSE FROM WARDROBE</button>
                <button type="button" onClick={() => {setPrompt("Suggest an outfit for my avatar");setShowVirtualTryOn(false);}} className="mt-[10px] h-[48px] w-full rounded-full border border-[#CFC4B4] bg-[#F8F4EB] px-[20px] text-[12px] font-semibold tracking-[.05em] text-[#302821] hover:bg-[#EFE8DD]">✦ AI SUGGEST AN OUTFIT</button>
                <div className="mt-[22px] rounded-[18px] bg-[#E8EDDF] p-[17px]">
                  <p className="m-0 text-[11px] font-semibold text-[#40542E]">✦ DripCheck AI</p>
                  <p className="mb-0 mt-[6px] text-[11px] leading-[1.6] text-[#68705F]">Your saved avatar will appear here once avatar customization is connected in Settings.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showWardrobePicker && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/50 p-5 backdrop-blur-[2px]" onMouseDown={(e)=>{if(e.target===e.currentTarget)setShowWardrobePicker(false)}}>
          <div className="relative max-h-[86vh] w-full max-w-[860px] overflow-y-auto rounded-[24px] bg-[#F8F4EB] p-[26px] shadow-2xl">
            <button onClick={()=>setShowWardrobePicker(false)} className="absolute right-5 top-3 text-[30px] text-[#6F655B]">×</button>
            <p className="mb-1 text-[10px] font-semibold tracking-[.2em] text-[#60744F]">YOUR WARDROBE</p>
            <h2 className="mt-0 font-serif text-[30px]">Choose pieces to try on</h2>
            <p className="mt-[-8px] text-[12px] text-[#817970]">These are the same items saved in My Wardrobe. Pick a top, bottom, dress, shoes, jewellery, accessories or any custom category.</p>
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {tryOnWardrobe.map(item=>{const selected=tryOnItems.some(x=>x.id===item.id);return <article key={item.id} className={`overflow-hidden rounded-[14px] border bg-white ${selected?"border-[#60744F] ring-2 ring-[#60744F]/20":"border-[#DDD4C6]"}`}>
                <img src={item.image} alt={item.name} className="aspect-[4/5] w-full object-contain bg-[#F1EBDF]"/>
                <div className="p-3"><p className="m-0 truncate text-[13px] font-semibold">{item.name}</p><p className="mb-2 mt-1 text-[10px] text-[#95836F]">{item.category}</p><button onClick={()=>toggleTryOnItem(item)} className={`w-full rounded-full px-3 py-2 text-[11px] font-semibold ${selected?"bg-[#E8EDDF] text-[#40542E]":"bg-[#60744F] text-white"}`}>{selected?"REMOVE":"TRY ON"}</button></div>
              </article>})}
            </div>
            {!tryOnWardrobe.length&&<p className="py-10 text-center text-[13px] text-[#95836F]">Your wardrobe is empty. Add items in Wardrobe first.</p>}
            <button onClick={()=>setShowWardrobePicker(false)} className="mt-6 h-[46px] w-full rounded-full bg-[#60744F] text-[12px] font-semibold text-white">DONE — VIEW ON AVATAR</button>
          </div>
        </div>
      )}

    </div>
  );
}


function SuggestionCard({
  icon,
  title,
  line1,
  line2,
}) {
  return (
    <button className="min-h-[115px] rounded-[12px] border border-[#DDD3C5] bg-[#FFFCF8] p-[18px] text-left transition hover:-translate-y-[2px] hover:shadow-md">

      <h3 className="mb-[10px] mt-0 text-[15px] font-semibold">
        <span className="mr-[5px] text-[20px]">
          {icon}
        </span>

        {title}
      </h3>

      <p className="my-[7px] text-[13px] text-[#786F67]">
        {line1}
      </p>

      <p className="my-[7px] text-[13px] text-[#786F67]">
        {line2}
      </p>

    </button>
  );
}


function ProfilePage() {
  const [profileTab, setProfileTab] = useState("Profile");
  const [backendProfile, setBackendProfile] = useState(null);

useEffect(() => {
  async function loadProfile() {
    try {
      const response = await fetch(`${API_BASE}/profile`, {
        headers: getAuthHeaders(),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Profile API:", data);
        return;
      }

      console.log("✅ Real profile loaded:", data);
      setBackendProfile(data);
    } catch (error) {
      console.error("❌ Profile load error:", error);
    }
  }

  loadProfile();
}, []);

  const defaultPreferences = {
    styleScores: { Casual: 80, Minimal: 70, Ethnic: 60, Streetwear: 40, Formal: 30 },
    fabrics: ["Cotton", "Linen"],
    fitSilhouette: "Relaxed",
    occasionStyles: {
      Work: ["Minimal", "Tailored"],
      Weekend: ["Casual", "Relaxed"],
      Festive: ["Ethnic", "Bold colours"],
    },
    fitPreferences: ["Regular"],
    colourPreferences: ["Neutrals"],
    favouriteBrands: ["H&M"],
    topSize: "M",
    bottomSize: "30",
    shoeSize: "7",
    budget: "₹500 – ₹3,000",
    sustainability: "Prefer eco-friendly",
    dailyOutfit: true,
    weatherReminder: false,
  };

  const loadPreferences = () => {
    try {
      const stored = localStorage.getItem("dripcheck-preferences");
      return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
    } catch {
      return defaultPreferences;
    }
  };

  const [savedPreferences, setSavedPreferences] = useState(loadPreferences);

  const savePreferences = (nextPreferences) => {
    setSavedPreferences(nextPreferences);
    localStorage.setItem("dripcheck-preferences", JSON.stringify(nextPreferences));
  };

  const menuItems = ["Profile", "Style Preferences", "Personalisation", "Saved", "Liked", "Settings"];

  return (
    <div className="flex min-h-[calc(100vh-78px)] bg-[#F8F4EB]">
      <aside className="w-[285px] flex-shrink-0 px-[14px] py-[22px]">
        <div className="space-y-[4px]">
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => setProfileTab(item)}
              className={`h-[52px] w-full rounded-[13px] border-none px-[16px] text-left text-[18px] transition ${
                profileTab === item
                  ? "bg-[#E8EDDF] font-medium text-[#34472B]"
                  : "bg-transparent text-[#8B7B68] hover:bg-[#F0EDE4]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-[14px] pb-[45px] pt-[16px]">
        {profileTab === "Profile" && (
          <ProfileOverview
            setProfileTab={setProfileTab}
            preferences={savedPreferences}
          />
        )}
        {profileTab === "Style Preferences" && (
          <StylePreferences
            savedPreferences={savedPreferences}
            onSave={savePreferences}
          />
        )}
        {profileTab === "Personalisation" && (
          <Personalisation
            savedPreferences={savedPreferences}
            onSave={savePreferences}
          />
        )}
        {profileTab === "Saved" && <SavedPage />}
        {profileTab === "Liked" && <LikedPage />}
        {profileTab === "Settings" && <SettingsPage />}
      </main>
    </div>
  );
}

function ProfileOverview({ setProfileTab, preferences }) {
  const defaultProfile = { name: "Profile Name", username: "@dripcheck.me", bio: "Building my wardrobe, one look at a time ✦", location: "Goa, India", image: "" };
  const [profile, setProfile] = useState(() => { try { return { ...defaultProfile, ...(JSON.parse(localStorage.getItem("dripcheck-social-profile")) || {}) }; } catch { return defaultProfile; } });
  const [draft, setDraft] = useState(profile);
  const [editing, setEditing] = useState(false);
  const [peopleModal, setPeopleModal] = useState(null);
  const [viewPerson, setViewPerson] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editPostForm, setEditPostForm] = useState({ caption: "", tags: "", image: "", originalImage: "" });
  const [postForm, setPostForm] = useState({ caption: "", tags: "", image: "", originalImage: "" });
  const [collaborators, setCollaborators] = useState([]);
  const [following, setFollowing] = useState(() => { try { return JSON.parse(localStorage.getItem("dripcheck-following")) || ["atiya"]; } catch { return ["atiya"]; } });
  const defaultFollowers=[
    {id:"meher",name:"Meher",username:"@meher.edit",bio:"college fits & colour",initial:"M",followers:154,following:211},
    {id:"riya",name:"Riya",username:"@riya.wears",bio:"everyday fits + little details ✦",initial:"R",followers:218,following:190},
    {id:"noor",name:"Noor",username:"@noor.styles",bio:"modest styling & neutral palettes",initial:"N",followers:301,following:245}
  ];
  const [followers,setFollowers]=useState(()=>{try{return JSON.parse(localStorage.getItem("dripcheck-followers"))||defaultFollowers}catch{return defaultFollowers}});
  const [posts, setPosts] = useState(() => { try { return JSON.parse(localStorage.getItem("dripcheck-community-posts")) || []; } catch { return []; } });
  const p = preferences;
  const directory = [
    { id:"atiya",name:"Atiya Fathima",username:"@atiya.f",bio:"minimal fits, coffee & college days ✦",initial:"A",followers:400,following:453 },
    { id:"sara",name:"Sara",username:"@sara.styles",bio:"soft silhouettes + everyday style",initial:"S",followers:286,following:319 },
    { id:"maya",name:"Maya",username:"@maya.styles",bio:"neutral tones & minimal looks",initial:"M",followers:344,following:280 },
    { id:"aanya",name:"Aanya",username:"@aanyawears",bio:"streetwear & everyday outfits",initial:"A",followers:522,following:401 },
    { id:"zoya",name:"Zoya",username:"@zoyawears",bio:"modest fashion & little details ♡",initial:"Z",followers:198,following:245 },
    { id:"meher",name:"Meher",username:"@meher.edit",bio:"college fits & colour",initial:"M",followers:154,following:211 },
    { id:"riya",name:"Riya",username:"@riya.wears",bio:"everyday fits + little details ✦",initial:"R",followers:218,following:190 },
    { id:"noor",name:"Noor",username:"@noor.styles",bio:"modest styling & neutral palettes",initial:"N",followers:301,following:245 }
  ];
  const myPosts = posts.filter((x)=>x.mine||x.userId==="me").sort((a,b)=>(b.pinned?1:0)-(a.pinned?1:0));
  useEffect(()=>localStorage.setItem("dripcheck-following",JSON.stringify(following)),[following]);
  useEffect(()=>localStorage.setItem("dripcheck-followers",JSON.stringify(followers)),[followers]);
  const handleProfileImage=(e)=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>setDraft((d)=>({...d,image:r.result}));r.readAsDataURL(f)};
  const saveProfile=()=>{let username=draft.username.trim()||"@dripcheck.me";if(!username.startsWith("@"))username="@"+username;const next={...draft,name:draft.name.trim()||"Profile Name",username};setProfile(next);localStorage.setItem("dripcheck-social-profile",JSON.stringify(next));const updated=posts.map((post)=>post.mine||post.userId==="me"?{...post,user:next.name,username:next.username}:post);setPosts(updated);localStorage.setItem("dripcheck-community-posts",JSON.stringify(updated));setEditing(false)};
  const removeMyPost=(id)=>{if(!window.confirm("Delete this post from your profile and community feed?"))return;const next=posts.filter((x)=>x.id!==id);setPosts(next);localStorage.setItem("dripcheck-community-posts",JSON.stringify(next));if(selectedPost?.id===id)setSelectedPost(null)};
  const persistPosts=(next)=>{setPosts(next);localStorage.setItem("dripcheck-community-posts",JSON.stringify(next));};
  const updatePost=(id,changes)=>{const next=posts.map(x=>x.id===id?{...x,...changes}:x);persistPosts(next);setSelectedPost(prev=>prev?.id===id?{...prev,...changes}:prev);};
  const togglePostSetting=(post,key)=>updatePost(post.id,{[key]:!post[key]});
  const startEditPost=(post)=>{setEditPostForm({caption:post.caption||"",tags:post.tags||"",image:post.image||"",originalImage:post.image||""});setEditingPost(post);};
  const handleEditPostImage=(e)=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>setEditPostForm(prev=>({...prev,image:r.result,originalImage:r.result}));r.readAsDataURL(f)};
  const saveEditedPost=()=>{if(!editingPost)return;if(!editPostForm.caption.trim()||!editPostForm.image){alert("Add an image and caption first.");return;}updatePost(editingPost.id,{caption:editPostForm.caption.trim(),tags:editPostForm.tags.trim(),image:editPostForm.image});setEditingPost(null);};
  const sharePost=async(post)=>{const text=`${post.caption||"DripCheck post"}${post.tags?` ${post.tags}`:""}`;try{await navigator.clipboard?.writeText(text);alert("Post details copied — ready to share.");}catch{alert("Share: "+text)}};
  const handlePostImage=(e)=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=()=>setPostForm((prev)=>({...prev,image:r.result,originalImage:r.result}));r.readAsDataURL(f)};
  const createProfilePost=()=>{if(!postForm.caption.trim()||!postForm.image){alert("Add an image and caption first.");return;}const newPost={id:Date.now(),userId:"me",user:profile.name||"You",username:profile.username||"@dripcheck.me",caption:postForm.caption.trim(),tags:postForm.tags.trim(),image:postForm.image,likes:0,comments:[],liked:false,saved:false,mine:true,collaborators,pinned:false,hideLikes:false,hideComments:false,hideShare:false};const next=[newPost,...posts];setPosts(next);localStorage.setItem("dripcheck-community-posts",JSON.stringify(next));setPostForm({caption:"",tags:"",image:"",originalImage:""});setCollaborators([]);setShowCreate(false)};
  const toggleFollow=(id)=>setFollowing(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
  const removeFollower=(id)=>{if(window.confirm("Remove this follower?"))setFollowers(prev=>prev.filter(x=>x.id!==id));};
  const list=peopleModal==="followers"?followers:directory.filter((person)=>following.includes(person.id));
  const personPosts=(person)=>posts.filter(post=>!post.mine&&(post.userId===person.id||post.username===person.username)).slice(0,9);
  const fallback=["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80","https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80","https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80"];

  return <div className="mx-auto max-w-[1050px]">
    <section className="rounded-[24px] border border-[#DDD4C6] bg-[#FFFCF8] px-[34px] py-[30px]">
      <div className="flex items-center gap-[34px]"><div className="relative h-[142px] w-[142px] shrink-0 overflow-hidden rounded-full border-[4px] border-[#E8EDDF] bg-[#D8C7AF]">{profile.image?<img src={profile.image} alt={profile.name} className="h-full w-full object-cover"/>:<div className="flex h-full w-full items-center justify-center font-serif text-[46px] text-[#5E4B3D]">{profile.name?.[0]||"D"}</div>}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-[13px]"><h1 className="m-0 text-[30px] font-semibold" style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>{profile.username}</h1><span className="text-[#60744F]">✦</span></div><p className="mb-[13px] mt-[5px] text-[15px] font-medium">{profile.name}</p><div className="mb-[15px] flex gap-[30px] text-[14px]"><span><b>{myPosts.length}</b> posts</span><button onClick={()=>setPeopleModal("followers")}><b>{followers.length}</b> followers</button><button onClick={()=>setPeopleModal("following")}><b>{following.length}</b> following</button></div><p className="m-0 max-w-[560px] text-[14px] leading-6">{profile.bio}</p><p className="mt-[5px] text-[12px] text-[#8B8177]">⌖ {profile.location}</p></div></div>
      <div className="mt-[25px] grid grid-cols-2 gap-[12px]"><button onClick={()=>{setDraft(profile);setEditing(true)}} className="h-[44px] rounded-[10px] bg-[#E8EDDF] text-[13px] font-semibold text-[#40542E]">Edit Profile</button><button onClick={()=>{navigator.clipboard?.writeText(`${profile.name} ${profile.username}`);alert("Profile details copied.")}} className="h-[44px] rounded-[10px] border border-[#DDD4C6] bg-[#F8F4EB] text-[13px] font-semibold">Share Profile</button></div>
    </section>
    <section className="mt-[22px] overflow-hidden rounded-[22px] border border-[#DDD4C6] bg-[#FFFCF8]">
      <div className="flex items-center justify-center gap-[50px] border-b border-[#E4DCCE] py-[15px]"><span className="border-b-2 border-[#60744F] pb-[12px] text-[12px] font-semibold tracking-[.12em] text-[#40542E]">▦ POSTS</span><button onClick={()=>setProfileTab("Saved")} className="pb-[12px] text-[12px] tracking-[.12em] text-[#95836F]">♡ SAVED</button></div>
      {myPosts.length?<div className="grid grid-cols-3 gap-[3px] bg-[#E7E0D5]">{myPosts.map((post)=><button type="button" key={post.id} onClick={()=>setSelectedPost(post)} className="group relative aspect-square overflow-hidden bg-[#E9E1D5] text-left"><img src={post.image} alt={post.caption} className="h-full w-full object-cover"/>{post.pinned&&<span className="absolute right-[10px] top-[10px] rounded-full bg-[#FFFCF8]/90 px-[9px] py-[5px] text-[11px] font-semibold text-[#40542E]">⌖ Pinned</span>}<div className="absolute inset-0 flex items-center justify-center gap-[14px] bg-black/0 text-white opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">{!post.hideLikes&&<span>♥ {post.likes||0}</span>}{!post.hideComments&&<span>◯ {(post.comments||[]).length}</span>}<span className="rounded-full bg-white/90 px-[11px] py-[6px] text-[11px] font-semibold text-[#40542E]">View</span></div></button>)}</div>:<div className="flex min-h-[330px] items-center justify-center text-center"><div><button type="button" onClick={()=>setShowCreate(true)} aria-label="Create a new post" title="Create a new post" className="mx-auto mb-[16px] flex h-[70px] w-[70px] cursor-pointer items-center justify-center rounded-full border-2 border-[#60744F] bg-transparent text-[28px] text-[#60744F] transition hover:bg-[#E8EDDF] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#60744F]/30">▧</button><h2 className="mb-[8px] text-[28px]" style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>Share your style</h2><p className="m-0 text-[14px] text-[#817970]">Posts you create from Community will appear here.</p></div></div>}
    </section>
    <section className="mt-[22px] grid grid-cols-[1.65fr_1fr] gap-[22px]"><div className="rounded-[18px] border border-[#DDD4C6] bg-[#FFFCF8] p-[24px]"><div className="flex justify-between"><h2 className="m-0 text-[20px]">Your Style</h2><button onClick={()=>setProfileTab("Style Preferences")} className="text-[12px] text-[#60744F]">Edit →</button></div>{Object.entries(p.styleScores).map(([label,value])=><StyleBar key={label} label={label} value={value}/>)}</div><div className="rounded-[18px] border border-[#DDD4C6] bg-[#FFFCF8] p-[24px]"><h2 className="mt-0 text-[20px]">Your Preferences</h2><Preference label="Top / Bottom / Shoe" value={`${p.topSize} / ${p.bottomSize} / ${p.shoeSize}`}/><Preference label="Fit" value={p.fitPreferences.join(", ")||"Not set"}/><Preference label="Colours" value={p.colourPreferences.join(", ")||"Not set"}/><button onClick={()=>setProfileTab("Personalisation")} className="mt-[12px] h-[42px] w-full rounded-[8px] bg-[#60744F] text-[13px] text-white">Edit preferences</button></div></section>

    {showCreate&&<ModalShell wide close={()=>setShowCreate(false)}><h2 className="mt-0 text-[30px]" style={{fontFamily:"Georgia, serif"}}>Create a post</h2><input type="file" accept="image/*" onChange={handlePostImage} className="w-full rounded-[10px] border border-[#DDD4C6] bg-white p-[10px]"/>{postForm.originalImage&&<PostEditor src={postForm.originalImage} onChange={(image)=>setPostForm(p=>({...p,image}))}/>}<div className="mt-[14px] grid grid-cols-1 gap-[12px] md:grid-cols-2"><textarea value={postForm.caption} onChange={(e)=>setPostForm({...postForm,caption:e.target.value})} placeholder="Write a caption..." className="h-[100px] w-full rounded-[10px] border border-[#DDD4C6] bg-[#FFFCF8] p-[12px]"/><div><input value={postForm.tags} onChange={(e)=>setPostForm({...postForm,tags:e.target.value})} placeholder="#collegefit #minimal" className="h-[46px] w-full rounded-[10px] border border-[#DDD4C6] bg-[#FFFCF8] px-[12px]"/><div className="mt-[10px] rounded-[12px] border border-[#DDD4C6] bg-white p-[12px]"><p className="mb-[8px] mt-0 text-[12px] font-semibold">Add collaborators</p><div className="flex flex-wrap gap-[7px]">{["Atiya","Sara","Zoya","Meher","Aisha"].map(name=><button type="button" key={name} onClick={()=>setCollaborators(prev=>prev.includes(name)?prev.filter(x=>x!==name):[...prev,name])} className={`rounded-full border px-[11px] py-[6px] text-[11px] ${collaborators.includes(name)?"border-[#60744F] bg-[#E8EDDF] text-[#40542E]":"border-[#DDD4C6]"}`}>{collaborators.includes(name)?"✓ ":"+ "}{name}</button>)}</div></div></div></div><button type="button" onClick={createProfilePost} className="mt-[16px] h-[48px] w-full rounded-[10px] bg-[#60744F] text-white">Publish Post</button></ModalShell>}

    {selectedPost&&<ModalShell wide close={()=>setSelectedPost(null)}><div className="grid gap-[22px] md:grid-cols-[1.15fr_.85fr]"><div className="overflow-hidden rounded-[16px] bg-[#E9E1D5]"><img src={selectedPost.image} alt={selectedPost.caption} className="max-h-[70vh] w-full object-contain"/></div><div className="flex min-w-0 flex-col"><div className="mb-[15px] flex items-start justify-between gap-[12px]"><div><p className="m-0 text-[14px] font-semibold">{profile.username}</p>{selectedPost.pinned&&<p className="mt-[5px] text-[11px] font-semibold text-[#60744F]">⌖ Pinned to profile</p>}</div><button type="button" onClick={()=>setSelectedPost(null)} className="sr-only">Close</button></div><p className="whitespace-pre-wrap text-[14px] leading-6">{selectedPost.caption}</p>{selectedPost.tags&&<p className="mt-[4px] text-[12px] text-[#60744F]">{selectedPost.tags}</p>}<div className="my-[17px] flex flex-wrap gap-[10px] border-y border-[#E5DDD1] py-[13px] text-[13px]">{!selectedPost.hideLikes&&<span>♥ {selectedPost.likes||0} likes</span>}{!selectedPost.hideComments&&<span>◯ {(selectedPost.comments||[]).length} comments</span>}{!selectedPost.hideShare&&<button type="button" onClick={()=>sharePost(selectedPost)} className="font-semibold text-[#60744F]">↗ Share</button>}</div><h3 className="mb-[9px] mt-0 text-[12px] font-semibold uppercase tracking-[.12em] text-[#8B8177]">Post controls</h3><div className="grid grid-cols-2 gap-[8px]"><button type="button" onClick={()=>startEditPost(selectedPost)} className="h-[40px] rounded-[9px] border border-[#DDD4C6] bg-white text-[12px] font-semibold">✎ Edit</button><button type="button" onClick={()=>togglePostSetting(selectedPost,"pinned")} className="h-[40px] rounded-[9px] border border-[#DDD4C6] bg-white text-[12px] font-semibold">⌖ {selectedPost.pinned?"Unpin":"Pin"}</button><button type="button" onClick={()=>togglePostSetting(selectedPost,"hideLikes")} className="h-[40px] rounded-[9px] border border-[#DDD4C6] bg-white text-[12px]">{selectedPost.hideLikes?"Show":"Hide"} likes</button><button type="button" onClick={()=>togglePostSetting(selectedPost,"hideComments")} className="h-[40px] rounded-[9px] border border-[#DDD4C6] bg-white text-[12px]">{selectedPost.hideComments?"Show":"Hide"} comments</button><button type="button" onClick={()=>togglePostSetting(selectedPost,"hideShare")} className="h-[40px] rounded-[9px] border border-[#DDD4C6] bg-white text-[12px]">{selectedPost.hideShare?"Show":"Hide"} share</button><button type="button" onClick={()=>removeMyPost(selectedPost.id)} className="h-[40px] rounded-[9px] border border-[#D9B8B2] bg-white text-[12px] font-semibold text-[#9B4E46]">Delete</button></div><button type="button" onClick={()=>setShowCreate(true)} className="mt-auto h-[44px] rounded-[10px] bg-[#60744F] text-[12px] font-semibold text-white">+ Create another post</button></div></div></ModalShell>}

    {editingPost&&<ModalShell wide close={()=>setEditingPost(null)}><h2 className="mt-0 text-[30px]" style={{fontFamily:"Georgia, serif"}}>Edit post</h2><input type="file" accept="image/*" onChange={handleEditPostImage} className="w-full rounded-[10px] border border-[#DDD4C6] bg-white p-[10px]"/>{editPostForm.originalImage&&<PostEditor src={editPostForm.originalImage} onChange={(image)=>setEditPostForm(p=>({...p,image}))}/>}<div className="mt-[14px] grid grid-cols-1 gap-[12px] md:grid-cols-2"><textarea value={editPostForm.caption} onChange={(e)=>setEditPostForm({...editPostForm,caption:e.target.value})} placeholder="Write a caption..." className="h-[100px] w-full rounded-[10px] border border-[#DDD4C6] bg-[#FFFCF8] p-[12px]"/><input value={editPostForm.tags} onChange={(e)=>setEditPostForm({...editPostForm,tags:e.target.value})} placeholder="#collegefit #minimal" className="h-[46px] w-full rounded-[10px] border border-[#DDD4C6] bg-[#FFFCF8] px-[12px]"/></div><div className="mt-[16px] flex gap-[9px]"><button type="button" onClick={()=>setEditingPost(null)} className="h-[46px] flex-1 rounded-[10px] border border-[#DDD4C6]">Cancel</button><button type="button" onClick={saveEditedPost} className="h-[46px] flex-1 rounded-[10px] bg-[#60744F] text-white">Save Changes</button></div></ModalShell>}

    {editing&&<ModalShell close={()=>setEditing(false)}><h2 className="mt-0 text-[26px]">Edit profile</h2><div className="mb-[15px] flex items-center gap-[14px]"><div className="flex h-[72px] w-[72px] overflow-hidden rounded-full bg-[#D8C7AF]">{draft.image?<img src={draft.image} className="h-full w-full object-cover"/>:<span className="m-auto font-serif text-[25px]">{draft.name?.[0]||"D"}</span>}</div><label className="cursor-pointer rounded-full border border-[#60744F] px-[14px] py-[8px] text-[12px] text-[#60744F]">Change photo<input type="file" accept="image/*" onChange={handleProfileImage} className="hidden"/></label></div><input value={draft.name} onChange={(e)=>setDraft({...draft,name:e.target.value})} placeholder="Name" className="mb-[10px] h-[43px] w-full rounded-[8px] border border-[#DDD4C6] px-[12px]"/><input value={draft.username} onChange={(e)=>setDraft({...draft,username:e.target.value})} placeholder="@username" className="mb-[10px] h-[43px] w-full rounded-[8px] border border-[#DDD4C6] px-[12px]"/><textarea value={draft.bio} onChange={(e)=>setDraft({...draft,bio:e.target.value})} placeholder="Bio" className="mb-[10px] h-[80px] w-full rounded-[8px] border border-[#DDD4C6] p-[12px]"/><input value={draft.location} onChange={(e)=>setDraft({...draft,location:e.target.value})} placeholder="Location" className="h-[43px] w-full rounded-[8px] border border-[#DDD4C6] px-[12px]"/><div className="mt-[17px] flex gap-[9px]"><button onClick={()=>setEditing(false)} className="h-[44px] flex-1 rounded-[8px] border border-[#DDD4C6]">Cancel</button><button onClick={saveProfile} className="h-[44px] flex-1 rounded-[8px] bg-[#60744F] text-white">Save Changes</button></div></ModalShell>}

    {peopleModal&&<ModalShell close={()=>setPeopleModal(null)}><h2 className="mt-0 text-[25px]">{peopleModal==="followers"?"Followers":"Following"}</h2><div className="max-h-[430px] overflow-auto">{list.length?list.map((person)=><div key={person.id} className="flex items-center border-b border-[#E7E0D5] py-[12px]"><button onClick={()=>setViewPerson(person)} className="flex min-w-0 flex-1 items-center text-left"><div className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#D8C7AF] font-serif text-[18px]">{person.initial||person.name[0]}</div><div className="ml-[11px] min-w-0"><p className="m-0 truncate text-[14px] font-semibold">{person.name}</p><p className="mt-[2px] truncate text-[11px] text-[#95836F]">{person.username}</p></div></button><div className="ml-[10px] flex gap-[6px]">{peopleModal==="followers"?<><button onClick={()=>toggleFollow(person.id)} className={`rounded-full px-[12px] py-[7px] text-[11px] ${following.includes(person.id)?"border border-[#DDD4C6]":"bg-[#60744F] text-white"}`}>{following.includes(person.id)?"Unfollow":"Follow"}</button><button onClick={()=>removeFollower(person.id)} className="rounded-full border border-[#D9B8B2] px-[12px] py-[7px] text-[11px] text-[#9B4E46]">Remove</button></>:<button onClick={()=>toggleFollow(person.id)} className="rounded-full border border-[#DDD4C6] px-[12px] py-[7px] text-[11px]">Unfollow</button>}</div></div>):<p className="text-[13px] text-[#95836F]">No one here yet.</p>}</div></ModalShell>}

    {viewPerson&&<ModalShell close={()=>setViewPerson(null)}><div className="flex items-center gap-[20px]"><div className="flex h-[92px] w-[92px] shrink-0 items-center justify-center rounded-full bg-[#D8C7AF] font-serif text-[34px]">{viewPerson.initial||viewPerson.name[0]}</div><div><h2 className="m-0 text-[24px]">{viewPerson.username}</h2><p className="mb-[8px] mt-[4px] text-[14px] font-semibold">{viewPerson.name}</p><div className="flex gap-[18px] text-[11px]"><span><b>{personPosts(viewPerson).length||3}</b> posts</span><span><b>{viewPerson.followers||128}</b> followers</span><span><b>{viewPerson.following||176}</b> following</span></div></div></div><p className="mt-[16px] text-[13px] leading-6">{viewPerson.bio||"DripCheck community member ✦"}</p><div className="mt-[15px] grid grid-cols-2 gap-[9px]"><button onClick={()=>toggleFollow(viewPerson.id)} className={`h-[42px] rounded-[9px] ${following.includes(viewPerson.id)?"border border-[#DDD4C6] bg-white":"bg-[#60744F] text-white"}`}>{following.includes(viewPerson.id)?"Unfollow":"Follow"}</button><button onClick={()=>{if(!following.includes(viewPerson.id)){alert("Follow this person first to message them.");return;} alert("Open Chat and select this person to message them.");}} className="h-[42px] rounded-[9px] border border-[#60744F] text-[#60744F]">Message</button></div><div className="mt-[18px] grid grid-cols-3 gap-[4px]">{(personPosts(viewPerson).length?personPosts(viewPerson).map(x=>x.image):fallback).map((img,i)=><img key={i} src={img} className="aspect-square w-full rounded-[7px] object-cover"/>)}</div></ModalShell>}
  </div>;
}

function StylePreferences({ savedPreferences, onSave }) {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(savedPreferences)));
  const [message, setMessage] = useState("");

  const styleOptions = ["Casual", "Minimal", "Ethnic", "Streetwear", "Formal"];
  const occasionOptions = ["Minimal", "Tailored", "Casual", "Relaxed", "Ethnic", "Bold colours", "Streetwear", "Formal"];

  const setScore = (label, value) =>
    setDraft((prev) => ({ ...prev, styleScores: { ...prev.styleScores, [label]: value } }));

  const toggleFabric = (name) =>
    setDraft((prev) => ({
      ...prev,
      fabrics: prev.fabrics.includes(name) ? prev.fabrics.filter((x) => x !== name) : [...prev.fabrics, name],
    }));

  const toggleOccasionStyle = (occasion, style) =>
    setDraft((prev) => {
      const current = prev.occasionStyles[occasion] || [];
      return {
        ...prev,
        occasionStyles: {
          ...prev.occasionStyles,
          [occasion]: current.includes(style) ? current.filter((x) => x !== style) : [...current, style],
        },
      };
    });

  const save = () => {
    onSave(draft);
    setMessage("Style preferences saved");
    setTimeout(() => setMessage(""), 1800);
  };

  const cancel = () => {
    setDraft(JSON.parse(JSON.stringify(savedPreferences)));
    setMessage("Changes cancelled");
    setTimeout(() => setMessage(""), 1500);
  };

  return (
    <div className="mx-auto max-w-[1050px]">
      <section className="rounded-[27px] border border-[#E0D8CA] bg-[#FFFEFC] px-[30px] py-[26px]">
        <h2 className="m-0 text-[21px] font-medium">Your style</h2>
        <p className="mb-[20px] mt-[5px] text-[13px] text-[#95826D]">Drag the sliders, then save your changes.</p>
        {styleOptions.map((label) => (
          <AdjustableStyle key={label} label={label} value={draft.styleScores[label]} onChange={(v) => setScore(label, v)} />
        ))}
      </section>

      <section className="mt-[25px] rounded-[27px] border border-[#E0D8CA] bg-[#FFFEFC] px-[30px] py-[29px]">
        <h2 className="mb-[19px] mt-0 text-[21px] font-medium">Fabric preferences</h2>
        <div className="flex flex-wrap gap-[12px]">
          {["Cotton", "Linen", "Silk", "Wool", "Denim", "Synthetic blends"].map((name) => (
            <button key={name} onClick={() => toggleFabric(name)}
              className={`rounded-full border px-[19px] py-[9px] text-[16px] transition ${draft.fabrics.includes(name) ? "border-[#3F512E] bg-[#3F512E] text-white" : "border-[#E1D8C9] bg-[#F8F4EB] text-[#241F1B]"}`}>
              {name}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-[25px] rounded-[27px] border border-[#E0D8CA] bg-[#FFFEFC] px-[30px] py-[28px]">
        <h2 className="mb-[18px] mt-0 text-[21px] font-medium">Fit silhouette</h2>
        <div className="grid grid-cols-3 gap-[15px]">
          {["Relaxed", "Fitted", "Oversized"].map((name) => (
            <button key={name} onClick={() => setDraft((p) => ({ ...p, fitSilhouette: name }))}
              className={`flex h-[105px] flex-col items-center justify-center rounded-[16px] border-none text-[18px] transition ${draft.fitSilhouette === name ? "bg-[#E8EDDF] text-[#1E251B]" : "bg-[#F7F3EB] text-[#928573]"}`}>
              <span className="mb-[10px] text-[27px]">♧</span>{name}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-[25px] rounded-[27px] border border-[#E0D8CA] bg-[#FFFEFC] px-[30px] py-[28px]">
        <h2 className="mb-[4px] mt-0 text-[21px] font-medium">Style by occasion</h2>
        <p className="mb-[22px] mt-[5px] text-[13px] text-[#95826D]">Pick as many styles as you want for each occasion.</p>
        {Object.keys(draft.occasionStyles).map((occasion) => (
          <div key={occasion} className="border-b border-[#E7E0D5] py-[18px] first:pt-0 last:border-b-0 last:pb-0">
            <div className="mb-[12px] flex items-center justify-between">
              <span className="text-[17px] font-medium">{occasion}</span>
              <span className="text-[13px] text-[#99866F]">{draft.occasionStyles[occasion].join(", ") || "Choose styles"}</span>
            </div>
            <div className="flex flex-wrap gap-[8px]">
              {occasionOptions.map((option) => (
                <button key={option} onClick={() => toggleOccasionStyle(occasion, option)}
                  className={`rounded-full border px-[14px] py-[7px] text-[13px] transition ${draft.occasionStyles[occasion].includes(option) ? "border-[#3F512E] bg-[#3F512E] text-white" : "border-[#E1D8C9] bg-[#F8F4EB] text-[#5F554C]"}`}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </section>

      <SaveBar onCancel={cancel} onSave={save} message={message} />
    </div>
  );
}

function AdjustableStyle({ label, value, onChange }) {
  return (
    <div className="mb-[19px] last:mb-0">
      <div className="mb-[7px] flex items-center justify-between text-[18px]">
        <span>{label}</span><span className="min-w-[48px] text-right text-[#9A846A]">{value}%</span>
      </div>
      <input type="range" min="0" max="100" step="5" value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-[8px] w-full cursor-pointer accent-[#3F512E]" />
    </div>
  );
}

function Personalisation({ savedPreferences, onSave }) {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(savedPreferences)));
  const [openCard, setOpenCard] = useState(null);
  const [customBrand, setCustomBrand] = useState("");
  const [message, setMessage] = useState("");

  const fitOptions = ["Slim", "Regular", "Relaxed", "Oversized"];
  const colourOptions = ["Neutrals", "Pastels", "Earth tones", "Brights", "Dark colours", "Monochrome"];
  const brandOptions = ["H&M", "Zudio", "Zara", "Mango", "Uniqlo", "Westside", "Levi's"];

  const toggleArray = (key, value) =>
    setDraft((prev) => ({
      ...prev,
      [key]: prev[key].includes(value) ? prev[key].filter((x) => x !== value) : [...prev[key], value],
    }));

  const addBrand = () => {
    const clean = customBrand.trim();
    if (!clean) return;
    if (!draft.favouriteBrands.includes(clean)) {
      setDraft((prev) => ({ ...prev, favouriteBrands: [...prev.favouriteBrands, clean] }));
    }
    setCustomBrand("");
  };

  const save = () => {
    onSave(draft);
    setMessage("Personalisation saved");
    setTimeout(() => setMessage(""), 1800);
  };

  const cancel = () => {
    setDraft(JSON.parse(JSON.stringify(savedPreferences)));
    setOpenCard(null);
    setMessage("Changes cancelled");
    setTimeout(() => setMessage(""), 1500);
  };

  const cards = [
    { key: "fit", icon: "📏", title: "Fit preferences", summary: draft.fitPreferences.join(", ") || "Choose your preferred fit" },
    { key: "colour", icon: "🎨", title: "Colour preferences", summary: draft.colourPreferences.join(", ") || "Choose colours you love" },
    { key: "brands", icon: "♡", title: "Favourite brands", summary: draft.favouriteBrands.join(", ") || "Choose your go-to brands" },
  ];

  return (
    <div className="mx-auto max-w-[1050px]">
      <section className="rounded-[28px] bg-[#E8EDDF] px-[29px] py-[27px]">
        <h2 className="m-0 text-[21px] font-semibold">Make your recommendations smarter</h2>
        <p className="mb-[18px] mt-[3px] text-[17px] text-[#95826D]">Add a few details to get better outfit suggestions.</p>
        <div className="grid grid-cols-3 gap-[16px]">
          {cards.map((card) => (
            <PersonalCard key={card.key} {...card} active={openCard === card.key} onClick={() => setOpenCard(openCard === card.key ? null : card.key)} />
          ))}
        </div>

        {openCard && (
          <div className="mt-[16px] rounded-[18px] bg-white p-[22px]">
            {openCard === "fit" && <ChoiceEditor title="Which fits do you prefer?" options={fitOptions} selected={draft.fitPreferences} onToggle={(v) => toggleArray("fitPreferences", v)} />}
            {openCard === "colour" && <ChoiceEditor title="Which colours do you usually enjoy wearing?" options={colourOptions} selected={draft.colourPreferences} onToggle={(v) => toggleArray("colourPreferences", v)} />}
            {openCard === "brands" && (
              <div>
                <ChoiceEditor title="Which brands do you like?" options={brandOptions} selected={draft.favouriteBrands} onToggle={(v) => toggleArray("favouriteBrands", v)} />
                <div className="mt-[16px] flex max-w-[470px] gap-[9px]">
                  <input value={customBrand} onChange={(e) => setCustomBrand(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addBrand()} placeholder="Add another brand" className="h-[42px] flex-1 rounded-[9px] border border-[#DED6C9] bg-[#F8F4EB] px-[13px] text-[14px] outline-none focus:border-[#60744F]" />
                  <button onClick={addBrand} className="rounded-[9px] bg-[#60744F] px-[18px] text-[14px] text-white">Add</button>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="mt-[25px] rounded-[27px] border border-[#DED6C9] bg-[#FFFEFC] px-[29px] py-[28px]">
        <h2 className="mb-[20px] mt-0 text-[21px] font-medium">Sizes</h2>
        <div className="grid grid-cols-3 gap-[16px]">
          <SelectCard title="Top" value={draft.topSize} onChange={(v) => setDraft((p) => ({...p, topSize:v}))} options={["XXS","XS","S","M","L","XL","XXL","3XL"]} />
          <SelectCard title="Bottom" value={draft.bottomSize} onChange={(v) => setDraft((p) => ({...p, bottomSize:v}))} options={["24","26","28","30","32","34","36","38","40","42","44"]} />
          <SelectCard title="Shoe" value={draft.shoeSize} onChange={(v) => setDraft((p) => ({...p, shoeSize:v}))} options={["3","4","5","6","7","8","9","10","11","12"]} />
        </div>
      </section>

      <section className="mt-[25px] rounded-[27px] border border-[#DED6C9] bg-[#FFFEFC] px-[29px] py-[28px]">
        <h2 className="mb-[20px] mt-0 text-[21px] font-medium">Shopping</h2>
        <div className="grid grid-cols-2 gap-[16px]">
          <ShoppingSelect icon="₹" title="Budget range" value={draft.budget} onChange={(v) => setDraft((p) => ({...p, budget:v}))} options={["Under ₹500","₹500 – ₹1,000","₹1,000 – ₹3,000","₹3,000 – ₹5,000","₹5,000+","No fixed budget"]} />
          <ShoppingSelect icon="♧" title="Sustainability" value={draft.sustainability} onChange={(v) => setDraft((p) => ({...p, sustainability:v}))} options={["No preference","Prefer eco-friendly","Eco-friendly only","Prefer second-hand","Prefer durable basics"]} />
        </div>
      </section>

      <section className="mt-[25px] rounded-[27px] border border-[#DED6C9] bg-[#FFFEFC] px-[29px] py-[28px]">
        <h2 className="mb-[22px] mt-0 text-[21px] font-medium">Notifications</h2>
        <ToggleRow label="Daily outfit suggestion" enabled={draft.dailyOutfit} setEnabled={(fn) => setDraft((p) => ({...p, dailyOutfit: typeof fn === "function" ? fn(p.dailyOutfit) : fn}))} />
        <ToggleRow label="Weather-based reminders" enabled={draft.weatherReminder} setEnabled={(fn) => setDraft((p) => ({...p, weatherReminder: typeof fn === "function" ? fn(p.weatherReminder) : fn}))} />
      </section>

      <SaveBar onCancel={cancel} onSave={save} message={message} />
    </div>
  );
}

function PersonalCard({ icon, title, summary, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex min-h-[118px] flex-col items-start justify-center rounded-[16px] border px-[20px] text-left transition ${active ? "border-[#60744F] bg-[#F8FBEF]" : "border-transparent bg-white hover:border-[#D7DDC8]"}`}>
      <span className="mb-[9px] text-[24px] text-[#40542E]">{icon}</span>
      <span className="text-[17px] font-medium">{title}</span>
      <span className="mt-[5px] max-w-full truncate text-[12px] text-[#95836F]">{summary}</span>
    </button>
  );
}

function ChoiceEditor({ title, options, selected, onToggle }) {
  return (
    <div>
      <p className="mb-[13px] mt-0 text-[15px] font-medium">{title}</p>
      <div className="flex flex-wrap gap-[9px]">
        {options.map((option) => (
          <button key={option} onClick={() => onToggle(option)} className={`rounded-full border px-[15px] py-[8px] text-[13px] transition ${selected.includes(option) ? "border-[#40542E] bg-[#40542E] text-white" : "border-[#DED6C9] bg-[#F8F4EB] text-[#4B433C]"}`}>
            {selected.includes(option) ? "✓ " : ""}{option}
          </button>
        ))}
      </div>
    </div>
  );
}

function SelectCard({ title, value, onChange, options }) {
  return (
    <label className="flex min-h-[96px] flex-col items-center justify-center rounded-[16px] bg-[#F7F3EB] px-[18px]">
      <span className="mb-[7px] text-[15px] text-[#95836F]">{title}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full cursor-pointer border-none bg-transparent text-center text-[18px] text-[#302821] outline-none">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function ShoppingSelect({ icon, title, value, onChange, options }) {
  return (
    <div className="rounded-[16px] bg-[#F7F3EB] px-[19px] py-[19px]">
      <div className="mb-[11px] text-[24px] text-[#40542E]">{icon}</div>
      <p className="m-0 text-[17px] font-medium">{title}</p>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-[8px] h-[40px] w-full cursor-pointer rounded-[8px] border border-[#DED6C9] bg-[#FFFEFC] px-[10px] text-[14px] text-[#7E6D5B] outline-none focus:border-[#60744F]">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  );
}

function ToggleRow({ label, enabled, setEnabled }) {
  return (
    <div className="flex h-[57px] items-center justify-between border-b border-[#E4DDD2] last:border-b-0">
      <span className="text-[17px]">{label}</span>
      <button type="button" onClick={() => setEnabled((prev) => !prev)} className={`relative h-[29px] w-[51px] rounded-full border-none transition ${enabled ? "bg-[#40542E]" : "bg-[#E7E1D5]"}`} aria-pressed={enabled}>
        <span className={`absolute top-[4px] h-[21px] w-[21px] rounded-full bg-white transition-all ${enabled ? "left-[26px]" : "left-[4px]"}`} />
      </button>
    </div>
  );
}

function SaveBar({ onCancel, onSave, message }) {
  return (
    <div className="sticky bottom-[14px] z-20 mt-[25px] flex items-center justify-between rounded-[18px] border border-[#DED6C9] bg-[#FFFEFC]/95 px-[20px] py-[14px] shadow-lg backdrop-blur">
      <span className="text-[13px] text-[#60744F]">{message || "Changes are not applied until you save."}</span>
      <div className="flex gap-[10px]">
        <button onClick={onCancel} className="rounded-[9px] border border-[#D9D0C1] bg-[#F8F4EB] px-[20px] py-[10px] text-[14px]">Cancel</button>
        <button onClick={onSave} className="rounded-[9px] bg-[#60744F] px-[22px] py-[10px] text-[14px] text-white">Save Changes</button>
      </div>
    </div>
  );
}

function LikedPage() {
  const [likedPosts, setLikedPosts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dripcheck-liked-posts")) || []; } catch { return []; }
  });
  const [viewer, setViewer] = useState(null);

  const unlikePost = (id) => {
    const nextLiked = likedPosts.filter((p) => String(p.id) !== String(id));
    setLikedPosts(nextLiked);
    localStorage.setItem("dripcheck-liked-posts", JSON.stringify(nextLiked));
    try {
      const community = JSON.parse(localStorage.getItem("dripcheck-community-posts")) || [];
      localStorage.setItem("dripcheck-community-posts", JSON.stringify(community.map((p) => String(p.id) === String(id) ? { ...p, liked:false, likes:Math.max(0,(p.likes||0)-1) } : p)));
    } catch {}
    if (viewer && String(viewer.id) === String(id)) setViewer(null);
  };

  return (
    <div className="px-[24px] py-[18px]">
      <div className="mb-[26px]">
        <h1 className="m-0 text-[32px] font-medium text-[#302821]" style={{fontFamily:"Georgia, 'Times New Roman', serif"}}>Liked posts</h1>
        <p className="mt-[8px] text-[14px] text-[#95836F]">Posts you like in Community will appear here.</p>
      </div>
      {!likedPosts.length ? (
        <div className="flex min-h-[430px] flex-col items-center justify-center rounded-[24px] border border-[#DDD4C6] bg-[#FFFCF8] text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#60744F] text-[28px] text-[#60744F]">♡</div>
          <h2 className="m-0 font-serif text-[27px]">No liked posts yet</h2>
          <p className="mt-3 text-[13px] text-[#95836F]">Tap the heart on a Community post and you’ll find it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-[18px] xl:grid-cols-3">
          {likedPosts.map((post) => {
            const cover = post.mediaType === "carousel" ? post.images?.[0] : (post.video || post.image);
            return <article key={post.id} onClick={()=>setViewer(post)} className="group cursor-pointer overflow-hidden rounded-[18px] border border-[#DDD4C6] bg-[#FFFCF8]">
              <div className="aspect-square overflow-hidden bg-[#EEE7DC]">{post.mediaType === "video" || post.video ? <video src={cover} muted className="h-full w-full object-cover"/> : <img src={cover} alt={post.caption||"Liked post"} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"/>}</div>
              <div className="p-[14px]"><p className="m-0 text-[13px] font-semibold">{post.user}</p><p className="mt-1 line-clamp-2 text-[12px] text-[#746A60]">{post.caption}</p></div>
            </article>;
          })}
        </div>
      )}
      {viewer && <ModalShell wide close={()=>setViewer(null)}><div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_280px]"><div className="overflow-hidden rounded-xl bg-[#F3EEE5]"><CommunityPostMedia post={viewer}/></div><div><p className="text-[14px] font-semibold">{viewer.user}</p><p className="text-[14px] leading-6">{viewer.caption}</p><p className="text-[11px] text-[#60744F]">{viewer.tags}</p><button onClick={()=>unlikePost(viewer.id)} className="mt-5 rounded-xl border border-[#CFAFA8] px-4 py-2 text-[12px] text-[#8B4B45]">♡ Unlike</button></div></div></ModalShell>}
    </div>
  );
}

function SavedPage() {
  const [section, setSection] = useState("Posts");
  const [savedPosts, setSavedPosts] = useState(() => { try { return JSON.parse(localStorage.getItem("dripcheck-saved-posts")) || []; } catch { return []; } });
  const [collections, setCollections] = useState(() => { try { return JSON.parse(localStorage.getItem("dripcheck-save-collections")) || []; } catch { return []; } });
  const [openCollection, setOpenCollection] = useState(null);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [collectionName, setCollectionName] = useState("");
  const [viewer, setViewer] = useState(null);

  const emptyForm = { name: "", occasion: "College", notes: "" };
  const [outfits, setOutfits] = useState(() => { try { return JSON.parse(localStorage.getItem("dripcheck-saved-outfits")) || []; } catch { return []; } });
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { localStorage.setItem("dripcheck-save-collections", JSON.stringify(collections)); }, [collections]);
  const createCollection = () => { const name=collectionName.trim(); if(!name)return; setCollections(p=>[{id:Date.now(),name,postIds:[],createdAt:Date.now()},...p]); setCollectionName(""); setShowNewCollection(false); };
  const deleteCollection = (id) => { if(window.confirm("Delete this collection? The posts will stay in All Posts.")){setCollections(p=>p.filter(c=>c.id!==id)); if(openCollection?.id===id)setOpenCollection(null);} };
  const removeSavedPost = (id) => { const next=savedPosts.filter(p=>String(p.id)!==String(id)); setSavedPosts(next); localStorage.setItem("dripcheck-saved-posts",JSON.stringify(next)); setCollections(cs=>cs.map(c=>({...c,postIds:(c.postIds||[]).filter(pid=>String(pid)!==String(id))}))); setViewer(null); };
  const collectionPosts = openCollection ? savedPosts.filter(p=>(openCollection.postIds||[]).map(String).includes(String(p.id))) : savedPosts;
  const coverFor = (c) => { const ids=(c.postIds||[]).map(String); return savedPosts.find(p=>ids.includes(String(p.id))); };
  const mediaSrc = (p) => p?.image || p?.images?.[0] || "";

  const persistOutfits = (next) => { setOutfits(next); localStorage.setItem("dripcheck-saved-outfits", JSON.stringify(next)); };
  const submitOutfit = () => { if(!form.name.trim())return; if(editingId)persistOutfits(outfits.map(o=>o.id===editingId?{...o,...form}:o)); else persistOutfits([...outfits,{...form,id:Date.now(),createdAt:new Date().toISOString()}]); setForm(emptyForm);setEditingId(null);setShowForm(false); };

  return <div className="mx-auto max-w-[1050px]">
    <div className="mb-6 flex items-end justify-between border-b border-[#DED6C9] pb-4">
      <div><h2 className="m-0 font-serif text-[30px]">Saved</h2><p className="mb-0 mt-1 text-[13px] text-[#95836F]">Keep posts in All Posts or organise them into collections.</p></div>
      <div className="flex gap-2">{["Posts","Outfits"].map(x=><button key={x} onClick={()=>{setSection(x);setOpenCollection(null)}} className={`rounded-full px-5 py-2 text-[12px] ${section===x?"bg-[#60744F] text-white":"border border-[#D8CFC1] bg-[#FFFCF8]"}`}>{x}</button>)}</div>
    </div>

    {section==="Posts" && <>
      {!openCollection && <div className="mb-5 flex items-center justify-between"><h3 className="m-0 text-[19px]">Collections</h3><button onClick={()=>setShowNewCollection(true)} className="rounded-full bg-[#60744F] px-4 py-2 text-[12px] font-semibold text-white">＋ New Collection</button></div>}
      {!openCollection && <div className="mb-8 grid grid-cols-3 gap-4">
        <button onClick={()=>setOpenCollection({id:"all",name:"All Posts",postIds:savedPosts.map(p=>String(p.id))})} className="group relative aspect-[1.05/1] overflow-hidden rounded-[15px] border border-[#D8CFC1] bg-[#E8E1D5] text-left">{savedPosts.slice(0,4).length?<div className="grid h-full grid-cols-2 grid-rows-2">{savedPosts.slice(0,4).map((p,i)=>mediaSrc(p)?<img key={p.id} src={mediaSrc(p)} className="h-full w-full object-cover"/>:<div key={i} className="bg-[#D9D0C2]"/>)}</div>:<div className="flex h-full items-center justify-center text-[35px] text-[#8C7D6E]">⌑</div>}<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-4 pt-12 text-white"><p className="m-0 text-[18px] font-medium">All Posts</p><span className="text-[11px]">{savedPosts.length} saved</span></div></button>
        {collections.map(c=>{const cover=coverFor(c);return <div key={c.id} className="group relative aspect-[1.05/1] overflow-hidden rounded-[15px] border border-[#D8CFC1] bg-[#E8E1D5]"><button onClick={()=>setOpenCollection(c)} className="absolute inset-0 h-full w-full text-left">{cover&&mediaSrc(cover)?<img src={mediaSrc(cover)} className="h-full w-full object-cover"/>:<div className="flex h-full items-center justify-center text-[34px] text-[#8C7D6E]">⌑</div>}<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-4 pt-12 text-white"><p className="m-0 text-[18px] font-medium">{c.name}</p><span className="text-[11px]">{(c.postIds||[]).length} saved</span></div></button><button onClick={()=>deleteCollection(c.id)} title="Delete collection" className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white opacity-0 backdrop-blur group-hover:opacity-100">×</button></div>})}
      </div>}

      {openCollection && <div className="mb-4 flex items-center justify-between"><div><button onClick={()=>setOpenCollection(null)} className="mb-2 text-[12px] text-[#60744F]">← Collections</button><h3 className="m-0 font-serif text-[25px]">{openCollection.name}</h3></div>{openCollection.id!=="all"&&<button onClick={()=>deleteCollection(openCollection.id)} className="text-[12px] text-[#8B4B45]">Delete collection</button>}</div>}
      {(openCollection ? collectionPosts : []).length>0 && <div className="grid grid-cols-3 gap-1">{collectionPosts.map(p=><button key={p.id} onClick={()=>setViewer(p)} className="relative aspect-square overflow-hidden bg-[#E7E0D5]">{p.mediaType==="video"||p.video?<video src={p.video||p.image} muted className="h-full w-full object-cover"/>:<img src={mediaSrc(p)} className="h-full w-full object-cover"/>}<span className="absolute bottom-2 right-2 rounded-full bg-black/45 px-2 py-1 text-[9px] text-white">{p.user}</span></button>)}</div>}
      {openCollection && collectionPosts.length===0 && <div className="flex min-h-[260px] items-center justify-center rounded-[24px] border border-[#DED6C9] bg-[#FFFEFC] text-center"><div><div className="mb-3 text-[30px] text-[#A48E78]">⌑</div><p className="m-0 text-[16px] text-[#95836F]">No posts in this collection yet.</p></div></div>}
      {!openCollection && savedPosts.length===0 && collections.length===0 && <div className="flex min-h-[250px] items-center justify-center rounded-[24px] border border-[#DED6C9] bg-[#FFFEFC] text-center"><div><div className="mb-3 text-[30px] text-[#A48E78]">⌑</div><p className="m-0 text-[16px] text-[#95836F]">Posts you bookmark in Community will appear here.</p></div></div>}
    </>}

    {section==="Outfits" && <><div className="mb-5 flex items-center justify-between"><div><h3 className="m-0 text-[20px]">Saved outfits</h3><p className="mb-0 mt-1 text-[12px] text-[#95836F]">Your manually saved outfit ideas.</p></div><button onClick={()=>{setForm(emptyForm);setEditingId(null);setShowForm(true)}} className="rounded-[9px] bg-[#60744F] px-4 py-2 text-[12px] text-white">+ Add Saved Outfit</button></div>{showForm&&<section className="mb-5 rounded-[20px] border border-[#DED6C9] bg-[#FFFEFC] p-5"><div className="grid grid-cols-2 gap-3"><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Outfit name" className="rounded-lg border border-[#DED6C9] bg-[#F8F4EB] px-3 py-3"/><select value={form.occasion} onChange={e=>setForm({...form,occasion:e.target.value})} className="rounded-lg border border-[#DED6C9] bg-[#F8F4EB] px-3">{["College","Work","Weekend","Date","Party","Festive","Travel","Other"].map(x=><option key={x}>{x}</option>)}</select></div><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Notes..." className="mt-3 min-h-[90px] w-full rounded-lg border border-[#DED6C9] bg-[#F8F4EB] p-3"/><div className="mt-3 flex justify-end gap-2"><button onClick={()=>setShowForm(false)} className="rounded-lg border px-4 py-2">Cancel</button><button onClick={submitOutfit} className="rounded-lg bg-[#60744F] px-4 py-2 text-white">Save Outfit</button></div></section>}{outfits.length?<div className="grid grid-cols-2 gap-4">{outfits.map(o=><article key={o.id} className="rounded-[18px] border border-[#DED6C9] bg-[#FFFEFC] p-5"><span className="rounded-full bg-[#E8EDDF] px-3 py-1 text-[10px] text-[#40542E]">{o.occasion}</span><h3>{o.name}</h3><p className="text-[12px] text-[#817970]">{o.notes||"No notes added."}</p><div className="flex gap-2"><button onClick={()=>{setForm({name:o.name,occasion:o.occasion,notes:o.notes});setEditingId(o.id);setShowForm(true)}} className="rounded-lg border px-3 py-1.5 text-[11px]">Edit</button><button onClick={()=>window.confirm("Delete this saved outfit?")&&persistOutfits(outfits.filter(x=>x.id!==o.id))} className="rounded-lg border px-3 py-1.5 text-[11px] text-[#8B4B45]">Delete</button></div></article>)}</div>:<div className="flex min-h-[250px] items-center justify-center rounded-[24px] border border-[#DED6C9] bg-[#FFFEFC] text-[#95836F]">You haven’t saved any outfits yet.</div>}</>}

    {showNewCollection&&<ModalShell close={()=>setShowNewCollection(false)}><h2 className="mt-0 font-serif text-[26px]">New collection</h2><input autoFocus value={collectionName} onChange={e=>setCollectionName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&createCollection()} placeholder="Collection name" className="h-12 w-full rounded-xl border border-[#D8CFC1] bg-[#F8F4EB] px-4 outline-none focus:border-[#60744F]"/><button onClick={createCollection} className="mt-4 h-11 w-full rounded-xl bg-[#60744F] text-[13px] font-semibold text-white">Create collection</button></ModalShell>}
    {viewer&&<ModalShell wide close={()=>setViewer(null)}><div className="grid gap-5 md:grid-cols-[1fr_300px]"><div className="overflow-hidden rounded-xl bg-[#EEE8DE]">{viewer.mediaType==="video"||viewer.video?<video src={viewer.video||viewer.image} controls autoPlay className="max-h-[70vh] w-full object-contain"/>:<img src={mediaSrc(viewer)} className="max-h-[70vh] w-full object-contain"/>}</div><div><p className="font-semibold">{viewer.user}</p><p className="text-[14px] leading-6">{viewer.caption}</p><p className="text-[11px] text-[#60744F]">{viewer.tags}</p><button onClick={()=>removeSavedPost(viewer.id)} className="mt-5 rounded-full border border-[#CFAFA8] px-4 py-2 text-[12px] text-[#8B4B45]">Remove from Saved</button></div></div></ModalShell>}
  </div>;
}

function SettingsPage() {
  const [openSetting, setOpenSetting] = useState(null);
  const [privacyPage, setPrivacyPage] = useState(null);
  const [savedMessage, setSavedMessage] = useState("");

  const people = [
    { id: "atiya", name: "Atiya Fathima", username: "@atiya.f", initial: "A" },
    { id: "sara", name: "Sara", username: "@sara.styles", initial: "S" },
    { id: "maya", name: "Maya", username: "@maya.styles", initial: "M" },
    { id: "aanya", name: "Aanya", username: "@aanyawears", initial: "A" },
    { id: "zoya", name: "Zoya", username: "@zoyawears", initial: "Z" },
    { id: "meher", name: "Meher", username: "@meher.edit", initial: "M" },
  ];

  const [account, setAccount] = useState(() => {
    try {
      const social = JSON.parse(localStorage.getItem("dripcheck-social-profile")) || {};
      const saved = JSON.parse(localStorage.getItem("dripcheck-account-settings")) || {};
      return { name: social.name || "Profile Name", username: social.username || "@dripcheck.me", email: saved.email || "", ...saved };
    } catch { return { name: "Profile Name", username: "@dripcheck.me", email: "" }; }
  });
  const [notifications, setNotifications] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dripcheck-notification-settings")) || { likes:true, comments:true, follows:true, messages:true, styleTips:true }; }
    catch { return { likes:true, comments:true, follows:true, messages:true, styleTips:true }; }
  });
  const [privacy, setPrivacy] = useState(() => {
    try { return JSON.parse(localStorage.getItem("dripcheck-privacy-settings")) || { privateAccount:false, activityStatus:true, comments:"Everyone", language:"English", closeFriends:["atiya"], blocked:[] }; }
    catch { return { privateAccount:false, activityStatus:true, comments:"Everyone", language:"English", closeFriends:["atiya"], blocked:[] }; }
  });

  const flash = (msg="Saved ✓") => { setSavedMessage(msg); setTimeout(()=>setSavedMessage(""), 1800); };
  const saveAccount = () => {
    localStorage.setItem("dripcheck-account-settings", JSON.stringify(account));
    try {
      const old = JSON.parse(localStorage.getItem("dripcheck-social-profile")) || {};
      localStorage.setItem("dripcheck-social-profile", JSON.stringify({ ...old, name:account.name, username:account.username }));
    } catch {}
    flash();
  };
  const saveNotifications = (next) => { setNotifications(next); localStorage.setItem("dripcheck-notification-settings", JSON.stringify(next)); flash(); };
  const savePrivacy = (next) => { setPrivacy(next); localStorage.setItem("dripcheck-privacy-settings", JSON.stringify(next)); flash(); };
  const toggleList = (key, id) => {
    const list = privacy[key] || [];
    const next = { ...privacy, [key]: list.includes(id) ? list.filter(x=>x!==id) : [...list,id] };
    savePrivacy(next);
  };

  const SettingToggle = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between gap-5 border-b border-[#E8E1D6] py-[17px] last:border-b-0">
      <div><p className="m-0 text-[15px] font-medium text-[#302821]">{label}</p>{description && <p className="mb-0 mt-[4px] text-[12px] text-[#948575]">{description}</p>}</div>
      <button type="button" onClick={()=>onChange(!checked)} className={`relative h-[30px] w-[52px] shrink-0 rounded-full transition ${checked ? "bg-[#60744F]" : "bg-[#DDD5C9]"}`}>
        <span className={`absolute top-[4px] h-[22px] w-[22px] rounded-full bg-white shadow-sm transition-all ${checked ? "left-[26px]" : "left-[4px]"}`} />
      </button>
    </div>
  );

  const PrivacyIcon = ({ type }) => {
    if (type === "lock") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>;
    if (type === "star") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6"><circle cx="12" cy="12" r="9"/><path d="m12 7 1.5 3 3.5.5-2.5 2.4.6 3.5-3.1-1.7-3.1 1.7.6-3.5L7 10.5l3.5-.5L12 7Z"/></svg>;
    if (type === "blocked") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6"><circle cx="12" cy="12" r="9"/><path d="m6 6 12 12"/></svg>;
    if (type === "comment") return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6"><path d="M20 15a4 4 0 0 1-4 4H9l-5 3 1.5-4A7 7 0 0 1 3 12V8a4 4 0 0 1 4-4h9a4 4 0 0 1 4 4v7Z"/></svg>;
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6"><path d="M5 5h9v10H9l-4 3v-3H5V5Z"/><path d="M10 9h9v10h-1v3l-4-3h-4"/><path d="M8 8h3M9.5 6.5v3"/></svg>;
  };

  const privacyItems = [
    { key:"account", label:"Account privacy", icon:"lock" },
    { key:"close", label:"Close Friends", icon:"star" },
    { key:"blocked", label:"Blocked", icon:"blocked" },
    { key:"comments", label:"Comments", icon:"comment" },
  ];

  if (privacyPage) {
    const title = privacyItems.find(x=>x.key===privacyPage)?.label || "Privacy";
    return (
      <div className="mx-auto max-w-[1050px]">
        <button onClick={()=>setPrivacyPage(null)} className="mb-[18px] flex items-center gap-2 text-[14px] text-[#60744F]">← Back to Privacy</button>
        <section className="overflow-hidden rounded-[27px] border border-[#DED6C9] bg-[#FFFEFC]">
          <div className="border-b border-[#E5DED2] px-[30px] py-[23px]"><h2 className="m-0 font-serif text-[26px]">{title}</h2></div>
          <div className="px-[30px] py-[22px]">
            {privacyPage === "account" && <>
              <SettingToggle label="Private account" description="Only people you approve can follow you and see your community posts." checked={privacy.privateAccount} onChange={(v)=>savePrivacy({...privacy,privateAccount:v})}/>
              <SettingToggle label="Show activity status" description="Let people you message see when you're active." checked={privacy.activityStatus} onChange={(v)=>savePrivacy({...privacy,activityStatus:v})}/>
            </>}
            {privacyPage === "close" && <>
              <p className="mt-0 text-[13px] text-[#8C7D6E]">Choose who is in your Close Friends list.</p>
              {people.filter(p=>!privacy.blocked.includes(p.id)).map(person=><div key={person.id} className="flex items-center gap-3 border-b border-[#EEE7DC] py-3 last:border-0"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DED0B8] font-serif">{person.initial}</div><div className="flex-1"><p className="m-0 text-[14px] font-semibold">{person.name}</p><p className="m-0 text-[11px] text-[#9B8B7A]">{person.username}</p></div><button onClick={()=>toggleList("closeFriends",person.id)} className={`rounded-full px-4 py-2 text-[12px] ${privacy.closeFriends.includes(person.id)?"bg-[#60744F] text-white":"border border-[#D8CFC1] bg-white"}`}>{privacy.closeFriends.includes(person.id)?"Added":"Add"}</button></div>)}
            </>}
            {privacyPage === "blocked" && <>
              <p className="mt-0 text-[13px] text-[#8C7D6E]">Blocked people can't message you or interact with your posts.</p>
              {people.map(person=><div key={person.id} className="flex items-center gap-3 border-b border-[#EEE7DC] py-3 last:border-0"><div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DED0B8] font-serif">{person.initial}</div><div className="flex-1"><p className="m-0 text-[14px] font-semibold">{person.name}</p><p className="m-0 text-[11px] text-[#9B8B7A]">{person.username}</p></div><button onClick={()=>toggleList("blocked",person.id)} className={`rounded-full px-4 py-2 text-[12px] ${privacy.blocked.includes(person.id)?"bg-[#302821] text-white":"border border-[#D8CFC1] bg-white"}`}>{privacy.blocked.includes(person.id)?"Unblock":"Block"}</button></div>)}
            </>}
            {privacyPage === "comments" && <>
              <p className="mt-0 text-[13px] text-[#8C7D6E]">Choose who can comment on your community posts.</p>
              {["Everyone","People you follow","Close Friends","No one"].map(option=><button key={option} onClick={()=>savePrivacy({...privacy,comments:option})} className="flex w-full items-center justify-between border-b border-[#EEE7DC] py-[17px] text-left text-[15px] last:border-0"><span>{option}</span><span className={`flex h-5 w-5 items-center justify-center rounded-full border ${privacy.comments===option?"border-[#60744F]":"border-[#BDAF9E]"}`}>{privacy.comments===option&&<span className="h-3 w-3 rounded-full bg-[#60744F]"/>}</span></button>)}
            </>}
          </div>
        </section>
        {savedMessage && <div className="fixed bottom-6 right-6 rounded-full bg-[#40542E] px-5 py-3 text-[12px] text-white shadow-lg">{savedMessage}</div>}
      </div>
    );
  }

  const settings = ["Account settings", "Notifications", "Privacy", "Log out"];
  return (
    <div className="mx-auto max-w-[1050px]">
      <section className="overflow-hidden rounded-[27px] border border-[#DED6C9] bg-[#FFFEFC]">
        {settings.map((item,index)=><div key={item}>
          <button onClick={()=>setOpenSetting(openSetting===item?null:item)} className={`flex min-h-[78px] w-full items-center justify-between bg-transparent px-[30px] text-left text-[19px] ${index!==settings.length-1?"border-b border-[#E3DCD0]":""}`}>
            <span>{item}</span><span className={`text-[27px] font-light text-[#9A846D] transition-transform ${openSetting===item?"rotate-90":""}`}>›</span>
          </button>

          {openSetting==="Account settings" && item==="Account settings" && <div className="border-b border-[#E3DCD0] bg-[#F8F4EB] px-[30px] py-[24px]">
            <div className="grid gap-4 md:grid-cols-2"><label className="text-[12px] text-[#8C7D6E]">Name<input value={account.name} onChange={e=>setAccount({...account,name:e.target.value})} className="mt-2 h-11 w-full rounded-xl border border-[#DCD3C5] bg-white px-3 text-[14px] outline-none focus:border-[#60744F]"/></label><label className="text-[12px] text-[#8C7D6E]">Username<input value={account.username} onChange={e=>setAccount({...account,username:e.target.value})} className="mt-2 h-11 w-full rounded-xl border border-[#DCD3C5] bg-white px-3 text-[14px] outline-none focus:border-[#60744F]"/></label><label className="text-[12px] text-[#8C7D6E] md:col-span-2">Email<input type="email" value={account.email} onChange={e=>setAccount({...account,email:e.target.value})} placeholder="you@example.com" className="mt-2 h-11 w-full rounded-xl border border-[#DCD3C5] bg-white px-3 text-[14px] outline-none focus:border-[#60744F]"/></label></div><button onClick={saveAccount} className="mt-5 rounded-full bg-[#60744F] px-5 py-2.5 text-[12px] font-semibold text-white">SAVE ACCOUNT</button>
          </div>}

          {openSetting==="Notifications" && item==="Notifications" && <div className="border-b border-[#E3DCD0] bg-[#F8F4EB] px-[30px] py-[10px]">
            {[["likes","Likes","Notify me when someone likes my post."],["comments","Comments","Notify me about new comments."],["follows","New followers","Notify me when someone follows me."],["messages","Messages","Notify me about new chat messages."],["styleTips","AI style tips","Receive DripCheck styling suggestions."]].map(([key,label,desc])=><SettingToggle key={key} label={label} description={desc} checked={notifications[key]} onChange={(v)=>saveNotifications({...notifications,[key]:v})}/>)}
          </div>}

          {openSetting==="Privacy" && item==="Privacy" && <div className="border-b border-[#E3DCD0] bg-[#F8F4EB] px-[18px] py-[12px]">
            {privacyItems.map(row=><button key={row.key} onClick={()=>setPrivacyPage(row.key)} className="flex w-full items-center gap-4 rounded-xl px-[12px] py-[16px] text-left transition hover:bg-[#EEE9DF]"><span className="text-[#302821]"><PrivacyIcon type={row.icon}/></span><span className="flex-1 text-[15px]">{row.label}</span><span className="text-[22px] text-[#A28E77]">›</span></button>)}
          </div>}

          {openSetting==="Log out" && item==="Log out" && <div className="bg-[#F8F4EB] px-[30px] py-[20px]"><p className="mt-0 text-[13px] text-[#8C7D6E]">This prototype keeps your local DripCheck data on this browser.</p><button onClick={()=>{localStorage.setItem("dripcheck-demo-logged-out","true"); flash("Logged out of demo ✓")}} className="rounded-[8px] bg-[#60744F] px-[22px] py-[10px] text-[14px] text-white">Log out</button></div>}
        </div>)}
      </section>
      {savedMessage && <div className="fixed bottom-6 right-6 z-50 rounded-full bg-[#40542E] px-5 py-3 text-[12px] text-white shadow-lg">{savedMessage}</div>}
    </div>
  );
}

/* =========================================================
   EXISTING HELPER COMPONENTS
========================================================= */

function StyleBar({ label, value }) {
  return (
    <div className="mt-[19px]">
      <div className="flex justify-between text-[13px]">
        <span>{label}</span>

        <span className="text-[#7D756C]">{value}%</span>
      </div>

      <div className="mt-[6px] h-[8px] overflow-hidden rounded-full bg-[#DDD6CA]">
        <div
          style={{ width: `${value}%` }}
          className="h-full rounded-full bg-[#60744F]"
        />
      </div>
    </div>
  );
}


function Preference({ label, value }) {
  return (
    <div className="mb-[13px]">
      <p className="m-0 text-[12px] text-[#82796F]">{label}</p>

      <p className="mb-0 mt-[2px] text-[15px] font-semibold">
        {value}
      </p>
    </div>
  );
}


function SmartCard({ icon, title, text, onClick }) {
  return (
    <button onClick={onClick} className="flex min-h-[120px] flex-col gap-[10px] rounded-[12px] border-none bg-[#FFFCF8] p-[20px] text-left transition hover:-translate-y-[1px] hover:shadow-sm">
      <span className="text-[22px]">{icon}</span>

      <strong className="text-[14px]">{title}</strong>

      <small className="text-[12px] text-[#817970]">{text}</small>
    </button>
  );
}


/* =========================================================
   APP
========================================================= */

function App() {
  const [page, setPage] = useState("home");
  const [chatTarget, setChatTarget] = useState(null);

  const openChatWith = (person) => {
    setChatTarget(person);
    setPage("chat");
  };

  return (
    <div className="min-h-screen bg-[#F8F4EB] text-[#302821]">
      <Navbar page={page} setPage={setPage} />
      {page === "home" && <HomePage setPage={setPage} openChatWith={openChatWith} />}
      {page === "wardrobe" && <Wardrobe setPage={setPage} />}
      {page === "style" && <StylePage />}
      {page === "chat" && <ChatPage chatTarget={chatTarget} clearChatTarget={() => setChatTarget(null)} />}
      {page === "profile" && <ProfilePage />}
    </div>
  );
}

export default App;