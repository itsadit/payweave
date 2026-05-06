import authService from "../services/auth.service";

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and Password are required" });
    }
    const loginResult = await authService.loginUser({ email, password });
    res
      .status(200)
      .json({ success: true, message: "Login Successful", data: loginResult });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await authService.registerUser({
      name,
      email,
      phone,
      password,
    });
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export default { login, register };
