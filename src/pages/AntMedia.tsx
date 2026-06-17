import { useEffect, useRef, useState } from "react";
import { WebRTCAdaptor } from "@antmedia/webrtc_adaptor";
import { Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WS_URL = import.meta.env.VITE_ANT_WS;
const DEFAULT_ID = import.meta.env.VITE_DEFAULT_STREAM_ID || "demo123";

export default function GuideWithChat({
  userName = "TheGuide",
  streamId = DEFAULT_ID,
}) {
  const localRef = useRef<HTMLVideoElement | null>(null);
  const [adaptor, setAdaptor] = useState<WebRTCAdaptor | null>(null);
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState(false);
  const navigate = useNavigate();

  // Chat state
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<
    { user: string; text: string; ts: number }[]
  >([]);

  useEffect(() => {
    // Initialize WebRTC adaptor once (per streamId)
    const a = new WebRTCAdaptor({
      websocket_url: WS_URL,

      // We publish both video and audio from this browser
      mediaConstraints: { video: true, audio: true },

      // We only publish; we don't need to receive tracks here
      sdp_constraints: {
        OfferToReceiveAudio: false,
        OfferToReceiveVideo: false,
      },

      // This ID is used internally by the SDK to attach the local stream
      localVideoId: "localVideo",

      // Main callback for WebRTC / signalling events
      callback: (info, obj) => {
        console.log("WS:", info, obj || "");

        if (info === "initialized") setReady(true);
        if (info === "publish_started") setLive(true);
        if (info === "publish_finished" || info === "closed") setLive(false);

        // Data channel messages (chat etc.)
        if (info === "data_received" || info === "newDataChannelMessage") {
          try {
            const data =
              typeof obj?.data === "string" ? JSON.parse(obj.data) : obj?.data;
            if (data?.type === "chat") {
              setMessages((prev) => [
                ...prev,
                {
                  user: data.user,
                  text: data.msg,
                  ts: data.ts ?? Date.now(),
                },
              ]);
            }
          } catch (e) {
            console.warn("chat parse error:", e, obj);
          }
        }
      },

      // Error callback for WebRTC / signalling
      callbackError: (e) => console.error("WS error:", e),
    });

    setAdaptor(a);

    // Cleanup on component unmount:
    // try to stop publishing and close the WebSocket
    return () => {
      try {
        a.stop(streamId);
      } catch (err) {
        console.warn("cleanup stop error", err);
      }
      try {
        // Some SDK builds expose closeWebSocket() – call it if available
        (a as any).closeWebSocket?.();
      } catch (err) {
        console.warn("cleanup ws error", err);
      }
    };
  }, [streamId]);

  // Start publishing the stream
  const start = () => {
    if (!ready || !adaptor) {
      console.warn("WebRTC adaptor is not ready yet");
      return;
    }
    adaptor.publish(streamId);
  };

  // Stop publishing the stream
  const stop = () => {
    adaptor?.stop(streamId);
  };

  // Click on brand (top-left) – if live, confirm before leaving
  const handleBrandClick = () => {
    if (live) {
      const ok = window.confirm(
        "You are currently live. Leaving may stop the stream and disconnect viewers. Leave anyway?",
      );
      if (!ok) return;
      stop();
    }
    navigate("/");
  };

  // Send a chat message via WebRTC data channel
  const sendChat = () => {
    if (!adaptor || !msg.trim()) return;

    const payload = JSON.stringify({
      type: "chat",
      user: userName,
      msg,
      ts: Date.now(),
    });

    adaptor.sendData(streamId, payload);

    // Also add it immediately to our local message list
    setMessages((prev) => [
      ...prev,
      { user: userName, text: msg, ts: Date.now() },
    ]);
    setMsg("");
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8">
      {/* Header: brand + live status */}
      <header className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleBrandClick}
          className="group flex items-center space-x-2"
          aria-label="Go to home page"
          title="Back to Home"
        >
          <div className="flex items-center space-x-2">
            <Video className="h-8 w-8 text-blue-600" aria-hidden="true" />
            <h1 className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-2xl font-bold text-transparent">
              CampusTours Live
            </h1>
          </div>
        </button>

        {/* Live / Offline indicator (screen-reader friendly) */}
        <div
          className="flex items-center gap-2 text-sm font-medium"
          role="status"
          aria-live="polite"
        >
          <span
            className={`h-3 w-3 rounded-full ${live ? "bg-green-500" : "bg-red-500"}`}
            aria-hidden="true"
          />
          <span>{live ? "Live" : "Offline"}</span>
          <span className="sr-only">
            Stream is currently {live ? "live" : "offline"}
          </span>
        </div>
      </header>

      {/* Main layout: stacked on mobile, split on large screens */}
      <main className="flex flex-col gap-6 lg:flex-row">
        {/* Left side: video + controls + stats */}
        <section
          className="flex-1 space-y-4"
          aria-label="Stream preview and controls"
        >
          {/* Video preview area */}
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
            <video
              id="localVideo"
              ref={localRef}
              autoPlay
              muted
              playsInline
              className="h-full w-full bg-black"
              aria-label="Local stream preview"
            />
          </div>

          {/* Controls: start / stop / share screen */}
          <div className="flex flex-wrap gap-3">
            {!live && (
              <button
                type="button"
                onClick={start}
                disabled={!ready}
                className="rounded-md bg-black px-6 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-500"
                aria-pressed={live}
                aria-disabled={!ready}
              >
                {ready ? "Start Stream" : "Connecting..."}
              </button>
            )}
            {live && (
              <button
                type="button"
                onClick={stop}
                className="rounded-md bg-gray-300 px-6 py-2 text-sm font-medium text-gray-700"
                aria-pressed={live}
              >
                End Stream
              </button>
            )}
            <button
              type="button"
              onClick={() => adaptor?.switchDesktopCapture(streamId)}
              className="rounded-md bg-orange-500 px-6 py-2 text-sm font-medium text-white"
            >
              Share Screen
            </button>
          </div>

          {/* Simple stats area (responsive grid) */}
          <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
            <Stat label="VIEWER" value={"ViewerName"} />
            <Stat label="SCHEDULE" value={"8:00 - 12:00 AM"} />
            <Stat label="TARGET" value="Campus" />
          </div>
        </section>

        {/* Right side: chat panel */}
        <aside
          className="mt-4 w-full lg:mt-0 lg:w-96 lg:flex"
          aria-label="Live chat panel"
        >
          <ChatPanel
            title="Live Chat"
            messages={messages}
            msg={msg}
            setMsg={setMsg}
            onSend={sendChat}
          />
        </aside>
      </main>
    </div>
  );
}

