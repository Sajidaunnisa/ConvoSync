import React, { useEffect, useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import Divider from "./Divider";
import SearchUser from "./SearchUser";
import { logout } from "../redux/userSlice";
import { LuMessageCircle, LuUserPlus } from "react-icons/lu";
import { FiLogOut, FiArrowUpLeft } from "react-icons/fi";
import { FaImage, FaVideo } from "react-icons/fa"; // For media icons

const Sidebar = () => {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);

      socketConnection.on("conversation", (data) => {
        console.log("conversation", data);

        const conversationUserData = data.map((conversationUser, index) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });

        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/email");
    localStorage.clear();
  };

  return (
    <div className="w-full h-full grid grid-cols-[72px,1fr] bg-[#f8f4ff] dark:bg-[#0f172a] transition-all duration-300 p-0">
      {/* Sidebar */}
      <aside className="h-full w-[72px] bg-[#e9defa] dark:bg-[#1e293b] rounded-tr-2xl rounded-br-2xl flex flex-col items-center justify-center dark:text-white shadow-md p-0">
        <div className="flex flex-col items-center justify-center gap-6">
          {/* Chat */}
          <NavLink
            to="/message"
            title="Chat"
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center rounded-lg hover:bg-[#d6c1f7] dark:hover:bg-[#334155] transition ${
                isActive ? "bg-[#d6c1f7] dark:bg-[#334155]" : ""
              }`
            }
          >
            <LuMessageCircle size={22} />
          </NavLink>

          {/* Add Friend */}
          <button
            title="Add Friend"
            onClick={() => setOpenSearchUser(true)}
            className="w-12 h-12 flex justify-center items-center rounded-lg hover:bg-[#d6c1f7] dark:hover:bg-[#334155] transition"
          >
            <LuUserPlus size={22} />
          </button>

          {/* Profile */}
          <button
            title="Edit Profile"
            onClick={() => setEditUserOpen(true)}
            className="w-12 h-12 flex justify-center items-center rounded-lg hover:bg-[#d6c1f7] dark:hover:bg-[#334155] transition"
          >
            <Avatar
              width={36}
              height={36}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </button>

          {/* Logout */}
          <button
            title="Logout"
            onClick={handleLogout}
            className="w-12 h-12 flex justify-center items-center rounded-lg hover:bg-[#fca5a5] dark:hover:bg-red-700 transition"
          >
            <FiLogOut size={22} />
          </button>
        </div>
      </aside>

      {/* Messages Panel */}
      <main className="w-full h-full overflow-hidden">
        <header className="h-16 flex items-center border-b border-[#ddd] dark:border-[#334155] px-4">
          <h2 className="text-xl font-bold dark:text-white">Messages</h2>
        </header>

        <section className="h-[calc(100vh-64px)] overflow-y-auto px-3 py-4 scrollbar">
          {allUser.length === 0 && (
            <div className="mt-20 text-center text-slate-400">
              <FiArrowUpLeft size={48} className="mx-auto mb-2" />
              <p>Explore users to start a conversation.</p>
            </div>
          )}

          {allUser.map((conv) => (
            <NavLink
              to={`/message/${conv?.userDetails?._id}`}
              key={conv?._id}
              className="flex items-center gap-3 py-3 px-3 mb-2 border border-transparent rounded-lg hover:border-[#6b4b9e] hover:bg-[#f2e9fe] dark:hover:bg-[#334155] transition"
            >
              <Avatar
                imageUrl={conv?.userDetails?.profile_pic}
                name={conv?.userDetails?.name}
                width={42}
                height={42}
              />

              <div className="flex-1">
                <h3 className="text-base font-semibold text-ellipsis line-clamp-1 dark:text-white">
                  {conv?.userDetails?.name}
                </h3>
                <div className="text-xs text-slate-500 dark:text-slate-300 flex items-center gap-1">
                  {conv?.lastMsg?.imageUrl && (
                    <span className="flex items-center gap-1">
                      <FaImage />
                      {!conv?.lastMsg?.text && <span>Image</span>}
                    </span>
                  )}
                  {conv?.lastMsg?.videoUrl && (
                    <span className="flex items-center gap-1">
                      <FaVideo />
                      {!conv?.lastMsg?.text && <span>Video</span>}
                    </span>
                  )}
                  <p className="text-ellipsis line-clamp-1">
                    {conv?.lastMsg?.text}
                  </p>
                </div>
              </div>

              {Boolean(conv?.unseenMsg) && (
                <span className="text-xs w-6 h-6 flex justify-center items-center bg-[#6b4b9e] text-white font-bold rounded-full ml-auto">
                  {conv?.unseenMsg}
                </span>
              )}
            </NavLink>
          ))}
        </section>
      </main>

      {/* Modals */}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default Sidebar;
