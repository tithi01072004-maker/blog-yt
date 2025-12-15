import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { toast } from "sonner";
import { setBlog } from "../redux/blogSlice";
import api from "../api/api";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const UpdateBlog = () => {
  const editor = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const { blog, loading } = useSelector((store) => store.blog);

  /* =======================
     ✅ ALL HOOKS FIRST
  ======================= */
  const [localLoading, setLocalLoading] = useState(true);
  const [content, setContent] = useState("");
  const [publish, setPublish] = useState(false);

  const [blogData, setBlogData] = useState({
    title: "",
    subtitle: "",
    category: "",
    thumbnail: null,
  });

  const [previewThumbnail, setPreviewThumbnail] = useState("");

  const selectBlog = Array.isArray(blog)
    ? blog.find((item) => item._id === id)
    : null;

  /* =======================
     FETCH BLOG ON REFRESH
  ======================= */
  useEffect(() => {
    const fetchSingleBlog = async () => {
      try {
        const res = await api.get(`/blog/${id}`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setBlog([res.data.blog]));
        }
      } catch (error) {
        toast.error("Blog not found");
        navigate("/dashboard/your-blog");
      } finally {
        setLocalLoading(false);
      }
    };

    if (!selectBlog && id) {
      fetchSingleBlog();
    } else {
      setLocalLoading(false);
    }
  }, [id, selectBlog, dispatch, navigate]);

  /* =======================
     FILL FORM WHEN BLOG LOADS
  ======================= */
  useEffect(() => {
    if (selectBlog) {
      setContent(selectBlog.description || "");
      setBlogData({
        title: selectBlog.title || "",
        subtitle: selectBlog.subtitle || "",
        category: selectBlog.category || "",
        thumbnail: null,
      });
      setPreviewThumbnail(selectBlog.thumbnail || "");
    }
  }, [selectBlog]);

  /* =======================
     ✅ SAFE CONDITIONAL RENDER
  ======================= */
  if (localLoading) {
    return (
      <div className="text-center text-xl p-10">
        Loading blog...
      </div>
    );
  }

  /* =======================
     HANDLERS
  ======================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({ ...prev, [name]: value }));
  };

  const getSelectedCategory = (value) => {
    setBlogData((prev) => ({ ...prev, category: value }));
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBlogData((prev) => ({ ...prev, thumbnail: file }));

    const reader = new FileReader();
    reader.onloadend = () => setPreviewThumbnail(reader.result);
    reader.readAsDataURL(file);
  };

  const updateBlogHandler = async () => {
    const formData = new FormData();
    formData.append("title", blogData.title);
    formData.append("subtitle", blogData.subtitle);
    formData.append("description", content);
    formData.append("category", blogData.category);

    if (blogData.thumbnail) {
      formData.append("file", blogData.thumbnail);
    }

    try {
      dispatch(setLoading(true));

      const token = localStorage.getItem("token");

      const res = await api.put(`/blog/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Blog updated successfully!");
        navigate("/dashboard/your-blog");
      }
    } catch (error) {
      toast.error("Failed to update blog");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const togglePublishUnpublish = async (action) => {
    try {
      const res = await api.patch(
        `/blog/${id}`,
        { action },
        { withCredentials: true }
      );

      if (res.data.success) {
        setPublish(!publish);
        toast.success(res.data.message);
        navigate("/dashboard/your-blog");
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  const deleteBlog = async () => {
    try {
      const res = await api.delete(`/blog/delete/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        const updated = blog.filter((b) => b._id !== id);
        dispatch(setBlog(updated));
        toast.success(res.data.message);
        navigate("/dashboard/your-blog");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  /* =======================
     UI (UNCHANGED)
  ======================= */
  return (
    <div className="md:ml-[330px] pt-20 px-3 pb-10">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="w-full bg-white dark:bg-gray-800 p-5 -space-y-2">

          {/* UI CODE EXACTLY SAME AS YOURS */}

        </Card>
      </div>
    </div>
  );
};

export default UpdateBlog;
