import Container from "@/components/Container";
import UserManagement from "@/components/Dashboard/Users";
import React from "react";

const UsersPage = () => {
  return (
    <Container className="p-8 mt-0">
      <UserManagement />
    </Container>
  );
};

export default UsersPage;
