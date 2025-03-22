import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ProfileHeader from '../../components/features/ProfileHeader/ProfileHeader';
import ProfileTabs from '../../components/features//ProfileTabs/ProfileTabs';
const Profile = () => {
    return (_jsxs("div", { className: "max-w-[1024px] mx-auto  rounded-lg mb-5", children: [_jsx(ProfileHeader, { username: "tri1234512321" }), _jsx(ProfileTabs, {})] }));
};
export default Profile;
