import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCount } from '../../utils/formatters';

const easeOutExpo = (t) => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

const StatsCard = ({ title, value, previousValue = 0, icon: Icon, colorClass }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let startTime;
    const duration = 1500; // ms
    const targetValue = value || 0;
    
    // Safety for non-numeric values
    if (typeof targetValue !== 'number' || isNaN(targetValue)) {
      setDisplayValue(targetValue);
      return;
    }

    const startValue = displayValue;
    const difference = targetValue - startValue;

    if (difference === 0) return;

    const tick = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentVal = Math.floor(startValue + difference * easeOutExpo(progress));
      setDisplayValue(currentVal);
      
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplayValue(targetValue);
      }
    };

    requestAnimationFrame(tick);
  }, [value]);

  const diff = value - previousValue;
  const percentage = previousValue === 0 ? (diff > 0 ? 100 : 0) : ((diff / previousValue) * 100).toFixed(1);
  const isPositive = diff >= 0;

  return (
    <div className="bg-bg-primary border border-border-default rounded-xl p-5 hover:border-border-strong transition-colors flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl bg-opacity-10 ${colorClass.replace('text-', 'bg-')} bg-bg-secondary`}>
          <Icon className={`w-6 h-6 ${colorClass}`} />
        </div>
        <div className="flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="w-3 h-3 text-green" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red" />
          )}
          <span className={`font-mono text-[11px] font-medium ${isPositive ? 'text-green' : 'text-red'}`}>
            {Math.abs(percentage)}%
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col gap-1">
        <h3 className="font-mono text-[11px] text-text-muted uppercase tracking-wider">{title}</h3>
        <div className="font-display font-extrabold text-[28px] text-text-primary leading-none mt-1 shadow-sm">
          {formatCount(displayValue)}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
