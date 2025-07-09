import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaPlus, FaImage, FaVideo } from "react-icons/fa6";
import uploadFile from "../helpers/uploadFile";
import { IoClose } from "react-icons/io5";
import Loading from "./Loading";
import backgroundImage from "../assets/wallpaper2.jpg";
import { IoMdSend } from "react-icons/io";
import moment from "moment";

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector((state) => state?.user);
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });
  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMessage = useRef(null);

  useEffect(() => {
    if (currentMessage.current) {
      currentMessage.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [allMessage]);

  const handleUploadImageVideoOpen = () => {
    setOpenImageVideoUpload((preve) => !preve);
  };

  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: uploadPhoto.url,
      };
    });
  };
  const handleClearUploadImage = () => {
    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: "",
      };
    });
  };

  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenImageVideoUpload(false);

    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: uploadPhoto.url,
      };
    });
  };
  const handleClearUploadVideo = () => {
    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: "",
      };
    });
  };

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);
      socketConnection.emit("seen", params.userId);

      const handleMessageUser = (data) => {
        setDataUser(data);
      };

      const handleMessages = (data) => {
        setAllMessage(data);
      };

      socketConnection.on("message-user", handleMessageUser);
      socketConnection.on("message", handleMessages);

      return () => {
        socketConnection.off("message-user", handleMessageUser);
        socketConnection.off("message", handleMessages);
      };
    }
  }, [socketConnection, params.userId]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setMessage((preve) => {
      return {
        ...preve,
        text: value,
      };
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new message", {
          sender: user?._id,
          receiver: params.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };

  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-no-repeat bg-cover"
    >
      {/* Header */}

      <header className="sticky top-0 h-16 bg-[#f3e8ff] dark:bg-[#1e1b2e] flex justify-between items-center px-4 ">
        <div className="flex items-center gap-4">
          <Link
            to="/message"
            className="lg:hidden text-purple-600 dark:text-white"
          >
            <FaAngleLeft size={25} />
          </Link>
          <Avatar
            width={40}
            height={40}
            imageUrl={dataUser?.profile_pic}
            name={dataUser?.name}
            userId={dataUser?._id}
          />
          <div>
            <h3 className="font-semibold text-lg text-ellipsis line-clamp-1 dark:text-white">
              {dataUser?.name}
            </h3>
            <p className="text-sm">
              {dataUser.online ? (
                <span className="text-green-500">online</span>
              ) : (
                <span className="text-gray-400">offline</span>
              )}
            </p>
          </div>
        </div>
        <button className="dark:text-white hover:text-purple-800">
          <HiDotsVertical />
        </button>
      </header>

      {/* Messages */}
      <section className="h-[calc(100vh-128px)] overflow-y-auto scrollbar dark:bg-[#111827] px-3 py-2">
        <div className="flex flex-col gap-2" ref={currentMessage}>
          {allMessage.map((msg, index) => (
            <div
              key={msg._id || index}
              className={`rounded-lg px-3 py-2 shadow text-sm ${
                user._id === msg?.msgByUserId
                  ? "ml-auto bg-[#e2d6f3] text-black"
                  : "bg-white dark:bg-[#1f2937] dark:text-white"
              } max-w-[280px] md:max-w-sm lg:max-w-md`}
            >
              {msg?.imageUrl && (
                <img
                  src={msg?.imageUrl}
                  className="w-full h-auto object-contain rounded"
                />
              )}
              {msg?.videoUrl && (
                <video
                  src={msg.videoUrl}
                  className="w-full h-auto object-contain rounded"
                  controls
                />
              )}
              <p className="mt-1">{msg.text}</p>
              <p className="text-xs text-right text-gray-500 dark:text-gray-300">
                {moment(msg.createdAt).format("hh:mm")}
              </p>
            </div>
          ))}
        </div>

        {/* Preview - Image/Video Upload */}
        {(message.imageUrl || message.videoUrl) && (
          <div className="sticky bottom-0 left-0 w-full flex justify-center items-center bg-black bg-opacity-40 p-4 z-10">
            <div className="relative bg-white rounded-lg shadow-lg p-4 dark:bg-gray-800">
              <button
                className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                onClick={
                  message.imageUrl
                    ? handleClearUploadImage
                    : handleClearUploadVideo
                }
              >
                <IoClose size={24} />
              </button>
              {message.imageUrl && (
                <img
                  src={message.imageUrl}
                  className="w-full max-w-xs object-contain rounded"
                />
              )}
              {message.videoUrl && (
                <video
                  src={message.videoUrl}
                  className="w-full max-w-xs object-contain rounded"
                  controls
                  autoPlay
                  muted
                />
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="w-full flex justify-center items-center mt-4">
            <Loading />
          </div>
        )}
      </section>

      {/* Send Message Bar */}
      <section className="h-16 bg-[#f3e8ff] dark:bg-[#1e1b2e] flex items-center px-4 shadow-md">
        <div className="relative mr-3">
          <button
            onClick={handleUploadImageVideoOpen}
            className="w-10 h-10 flex justify-center items-center bg-purple-200 hover:bg-purple-300 dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white rounded-full transition"
          >
            <FaPlus size={18} />
          </button>

          {/* Upload menu */}
          {openImageVideoUpload && (
            <div className="absolute bottom-14 left-0 bg-white dark:bg-gray-800 shadow-lg rounded-lg w-36 p-2 z-20">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center gap-2 p-2 hover:bg-purple-100 dark:hover:bg-gray-700 cursor-pointer rounded"
                >
                  <FaImage className="text-purple-500" />
                  <span>Image</span>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center gap-2 p-2 hover:bg-purple-100 dark:hover:bg-gray-700 cursor-pointer rounded"
                >
                  <FaVideo className="text-blue-500" />
                  <span>Video</span>
                </label>
                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />
                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>

        <form
          className="flex-1 flex items-center gap-2"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 py-2 px-4 rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:focus:ring-purple-700"
            value={message.text}
            onChange={handleOnChange}
          />
          <button
            type="submit"
            className=" dark:text-white hover:text-purple-800 dark:hover:text-purple-400 transition"
          >
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
