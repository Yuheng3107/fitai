
type ProfileInfoProps = {
    profileData: {
        achivements: any[];
        username: string;
        email: string;
        profile_photo: null | string;
    } | null
}

const ProfileInfo = ({ profileData }: ProfileInfoProps) => {
    const placeholder = ""
    console.log(profileData?.username);
    return <div>
        <img src="placeholder" />
        <p>{profileData?.email}</p>
    </div>
}

export default ProfileInfo;