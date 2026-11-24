import { Schema, model, models, Model } from "mongoose";

// describes what a tweet looks like in TypeScript
export interface ITweet {
    content: string;
    author: string;
    upvotes: number;
    downvotes: number;
    createdAt: Date;
    updatedAt: Date;
}

const TweetSchema = new Schema<ITweet>(
    {
        content: {
            type: String,
            required: true,
            maxlength: [280, "Tweet cannot be more than 280 characters"],
        },
        author: {
            type: String,
            default: "anonymous",
        },
        upvotes: {
            type: Number,
            default: 0,
        },
        downvotes: {
            type: Number,
            default: 0,
        },
    },
    // adds createdAt and updatedAt fields automatically
    { timestamps: true }
);

// We have to define it this way because of hot reloading
export const Tweet: Model<ITweet> =
    (models.Tweet as Model<ITweet>) ?? model<ITweet>("Tweet", TweetSchema);