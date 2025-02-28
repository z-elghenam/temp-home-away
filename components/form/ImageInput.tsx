import { Label } from "../ui/label";
import { Input } from "../ui/input";

function ImageInput() {
  return (
    <div className="mb-2">
      <Label htmlFor="image" className="capitalize">
        Image
      </Label>
      <Input
        id="image"
        name="image"
        type="file"
        required
        accept="image/*"
        className="max-w-xs"
      />
    </div>
  );
}
export default ImageInput;
