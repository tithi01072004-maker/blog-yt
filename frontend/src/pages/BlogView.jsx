import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Bookmark, MessageSquare, Share2 } from 'lucide-react';

import CommentBox from '@/components/CommentBox';
import { setBlog } from '@/redux/blogSlice';

const BlogView = () => {
    const { blogId } = useParams();
    const dispatch = useDispatch();
    const { blog } = useSelector(store => store.blog);
    const { user } = useSelector(store => store.auth);

    // Find the blog safely
    const selectedBlog = blog.find(b => b._id === blogId);

    // Loading state for blog
    const [loading, setLoading] = useState(true);

    // Local state for likes
    const [blogLike, setBlogLike] = useState(0);
    const [liked, setLiked] = useState(false);

    useEffect(() => {
        if (selectedBlog) {
            setBlogLike(selectedBlog.likes?.length || 0);
            setLiked(selectedBlog.likes?.includes(user?._id) || false);
            setLoading(false);
        }
    }, [selectedBlog, user]);

    // Scroll to top on load
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const changeTimeFormat = (isDate) => {
        const date = new Date(isDate);
        const options = { day: "numeric", month: "long", year: "numeric" };
        return date.toLocaleDateString("en-GB", options);
    };

    const handleShare = (blogId) => {
        const blogUrl = `${window.location.origin}/blogs/${blogId}`;

        if (navigator.share) {
            navigator.share({
                title: "Check out this blog!",
                text: "Read this amazing blog post",
                url: blogUrl,
            }).catch(err => console.error("Error Sharing: ", err));
        } else {
            navigator.clipboard.writeText(blogUrl).then(() => {
                toast.success("Blog link copied to clipboard");
            });
        }
    };

    const likeOrDislikeHandler = async () => {
        if (!selectedBlog || !user) return;

        try {
            const action = liked ? "dislike" : "like";
            const res = await axios.get(
                `/api/v1/blog/${selectedBlog._id}/${action}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                const updatedLikes = liked ? blogLike - 1 : blogLike + 1;
                setBlogLike(updatedLikes);
                setLiked(!liked);

                const updatedBlogData = blog.map(p =>
                    p._id === selectedBlog._id
                        ? {
                            ...p,
                            likes: liked
                                ? p.likes.filter(id => id !== user._id)
                                : [...p.likes, user._id],
                        }
                        : p
                );

                dispatch(setBlog(updatedBlogData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Request failed");
        }
    };

    // Show loading if blog or user is not ready
   if (!selectedBlog) {
    return <div>Loading...</div>; // only show loading if the blog is not loaded
}

if (!user) {
    // user is null => token expired
    window.location.replace('/'); // redirect immediately
    return null; // render nothing
}


    return (
        <div className='pt-14 dark:bg-gray-900'>
            <div className='max-w-6xl mx-auto p-10'>
                {/* Breadcrumb */}
                <Breadcrumb style={{ fontFamily: "'Lora', serif", fontWeight: "600" }}>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to="/blogs">Blogs</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{selectedBlog.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Blog Header */}
                <div className='my-8'>
                    <h1 className='text-5xl text-green-900 dark:text-gray-200 font-bold tracking-tight mb-4' style={{ fontFamily: "'Great Vibes', cursive" }}>
                        {selectedBlog.title}
                    </h1>
                    <div className='flex items-center justify-between flex-wrap gap-4'>
                        <div className='flex items-center space-x-4'>
                            <Avatar>
                                <AvatarImage src={selectedBlog.author?.photoUrl} alt="author" />
                                <AvatarFallback>ID</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className='font-medium pl-3 text-xl text-green-700 dark:text-gray-200' style={{ fontFamily: "'Lobster', cursive" }}>
                                    {selectedBlog.author?.firstName} {selectedBlog.author?.lastName}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Lora', serif", fontWeight: "600" }}>
                            Published on {changeTimeFormat(selectedBlog.createdAt)} • 8 min read
                        </p>
                    </div>
                </div>

                {/* Featured Image */}
                <div className='mb-7 rounded-lg overflow-hidden'>
                    <img src={selectedBlog.thumbnail} alt="thumbnail" className='w-full object-cover rounded-lg' />
                    <p className='text-sm text-muted-foreground mt-2 italic' style={{ fontFamily: "'Lora', serif", fontWeight: "600" }}>
                        {selectedBlog.subtitle}
                    </p>
                </div>

                <p dangerouslySetInnerHTML={{ __html: selectedBlog.description }} />

                {/* Tags & Engagement */}
                <div className='mt-10'>
                    <div className='flex flex-wrap gap-2 mb-8'>
                        {["Next.js","React","Web development","Javascript"].map(tag => (
                            <Badge key={tag} variant="secondary" className="bg-green-700 hover:bg-green-600" style={{ fontFamily: "'Lora', serif", fontWeight: "600" }}>
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    <div className='flex items-center justify-between border-y dark:border-gray-800 border-gray-300 py-4 mb-8'>
                        <div className='flex items-center space-x-4'>
                            <Button onClick={likeOrDislikeHandler} variant="ghost" className="flex items-center gap-1">
                                {liked ? <FaHeart size={24} className='cursor-pointer text-red-600' /> :
                                    <FaRegHeart size={24} className='cursor-pointer text-gray-800 hover:text-gray-600 dark:text-white' />}
                                <span>{blogLike}</span>
                            </Button>

                            <Button variant="ghost" size="sm">
                                <MessageSquare className='h-4 w-4' />
                                <span>1 Comments</span>
                            </Button>
                        </div>

                        <div className='flex items-center space-x-2'>
                            <Button variant="ghost" size="sm">
                                <Bookmark className='w-4 h-4' />
                            </Button>
                            <Button onClick={() => handleShare(selectedBlog._id)} variant="ghost" size="sm">
                                <Share2 className='w-4 h-4' />
                            </Button>
                        </div>
                    </div>
                </div>

                <CommentBox selectedBlog={selectedBlog} />
            </div>
        </div>
    );
};

export default BlogView;
