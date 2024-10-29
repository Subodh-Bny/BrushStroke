"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useGetCategories } from "@/services/api/categoryApi";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import ArtistsSelect from "./ArtistsSelect";

export default function UpdateArtworkModal({
  artwork,
  onUpdate,
}: {
  artwork: Artwork;
  onUpdate: (updatedArtwork: Partial<Artwork>) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | undefined>(
    undefined
  );

  const [artistError, setArtistError] = useState<string | undefined>(undefined);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Artwork>({
    defaultValues: artwork,
  });
  const { data: categories } = useGetCategories();

  useEffect(() => {
    setImagePreviewUrl(artwork.image || "/notFound.jpg");
  }, [artwork]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.type.startsWith("image/")) {
        setImagePreviewUrl(URL.createObjectURL(file));
      } else {
        toast.error("Please upload a valid image file.");
        setImagePreviewUrl(null);
        setValue("image", undefined);
      }
    } else {
      setImagePreviewUrl(null);
    }
  };

  const onSubmit = async (data: Artwork) => {
    if (!data.category) {
      setCategoryError("Select category");
      return;
    }

    if (!data.artist) {
      setArtistError("Select artist");
      return;
    }

    setCategoryError(undefined);
    setArtistError(undefined);
    setIsLoading(true);

    const formData = new FormData();
    const updatedData: Partial<Artwork> = {};
    const originalArtwork: Artwork = { ...artwork };

    // Handle image upload
    if (
      data.image !== originalArtwork.image &&
      data.image &&
      data.image?.length > 0
    ) {
      formData.append("file", data.image[0]);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_UPLOAD_PRESET as string
      );
      formData.append(
        "cloud_name",
        process.env.NEXT_PUBLIC_CLOUD_NAME as string
      );

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/image/upload`,
          formData
        );
        const imageUrl = response.data.secure_url;
        if (originalArtwork.image !== imageUrl) {
          updatedData.image = imageUrl;
        }
        setImagePreviewUrl(null);
      } catch (error) {
        toast.error("Failed to upload image. Please try again.");
        setIsLoading(false);
        return;
      }
    }

    // Update fields based on changes
    if (originalArtwork.title !== data.title) updatedData.title = data.title;

    // Handle artist update
    const originalArtistId =
      typeof originalArtwork.artist === "object"
        ? originalArtwork.artist._id
        : originalArtwork.artist;
    const newArtistId =
      typeof data.artist === "object" ? data.artist._id : data.artist;

    if (originalArtistId !== newArtistId) {
      updatedData.artist = data.artist; // Update to new artist
    }

    if (originalArtwork.price !== data.price) updatedData.price = data.price;
    if (originalArtwork.category !== data.category)
      updatedData.category = data.category;
    if (originalArtwork.description !== data.description)
      updatedData.description = data.description;
    if (originalArtwork.availability !== data.availability)
      updatedData.availability = data.availability;

    if (Object.keys(updatedData).length === 0) {
      toast.error("No changes detected.");
      setIsLoading(false);
      return;
    }

    updatedData._id = data._id;

    try {
      await onUpdate(updatedData); // Await the update to catch any errors
    } catch (error) {
      toast.error("Failed to update artwork. Please try again.");
    }

    setIsLoading(false);
    setIsOpen(false);
    reset(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white hover:bg-gray-200 text-black">
          Update Artwork
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Artwork</DialogTitle>
          <DialogDescription>
            Make changes to your artwork here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <span className="text-red-500">{errors.title?.message}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              {...register("price", {
                required: "Price is required",
                valueAsNumber: true,
                min: { value: 0, message: "Price must be positive" },
              })}
            />
            {errors.title && (
              <span className="text-red-500">{errors.title?.message}</span>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Controller
                name="category"
                control={control}
                defaultValue=""
                render={({ field }) => {
                  const handleCategoryChange = (value: string) => {
                    field.onChange(value);
                    if (value) {
                      setCategoryError(undefined);
                    } else {
                      setCategoryError("Please select a category");
                    }
                  };
                  return (
                    <Select
                      onValueChange={handleCategoryChange}
                      value={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories &&
                          categories.map((category) => (
                            <SelectItem
                              key={category._id}
                              value={category._id || ""}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {categoryError && (
                <span className="text-red-500">{categoryError}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="images">
                Artwork Images <span className="text-red-500">*</span>
              </Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                {...register("image")}
                onChange={handleImageChange}
              />
              <div>
                {imagePreviewUrl && (
                  <Image
                    src={imagePreviewUrl}
                    alt="Image Preview"
                    width={100}
                    height={100}
                  />
                )}
              </div>
            </div>

            {/* <div className="flex items-center gap-2">
                <Switch id="featured" />
                <Label htmlFor="featured">Featured Artwork</Label>
              </div> */}

            <div className="grid gap-2">
              <Label htmlFor="artist">
                Artist <span className="text-red-500">*</span>
              </Label>
              <ArtistsSelect
                setValue={setValue}
                updateArtist={
                  typeof artwork.artist === "object"
                    ? artwork.artist
                    : undefined
                }
              />
              {artistError && (
                <span className="text-red-500">{artistError}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="available"
                defaultChecked={artwork.availability}
                onCheckedChange={(value) => {
                  setValue("availability", value);
                }}
              />
              <Label htmlFor="available">Availability (visible in store)</Label>
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <ClipLoader color="withe" size={20} />
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
