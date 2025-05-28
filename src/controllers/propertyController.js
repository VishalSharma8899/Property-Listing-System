import property from "../models/propertyModel.js";

export const addProperties = async (req, res) => {
  const id = req.body.id;

  const check = await property.findOne({ id });
  if (check) {
    res.status(401).json({
      msg: "This property is already registered",
    });
  }
  try {
    const properties = {
      ...req.body,
      createdBy: req.user.id,
    };
    console.log(properties);
    const newProperty = new property(properties);

    const saveData = await newProperty.save();
    return res.status(201).json(saveData);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getProperty = async (req, res) => {
  try {
    const data = await property.find();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const editProperty = async (req, res) => {
  const { id } = req.params;
  const userid = req.user.id;
  const updateData = req.body;
  console.log(" updatedata ", updateData);

  const check = await property.findOne({ _id : id  });
  if (!check) {
    return res.status(401).json({
      msg: "This property is not registered",
    });
  }

  const createdid = check.createdBy.toString();
  if (createdid !== userid) {
    return res.status(401).json({
      msg: "This property user is not Matched",
    });
  }

  try {
    const updatedProperty = await property.findByIdAndUpdate(
      check._id,
      updateData,
      { new: true }
    );

    return res.status(200).json(updatedProperty);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
 export const deleteProperty = async (req, res) => {
  const { id } = req.params;
  const userid = req.user.id;
console.log('id' , id);
  try {
    const check = await property.findOne({ _id : id });
    if (!check) {
      return res.status(401).json({
        msg: "This property is not registered",
      });
    }

    const createdid = check.createdBy?.toString(); // Ensure it's string for comparison
    if (createdid !== userid) {
      return res.status(401).json({
        msg: "This property user is not Matched",
      });
    }

    await property.deleteOne({ _id : id });

    return res.status(200).json({
      message: "Property deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
