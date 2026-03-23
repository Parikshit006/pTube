import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegisterMutation } from '../api/userApi';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Camera, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import DropZone from '../components/ui/DropZone';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Full name min 3 characters'),
  username: z.string().min(3, 'Username min 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Alphanumeric and underscores only'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password min 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const Register = () => {
  const [registerAccount, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    if (!avatarFile) {
      toast.error('Avatar image is required');
      return;
    }

    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key !== 'confirmPassword') formData.append(key, data[key]);
    });
    formData.append('avatar', avatarFile);

    try {
      await registerAccount(formData).unwrap();
      toast.success('Account created! Please log in.');
      navigate('/login');
    } catch {
      // Handled
    }
  };

  const avatarPreview = avatarFile ? URL.createObjectURL(avatarFile) : null;

  return (
    <div className="w-full bg-bg-secondary border border-border-default rounded-[16px] p-8 pb-10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <div className="text-center mb-6">
        <h1 className="font-display font-bold text-[28px] text-text-primary tracking-tight">Join free</h1>
        <p className="font-body text-[14px] text-text-muted mt-2">Get full access to all features</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        
        <div className="flex justify-center mb-2">
           <div className="relative group/avatar cursor-pointer rounded-full overflow-hidden w-[80px] h-[80px] bg-bg-tertiary border-2 border-border-default shadow-sm ring-2 ring-transparent ring-offset-2 ring-offset-bg-secondary focus-within:ring-red focus-within:border-red transition-all">
             <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" />
             {avatarPreview ? (
               <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center font-display font-medium text-text-muted">AV</div>
             )}
             <div className="absolute inset-0 bg-black/40 items-center justify-center hidden group-hover/avatar:flex transition-all z-10 pointer-events-none">
                <Camera className="w-6 h-6 text-white opacity-80" />
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-[13px] font-medium text-text-secondary ml-1">Full Name</label>
            <input 
              {...register('fullName')}
              placeholder="John Doe"
              className="w-full h-11 px-4 rounded-lg bg-bg-tertiary border border-border-default font-body text-[14px] transition-all focus:border-red focus:bg-bg-primary outline-none"
            />
            {errors.fullName && <span className="font-body text-red text-[12px] ml-1">{errors.fullName.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-body text-[13px] font-medium text-text-secondary ml-1">Username</label>
            <input 
              {...register('username')}
              placeholder="johndoe123"
              className="w-full h-11 px-4 rounded-lg bg-bg-tertiary border border-border-default font-body text-[14px] transition-all focus:border-red focus:bg-bg-primary outline-none lowercase"
            />
            {errors.username && <span className="font-body text-red text-[12px] ml-1">{errors.username.message}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="font-body text-[13px] font-medium text-text-secondary ml-1">Email</label>
          <input 
            {...register('email')}
            type="email"
            placeholder="johndoe@example.com"
            className="w-full h-11 px-4 rounded-lg bg-bg-tertiary border border-border-default font-body text-[14px] transition-all focus:border-red focus:bg-bg-primary outline-none"
          />
          {errors.email && <span className="font-body text-red text-[12px] ml-1">{errors.email.message}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="font-body text-[13px] font-medium text-text-secondary ml-1">Password</label>
            <div className="relative">
              <input 
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full h-11 pl-4 pr-10 rounded-lg bg-bg-tertiary border border-border-default font-body text-[14px] transition-all focus:border-red focus:bg-bg-primary outline-none"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted transition-colors"
                tabIndex="-1"
              >
                {showPassword ? <EyeOff className="w-[15px] h-[15px]" /> : <Eye className="w-[15px] h-[15px]" />}
              </button>
            </div>
            {errors.password && <span className="font-body text-red text-[12px] ml-1">{errors.password.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-body text-[13px] font-medium text-text-secondary ml-1">Confirm</label>
            <input 
              {...register('confirmPassword')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full h-11 px-4 rounded-lg bg-bg-tertiary border border-border-default font-body text-[14px] transition-all focus:border-red focus:bg-bg-primary outline-none"
            />
            {errors.confirmPassword && <span className="font-body text-red text-[12px] ml-1">{errors.confirmPassword.message}</span>}
          </div>
        </div>

        <Button 
          type="submit" 
          isLoading={isLoading} 
          className="w-full mt-4 bg-red text-white h-11 text-[15px] font-display font-semibold transition-all hover:-translate-y-[1px] shadow-[0_4px_14px_0_rgba(255,59,59,0.2)] hover:shadow-[0_6px_20px_rgba(255,59,59,0.23)] border-none"
        >
          Create account
        </Button>
      </form>
      
      <p className="text-center font-body text-[13px] text-text-secondary mt-6">
        Already have an account? <Link to="/login" className="text-red font-medium hover:underline transition-all">Sign in here</Link>
      </p>
    </div>
  );
};

export default Register;