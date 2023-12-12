import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    const errors = err?.error?.map(
      (error: { message: string }) => error.message
    );
    return res.status(400).json({ status: false,message:"Invalid Input!", errors });
  } else if (err.code === 11000 || err.code === 11001) {
    let key = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      status: false,
      message:"Invalid Input!",
      error: {
        [key]: `${key[0].toUpperCase() + key.substring(1)} must be unique.`,
      },
    });
  }

  return res
    .status(500)
    .json({ status: false, message: "Internal Server Error" });
};

export default errorHandler;
