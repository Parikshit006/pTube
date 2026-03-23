import React, { useState } from 'react';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

const CommentInput = ({ user, onSubmit, isLoading = false, initialValue = '', onCancel }) => {
  const [content, setContent] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      if (!initialValue) setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-start w-full">
      <Avatar src={user?.avatar} name={user?.username} size="md" className="shrink-0" />
      <div className="flex-1 flex flex-col min-w-0">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Add a comment..."
          maxLength={1000}
          className="w-full bg-transparent resize-none overflow-hidden outline-none font-body text-[14px] text-text-primary placeholder:text-text-muted transition-colors border-b border-border-default focus:border-text-primary pb-1 min-h-[28px] max-h-[150px]"
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />
        <div className="flex justify-between items-center mt-2 h-9 overflow-hidden transition-all">
          <span className="font-mono text-[11px] text-text-disabled">
            {content.length}/1000
          </span>
          <div className="flex gap-2">
            {onCancel && (
              <Button type="button" variant="ghost" size="sm" onClick={onCancel} className="rounded-full h-8 px-4 text-[13px] hover:bg-bg-secondary">
                Cancel
              </Button>
            )}
            <Button 
              type="submit" 
              size="sm" 
              isLoading={isLoading} 
              disabled={!content.trim()} 
              className={`rounded-full h-8 px-4 text-[13px] ${content.trim() ? 'bg-blue text-white hover:bg-blue/90' : 'bg-bg-secondary text-text-muted hover:bg-bg-secondary cursor-not-allowed'}`}
            >
              Comment
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CommentInput;
