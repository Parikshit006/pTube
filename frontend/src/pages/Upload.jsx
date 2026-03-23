import React, { useState } from 'react';
import UploadForm from '../components/video/UploadForm';
import UploadProgress from '../components/video/UploadProgress';
import { useDispatch } from 'react-redux';
import { setUploadProgress } from '../app/uiSlice';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Upload = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (formData) => {
    setIsUploading(true);
    dispatch(setUploadProgress(0));

    try {
      // Use direct axios call to access onUploadProgress
      const response = await axiosInstance.post('/videos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          dispatch(setUploadProgress(percentCompleted));
        },
      });

      toast.success('Video published successfully!');
      
      // Navigate to the video or to dashboard
      setTimeout(() => {
        setIsUploading(false);
        dispatch(setUploadProgress(0));
        navigate(`/watch/${response.data.data._id}`);
      }, 1000);

    } catch (error) {
      setIsUploading(false);
      dispatch(setUploadProgress(0));
      // Let interceptor toss the toast error
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto py-2 sm:py-6 relative min-h-[calc(100vh-100px)]">
      
      <div className="w-full flex items-center justify-between mb-8 pb-4 border-b border-border-default px-2">
        <div>
          <h1 className="font-display font-bold text-[24px] text-text-primary leading-tight">Upload Video</h1>
          <p className="font-body text-[14px] text-text-muted mt-1">Share your content with the PTUBE community.</p>
        </div>
      </div>

      <div className="w-full px-2">
        <UploadForm onUpload={handleUpload} isLoading={isUploading} />
      </div>

      {isUploading && <UploadProgress />}
    </div>
  );
};

export default Upload;