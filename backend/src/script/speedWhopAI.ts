import "dotenv/config";
import UserModel from "../models/user.model";
import connectDatabase from './../config/database.config';


export const CreateWhoopAI = async () => {
    const existingAI = await UserModel.findOne({ isAI: true, name: "Whoop AI" });
    if (existingAI) {
       await UserModel.deleteOne({ _id: existingAI._id});
    }
    const whoopAI = new UserModel({
        name: "Whoop AI",
        isAI: true,
        avatar: "https://res.cloudinary.com/dpvvlndo/image/upload/v1759925671/ai_logo_qqman8.png",  // Your AI avatar URL
    });
    await whoopAI.save();
    console.log("Whoop AI created successfully");
    return whoopAI;
};

const seedWhoopAI = async () => {
    try{
        await connectDatabase();
        await CreateWhoopAI();
        console.log("Seeding completed.");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedWhoopAI();
