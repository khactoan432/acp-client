import React from "react";

import User from "../../../assets/user3.png";

interface ProfileHeaderProps {
  username: string;
  // status: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ username }) => {
  return (
    <div className="flex flex-col items-center bg-white py-8 relative">
      <div className="w-24 h-24 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center">
        <img src={User} alt="Avatar" className="w-full h-full rounded-full" />
      </div>
      <button className="absolute top-8 right-8 bg-white p-2 rounded-full shadow-md">
        <i className="fas fa-edit"></i>
      </button>
      <h1 className="text-xl mt-4">{username}</h1>
      {/* <span className="text-gray-600">{status}</span> */}
    </div>
  );
};

export default ProfileHeader;
