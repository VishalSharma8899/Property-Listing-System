import properties from "../models/propertiesModel.js";

export const addProperties = async (req, res) => {
  const id = req.body.id;

  const check = await properties.findOne({ id });
  if (check) {
    res.status(401).json({
      msg: "This properties is already registered",
    });
  }

  const userid = req.user.userid;
  console.log(userid);
  try {
    const propertiesData = {
      ...req.body,
      createdBy: userid ,
    };
    
    const Properties = new properties(propertiesData);

    const saveData = await   Properties.save();
    return res.status(201).json(saveData);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getproperties = async (req, res) => {
  try {
    const data = await properties.find();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const editproperties = async (req, res) => {
  const { id } = req.params;
  const userid = req.user.userid;
  const updateData = req.body;
 
  const check = await properties.findOne({ _id: id });
  if (!check) {
    return res.status(401).json({
      msg: "This properties is not registered",
    });
  }

  const createdid = check.createdBy.toString();
  if (createdid !== userid) {
    return res.status(401).json({
      msg: "This properties user is not Matched",
    });
  }

  try {
    const updatedproperties = await properties.findByIdAndUpdate(
      check._id,
      updateData,
      { new: true }
    );

    return res.status(200).json(updatedproperties);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteproperties = async (req, res) => {
  const { id } = req.params;
  const userid = req.user.userid;
  try {
    const check = await properties.findOne({ _id: id });
    if (!check) {
      return res.status(401).json({
        msg: "This properties is not registered",
      });
    }

    const createdid = check.createdBy?.toString();
    if (createdid !== userid) {
      return res.status(401).json({
        msg: "This properties user is not Matched",
      });
    }

    await properties.deleteOne({ _id: id });

    return res.status(200).json({
      message: "properties deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
