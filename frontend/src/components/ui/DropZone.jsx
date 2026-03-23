import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

const DropZone = ({ onDrop, accept, maxSize, isImage = false, file }) => {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onDrop(acceptedFiles);
      }
    },
    accept: accept,
    maxSize: maxSize,
    multiple: false,
    noClick: false,
    noKeyboard: false,
  });

  if (isImage && file) {
    const preview = typeof file === 'string' ? file : URL.createObjectURL(file);
    return (
      <div 
        {...getRootProps()} 
        className="relative w-full aspect-video rounded-xl overflow-hidden border border-border-default group cursor-pointer"
      >
        <input {...getInputProps()} />
        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        <div 
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
        >
          <Upload className="w-8 h-8 mb-2" />
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={`w-full h-full min-h-[240px] flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-colors cursor-pointer text-center outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 ${
        isDragActive && !isDragReject
          ? 'border-red bg-red-dim'
          : isDragReject
          ? 'border-red bg-red/5'
          : 'border-border-default bg-bg-secondary hover:bg-bg-tertiary hover:border-text-muted'
      }`}
    >
      <input {...getInputProps()} />
      <Upload className={`w-12 h-12 mb-4 ${isDragActive ? 'text-red animate-pulse' : 'text-text-muted'}`} />
      
      {file ? (
        <>
          <p className="font-display font-semibold text-text-primary text-base mb-1">{file.name}</p>
          <p className="font-mono text-xs text-text-disabled">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
        </>
      ) : (
        <>
          <p className="font-display font-semibold text-text-primary text-base mb-1">
            {isImage ? 'Drag thumbnail here' : 'Drag video here'}
          </p>
          <p className="font-body text-sm text-text-muted mb-4">or click to browse</p>
          <p className="font-mono text-[11px] text-text-disabled">
            {isImage ? 'Accepted formats: JPEG, PNG, WEBP' : 'Accepted formats: MP4, WEBM, OGG'}
          </p>
        </>
      )}
    </div>
  );
};

export default DropZone;
