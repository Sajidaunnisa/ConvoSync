import React, { useMemo } from "react";
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from "react-redux";

const Avatar = ({ userId, name, imageUrl, width = 40, height = 40 }) => {
  const onlineUser = useSelector((state) => state?.user?.onlineUser);

  const avatarName = useMemo(() => {
    if (name) {
      const splitName = name.trim().split(" ");
      return splitName.length > 1
        ? splitName[0][0] + splitName[1][0]
        : splitName[0][0];
    }
    return "";
  }, [name]);

  const bgColor = [
    "bg-rose-200",
    "bg-emerald-200",
    "bg-indigo-200",
    "bg-purple-200",
    "bg-pink-200",
    "bg-orange-200",
    "bg-lime-200",
    "bg-violet-200",
    "bg-amber-200",
  ];

  const randomNumber = useMemo(
    () => Math.floor(Math.random() * bgColor.length),
    []
  );
  const isOnline = onlineUser.includes(userId);

  return (
    <div
      className="relative"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          width={width}
          height={height}
          alt={name}
          className="rounded-full object-cover w-full h-full border border-slate-200 dark:border-slate-700 shadow-sm"
        />
      ) : name ? (
        <div
          className={`rounded-full flex items-center justify-center font-semibold text-slate-700 dark:text-white ${bgColor[randomNumber]}`}
          style={{
            width: `${width}px`,
            height: `${height}px`,
            fontSize: width / 2.5,
          }}
        >
          {avatarName}
        </div>
      ) : (
        <PiUserCircle
          size={width}
          className="text-slate-400 dark:text-slate-500"
        />
      )}

      {/* Online status indicator */}
      {isOnline && (
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full"></span>
      )}
    </div>
  );
};

export default React.memo(Avatar);
