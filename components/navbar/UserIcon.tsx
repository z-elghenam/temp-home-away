import { fetchProfileImage } from "@/utils/actions";
import { LuUser } from "react-icons/lu";

async function UserIcon() {
  const profileImage = await fetchProfileImage();

  if (profileImage)
    return (
      <img
        src={profileImage}
        className="object-cover w-6 h-6 rounded-full text-white"
      />
    );

  return <LuUser className="w-6 h-6 bg-primary rounded-full text-white" />;
}
export default UserIcon;

