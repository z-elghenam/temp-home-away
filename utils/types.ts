export type actionFunction = (
  prevState: { message: string },
  formData: FormData
) => Promise<{ message: string }> | { message: string };


export type PropertyCardProps = {
  image: string;
  id: string;
  name: string;
  tagline: string;
  country: string;
  price: number;
};