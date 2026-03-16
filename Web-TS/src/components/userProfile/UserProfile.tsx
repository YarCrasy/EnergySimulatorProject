import "./UserProfile.css";

import userProfile from "@svg/user-profile.svg";

function UserProfile({ avatarUrl, menu }) {
    return (
        <div className="user-profile">
            <img src={avatarUrl || userProfile} alt="User avatar" className="user-avatar" />
            {menu && <div className="user-menu">{menu}</div>}
        </div>
    );
}

export default UserProfile;
