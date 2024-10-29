import { Response } from "express";

export const internalError = (
  consoleError: string,
  error: any,
  res: Response
) => {
  console.log(consoleError, error.message);
  return res
    .status(500)
    .json({ message: "Internal server error", error: error });
};
