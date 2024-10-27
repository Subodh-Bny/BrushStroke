"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useAddArtwork } from "@/services/api/artworkApi";
import {
  useCreateCategory,
  useGetCategories,
} from "@/services/api/categoryApi";
import toast from "react-hot-toast";
import Image from "next/image";
import axios from "axios";
import LoadingPopup from "@/components/LoadingPopup";
import ArtistsSelect from "../ArtistsSelect";

const AddArtwork = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | undefined>(
    undefined
  );
  const [artistError, setArtistError] = useState<string | undefined>(undefined);

  const { data: categoriesData } = useGetCategories();
  useEffect(() => {
    categoriesData && setCategories(categoriesData);
  }, [categoriesData]);

  const {
    register: newCategoryRegister,
    handleSubmit: handleNewCategorySubmit,
    reset: newCategoryReset,
  } = useForm<{ name: string }>();

  const {
    register,
    reset,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<Artwork>();

  const { mutate: addArtworkMutate } = useAddArtwork({ reset });
  const { mutate: createCategory } = useCreateCategory();

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

  const [addArtworkLoading, setAddArtworkLoading] = useState<boolean>(false);
  const artworkCreateHandler: SubmitHandler<Artwork> = async (data) => {
    setAddArtworkLoading(true);
    if (data.category === "" || data.category === undefined) {
      setCategoryError("Select category");
      setAddArtworkLoading(false);
      return;
    }
    if (data.artist === "" || data.artist === undefined) {
      setArtistError("Select artist");
      setAddArtworkLoading(false);
      return;
    }

    setCategoryError(undefined);
    setArtistError(undefined);

    const formData = new FormData();

    if (data?.image && data.image.length > 0) {
      formData.append("file", data?.image[0]);
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
          "https://api.cloudinary.com/v1_1/" +
            process.env.NEXT_PUBLIC_CLOUD_NAME +
            "/image/upload",
          formData
        );
        const imageUrl = response.data.secure_url;
        data.image = imageUrl;
        addArtworkMutate(data);
        setImagePreviewUrl(null);
        setAddArtworkLoading(false);
      } catch (error) {
        toast.error("Failed to upload image. Please try again.");
        setAddArtworkLoading(false);
      }
    } else {
      toast.error("Please upload image");
      setAddArtworkLoading(false);
    }
  };

  const onCreateCategory = (data: { name: string }) => {
    const newCategory: Category = {
      name: data.name,
    };
    createCategory(newCategory);
    setIsDialogOpen(false);
    newCategoryReset();
  };
  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold mb-6">Add New Artwork</h1>

      <Card>
        <CardHeader>
          <CardTitle>Artwork Information</CardTitle>
          <CardDescription>
            Enter the details of the new Artwork
          </CardDescription>
        </CardHeader>
        <CardContent className="w-[500px]">
          <form onSubmit={handleSubmit(artworkCreateHandler)}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">
                  Artwork Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter Artwork name"
                  {...register("title", {
                    required: "Artwork name is required",
                  })}
                />
                {errors.title && (
                  <span className="text-red-500">{errors.title?.message}</span>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter Artwork description"
                  {...register("description")}
                />
                {errors.description && (
                  <span className="text-red-500">
                    {errors.description?.message}
                  </span>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex justify-between items-center mt-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <span className="text-sm flex gap-1 select-none cursor-pointer items-center">
                        <PlusCircle className="h-4 w-4" />
                        Add New
                      </span>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Create New Category</DialogTitle>
                        <DialogDescription>
                          Add a new category for your products. Click save when
                          you&apos;re done.
                        </DialogDescription>
                      </DialogHeader>
                      <form
                        onSubmit={(e) => {
                          e.stopPropagation();
                          handleNewCategorySubmit(onCreateCategory)(e);
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Category Name
                          </label>
                          <Input
                            id="name"
                            placeholder="e.g., Paintings, Sculptures"
                            {...newCategoryRegister("name", {
                              required: "Category name is required",
                            })}
                          />
                        </div>
                        <Button className="w-full">Create Category</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
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
                          {categories.map((category) => (
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
                <Label htmlFor="price">
                  Price <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  placeholder="Enter price"
                  type="number"
                  min="0"
                  step="0.01"
                  {...register("price", {
                    required: "Specify the price for the artwork",
                  })}
                />
                {errors.price && (
                  <span className="text-red-500">{errors.price?.message}</span>
                )}
              </div>

              {/* <div className="grid gap-2">
                <Label htmlFor="dimensions">Dimensions (W x H in cm)</Label>
                <div className="flex gap-2">
                  <Input placeholder="Width" type="number" min="0" step="0.1" />
                  <Input
                    placeholder="Height"
                    type="number"
                    min="0"
                    step="0.1"
                  />
                </div>
              </div> */}

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
                      className="mt-4"
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
                <ArtistsSelect setValue={setValue} />
                {artistError && (
                  <span className="text-red-500">{artistError}</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  defaultChecked
                  onCheckedChange={(value) => {
                    setValue("availability", value);
                  }}
                />
                <Label htmlFor="active">Active (visible in store)</Label>
              </div>
            </div>
            <Button className="mt-6">Add Artwork</Button>
          </form>
        </CardContent>
      </Card>
      <LoadingPopup
        isLoading={addArtworkLoading}
        message="Creating artwork..."
      />
    </section>
  );
};

export default AddArtwork;
