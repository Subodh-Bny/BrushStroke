import Container from "@/components/Container";
import React from "react";
import ClipLoader from "react-spinners/ClipLoader";

interface ErrorHandlerType {
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const useApiErrorHandler = ({
  isLoading,
  isError,
  message,
}: ErrorHandlerType): (() => JSX.Element | null) => {
  const handler = () => {
    if (isLoading) {
      return (
        <Container className="flex items-center justify-center min-h-screen">
          <ClipLoader size={50} />
        </Container>
      );
    }

    if (isError) {
      return (
        <Container className="min-h-screen flex items-center justify-center">
          {message}
        </Container>
      );
    }

    return null;
  };

  return handler;
};

export default useApiErrorHandler;
