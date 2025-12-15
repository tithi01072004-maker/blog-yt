import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useEffect, useRef, useState } from "react";
import JoditEditor from "jodit-react";
import { toast } from 'sonner';
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

  const selectBlog = Array.isArray(blog) ? blog.find((item) => item._id === id) : null;

  // Fetch blog if page refreshed
  useEffect(() => {
    const fetchSingleBlog = async () => {
      try {
        const res = await api.get(`/blog/${id}`, { withCredentials: true });
        if (res.data.success) {
          dispatch(setBlog([res.data.blog]));
        }
      } catch {
        toast.error("Blog not found");
        navigate("/dashboard/your-blog");
      } finally {
        setLocalLoading(false);
      }
    };

    if (!selectBlog && id) fetchSingleBlog();
    else setLocalLoading(false);
  }, [id, selectBlog, dispatch, navigate]);

  // Fill form data
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

  if (localLoading) return <div className="text-center text-xl p-10">Loading blog...</div>;

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

 // Update blog handler
const updateBlogHandler = async () => {
  const formData = new FormData();
  formData.append("title", blogData.title || selectBlog.title);
  formData.append("subtitle", blogData.subtitle || selectBlog.subtitle);
  formData.append("description", content || selectBlog.description);
  formData.append("category", blogData.category || selectBlog.category);

  if (blogData.thumbnail) {
    formData.append("thumbnail", blogData.thumbnail); // ✅ correct field name
  }

  try {
    dispatch(setLoading(true));
    const token = localStorage.getItem("token");
    const res = await api.put(`/blog/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });
    if (res.data.success) {
      toast.success("Blog updated successfully!");
      navigate("/dashboard/your-blog");
    }
  } catch (error) {
    console.log(error.response?.data || error.message);
    toast.error("Failed to update blog");
  } finally {
    dispatch(setLoading(false));
  }
};


  const togglePublishUnpublish = async (action) => {
    try {
      const res = await api.patch(`/blog/${id}`, { action }, { withCredentials: true });
      if (res.data.success) {
        setPublish(!publish);
        toast.success(res.data.message);
        navigate("/dashboard/your-blog");
      }
    } catch {
      toast.error("Server error");
    }
  };

  const deleteBlog = async () => {
    try {
      const res = await api.delete(`/blog/delete/${id}`, { withCredentials: true });
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

  return (
    <div className="md:ml-[330px] pt-20 px-3 pb-10">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="w-full bg-white dark:bg-gray-800 p-5 -space-y-2">
          <h1 className="text-4xl font-bold text-green-900 dark:text-gray-200" style={{ fontFamily: "'Satisfy', cursive" }}>
            Basic Blog Information
          </h1>
          <p style={{ fontFamily: "'Lora', serif", fontWeight: "500" }}>
            Make changes to your blog here. Click publish when you are done.
          </p>

          <div className="flex gap-3 my-3">
            <Button
              onClick={() => togglePublishUnpublish(selectBlog?.isPublished ? "false" : "true")}
              className="bg-green-800 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600"
            >
              {selectBlog?.isPublished ? "Unpublish" : "Publish"}
            </Button>

            <Button
              onClick={deleteBlog}
              variant="destructive"
              className="dark:bg-red-600 dark:hover:bg-red-700"
            >
              Remove Blog
            </Button>
          </div>

          {/* Title */}
          <Label className="text-2xl font-medium text-green-900 dark:text-gray-200">Title</Label>
          <Input type="text" name="title" value={blogData.title} onChange={handleChange} />

          {/* Subtitle */}
          <Label className="text-2xl font-medium text-green-900 dark:text-gray-200 mt-3">Subtitle</Label>
          <Input type="text" name="subtitle" value={blogData.subtitle} onChange={handleChange} />

          {/* Description */}
          <Label className="text-2xl font-medium text-green-900 dark:text-gray-200 mt-3">Description</Label>
          <JoditEditor ref={editor} value={content} onChange={(newContent) => setContent(newContent)} />

          {/* Category */}
          <Label className="text-2xl font-medium text-green-900 dark:text-gray-200 mt-3">Category</Label>
          {/* Category */}
<Select value={blogData.category} onValueChange={getSelectedCategory}>
  <SelectTrigger className="w-[220px]">
    <SelectValue placeholder="Select category" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Category</SelectLabel>
      <SelectItem value="Web Development">Web Development</SelectItem>
      <SelectItem value="Machine Learning">Machine Learning</SelectItem>
      <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
      <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
      <SelectItem value="Photography">Photography</SelectItem>
      <SelectItem value="Cooking">Cooking</SelectItem>
      <SelectItem value="Blogging">Blogging</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>

          {/* Thumbnail */}
          <Label className="text-2xl font-medium text-green-900 dark:text-gray-200 mt-3">Thumbnail</Label>
          <Input type="file" accept="image/*" onChange={selectThumbnail} />
          {previewThumbnail && <img src={previewThumbnail} alt="Preview" className="mt-2 w-40 h-28 object-cover rounded-lg" />}

          {/* Buttons */}
          <div className="flex gap-3 mt-5">
            <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
            <Button onClick={updateBlogHandler} className="bg-green-800 dark:bg-green-400 hover:bg-green-700 dark:hover:bg-green-600">
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Please Wait</> : "Save"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UpdateBlog;
