import React, { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Flame, Twitter, Bell, History, ThumbsUp, ListVideo, LayoutDashboard, Upload, ChevronRight } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setSidebarOpen } from '../../app/uiSlice';
import { useGetSubscribedChannelsQuery } from '../../api/subscriptionApi';
import Avatar from '../ui/Avatar';

const NavItem = ({ to, icon: Icon, label, isExpanded }) => {
  return (
    <NavLink
      to={to}
      title={!isExpanded ? label : undefined}
      className={({ isActive }) =>
        `flex items-center gap-3 py-[10px] px-3 font-body text-[13px] font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-red group ${
          isActive
            ? 'bg-red-dim text-text-primary border-l-2 border-[#ff3b3b] rounded-none rounded-r-lg pl-[10px]'
            : 'text-text-muted hover:bg-bg-elevated hover:text-text-primary rounded-lg'
        }`
      }
    >
      <Icon className="w-[17px] h-[17px] shrink-0 group-hover:scale-110 transition-transform" />
      <span className={`transition-all duration-200 truncate ${isExpanded ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
        {label}
      </span>
    </NavLink>
  );
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const { data: subData } = useGetSubscribedChannelsQuery(user?._id, {
    skip: !user?._id,
  });

  const subscriptions = subData?.data || [];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        dispatch(setSidebarOpen(true));
      } else {
        dispatch(setSidebarOpen(false));
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Init
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  // Close completely on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      dispatch(setSidebarOpen(false));
    }
  }, [location.pathname, dispatch]);

  const mainNav = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/trending', icon: Flame, label: 'Trending' },
    { to: '/tweets', icon: Twitter, label: 'Tweets' },
    { to: '/subscriptions', icon: Bell, label: 'Subscriptions' },
  ];

  const libNav = [
    { to: '/history', icon: History, label: 'History' },
    { to: '/liked', icon: ThumbsUp, label: 'Liked videos' },
    { to: '/playlists', icon: ListVideo, label: 'Playlists' },
  ];

  const creatorNav = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/upload', icon: Upload, label: 'Upload' },
  ];

  const isExpanded = sidebarOpen;
  
  const GroupLabel = ({ children }) => (
    isExpanded ? <div className="font-mono text-[10px] text-text-disabled uppercase tracking-[0.10em] px-3 pt-2 pb-1">{children}</div> : null
  );

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-30 lg:hidden transition-opacity duration-250 ${sidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => dispatch(setSidebarOpen(false))}
      />
      <aside 
        className={`fixed top-[56px] left-0 bottom-0 z-40 bg-bg-secondary border-r border-border-subtle flex flex-col transition-[width,transform] duration-250 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden lg:translate-x-0 ${isExpanded ? 'w-[240px]' : 'w-[68px] -translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 cs-scroll">
          <div className="flex flex-col gap-1">
            {mainNav.map((link) => (
              <NavItem key={link.to} {...link} isExpanded={isExpanded} />
            ))}
          </div>

          {isAuthenticated && (
            <>
              <div className="border-b border-border-subtle my-2" />
              <GroupLabel>Library</GroupLabel>
              <div className="flex flex-col gap-1">
                {libNav.map((link) => (
                  <NavItem key={link.to} {...link} isExpanded={isExpanded} />
                ))}
              </div>

              <div className="border-b border-border-subtle my-2" />
              <GroupLabel>Creator</GroupLabel>
              <div className="flex flex-col gap-1">
                {creatorNav.map((link) => (
                  <NavItem key={link.to} {...link} isExpanded={isExpanded} />
                ))}
              </div>

              {isExpanded && subscriptions.length > 0 && (
                <>
                  <div className="border-b border-border-subtle my-2" />
                  <GroupLabel>Subscriptions</GroupLabel>
                  <div className="flex flex-col">
                    {subscriptions.map((sub) => {
                      const c = sub.channel || sub;
                      return (
                        <NavLink key={c._id || c.username} to={`/channel/${c.username}`} className="flex items-center gap-3 py-[8px] px-3 font-body text-[12px] font-normal transition-colors text-text-muted hover:bg-bg-elevated hover:text-text-primary rounded-lg group">
                          <Avatar src={c.avatar} name={c.username} size="xs" className="w-6 h-6 border border-border-subtle group-hover:border-red transition-colors" />
                          <span className="truncate">{c.fullName || c.username}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
        
        {isExpanded && (
          <div className="p-3 text-center">
            <p className="font-mono text-[10px] text-text-disabled">PTUBE © 2025</p>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
