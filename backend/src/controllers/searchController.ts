import { Request, Response } from "express";
import Topic, { ITopic } from "../models/Topic";
// import { redisClient as client } from "../server";

export const searchTopics = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (typeof query !== "string") {
      return res.status(400).json({ message: "Invalid search query" });
    }

    // // check cache
    // const cachedResult = await client.get(`search/${query}`);
    // if (cachedResult) {
    //   return res.status(200).json(JSON.parse(cachedResult));
    // }

    const topics: ITopic[] = await Topic.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { slug: { $regex: query, $options: "i" } },
      ],
    })
      .select("name slug")
      .limit(10);

    if (topics.length === 0) {
      return res.json({ message: "No results found", topics: [] });
    }

    // set cache
    // await client.set(`search/${query}`, JSON.stringify(topics), "EX", 600); //cached for 10 minutes

    return res.json({ topics });
  } catch (error) {
    res.status(500).json({ message: "Server error during search" });
  }
};
