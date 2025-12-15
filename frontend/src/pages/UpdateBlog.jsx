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

  const { blog, loading } = useSelector((store) => store.blog);
  const [localLoading, setLocalLoading] = useState(true);


  // ✅ FIX: useParams must match route param name
  const { id } = useParams();

  const selectBlog = Array.isArray(blog) ? blog.find((item) => item._id === id) : null;
  useEffect(() => {
  const fetchSingleBlog = async () => {
    try {
      const res = await api.get(`/blog/${id}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setBlog([res.data.blog]));
      }
    } catch (err) {
      toast.error("Blog not found");
      navigate("/dashboard/your-blog");
    } finally {
      setLocalLoading(false);
    }
  };

  // 👉 fetch ONLY if blog is empty
 if (!selectBlog && id) {
  fetchSingleBlog();
} else {
  setLocalLoading(false);
}

}, [id, blog?.length, dispatch, navigate]);


  if (localLoading) {
  return (
    <div className="text-center text-xl p-10">
      Loading blog...
    </div>
  );
}






  // STEP 2 — Prevent crash (shows loading first)
  const [content, setContent] = useState("");

  const [publish, setPublish] = useState(false)

  const [blogData, setBlogData] = useState({
    title: "",
    subtitle: "",
    category: "",
  });

  const [previewThumbnail, setPreviewThumbnail] = useState("");

  // STEP 3 — Fill data once blog is loaded
  useEffect(() => {
    if (selectBlog) {
      setContent(selectBlog.description || "");
      setBlogData({
        title: selectBlog.title || "",
        subtitle: selectBlog.subtitle || "",
        category: selectBlog.category || "",
      });
      setPreviewThumbnail(selectBlog.thumbnail);
    }
  }, [selectBlog]);



  // FORM HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getSelectedCategory = (value) => {
    setBlogData((prev) => ({ ...prev, category: value }));
  };

  const selectThumbnail = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBlogData((prev) => ({ ...prev, thumbnail: file }));

      const reader = new FileReader();
      reader.onloadend = () => setPreviewThumbnail(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // UPDATE BLOG HANDLER
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

      const token = localStorage.getItem("token"); // read token

      const res = await api.put(
        `/blog/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}` // attach token
          },
          withCredentials: true, // optional if using cookies
        }
      );





      if (res.data.success) {
        toast.success("Blog updated successfully!");
        navigate("/dashboard/your-blog");


      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update blog");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const togglePublishUnpublish = async (action) => {
    try {
      const res = await api.patch(
        `/blog/${id}`,
        { action }, // ✅ send in body
        { withCredentials: true }
      )
      if (res.data.success) {
        setPublish(!publish);
        toast.success(res.data.message)
        navigate("/dashboard/your-blog")
      } else {
        toast.error("Failed to update")
      }

    } catch (error) {
      console.log(error)
      toast.error(error?.response?.data?.message || "Server error");

    }
  }

  const deleteBlog = async () => {
    try {
      const res = await api.delete(`/blog/delete/${id}`, { withCredentials: true })
      if (res.data.success) {
        const updatedBlogData = blog.filter((blogItem) => blogItem?._id !== id);
        dispatch(setBlog(updatedBlogData))
        toast.success(res.data.message)
        navigate('/dashboard/your-blog')
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went error")

    }
  }

  return (
    <div className="md:ml-[330px] pt-20 px-3 pb-10">
      <div className="max-w-6xl mx-auto mt-8">
        <Card className="w-full bg-white dark:bg-gray-800 p-5 -space-y-2">
          <h1
            className="text-4xl font-bold text-green-900 dark:text-gray-200"
            style={{ fontFamily: "'Satisfy', cursive" }}
          >
            Basic Blog Information
          </h1>

          <p style={{ fontFamily: "'Lora', serif", fontWeight: "500" }}>
            Make changes to your blog here. Click publish when you are done.
          </p>

          <div className="flex gap-3">
            <Button
              onClick={() =>
                togglePublishUnpublish(selectBlog?.isPublished ? "false" : "true")
              }
              className="bg-green-800 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600"
              style={{ fontFamily: "'Lobster', cursive" }}
            >
              {selectBlog?.isPublished ? "Unpublish" : "Publish"}
            </Button>


            <Button onClick={deleteBlog}
              variant="destructive"
              className="dark:bg-red-600 dark:hover:bg-red-700"
              style={{ fontFamily: "'Lobster', cursive" }}
            >
              Remove Blog
            </Button>
          </div>

          {/* TITLE */}
          <div>
            <Label
              className="text-2xl font-medium text-green-900 dark:text-gray-200"
              style={{ fontFamily: "'Lobster', cursive" }}
            >
              Title
            </Label>
            <Input
              type="text"
              placeholder="Enter a title"
              name="title"
              value={blogData.title}
              onChange={handleChange}
              className="dark:border-gray-300"
            />
          </div>

          {/* SUBTITLE */}
          <div>
            <Label
              className="text-2xl font-medium text-green-900 dark:text-gray-200"
              style={{ fontFamily: "'Lobster', cursive" }}
            >
              Subtitle
            </Label>
            <Input
              type="text"
              placeholder="Enter a subtitle"
              name="subtitle"
              value={blogData.subtitle}
              onChange={handleChange}
              className="dark:border-gray-300"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <Label
              className="text-2xl font-medium text-green-900 dark:text-gray-200"
              style={{ fontFamily: "'Lobster', cursive" }}
            >
              Description
            </Label>

            <JoditEditor
              ref={editor}
              className='jodit_toolbar'
              value={content}
              onChange={(newContent) => setContent(newContent)}
            />
          </div>

          {/* CATEGORY */}
          <div>
            <Label
              className="mb-1 text-2xl font-medium text-green-900 dark:text-gray-200"
              style={{ fontFamily: "'Lobster', cursive" }}
            >
              Category
            </Label>

            <Select onValueChange={getSelectedCategory} className="border-gray-300">
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder={blogData.category || "Select category"} />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  <SelectItem value="Web Development">Web Development</SelectItem>
                  <SelectItem value="Machine Learning">Machine Learning</SelectItem>
                  <SelectItem value="Artificial Intelligence">
                    Artificial Intelligence
                  </SelectItem>
                  <SelectItem value="Digital Marketing">Digital Marketing</SelectItem>
                  <SelectItem value="Photography">Photography</SelectItem>
                  <SelectItem value="Cooking">Cooking</SelectItem>
                  <SelectItem value="Blogging">Blogging</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* THUMBNAIL */}
          <div>
            <Label
              className="mb-1 text-2xl font-medium text-green-900 dark:text-gray-200"
              style={{ fontFamily: "'Lobster', cursive" }}
            >
              Thumbnail
            </Label>

            <Input
              type="file"
              id='file'
              accept="image/*"
              className="w-fit dark:border-gray-300"
              onChange={selectThumbnail}
            />


            {previewThumbnail && (
              <img
                src={previewThumbnail}
                alt="Preview"
                className="mt-3 w-40 h-28 rounded-lg object-cover"
              />
            )}
          </div>

          {/* BACK + SAVE */}
          <div className="flex gap-3 mt-4">
            <Button
              className="bg-gray-300"
              style={{ fontFamily: "'Lobster', cursive" }}
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>

            <Button
              className="bg-green-800 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600"
              style={{ fontFamily: "'Lobster', cursive" }}
              onClick={updateBlogHandler}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Please Wait
                </>
              ) : (
                "Save"

              )}

            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default UpdateBlog;
