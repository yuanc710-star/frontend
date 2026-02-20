import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

/*
declare global {
  interface Window {
    fbAsyncInit?: () => void;
  }
}

declare const FB:any;

window.fbAsyncInit = () => {
  console.log("fbAsyncInit called", window.FB);
  window.FB.init({
    appId: import.meta.env.VITE_FB_APP_ID,
    version: 'v19.0',
    xfbml: false,
  });
  console.log("FB.init called");
};
*/

createRoot(document.getElementById("root")!).render(<App />);
