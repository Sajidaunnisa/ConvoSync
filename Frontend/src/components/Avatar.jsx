import React, { useMemo } from 'react';
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from 'react-redux';

const Avatar = ({ userId, name, imageUrl, width, height }) => {
    const onlineUser = useSelector(state => state?.user?.onlineUser);

    const avatarName = useMemo(() => {
        if (name) {
            const splitName = name.split(" ");
            return splitName.length > 1 ? splitName[0][0] + splitName[1][0] : splitName[0][0];
        }
        return "";
    }, [name]);

    const bgColor = [
      'bg-rose-200',
      'bg-emerald-200',
      'bg-indigo-200',
      'bg-purple-200',
      'bg-pink-200',
      'bg-orange-200',
     ' bg-lime-200',
      'bg-violet-200',
      'bg-amber-200'
    ];

    const randomNumber = useMemo(() => Math.floor(Math.random() * bgColor.length), []);
    const isOnline = onlineUser.includes(userId);

    return (
        <div className="text-slate-800 rounded-full font-bold relative" >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    width={width}
                    height={height}
                    alt={name}
                    className="object-contain aspect-square rounded-full"
                />
            ) : name ? (
                <div style={{ width: `${width}px`, height: `${height}px` }} className={`overflow-hidden rounded-full flex justify-center items-center text-lg ${bgColor[randomNumber]}`}>
                    {avatarName}
                </div>
            ) : (
                <PiUserCircle size={width} />
            )}
            {isOnline && (
                <div className="bg-green-600 p-1 absolute bottom-2 -right-1 z-10 rounded-full"></div>
            )}
        </div>
    );
};

export default React.memo(Avatar);
