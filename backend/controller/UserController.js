import UserService from "../services/UserService.js";

const createUser = (req, res) => {
  try {
    console.log(req.body);
    // await UserService.createUser(req.body);
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};
export default createUser;
