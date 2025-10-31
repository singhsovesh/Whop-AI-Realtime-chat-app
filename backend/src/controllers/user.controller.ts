import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { getUsersService } from "../services/user.service";


export const getUserController = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user?._id;

        const users = await getUsersService(userId);


        return res.status(HTTPSTATUS.OK).json({
            message: "User chats retrieved successfully",
            data: users,
        })
    }
)