import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { blogs } from "../../data/blogs";
import { CiLock } from "react-icons/ci";
import { FaLongArrowAltRight, FaUser } from "react-icons/fa";
import { Button } from "@mui/material";

const BlogList = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="my-container">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Our Blog</h1>
          <Button
            onClick={() => (window.location.href = "mailto:blog@chequemart.com?subject=Submit Blog Post")}
            className="!bg-[#ff5252] !text-white !normal-case"
          >
            Submit Your Blog
          </Button>
        </div>

        {!selectedBlog ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedBlog(blog)}
              >
                <div className="relative">
                  <img
                    src="/src/assets/image/BlogImage1.jpg"
                    alt={blog.title}
                    className="w-full h-48 object-cover"
                  />
                  <span className="absolute bottom-3 right-3 bg-[#ff5252] text-white text-xs px-2 py-1 rounded">
                    {blog.date}
                  </span>
                </div>
                <div className="p-4">
                  <span className="text-xs text-[#ff5252] font-medium">
                    {blog.category}
                  </span>
                  <h2 className="text-lg font-semibold mt-1 mb-2 hover:text-[#ff5252]">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-2">{blog.excerpt}</p>
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                    <FaUser className="text-xs" />
                    <span>{blog.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <button
              onClick={() => setSelectedBlog(null)}
              className="text-[#ff5252] hover:underline mb-4"
            >
              ← Back to Blogs
            </button>
            <span className="text-xs text-[#ff5252] font-medium">
              {selectedBlog.category}
            </span>
            <h1 className="text-2xl font-bold mt-1 mb-4">{selectedBlog.title}</h1>
            <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
              <span>{selectedBlog.date}</span>
            </div>
            <img
              src="/src/assets/image/BlogImage1.jpg"
              alt={selectedBlog.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{selectedBlog.content}</p>
            </div>
            <div className="mt-8 pt-6 border-t">
              <p className="text-gray-600">
                Want to share your thoughts?{" "}
                <a
                  href="mailto:blog@chequemart.com?subject=Submit Blog Post"
                  className="text-[#ff5252] hover:underline"
                >
                  Submit your blog post
                </a>{" "}
                for review.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogList;