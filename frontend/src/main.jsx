import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { RouterProvider } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { Toaster } from 'react-hot-toast';
import { initializeAuth } from './app/authSlice';
import './index.css';

// Sync initial theme
const savedTheme = localStorage.getItem('ptube-theme');
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

store.dispatch(initializeAuth()).finally(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Provider store={store}>
        <RouterProvider router={AppRouter} />
        <Toaster 
          position="top-right" 
          toastOptions={{
            className: '!bg-bg-elevated !text-text-primary !border !border-border-default !rounded-[10px] !font-body !text-[14px]',
            success: { iconTheme: { primary: '#22c55e', secondary: '#ffffff' } },
            error: { iconTheme: { primary: '#ff3b3b', secondary: '#ffffff' } },
          }}
        />
      </Provider>
    </StrictMode>
  );
});
