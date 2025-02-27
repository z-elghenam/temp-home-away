import * as z from "zod";

export const profileSchema = z.object({
  firstName: z.string().min(2 , {message: "firstName must at leat contain 2 character"}),
  lastName: z.string().min(3),
  username: z.string().min(3),
});
