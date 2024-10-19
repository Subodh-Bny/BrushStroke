"use client";
import Container from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  useCreateCategory,
  useDeleteCategory,
  useGetCategories,
  useUpdateCategory,
} from "@/services/api/categoryApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Plus, Trash } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ClipLoader from "react-spinners/ClipLoader";

const CategoryPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { mutate: createCategory } = useCreateCategory();
  const { mutate: updateCategory, isPending: updatePending } =
    useUpdateCategory();
  const { mutate: deleteCategory, isPending: deletePending } =
    useDeleteCategory();
  const { data: categoriesData } = useGetCategories();
  useEffect(() => {
    categoriesData && setCategories(categoriesData);
  }, [categoriesData]);

  const {
    register: newCategoryRegister,
    handleSubmit: handleNewCategorySubmit,
    reset: newCategoryReset,
  } = useForm<{ name: string }>();

  const onCreateCategory = (data: { name: string }) => {
    const newCategory: Category = {
      name: data.name,
    };
    createCategory(newCategory);
    setIsDialogOpen(false);
    newCategoryReset();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory({ ...category });
  };

  const handleDelete = (id: string) => {
    deleteCategory(id);
  };

  const handleSave = () => {
    if (editingCategory) {
      updateCategory(editingCategory);
      !updatePending && setEditingCategory(null);
    }
  };

  return (
    <Container className="">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Category</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.stopPropagation();
                    handleNewCategorySubmit(onCreateCategory)(e);
                  }}
                  className="space-y-4"
                >
                  <div className="flex gap-1 flex-col">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>

                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category?._id}>
                  <TableCell>
                    {editingCategory?._id === category?._id ? (
                      <Input
                        value={editingCategory?.name}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      category.name
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    {editingCategory?._id === category._id ? (
                      <Button
                        onClick={handleSave}
                        size="sm"
                        disabled={
                          editingCategory?._id === category?._id &&
                          updatePending
                        }
                      >
                        {editingCategory?._id === category?._id &&
                        updatePending ? (
                          <ClipLoader size={15} />
                        ) : (
                          "Save"
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handleEdit(category)}
                        size="sm"
                        variant="outline"
                        disabled={
                          editingCategory?._id === category?._id &&
                          updatePending
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      onClick={() => handleDelete(category?._id || "")}
                      size="sm"
                      variant="outline"
                      className="ml-2"
                      disabled={
                        editingCategory?._id === category?._id && deletePending
                      }
                    >
                      {editingCategory?._id === category?._id &&
                      deletePending ? (
                        <ClipLoader size={15} />
                      ) : (
                        <Trash className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CategoryPage;
