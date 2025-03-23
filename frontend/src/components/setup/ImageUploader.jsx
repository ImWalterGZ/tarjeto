import { toast } from "react-hot-toast";
import { compressImage } from "../../utils/image.compressor";

function ImageUploader({ fieldName, value, onChange }) {
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        toast.loading("Procesando imagen...", {
          id: "imageProcessing",
        });

        const compressedFile = await compressImage(file);

        const reader = new FileReader();
        reader.onloadend = () => {
          onChange(reader.result, fieldName);
          toast.success("Imagen subida correctamente", {
            id: "imageProcessing",
          });
        };
        reader.onerror = () => {
          toast.error("Error al procesar la imagen", {
            id: "imageProcessing",
          });
        };
        reader.readAsDataURL(compressedFile);
      } catch (error) {
        toast.error("Error al procesar la imagen", {
          id: "imageProcessing",
        });
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full">
      <h2 className="text-2xl font-semibold text-gray-800">
        Sube una foto de ti, no te vamos a criticar
      </h2>
      <h3 className="-mt-4 text-sm text-gray-500">tanto...</h3>

      <input
        type="file"
        id={fieldName}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <label htmlFor={fieldName} className="btn btn-error w-full max-w-md">
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"
          />
        </svg>
        <span>Subir</span>
      </label>

      {value && (
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-red-500">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <button
        onClick={() => onChange(null, fieldName)}
        className="btn btn-ghost w-full max-w-md"
      >
        <span>Omitir</span>
      </button>
    </div>
  );
}

export default ImageUploader;
