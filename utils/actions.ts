"use server";
import { profileSchema } from "./schemas";
import { ZodError } from "zod";
import db from "./db";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const getAuthUser = async () => {
  const user = await currentUser();

  if (!user) throw new Error("You must be logged in to access this route");

  if (!user.privateMetadata.hasProfile) {
    redirect("/profile/create");
  }

  return user;
};

export const createProfileAction = async (
  prevState: { message: string },
  formData: FormData,
): Promise<{ message: string }> => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Please login to create a profile");

    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = profileSchema.parse(rawData);

    await db.profile.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress,
        profileImage: user.imageUrl ?? "",
        ...validatedFields,
      },
    });

    const client = await clerkClient();

    await client.users.updateUserMetadata(user.id, {
      privateMetadata: {
        hasProfile: true,
      },
    });
  } catch (err) {
    if (err instanceof ZodError) {
      return { message: err.errors.map((e) => e.message).join(", ") }; // Return Zod error messages
    }

    return {
      message:
        err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }

  redirect("/");
};

export const fetchProfileImage = async () => {
  const user = await currentUser();

  if (!user) return null;

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
    select: {
      profileImage: true,
    },
  });

  return profile?.profileImage;
};

export const fetchProfile = async () => {
  const user = await getAuthUser();

  const profile = await db.profile.findUnique({
    where: {
      clerkId: user.id,
    },
  });

   // if (!profile) return redirect('/profile/create');

  return profile;
};

export const updateProfileAction = async (
  prevState: { message: string },
  formData: FormData,
): Promise<{ message: string }> => {

  const rawData = Object.fromEntries(formData.entries());

  return { message: "update profile action" };
};
