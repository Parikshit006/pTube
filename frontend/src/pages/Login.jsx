import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().min(1, 'Username or Email is required'),
  password: z.string().min(1, 'Password is required'),
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema)
  });

  const from = location.state?.from?.pathname || '/';

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login(data);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch {
      // Error handled by interceptor mapping
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-bg-secondary border border-border-default rounded-[16px] p-8 pb-10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <div className="text-center mb-8">
        <h1 className="font-display font-bold text-[28px] text-text-primary tracking-tight">Welcome back</h1>
        <p className="font-body text-[14px] text-text-muted mt-2">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="font-body text-[13px] font-medium text-text-secondary ml-1">Email or Username</label>
          <input 
            {...register('email')}
            placeholder="johndoe@example.com"
            disabled={isLoading}
            className="w-full h-11 px-4 rounded-lg bg-bg-tertiary border border-border-default font-body text-[14px] transition-all focus:border-red focus:bg-bg-primary outline-none disabled:opacity-50"
          />
          {errors.email && <span className="font-body text-red text-[12px] ml-1 mt-0.5">{errors.email.message}</span>}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center ml-1">
            <label className="font-body text-[13px] font-medium text-text-secondary">Password</label>
            <Link to="/forgot-password" className="font-body text-[12px] text-text-muted hover:text-text-primary transition-colors">Forgot password?</Link>
          </div>
          <div className="relative">
            <input 
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              disabled={isLoading}
              className="w-full h-11 pl-4 pr-10 rounded-lg bg-bg-tertiary border border-border-default font-body text-[14px] transition-all focus:border-red focus:bg-bg-primary outline-none disabled:opacity-50"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <span className="font-body text-red text-[12px] ml-1 mt-0.5">{errors.password.message}</span>}
        </div>

        <Button 
          type="submit" 
          isLoading={isLoading} 
          className="w-full mt-2 bg-red text-white h-11 text-[15px] font-display font-semibold transition-all hover:-translate-y-[1px] shadow-[0_4px_14px_0_rgba(255,59,59,0.2)] hover:shadow-[0_6px_20px_rgba(255,59,59,0.23)] border-none"
        >
          Sign in
        </Button>

        <div className="flex items-center gap-3 my-2 opacity-60">
          <div className="flex-1 h-px bg-border-strong" />
          <span className="font-body text-[12px] text-text-muted lowercase">or</span>
          <div className="flex-1 h-px bg-border-strong" />
        </div>

        <Link to="/register" className="w-full">
          <Button type="button" variant="ghost" className="w-full h-11 text-[14px] bg-bg-tertiary border border-border-default hover:bg-border-default hover:text-text-primary transition-colors">
            Create account
          </Button>
        </Link>
      </form>
    </div>
  );
};

export default Login;