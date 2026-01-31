import React, { useEffect, useState } from "react";
import { Layout } from "./components/Layout";
import { HomePage } from "./components/HomePage";
import { BlogPostPage } from "./components/BlogPostPage";
import { CreateEditPostPage } from "./components/CreateEditPostPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { ProfilePage } from "./components/ProfilePage";
import { DashboardPage } from "./components/DashboardPage";
import { ReadingListPage } from "./components/ReadingListPage";
import { SearchUsersPage } from "./components/SearchUsersPage";
import { PublicUserProfilePage } from "./components/PublicUserProfilePage";
import { UserConnectionsPage } from "./components/UserConnectionsPage";
import { FollowingFeedPage } from "./components/FollowingFeedPage";
import { SEOHead } from "./components/SEOHead";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./lib/ThemeContext";
import api from "./api/axios";
import { Page } from "./index";
import { toast } from "sonner";

interface AppState {
  currentPage: Page;
  currentPostId?: string;
  previousPage?: Page;
  previousId?: string;
  isAuthenticated: boolean;
}

function App() {
  const [appState, setAppState] = useState<AppState>({
    currentPage: "login",
    isAuthenticated: false,
  });

  const [posts, setPosts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  /* ---------- RESTORE LOGIN ---------- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setAppState({
        currentPage: "home",
        isAuthenticated: true,
      });
      fetchPosts();
    }
  }, []);

  /* ---------- FETCH POSTS ---------- */
  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts");
      setPosts(res.data);
    } catch {
      toast.error("Failed to load posts");
    }
  };

  /* ---------- ✅ FIXED NAVIGATION ---------- */
  const handleNavigate = (page: Page | "back", id?: string) => {
    setAppState((prev) => {
      if (page === "back" && prev.previousPage) {
        return {
          currentPage: prev.previousPage,
          currentPostId: prev.previousId,
          isAuthenticated: prev.isAuthenticated,
        };
      }

      const isAuthPage = page === "login" || page === "signup";

      return {
        previousPage: prev.currentPage,
        previousId: prev.currentPostId,
        currentPage: page,
        currentPostId: id,
        isAuthenticated: !isAuthPage, // ✅ CRITICAL FIX
      };
    });

    window.scrollTo(0, 0);
  };

  /* ---------- LOGIN ---------- */
  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user);
      setAppState({ currentPage: "home", isAuthenticated: true });
      fetchPosts();
      toast.success("Login successful");
    } catch (err: any) {
      toast.error(err?.response?.data?.msg || "Login failed");
    }
  };

  /* ---------- SIGNUP ---------- */
  const handleSignup = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      await api.post("/auth/signup", { name, email, password });

      toast.success("Account created successfully 🎉");

      setAppState({
        currentPage: "login",
        isAuthenticated: false,
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.msg || "Signup failed");
    }
  };

  /* ---------- LOGOUT ---------- */
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setPosts([]);
    setAppState({ currentPage: "login", isAuthenticated: false });
  };

  /* ---------- AUTH SCREENS ---------- */
  if (!appState.isAuthenticated) {
    return (
      <>
        <SEOHead title="Auth" />
        {appState.currentPage === "signup" ? (
          <SignupPage
            onNavigate={handleNavigate}
            onSignup={handleSignup}
          />
        ) : (
          <LoginPage
            onNavigate={handleNavigate}
            onLogin={handleLogin}
          />
        )}
        <Toaster position="top-right" />
      </>
    );
  }

  /* ---------- DERIVED DATA ---------- */
  const myPosts = posts.filter(
    (p) => p.author?._id === user?._id
  );

  const currentPost = appState.currentPostId
    ? posts.find((p) => p._id === appState.currentPostId)
    : null;

  /* ---------- RENDER ---------- */
  const renderPage = () => {
    switch (appState.currentPage) {
      case "home":
        return <HomePage posts={posts} onNavigate={handleNavigate} />;

      case "post":
        return currentPost ? (
          <BlogPostPage
            postId={currentPost._id}
            onNavigate={handleNavigate}
          />
        ) : null;

      case "create":
        return <CreateEditPostPage onNavigate={handleNavigate} />;

      case "dashboard":
        return <DashboardPage posts={myPosts} onNavigate={handleNavigate} />;

      case "profile":
        return <ProfilePage posts={myPosts} onNavigate={handleNavigate} />;

      case "reading-list":
        return (
          <ReadingListPage
            posts={posts}
            onNavigate={handleNavigate}
          />
        );

      case "search-users":
        return <SearchUsersPage onNavigate={handleNavigate} />;

      case "user-profile":
        return appState.currentPostId ? (
          <PublicUserProfilePage
            userId={appState.currentPostId}
            onNavigate={handleNavigate}
          />
        ) : null;

      case "followers":
        return appState.currentPostId ? (
          <UserConnectionsPage
            userId={appState.currentPostId}
            type="followers"
            onNavigate={handleNavigate}
          />
        ) : null;

      case "following":
        return appState.currentPostId ? (
          <UserConnectionsPage
            userId={appState.currentPostId}
            type="following"
            onNavigate={handleNavigate}
          />
        ) : null;

      case "following-feed":
        return <FollowingFeedPage onNavigate={handleNavigate} />;

      default:
        return null;
    }
  };

  return (
    <>
      <SEOHead title="BlogHub" />
      <ThemeProvider>
        <Layout
          currentPage={appState.currentPage}
          onNavigate={handleNavigate}
          isAuthenticated={true}
          onLogout={handleLogout}
        >
          {renderPage()}
        </Layout>
        <Toaster position="top-right" />
      </ThemeProvider>
    </>
  );
}

export default App;
