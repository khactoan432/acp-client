import React from 'react';
import ProfileHeader from '../../components/features/ProfileHeader/ProfileHeader';
import ProfileTabs from '../../components/features//ProfileTabs/ProfileTabs';

const Profile: React.FC = () => {
  return (
    <div className="max-w-[1024px] mx-auto  rounded-lg mb-5">
      <ProfileHeader username="tri1234512321" />
      <ProfileTabs />
    </div>
  );
};

export default Profile;
