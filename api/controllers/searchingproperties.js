 import properties from "../models/propertiesModel.js";
import redisClient from "../config/redisClient.js"; 

export const propertiesSearch = async (req, res) => {
  try {
    const data = req.query;
    const filter = {};

    if (data.title) filter.title = { $regex: data.title, $options: "i" };
    if (data.type) filter.type = data.type;
    if (data.city) filter.city = data.city;
    if (data.state) filter.state = data.state;
    if (data.bedrooms) filter.bedrooms = +data.bedrooms;
    if (data.bathrooms) filter.bathrooms = +data.bathrooms;
    if (data.furnished) filter.furnished = data.furnished;
    if (data.listedBy) filter.listedBy = data.listedBy;
    if (data.listingType) filter.listingType = data.listingType;
    if (data.isVerified !== undefined)
      filter.isVerified = data.isVerified === "true";

    if (data.minPrice || data.maxPrice) {
      filter.price = {};
      if (data.minPrice) filter.price.$gte = +data.minPrice;
      if (data.maxPrice) filter.price.$lte = +data.maxPrice;
    }

    if (data.minArea || data.maxArea) {
      filter.areaSqFt = {};
      if (data.minArea) filter.areaSqFt.$gte = +data.minArea;
      if (data.maxArea) filter.areaSqFt.$lte = +data.maxArea;
    }

   
    const redisKey = `propertiesSearch:${JSON.stringify(filter)}`;

     
    const cachedResults = await redisClient.get(redisKey);
    if (cachedResults) {
      console.log("Cache hit for properties search");
      return res.status(200).json(JSON.parse(cachedResults));
    }

    console.log("Cache miss for properties search, querying DB");
    const Properties = await properties.find(filter);

  
    await redisClient.setEx(redisKey, 120, JSON.stringify(Properties));

    res.status(200).json(Properties);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
