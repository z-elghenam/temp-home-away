import { CardSignInButton } from "../form/Buttons";
import { auth } from "@clerk/nextjs/server";
import { fetchFavoriteId } from "@/utils/actions";
import FavoriteToggleForm from "./FavoriteToggleForm";

async function FavoriteToggleButton({ propertyId }: { propertyId: string }) {
  const { userId } = await auth();
  if (!userId) return <CardSignInButton />;
  const favoriteId = await fetchFavoriteId({ propertyId, userId });

  return <FavoriteToggleForm favoriteId={favoriteId} propertyId={propertyId} />;
}
export default FavoriteToggleButton;

