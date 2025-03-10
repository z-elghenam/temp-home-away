export type actionFunction = (
  prevState: { message: string },
  formData: FormData
) => Promise<{
    redirectTo?: string; message: string 
}> ;


export type PropertyCardProps = {
  image: string;
  id: string;
  name: string;
  tagline: string;
  country: string;
  price: number;
};