/**
 * Simple stat card used under the video player.
 */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
    </div>
  );
}

/**
 * Chat panel on the right side: messages, scrollable area, and input box.
 */
function ChatPanel({
  title,
  messages,
  msg,
  setMsg,
  onSend,
}: {
  title: string;
  messages: { user: string; text: string; ts: number }[];
  msg: string;
  setMsg: (s: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="flex min-h-[220px] flex-col rounded-lg bg-gray-100 p-4 lg:h-full">
      {/* Header: title + message count */}
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-medium">{title}</h2>
        <span
          className="rounded-full bg-white px-2 py-0.5 text-sm text-gray-600"
          aria-label={`Total messages: ${messages.length}`}
        >
          {messages.length}
        </span>
      </div>

      {/* Scrollable messages area */}
      <div
        className="flex-1 space-y-2 overflow-y-auto rounded-md bg-white p-2"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {messages.map((m, i) => (
          <article
            key={m.ts + i}
            className="rounded-md bg-gray-50 p-2 shadow-sm"
            aria-label={`Message from ${m.user}`}
          >
            <div className="text-sm font-semibold">{m.user}</div>
            <div className="text-sm">{m.text}</div>
            <time
              className="text-xs text-gray-400"
              dateTime={new Date(m.ts).toISOString()}
            >
              {new Date(m.ts).toLocaleTimeString()}
            </time>
          </article>
        ))}

        {messages.length === 0 && (
          <p className="text-sm italic text-gray-400">No messages yet…</p>
        )}
      </div>

      {/* Input area: form with submit for Enter key support */}
      <form
        className="mt-2 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
        aria-label="Send a chat message"
      >
        <div className="flex-1">
          <label htmlFor="chat-input" className="sr-only">
            Type your message
          </label>
          <input
            id="chat-input"
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Type a message…"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-gray-500"
          disabled={!msg.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}
