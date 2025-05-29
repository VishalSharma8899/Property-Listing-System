import { User } from "../models/userModel.js";
import properties from "../models/propertiesModel.js";

export const addFavoriteproperties = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userid;
  console.log("id", id);
  console.log("userid", userId);
  try {
    const existingUser = await User.findById({ _id: userId });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { favorites: id } },
      { new: true }
    );

    return res.status(201).json(updatedUser);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



export const getUsersForFavoriteProperties = async (req, res) => {
  try {
    const userId = req.user.userid;
    const user = await User.findById(userId);
    if (!user || !user.favorites || user.favorites.length === 0) {
      return res.status(200).json([]);
    }
    const favoriteProperties = await properties.find({
      _id: { $in: user.favorites },
    });
    const result = [];
    for (const prop of favoriteProperties) {
      const users = await User.find({ favorites: prop._id });
      result.push({
        properties: prop,
      });
    }
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



export const deleteFavoriteproperties = async (req, res) => {
  try {
    const userId = req.user.userid;
    const propertiesId = req.params.id;

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
        .json({ message: "properties not found in favorites" });
    }

    user.favorites.splice(index, 1);

    await user.save();

    return res.status(200).json({
      message: "Favorite properties removed successfully",
      favorites: user.favorites,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
