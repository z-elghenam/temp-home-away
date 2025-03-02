"use server";
import {
  imageSchema,
  profileSchema,
  propertySchema,
  validateWithZodSchema,
} from "./schemas";
import { ZodError } from "zod";
import db from "./db";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { uploadImage } from "./supabase";

const getAuthUser = async () => {
  const user = await currentUser();

  if (!user) throw new Error("You must be logged in to access this route")
    // if(!user) return null

  if (!user.privateMetadata.hasProfile) redirect("/profile/create");

  return user;
};

const renderError = (
  error: unknown,
): {
  message: string;
} => {
  return {
    message:
      error instanceof Error ? error.message : "An unexpected error occurred",
  };
};

export const createProfileAction = async (
  prevState: { message: string },
  formData: FormData,
): Promise<{ message: string }> => {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Please login to create a profile");

    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

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
      return { message: err.errors.map((e) => e.message).join(", ") };
    }

    return {
      message:
        err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }

  redirect("/");
};

export const fetchProfileImage = async () => {
  const user = await getAuthUser();

  if(!user) return null


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

  return profile;
};

export const updateProfileAction = async (
  prevState: { message: string },
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAuthUser();

  try {
    const rawData = Object.fromEntries(formData.entries());
    const validatedFields = validateWithZodSchema(profileSchema, rawData);

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: validatedFields,
    });

    revalidatePath("/profile");
    return { message: "Profile updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const updateProfileImageAction = async (
  prevState: { message: string },
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const image = formData.get("image") as File;
    const validatedFile = validateWithZodSchema(imageSchema, { image });
    const fullPath = await uploadImage(validatedFile.image);

    await db.profile.update({
      where: {
        clerkId: user.id,
      },
      data: {
        profileImage: fullPath,
      },
    });
    revalidatePath("/profile");
    return { message: "Profile image updated successfully" };
  } catch (error) {
    return renderError(error);
  }
};

export const createPropertyAction = async (
  prevState: { message: string },
  formData: FormData,
): Promise<{ message: string }> => {
  const user = await getAuthUser();
  try {
    const rawData = Object.fromEntries(formData);
    const file = formData.get("image") as File;
    const validatedFields = validateWithZodSchema(propertySchema, rawData);
    const validatedFile = validateWithZodSchema(imageSchema, { image: file });

    const fullPath = await uploadImage(validatedFile.image);

    await db.property.create({
      data: {
        ...validatedFields,
        image: fullPath,
        profileId: user.id,
      },
    });
    return { message: "Property was created updated successfully" };
  } catch (error) {
    console.error("Error creating property:", error);
    return renderError(error);
  }
  redirect("/");
};

export const fetchProperties = async ({
  search = "",
  category,
}: {
  search?: string;
  category?: string;
}) => {
  const properties = await db.property.findMany({
    where: {
      category,
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { tagline: { contains: search, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      tagline: true,
      country: true,
      image: true,
      price: true,
    },
  });
  return properties;
};
