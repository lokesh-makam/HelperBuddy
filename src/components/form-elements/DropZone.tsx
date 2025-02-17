"use client";
import React, { useState } from "react";
import ComponentCard from "../common/ComponentCard";
import { useDropzone } from "react-dropzone";

const DropzoneComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "application/pdf": [],
    },
    maxFiles: 1,
  });

  return (
    <ComponentCard title="KYC Document">
      <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
        <form
          {...getRootProps()}
          className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10
            ${
              isDragActive
                ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
                : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
            }
          `}
          id="demo-upload"
        >
          <input {...getInputProps()} />

          <div className="dz-message flex flex-col items-center !m-0">
            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {isDragActive ? "Drop File Here" : "Drag & Drop a File Here"}
            </h4>
            <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
              Drag and drop a PNG, JPG, or PDF file here or browse
            </span>
            <span className="font-medium underline text-theme-sm text-brand-500">
              Browse File
            </span>
          </div>
        </form>
      </div>

      {file && (
        <div className="mt-4 p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
          <h5 className="font-medium text-gray-800 dark:text-white">File Preview:</h5>
          {file.type === "application/pdf" ? (
            <embed src={URL.createObjectURL(file)} width="100%" height="400px" />
          ) : (
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="mt-2 w-full max-w-xs rounded-lg border"
            />
          )}
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-400">{file.name}</p>
        </div>
      )}
    </ComponentCard>
  );
};

export default DropzoneComponent;
