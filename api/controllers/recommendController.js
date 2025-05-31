 import mongoose from 'mongoose';
import { User } from '../models/userModel.js';
  import properties from "../models/propertiesModel.js"; 
export const recommendProperty = async (req, res) => {
  try {
    const { propertyId, userEmail } = req.params;  
    const recommendedBy = req.user.userid; 

    // Validate inputs
    if (!propertyId || !userEmail) {
      return res.status(400).json({ message: 'propertyId and userEmail are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({ message: 'Invalid propertyId' });
    }

    const receiver = await User.findOne({ email: userEmail });
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver user not found' });
    }

    const alreadyRecommended = receiver.recommendationsReceived.some(
      (rec) =>
        rec.propertyId.toString() === propertyId &&
        rec.recommendedBy.toString() === recommendedBy.toString()
    );

    if (alreadyRecommended) {
      return res.status(400).json({ message: 'Already recommended' });
    }

    receiver.recommendationsReceived.push({
      propertyId,
      recommendedBy,
    });

    await receiver.save();

    res.status(200).json({ message: 'Property recommended successfully' });
  } catch (error) {
    console.error('Error recommending property:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


 

export const getReceivedRecommendations = async (req, res) => {
  try {
    const userId = req.user.userid;  

    const user = await User.findById(userId)
      .populate({
        path: 'recommendationsReceived.propertyId',
        model: 'properties',
      })
      .populate({
        path: 'recommendationsReceived.recommendedBy',
        select: 'name email',  
      });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      recommendations: user.recommendationsReceived,
    });
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Server error' });
  }
};