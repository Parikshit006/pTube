import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DropZone from '../ui/DropZone';
import Button from '../ui/Button';
import Switch from '../ui/Switch';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const uploadSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Max 100 characters'),
  description: z.string().min(1, 'Description is required').max(5000, 'Max 5000 characters'),
});

const UploadForm = ({ onUpload, isLoading }) => {
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(uploadSchema),
  });

  const handleAddTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, '');
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const onSubmit = (data) => {
    if (!videoFile) {
      toast.error('Video file is required');
      return;
    }
    if (!thumbnailFile) {
      toast.error('Thumbnail is required');
      return;
    }
    
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('isPublished', isPublished);
    formData.append('videoFile', videoFile);
    
    // Send tags as a comma-separated string if API expects it
    if (tags.length > 0) formData.append('tags', tags.join(','));
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);

    onUpload(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8 w-full">
      
      {/* Left Column: Dropzone */}
      <div className="w-full lg:w-[40%] flex flex-col gap-4">
        <label className="font-display font-semibold text-[16px] text-text-primary">Video File <span className="text-red">*</span></label>
        <div className="flex-1 min-h-[300px] lg:min-h-0 bg-bg-secondary rounded-xl overflow-hidden shadow-sm">
          <DropZone 
            accept={{ 'video/*': ['.mp4', '.webm', '.ogg'] }}
            maxSize={100 * 1024 * 1024}
            onDrop={(files) => setVideoFile(files[0])}
            file={videoFile}
          />
        </div>
        {!videoFile && <p className="font-mono text-[12px] text-red text-center mt-2">Video file is required array to proceed</p>}
      </div>

      {/* Right Column: Fields */}
      <div className="w-full lg:w-[60%] flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="font-display font-semibold text-[15px] text-text-primary">Title <span className="text-red">*</span></label>
          <input 
            {...register('title')}
            placeholder="Add a title that describes your video"
            className="w-full bg-bg-tertiary border border-border-default rounded-lg px-4 h-12 font-body text-[15px] text-text-primary focus:border-red focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary transition-colors outline-none"
          />
          {errors.title && <p className="font-mono text-[12px] text-red mt-1">{errors.title.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-display font-semibold text-[15px] text-text-primary">Description</label>
          <textarea 
            {...register('description')}
            placeholder="Tell viewers about your video"
            rows={5}
            className="w-full bg-bg-tertiary border border-border-default rounded-lg p-4 font-body text-[15px] text-text-primary focus:border-red focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary transition-colors outline-none resize-none"
          />
          {errors.description && <p className="font-mono text-[12px] text-red mt-1">{errors.description.message}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-display font-semibold text-[15px] text-text-primary">Thumbnail</label>
          <p className="font-body text-[13px] text-text-muted mb-2 -mt-1">Select or upload a picture that shows what's in your video.</p>
          <div className="w-full max-w-[280px]">
            <DropZone 
              isImage={true}
              accept={{ 'image/*': ['.jpeg', '.png', '.webp'] }}
              maxSize={5 * 1024 * 1024}
              onDrop={(files) => setThumbnailFile(files[0])}
              file={thumbnailFile}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="font-display font-semibold text-[15px] text-text-primary">Tags</label>
          <p className="font-body text-[13px] text-text-muted mb-2 -mt-1">Tags can be useful if content in your video is commonly misspelled.</p>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 bg-blue-dim text-blue border border-[rgba(59,130,246,0.2)] px-3 py-1 rounded-full font-body text-[13px]">
                {tag}
                <button type="button" onClick={() => removeTag(tag)} className="hover:text-red transition-colors focus:outline-none rounded-full ml-1">
                  <X className="w-[14px] h-[14px]" />
                </button>
              </span>
            ))}
          </div>
          
          <input 
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add a tag and press Enter or comma (,)"
            className="w-full bg-bg-tertiary border border-border-default rounded-lg px-4 h-12 font-body text-[15px] text-text-primary focus:border-red focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 transition-colors outline-none"
          />
        </div>

        <div className="flex items-center justify-between py-4 border-y border-border-default my-2">
          <div className="flex flex-col">
            <h4 className="font-display font-semibold text-[15px] text-text-primary">Visibility</h4>
            <p className="font-body text-[13px] text-text-muted mt-1">Make your video public or private.</p>
          </div>
          <div className="flex items-center gap-3">
             <span className={`font-mono text-[13px] font-medium ${isPublished ? 'text-green' : 'text-text-muted'}`}>
               {isPublished ? 'Public' : 'Private'}
             </span>
             <Switch checked={isPublished} onChange={setIsPublished} />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={!videoFile || isLoading} 
          isLoading={isLoading} 
          className="w-full mt-4 bg-red text-white py-4 h-auto text-[16px] font-display font-bold uppercase tracking-wide shadow-[0_4px_14px_0_rgba(255,59,59,0.39)] hover:shadow-[0_6px_20px_rgba(255,59,59,0.23)] hover:-translate-y-[1px] transition-all"
        >
          Publish Video
        </Button>
      </div>

    </form>
  );
};

export default UploadForm;
