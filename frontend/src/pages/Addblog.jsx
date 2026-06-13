import axios from "axios";
import React, { use, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { data, Navigate, useNavigate, useParams } from "react-router-dom";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import EditorjsList from "@editorjs/list";
import CodeTool from "@editorjs/code";
import Marker from "@editorjs/marker";
import Underline from "@editorjs/underline";
import Embed from "@editorjs/embed";
import RawTool from "@editorjs/raw";
import TextVariantTune from "@editorjs/text-variant-tune";
import ImageTool from "@editorjs/image";

function Addblog() {
  const { id } = useParams();

  const { title, description, imageurl, content, draft, tags } = useSelector(
    (slice) => slice.selectedBlogSlice,
  );
  const editorref = useRef(null);
  const formData = new FormData();

  const { token } = useSelector((slice) => slice.user);

  const navigate = useNavigate();
  const [blogData, setblogdata] = useState({
    title: "",
    description: "",
    image: null,
    content: { blocks: [] },
    tags: [],
    draft: false,
  });
  async function handlepostblog() {
    formData.append("title", blogData.title);
    formData.append("description", blogData.description);
    formData.append("image", blogData.image);
    formData.append("content", JSON.stringify(blogData.content));
    formData.append("tags", JSON.stringify(blogData.tags));
    formData.append("draft", blogData.draft);

    let images = [];
    blogData?.content?.blocks?.forEach((block) => {
      if (block.type == "image") {
        images.push(block.data.file.image);
        formData.append("images", block.data.file.image);
      }
    });
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/blogs`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      //   URL.createObjectURL(blogData.image)
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  async function fetchblogbyid() {
    setblogdata({
      title: title || "",
      description: description || "",
      image: imageurl || null,
      content: content || { blocks: [] },
      tags: tags || [],
      draft: draft || false,
    });
  }

  useEffect(() => {
    if (id) {
      fetchblogbyid();
    } else {
      setblogdata({
        title: "",
        description: "",
        image: null,
        content: { blocks: [] },
        tags: [],
        draft: false,
      });
    }
  }, [id, title, description, imageurl, content, tags, draft]);

  async function handleupdateblog() {
    const formdata = new FormData();
    formdata.append("title", blogData.title);
    formdata.append("description", blogData.description);
    formdata.append("image", blogData.image);
    formdata.append("content", JSON.stringify(blogData.content));
    formdata.append("tags", JSON.stringify(blogData.tags));
    formdata.append("draft", blogData.draft);

    // for (let data of formdata.entries()) {
    //   console.log(data);
    // }
    let existingimages = [];
    let images = [];
    blogData.content.blocks.forEach((block) => {
      if (block.type == "image") {
        if (block.data.file.image) {
          formdata.append("images", block.data.file.image);
          images.push(block.data.file.image);
        } else {
          existingimages.push({
            url: block.data.file.url,
            imageid: block.data.file.imageid,
          });
        }
      }
    });
    formdata.append("existingimages", JSON.stringify(existingimages));
    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/blogs/${id}`,
        formdata,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log(res.data.message);
      console.log("blogdata", blogData); //   URL.createObjectURL(blogData.image)
      toast.success(res.data.message);
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  }

  function initilizeditorjs() {
    if (editorref.current) return;

    editorref.current = new EditorJS({
      holder: "editor",
      placeholder: "write something...",

      data: id && content ? content : { blocks: [] },

      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            placeholder: "Enter a header",
            levels: [2, 3, 4],
            defaultLevel: 3,
          },
        },

        list: {
          class: EditorjsList,
          inlineToolbar: true,
          config: {
            defaultStyle: "unordered",
          },
        },

        code: CodeTool,

        marker: {
          class: Marker,
          shortcut: "CMD+SHIFT+M",
        },

        underline: Underline,
        embed: Embed,
        raw: RawTool,
        textVariant: TextVariantTune,

        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile: async (image) => {
                return {
                  success: 1,
                  file: {
                    url: URL.createObjectURL(image),
                    image,
                  },
                };
              },
            },
          },
        },
      },

      tunes: ["textVariant"],

      onChange: async () => {
        const data = await editorref.current.save();

        setblogdata((prev) => ({
          ...prev,
          content: data,
        }));
      },
    });
  }

  function deletetag(index) {
    setblogdata((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  }

  function handlekeydown(e) {
    const tag = e.target.value.trim().toLowerCase();

    if (e.code === "Space") {
      e.preventDefault();
    }

    if ((e.code === "Enter" || e.code === "Space") && tag !== "") {
      e.preventDefault();

      if (blogData.tags.length >= 10) {
        e.target.value = "";
        return toast.error("You cannot enter more than 10 tags");
      }

      if (blogData.tags.includes(tag)) {
        e.target.value = "";
        return toast.error("This tag already exists");
      }

      setblogdata((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));

      e.target.value = "";
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!editorref.current) {
        initilizeditorjs();
      }
    }, 0);

    return () => {
      clearTimeout(timer);

      if (
        editorref.current &&
        typeof editorref.current.destroy === "function"
      ) {
        editorref.current.destroy();
        editorref.current = null;
      }
    };
  }, []);

  return token == null ? (
    <Navigate to={"/signin"} />
  ) : (
    <div className="max-w-7xl mx-auto my-10 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 lg:p-10 shadow-sm flex flex-col gap-8">
      {/* Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Upload */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Main Image
          </label>

          <label
            htmlFor="image"
            className="cursor-pointer border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden bg-gray-50 hover:border-red-500 transition-all duration-300"
          >
            {blogData.image ? (
              <img
                className="w-full h-[350px] object-cover hover:scale-[1.02] transition-all duration-300"
                src={
                  typeof blogData.image === "string"
                    ? blogData.image
                    : URL.createObjectURL(blogData.image)
                }
                alt=""
              />
            ) : (
              <div className="h-[350px] flex items-center justify-center text-gray-400 text-xl font-medium">
                Click to Upload Image
              </div>
            )}
          </label>

          <input
            id="image"
            type="file"
            className="hidden"
            accept=".png,.jpg,.jpeg"
            onChange={(e) =>
              setblogdata((prev) => ({
                ...prev,
                image: e.target.files[0],
              }))
            }
          />
        </div>

        {/* Title & Tags */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Title
            </label>

            <input
              type="text"
              value={blogData.title}
              onChange={(e) =>
                setblogdata((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              placeholder="Enter blog title..."
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100"
            />
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Tags
            </label>

            <input
              type="text"
              placeholder="react, nodejs, mongodb..."
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100"
              onKeyDown={handlekeydown}
            />

            <div className="flex items-center justify-center gap-1">
              <p className="text-xs my-1 opacity-80 text-red-500">
                *Click on space bar or enter to add tag .
              </p>
              <p className="text-xs my-1  text-red-700">
                {10 - blogData?.tags?.length} tags remaining
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {blogData?.tags?.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 justify-center bg-gray-200 text-black rounded-full px-4 py-2 cursor-pointer hover:text-white hover:bg-blue-500"
                >
                  <p>{tag}</p>
                  <i
                    onClick={() => deletetag(index)}
                    className="fi fi-br-cross-small "
                  ></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Draft + Description */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Draft */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Draft Status
          </label>

          <select
            value={blogData.draft}
            onChange={(e) =>
              setblogdata((prev) => ({
                ...prev,
                draft: e.target.value == "true" ? true : false,
              }))
            }
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100"
          >
            <option value="true">Draft</option>
            <option value="false">Publish</option>
          </select>
        </div>

        {/* Description */}
        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="text-sm font-semibold uppercase tracking-wider text-gray-500">
            Description
          </label>

          <textarea
            value={blogData.description}
            onChange={(e) =>
              setblogdata((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Write a short description..."
            className="w-full rounded-xl border border-gray-300 p-4 min-h-[150px] resize-none outline-none transition-all duration-200 focus:border-red-500 focus:ring-4 focus:ring-red-100"
          />
        </div>
      </div>

      {/* Content Editor */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          Content
        </label>

        <div
          id="editor"
          className="border border-gray-300 rounded-2xl p-6 min-h-[500px] bg-white transition-all duration-200 focus-within:border-red-500"
        ></div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <button
          className="px-8 py-3 rounded-xl bg-red-500 text-white font-semibold shadow-md hover:bg-red-600 active:scale-95 transition-all duration-200"
          onClick={id ? handleupdateblog : handlepostblog}
        >
          {blogData.draft
            ? "Saved as draft"
            : id
              ? "Update Blog"
              : "Publish Blog"}
        </button>
      </div>
    </div>
  );
}

export default Addblog;
