import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { useAuthCheck } from './hooks/useAuthCheck';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SearchList from './pages/SearchList';
import BlogView from './pages/BlogView';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import YourBlog from './pages/YourBlog';
import Comments from './pages/Comments';
import CreateBlog from './pages/CreateBlog';
import UpdateBlog from './pages/UpdateBlog';

const router = createHashRouter([
  { path: "/", element: <><Navbar /><Home /><Footer /></> },
  { path: "/blogs", element: <><Navbar /><Blogs /><Footer /></> },
  { path: "/about", element: <><Navbar /><About /><Footer /></> },
  { path: "/search", element: <><Navbar /><SearchList /><Footer /></> },
  { path: "/login", element: <><Navbar /><Login /></> },
  { path: "/signup", element: <><Navbar /><Signup /></> },
  { path: "/blogs/:blogId", element: <><Navbar /><BlogView /></> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Navbar />
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      { path: "profile", element: <Profile /> },
      { path: "your-blog", element: <YourBlog /> },
      { path: "comments", element: <Comments /> },
      { path: "write-blog", element: <CreateBlog /> },
      { path: "write-blog/:id", element: <UpdateBlog /> }
    ]
  }
]);

const App = () => {
  const { theme } = useSelector(store => store.theme);
  const { checkAuth } = useAuthCheck();

  // Theme toggle
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [theme]);

  // Auth check on load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <RouterProvider router={router} />;
};

export default App;
