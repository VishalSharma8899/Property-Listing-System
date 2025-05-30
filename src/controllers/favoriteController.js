 import { User } from "../models/userModel.js";
import properties from "../models/propertiesModel.js";
import redisClient from "../config/redisClient.js";  

 
export const addFavoriteproperties = async (req, res) => {
  const { id } = req.params;        
  const userId = req.user.userid;    

  console.log("Add Favorite - property id:", id, "user id:", userId);

  try {
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: id } },
      { new: true }
    );
 
    await redisClient.del(`userFavorites:${userId}`);
    console.log(`Redis cache cleared for userFavorites:${userId}`);

    return res.status(201).json(updatedUser);
  } catch (err) {
    console.error("Error adding favorite:", err);
    return res.status(500).json({ message: err.message });
  }
};

 
export const getUsersForFavoriteProperties = async (req, res) => {
  try {
    const userId = req.user.userid;

 
    const cachedResult = await redisClient.get(`userFavorites:${userId}`);

    if (cachedResult) {
      console.log("Cache hit: Returning favorite properties from Redis");
      return res.status(200).json(JSON.parse(cachedResult));
    }

    console.log("Cache miss: Fetching favorite properties from MongoDB");

    const user = await User.findById(userId);
    if (!user || !user.favorites || user.favorites.length === 0) {
      return res.status(200).json([]);
    }

     
    const favoriteProperties = await properties.find({
      _id: { $in: user.favorites },
    });

    const result = favoriteProperties.map((prop) => ({
      properties: prop,
    }));

   
    await redisClient.setEx(
      `userFavorites:${userId}`,
      60,   
      JSON.stringify(result)
    );

    console.log("Data cached in Redis for userFavorites:", userId);

    return res.status(200).json(result);
  } catch (err) {
    console.error("Error getting favorite properties:", err);
    return res.status(500).json({ message: err.message });
  }
};

 
export const deleteFavoriteproperties = async (req, res) => {
  try {
    const userId = req.user.userid;
    const propertiesId = req.params.id;

    console.log("Delete favorite property id:", propertiesId, "for user:", userId);

    const user = await User.findById(userId);
    if (!user || !user.favorites) {
      return res.status(404).json({ message: "User or favorites not found" });
    }

    const index = user.favorites.findIndex(
      (fav) => fav.toString() === propertiesId
    );

    if (index === -1) {
      return res
        .status(404)
        .json({ message: "Property not found in favorites" });
    }

    user.favorites.splice(index, 1);
    await user.save();

   
    await redisClient.del(`userFavorites:${userId}`);
    console.log(`Redis cache cleared for userFavorites:${userId}`);

    return res.status(200).json({
      message: "Favorite property removed successfully",
      favorites: user.favorites,
    });
  } catch (err) {
    console.error("Error deleting favorite property:", err);
    return res.status(500).json({ message: err.message });
  }
};
