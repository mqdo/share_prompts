import { connectToDB } from "@utils/database";
import Prompt from "@models/prompt";

export const GET = async (req) => {
  const query = req.nextUrl.searchParams.get("query");

  const aggregations = [
    {
      $lookup: {
        from: "users",
        localField: "creator",
        foreignField: "_id",
        as: "creator"
      }
    },
    {
      $unwind: "$creator"
    },
    {
      $match: {
        $or: [
          {
            "creator.username": {
              $regex: query,
              $options: "i"
            }
          },
          {
            prompt: {
              $regex: query,
              $options: "i"
            }
          },
          {
            tag: {
              $regex: query,
              $options: "i"
            }
          }
        ]
      }
    }
  ];

  try {
    await connectToDB();
    const prompts = query
      ? await Prompt.aggregate(aggregations)
      : await Prompt.find({}).populate("creator");

    return new Response(JSON.stringify(prompts), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to fetch all prompts", { status: 400 });
  }
}