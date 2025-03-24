import Compressor from "compressorjs";

export const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.8,
      maxWidth: 400,
      maxHeight: 400,
      convertSize: 500000,
      success: (compressedFile) => {
        resolve(compressedFile);
      },
      error: (err) => {
        reject(err);
      },
    });
  });
};
