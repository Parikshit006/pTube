import React from 'react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateTweetMutation } from '../../api/tweetApi';
import toast from 'react-hot-toast';

const tweetSchema = z.object({
  content: z.string().min(1, "Tweet cannot be empty").max(280, "Tweet max length is 280 characters"),
});

const TweetComposer = ({ user }) => {
  const [createTweet, { isLoading }] = useCreateTweetMutation();
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(tweetSchema),
    defaultValues: { content: '' }
  });

  const content = watch('content');
  const remaining = 280 - (content?.length || 0);

  const onSubmit = async (data) => {
    try {
      await createTweet(data.content).unwrap();
      toast.success('Tweet posted successfully');
      reset();
    } catch (err) {
      // Error handled by interceptor
    }
  };

  return (
    <div className="flex gap-4 bg-bg-primary p-4 border border-border-default rounded-[12px] shadow-sm mb-6">
      <Avatar src={user?.avatar} name={user?.username} size="md" className="shrink-0" />
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col min-w-0">
        <textarea
          {...register('content')}
          placeholder="What's happening?"
          className="w-full bg-transparent resize-none overflow-hidden outline-none font-body text-[15px] text-text-primary placeholder:text-text-muted transition-colors border-b border-transparent focus:border-red pb-2 min-h-[50px] max-h-[200px]"
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />
        {errors.content && <span className="text-red font-body text-[12px] mt-1">{errors.content.message}</span>}
        
        <div className="flex justify-between items-end mt-3 border-t border-border-secondary pt-3">
          <span className={`font-mono text-[11px] ${remaining < 20 ? 'text-gold' : remaining < 0 ? 'text-red' : 'text-text-disabled'}`}>
            {remaining}
          </span>
          <Button type="submit" size="sm" isLoading={isLoading} disabled={remaining < 0 || content.trim() === ''} className="bg-blue hover:bg-blue/90 h-[32px] rounded-full px-5 pointer-events-auto">
            Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TweetComposer;
