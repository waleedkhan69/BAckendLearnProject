import { asyncHandler } from "../utils/asyncHandler.js"; // ✅ Correct Import

const registerUser = asyncHandler(async (req, res) => {
 return res.status(200).json({
  message: "ok am doing good what about you",
 });
});

export { registerUser };
