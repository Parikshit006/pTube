import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, X, Mic, Upload, Bell, ChevronDown, User, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import Avatar from '../ui/Avatar';
import { toggleSidebar } from '../../app/uiSlice';
import { logout } from '../../app/authSlice';
import { useDebounce } from '../../hooks/useDebounce';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  
  const searchInputRef = useRef(null);
  const avatarDropdownRef = useRef(null);

  // Close dropdowns on outside click skip for now for simplicity, can handle later

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      searchInputRef.current?.blur();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    searchInputRef.current?.focus();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-[56px] z-50 bg-[color-mix(in_srgb,var(--bg-secondary)_90%,transparent)] backdrop-blur-[16px] border-b border-border-subtle flex items-center justify-between px-4 transition-colors">
      {/* Left Zone */}
      <div className="flex items-center gap-1">
        <button 
          onClick={() => dispatch(toggleSidebar())}
          className="btn-icon w-10 h-10 text-text-primary"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/" className="flex items-center gap-2 group outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 rounded-lg">
          <div className="w-[28px] h-[28px] rounded-md bg-red flex items-center justify-center -tracking-[0.02em]">
            <span className="font-display font-extrabold text-white text-[15px] leading-none">P</span>
          </div>
          <span className="font-display font-bold text-[18px] text-text-primary hidden sm:block tracking-tight">PTUBE</span>
        </Link>
      </div>

      {/* Center Zone */}
      <div className="flex-1 max-w-[480px] mx-auto flex items-center gap-2 px-2">
        <form 
          onSubmit={handleSearchSubmit} 
          className="relative flex-1 rounded-[100px] bg-bg-primary dark:bg-bg-tertiary border border-border-default h-[36px] flex items-center transition-colors focus-within:border-red focus-within:ring-[3px] focus-within:ring-red-dim group"
        >
          <div className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-[15px] h-[15px] text-text-muted group-focus-within:text-[#ff6b6b] transition-colors" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search videos, tweets, channels..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-full bg-transparent border-none outline-none pl-10 pr-8 font-body text-[13px] text-text-primary placeholder:text-text-disabled placeholder:font-body"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-[14px] top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X className="w-[13px] h-[13px]" />
            </button>
          )}
        </form>
        <button type="button" className="btn-icon hidden md:flex w-[36px] h-[36px] border border-border-default bg-bg-secondary hover:bg-bg-tertiary">
          <Mic className="w-[15px] h-[15px] text-text-primary" />
        </button>
      </div>

      {/* Right Zone */}
      <div className="flex items-center gap-[6px]">
        {isAuthenticated ? (
          <>
            <Link 
              to="/upload" 
              className="hidden sm:flex items-center gap-[6px] bg-red-dim border border-[rgba(255,59,59,0.20)] rounded-lg px-3 py-[6px] hover:bg-[rgba(255,59,59,0.18)] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2"
            >
              <Upload className="w-[13px] h-[13px] text-[#ff6b6b]" />
              <span className="font-body font-medium text-[12px] text-[#ff6b6b]">Upload</span>
            </Link>
            
            <ThemeToggle />
            
            <div className="relative">
              <button 
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="btn-icon w-10 h-10 text-text-primary relative"
              >
                <Bell className="w-[20px] h-[20px]" />
                <span className="absolute top-[8px] right-[8px] w-[6px] h-[6px] rounded-full bg-[#ff3b3b] animate-[pulse_2s_ease-in-out_infinite]" />
              </button>
              
              {showNotifMenu && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-[320px] max-h-[400px] overflow-y-auto bg-bg-elevated border border-border-default rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between p-3 border-b border-border-subtle sticky top-0 bg-bg-elevated/95 backdrop-blur-sm z-10">
                    <span className="font-display font-semibold text-[14px]">Notifications</span>
                    <button className="font-mono text-[11px] text-red hover:underline focus:outline-none">Mark all read</button>
                  </div>
                  <div className="p-8 flex flex-col items-center justify-center text-text-muted gap-2">
                    <Bell className="w-8 h-8 opacity-20" />
                    <span className="font-body text-[13px]">No new notifications</span>
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={avatarDropdownRef}>
              <button 
                onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                className="flex items-center gap-[2px] btn-icon rounded-full hover:bg-transparent"
              >
                <Avatar src={user?.avatar} name={user?.username} size="sm" className="w-8 h-8" />
                <ChevronDown className={`hidden sm:block w-3 h-3 text-text-primary transition-transform duration-200 ${showAvatarMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showAvatarMenu && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-[220px] bg-bg-elevated border border-border-default rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] z-50 animate-in fade-in slide-in-from-top-2 duration-150 py-2">
                  <div className="px-4 py-2 border-b border-border-subtle mb-2">
                    <div className="font-body font-medium text-[14px] text-text-primary truncate">{user?.fullName}</div>
                    <div className="font-mono text-[11px] text-text-muted truncate">@{user?.username}</div>
                  </div>
                  
                  <div className="flex flex-col">
                    <Link onClick={() => setShowAvatarMenu(false)} to={`/channel/${user?.username}`} className="flex items-center gap-3 px-4 py-2 hover:bg-bg-overlay transition-colors text-text-primary font-body text-[13px]">
                      <User className="w-[17px] h-[17px]" /> Your channel
                    </Link>
                    <Link onClick={() => setShowAvatarMenu(false)} to="/dashboard" className="flex items-center gap-3 px-4 py-2 hover:bg-bg-overlay transition-colors text-text-primary font-body text-[13px]">
                      <LayoutDashboard className="w-[17px] h-[17px]" /> Dashboard
                    </Link>
                    <Link onClick={() => setShowAvatarMenu(false)} to="/upload" className="flex items-center gap-3 px-4 py-2 hover:bg-bg-overlay transition-colors text-text-primary font-body text-[13px]">
                      <Upload className="w-[17px] h-[17px]" /> Upload
                    </Link>
                    <div className="flex items-center gap-3 px-4 py-2 hover:bg-bg-overlay transition-colors text-text-primary font-body text-[13px]">
                      <Settings className="w-[17px] h-[17px]" /> Settings
                    </div>
                  </div>
                  
                  <div className="h-px bg-border-subtle my-2" />
                  
                  <button 
                    onClick={() => {
                      dispatch(logout());
                      setShowAvatarMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-bg-overlay transition-colors text-red font-body text-[13px]"
                  >
                    <LogOut className="w-[17px] h-[17px]" /> Sign out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/login" className="btn-icon rounded-md font-body font-medium text-[12px] h-8 px-3 text-text-primary hover:bg-bg-elevated">Sign in</Link>
            <Link to="/register" className="btn-icon rounded-md font-body font-medium text-[12px] h-8 px-4 bg-red text-white hover:bg-opacity-90">Join free</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
