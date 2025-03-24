import sharp from "sharp";

export const resizeToExactDimensions = async (
  base64String,
  width = 30,
  height = 30
) => {
  try {
    // Remove the data URL prefix if it exists
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, "");

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Process image with sharp
    const processedImageBuffer = await sharp(imageBuffer)
      .resize(width, height, {
        fit: "fill",
        position: "center",
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    // Convert back to base64
    const processedBase64 = processedImageBuffer.toString("base64");

    // Return with the same data URL prefix as input
    const prefix =
      base64String.match(/^data:image\/\w+;base64,/)?.[0] ||
      "data:image/jpeg;base64,";
    return `${prefix}${processedBase64}`;
  } catch (error) {
    console.error("Error in resizeToExactDimensions:", error);
    throw error;
  }
};
