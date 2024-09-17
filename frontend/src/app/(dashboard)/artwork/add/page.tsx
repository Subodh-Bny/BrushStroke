"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Switch } from "@/components/ui/switch";

const AddArtwork = () => {
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
        <CardContent>
          <form>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Artwork Name</Label>
                <Input id="name" placeholder="Enter Artwork name" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter Artwork description"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="books">Books</SelectItem>
                    <SelectItem value="home">Home & Garden</SelectItem>
                    <SelectItem value="toys">Toys & Games</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  placeholder="Enter price"
                  type="number"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="grid gap-2">
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
              </div>

              <div className="grid gap-2">
                <Label htmlFor="images">Artwork Images</Label>
                <Input id="images" type="file" multiple accept="image/*" />
              </div>

              <div className="flex items-center gap-2">
                <Switch id="featured" />
                <Label htmlFor="featured">Featured Artwork</Label>
              </div>

              <div className="flex items-center gap-2">
                <Switch id="active" defaultChecked />
                <Label htmlFor="active">Active (visible in store)</Label>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Add Artwork</Button>
        </CardFooter>
      </Card>
    </section>
  );
};

export default AddArtwork;
