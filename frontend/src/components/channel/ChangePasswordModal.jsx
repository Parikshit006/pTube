import React from 'react';
import Modal from '../ui/Modal';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../ui/Button';
import { useChangePasswordMutation } from '../../api/userApi';
import toast from 'react-hot-toast';

const passwordSchema = z.object({
  oldPassword: z.string().min(6, 'Minimum 6 characters required'),
  newPassword: z.string().min(6, 'Minimum 6 characters required'),
  confirmPassword: z.string().min(6, 'Minimum 6 characters required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  const onSubmit = async (data) => {
    try {
      await changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword
      }).unwrap();
      toast.success('Password updated successfully');
      reset();
      onClose();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to update password');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        
        <div className="flex flex-col gap-1">
          <label className="font-body text-[13px] font-medium text-text-secondary ml-1">Current Password</label>
          <input
            type="password"
            {...register('oldPassword')}
            className="w-full h-10 px-3 rounded-lg bg-bg-tertiary border border-border-default font-body text-[14px] transition-all focus:border-red outline-none"
          />
          {errors.oldPassword && <span className="text-red text-[12px] ml-1">{errors.oldPassword.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-body text-[13px] font-medium text-text-secondary ml-1">New Password</label>
          <input
            type="password"
            {...register('newPassword')}
            className="w-full h-10 px-3 rounded-lg bg-bg-tertiary border border-border-default font-body text-[14px] transition-all focus:border-red outline-none"
          />
          {errors.newPassword && <span className="text-red text-[12px] ml-1">{errors.newPassword.message}</span>}
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="font-body text-[13px] font-medium text-text-secondary ml-1">Confirm New Password</label>
          <input
            type="password"
            {...register('confirmPassword')}
            className="w-full h-10 px-3 rounded-lg bg-bg-tertiary border border-border-default font-body text-[14px] transition-all focus:border-red outline-none"
          />
          {errors.confirmPassword && <span className="text-red text-[12px] ml-1">{errors.confirmPassword.message}</span>}
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-red text-white hover:-translate-y-[1px] shadow-[0_4px_14px_0_rgba(255,59,59,0.2)] border-none transition-all" isLoading={isLoading}>
            Update Password
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ChangePasswordModal;
