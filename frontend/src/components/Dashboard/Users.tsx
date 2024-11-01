"use client";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
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
import { useForm, SubmitHandler } from "react-hook-form";
import ClipLoader from "react-spinners/ClipLoader";
import { useAddUser, useGetUsers, useUpdateUser } from "@/services/api/userApi";
import { useState } from "react";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: userData } = useGetUsers();

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user._id || "" !== id));
  };

  const closeDialog = () => setIsDialogOpen(false);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingUser(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Edit User" : "Add New User"}
              </DialogTitle>
            </DialogHeader>
            <UserForm
              user={editingUser}
              closeDialog={closeDialog}
              //   onSubmit={editingUser ? handleEditUser : handleAddUser}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userData?.map((user) => (
            <TableRow key={user._id}>
              <TableCell>{user.username}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setEditingUser(user);
                    setIsDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteUser(user._id || "")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

type UserFormProps = {
  user: User | null;
  closeDialog: () => void;
  //   onSubmit: (user: User | Omit<User, "id">) => void;
};

interface ManageUser extends SignupUser {
  _id: string;
  role: string;
}

function UserForm({ user, closeDialog }: UserFormProps) {
  const { register, handleSubmit, reset, setValue } = useForm<ManageUser>();

  const [name, setName] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState(
    user && "password" in user ? (user.password as string) : ""
  );
  const [confirmPassword, setConfirmPassword] = useState(
    user && "password" in user ? (user.password as string) : ""
  );
  const { mutate, isPending: addUserPending } = useAddUser({
    reset,
    onSuccess: closeDialog,
  });

  const { mutate: updateMutate, isPending: updatePending } = useUpdateUser({
    onSuccess: closeDialog,
  });

  const submitHandler: SubmitHandler<ManageUser> = (data, event) => {
    event?.preventDefault();
    if (!user) {
      mutate(data);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...dataWithoutId } = data;
      updateMutate({ _id: user._id || "", ...dataWithoutId });
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={name}
          {...register("username")}
          onChange={(e) => setName(e.target.value)}
          required={user ? false : true}
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          {...register("email")}
          onChange={(e) => setEmail(e.target.value)}
          required={user ? false : true}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          {...register("password")}
          onChange={(e) => setPassword(e.target.value)}
          required={user ? false : true}
        />
      </div>
      <div>
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input
          id="confirm-password"
          type="confirm-password"
          value={confirmPassword}
          {...register("confirmPassword")}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required={user ? false : true}
        />
      </div>
      <div>
        <Label htmlFor="role">Role</Label>
        <Select
          onValueChange={(value) => setValue("role", value)}
          defaultValue={user?.role}
        >
          <SelectTrigger>
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="ARTIST">Artist</SelectItem>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={addUserPending}>
        {addUserPending || updatePending ? (
          <ClipLoader size={15} color="white" />
        ) : user ? (
          "Update User"
        ) : (
          "Add User"
        )}{" "}
      </Button>
    </form>
  );
}

export default UserManagement;
