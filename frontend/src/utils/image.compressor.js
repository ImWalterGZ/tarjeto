import Compressor from "compressorjs";

export const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
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
