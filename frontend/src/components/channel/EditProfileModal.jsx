import React from 'react';
import Modal from '../ui/Modal';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../ui/Button';

// Simplified schema to avoid large forms
const profileSchema = z.object({
  fullName: z.string().min(3).max(50),
  username: z.string().min(3).max(30),
  email: z.string().email(),
  description: z.string().max(500).optional(),
});

import ChangePasswordModal from './ChangePasswordModal';

const EditProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [isPasswordModalOpen, setPasswordModalOpen] = React.useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      username: user?.username || '',
      email: user?.email || '',
      description: user?.description || '', // if your user object has this
    }
  });

  const onSubmit = async (data) => {
    await onSave(data);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <p className="font-mono text-[12px] text-text-muted mb-2">Note: Avatar and Cover Image updates are handled via separate buttons in full app context. This form updates basic info.</p>

        <div className="flex flex-col gap-1">
          <label className="font-body text-[13px] font-medium text-text-secondary ml-1">Full Name</label>
          <input
            {...register('fullName')}
            className="w-full h-10 px-3 rounded-lg bg-bg-tertiary border border-border-default font-body text-[14px] transition-all focus:border-red"
          />
          {errors.fullName && <span className="text-red text-[12px] ml-1">{errors.fullName.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-body text-[13px] font-medium text-text-secondary ml-1">Username</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-text-disabled">@</span>
            <input
              {...register('username')}
              className="w-full h-10 pl-7 pr-3 rounded-lg bg-bg-tertiary border border-border-default font-body text-[14px] transition-all focus:border-red"
            />
          </div>
          {errors.username && <span className="text-red text-[12px] ml-1">{errors.username.message}</span>}
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="font-body text-[13px] font-medium text-text-secondary ml-1">Email address</label>
          <input
            {...register('email')}
            type="email"
            className="w-full h-10 px-3 rounded-lg bg-bg-tertiary border border-border-default font-body text-[14px] transition-all focus:border-red"
          />
          {errors.email && <span className="text-red text-[12px] ml-1">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-body text-[13px] font-medium text-text-secondary ml-1">Description (Bio)</label>
          <textarea
            {...register('description')}
            rows={4}
            className="w-full p-3 rounded-lg bg-bg-tertiary border border-border-default font-body text-[14px] outline-none resize-none focus:border-red"
          />
          {errors.description && <span className="text-red text-[12px] ml-1">{errors.description.message}</span>}
        </div>

        <div className="flex justify-between items-center mt-4 pt-4 border-t border-border-default">
          <Button type="button" variant="ghost" className="text-red font-semibold" onClick={() => setPasswordModalOpen(true)}>
            Change Password
          </Button>
          <div className="flex gap-3">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Save Changes
            </Button>
          </div>
        </div>
      </form>
      {isPasswordModalOpen && (
        <ChangePasswordModal 
          isOpen={isPasswordModalOpen} 
          onClose={() => setPasswordModalOpen(false)} 
        />
      )}
    </Modal>
  );
};

export default EditProfileModal;
