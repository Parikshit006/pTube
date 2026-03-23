import React, { useState } from 'react';
import { CheckCircle, Bell } from 'lucide-react';
import Button from '../ui/Button';
import { useToggleSubscriptionMutation } from '../../api/subscriptionApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SubscribeButton = ({ channelId, initialSubscribed = false }) => {
  const [isSubscribed, setIsSubscribed] = useState(initialSubscribed);
  const [toggleSubscription] = useToggleSubscriptionMutation();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleToggle = async () => {
    if (!isAuthenticated) {
      toast('Please log in to subscribe.', { icon: '🔒' });
      navigate('/login');
      return;
    }

    const prev = isSubscribed;
    setIsSubscribed(!prev);
    
    try {
      await toggleSubscription(channelId).unwrap();
      toast.success(isSubscribed ? 'Subscribed' : 'Unsubscribed');
    } catch {
      setIsSubscribed(prev); // Revert
      toast.error('Could not subscribe at this time');
    }
  };

  if (isSubscribed) {
    return (
      <Button 
        onClick={handleToggle}
        variant="ghost" 
        size="md" 
        className="rounded-full bg-[rgba(34,197,94,0.1)] hover:bg-[rgba(34,197,94,0.15)] text-green border border-[rgba(34,197,94,0.2)] focus-visible:ring-green pl-4 pr-5 group"
      >
        <CheckCircle className="w-[18px] h-[18px] mr-2 shrink-0 group-hover:hidden" />
        <Bell className="w-[18px] h-[18px] mr-2 shrink-0 hidden group-hover:block" />
        <span className="font-body font-medium text-[14px]">Subscribed</span>
      </Button>
    );
  }

  return (
    <Button 
      onClick={handleToggle}
      variant="primary" 
      size="md" 
      className="rounded-full bg-red text-white hover:bg-red/90 px-6 tracking-wide shadow-md shadow-red/20 focus-visible:ring-red"
    >
      <span className="font-body font-semibold text-[14px]">Subscribe</span>
    </Button>
  );
};

export default SubscribeButton;
