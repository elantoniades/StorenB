"use client";

import { useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { createClient } from "@/src/utils/supabase/client";

interface ImageUploadSupabaseProps {
  value: string[];
  onChange: (value: string[]) => void;
}
const supabase = createClient();
const ImageUploadSupabase: React.FC<ImageUploadSupabaseProps> = ({
  value,
  onChange,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `spaces/${fileName}`;

    const { error } = await supabase.storage
      .from("spaces_images")
      .upload(filePath, file);

    if (error) {
      console.error("Upload error:", error);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from("spaces_images")
      .getPublicUrl(filePath);

    if (data?.publicUrl) {
      onChange([...value, data.publicUrl]);
    }

    setUploading(false);
  };

  const handleRemove = (url: string) => {
    onChange(value.filter((item) => item !== url));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="cursor-pointer bg-neutral-100 border border-neutral-300 px-4 py-2 rounded hover:bg-neutral-200 transition">
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <div className="flex items-center gap-1">
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </div>
          )}
          <input
            type="file"
            onChange={handleUpload}
            className="hidden"
            accept="image/*"
            disabled={uploading}
          />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-2">
        {value.map((url) => (
          <div key={url} className="relative aspect-square overflow-hidden rounded-md border">
            <img
              src={url}
              alt="Uploaded"
              className="object-cover w-full h-full"
            />
            <button
              onClick={() => handleRemove(url)}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploadSupabase;
