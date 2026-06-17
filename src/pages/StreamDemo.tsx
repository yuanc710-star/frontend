import React, { useEffect, useState } from 'react';

declare global {
  interface Window { FB: any }
}

const PAGE_ID = import.meta.env.VITE_FB_PAGE_ID as string;

export default function LiveTour() {
  const [videoId, setVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (videoId && window.FB) {
      window.FB.XFBML.parse(
        document.getElementById('fb-video-container')
      );
    }
  }, [videoId]);

  function startLive() {
    if (!window.FB) {
      alert('Facebook SDK not loaded yet!');
      return;
    }
    window.FB.login((res: any) => {
      if (!res.authResponse) return alert('Auth failed');
      // Debug: log response for troubleshooting
      console.log("FB.login response:", res);

      // Get all pages the user manages
      window.FB.api('/me/accounts', (acct: any) => {
        console.log("FB.api /me/accounts:", acct);
        if (!acct || !acct.data) {
          alert('No pages returned, or missing permission.');
          return;
        }
        const pg = acct.data.find((p: any) => p.id === PAGE_ID);
        if (!pg) return alert('You are not an admin of the required Page');
        const pageToken = pg.access_token;

        // Create the Live Video on the Page
        window.FB.api(
          `/${PAGE_ID}/live_videos`,
          'POST',
          { access_token: pageToken, status: 'LIVE_NOW' },
          (videoRes: any) => {
            console.log("FB.api live_videos response:", videoRes);
            if (videoRes && videoRes.id) setVideoId(videoRes.id);
            else alert('Failed to create live video');
          }
        );
      });
    }, {
      scope: 'pages_show_list,pages_read_engagement,pages_manage_posts,publish_video'
    });
  }

  return (
    <div className="p-6 space-y-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold">Campus Tour Live Demo</h1>
      <button
        onClick={startLive}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Start Live
      </button>

      <div id="fb-video-container" className="mt-4">
        {videoId && (
          <div
            className="fb-video"
            data-href={`https://www.facebook.com/${PAGE_ID}/videos/${videoId}`}
            data-autoplay="true"
            data-width="500"
          />
        )}
      </div>
    </div>
  );
}
