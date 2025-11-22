import { useEffect, useRef, useState } from "react";
import { WebRTCAdaptor } from "@antmedia/webrtc_adaptor";

const WS_URL = import.meta.env.VITE_ANT_WS;
const DEFAULT_ID = import.meta.env.VITE_DEFAULT_STREAM_ID || "demo123";

export default function VisitorWithChat({
  userName = "Guest",
  streamId = DEFAULT_ID,
}) {
  const remoteRef = useRef<HTMLVideoElement | null>(null);
  const [adaptor, setAdaptor] = useState<WebRTCAdaptor | null>(null);
  const [playing, setPlaying] = useState(false);

  // chat state
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<
    { user: string; text: string; ts: number }[]
  >([]);

  useEffect(() => {
    const a = new WebRTCAdaptor({
      websocket_url: WS_URL,
      // viewer: receive tracks
      sdp_constraints: { OfferToReceiveAudio: true, OfferToReceiveVideo: true },
      remoteVideoId: "remoteVideo",
      callback: (info, obj) => {
        console.log("WS:", info, obj || "");
        if (info === "play_started") setPlaying(true);
        if (info === "play_finished" || info === "closed") setPlaying(false);

        if (
          info === "data_received" ||
          info === "newDataChannelMessage"
        ) {
          try {
            const data =
              typeof obj?.data === "string" ? JSON.parse(obj.data) : obj?.data;
            if (data?.type === "chat") {
              setMessages((prev) => [
                ...prev,
                { user: data.user, text: data.msg, ts: data.ts ?? Date.now() },
              ]);
            }
          } catch (e) {
            console.warn("chat parse err:", e, obj);
          }
        }
      },
      callbackError: (e) => console.error("WS error:", e),
    });
    setAdaptor(a);
  }, []);

  const startPlay = () => adaptor?.play(streamId);
  const stopPlay = () => adaptor?.stop(streamId);

  const sendChat = () => {
    if (!adaptor || !msg.trim()) return;
    const payload = JSON.stringify({
      type: "chat",
      user: userName,
      msg,
      ts: Date.now(),
    });
    adaptor.sendData(streamId, payload);
    setMessages((prev) => [...prev, { user: userName, text: msg, ts: Date.now() }]);
    setMsg("");
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
          CampusTours Live
        </h1>
        <h2 className="text-2xl font-semibold">Welcome, {userName}</h2>
        <span className="text-sm font-medium flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${playing ? "bg-green-500" : "bg-red-500"}`} />
          {playing ? "Live" : "Offline"}
        </span>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-4">
          <div className="bg-gray-100 rounded-lg overflow-hidden aspect-video">
            <video
              id="remoteVideo"
              ref={remoteRef}
              autoPlay
              playsInline
              controls={false}
              className="w-full h-full bg-black"
            />
          </div>
          <div className="flex gap-3">
            {!playing && (
              <button
                onClick={startPlay}
                className="px-6 py-2 rounded-md bg-black text-white text-sm font-medium"
              >
                Join Stream
              </button>
            )}
            {playing && (
              <button
                onClick={stopPlay}
                className="px-6 py-2 rounded-md bg-gray-300 text-gray-700 text-sm font-medium"
              >
                Leave
              </button>
            )}
          </div>
        </div>

        <ChatPanel
          title="Live Chat"
          messages={messages}
          msg={msg}
          setMsg={setMsg}
          onSend={sendChat}
        />
      </div>
    </div>
  );
}

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
    <div className="w-96 bg-gray-100 rounded-lg p-4 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium">{title}</h2>
        <span className="text-sm bg-white px-2 py-0.5 rounded-full text-gray-600">
          {messages.length}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 bg-white rounded-md p-2">
        {messages.map((m, i) => (
          <div key={i} className="bg-gray-50 p-2 rounded-md shadow-sm">
            <div className="text-sm font-semibold">{m.user}</div>
            <div className="text-sm">{m.text}</div>
            <div className="text-xs text-gray-400">
              {new Date(m.ts).toLocaleTimeString()}
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm italic">No messages yet…</p>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          className="flex-1 border rounded-md px-3 py-2 text-sm"
          placeholder="Type a message…"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
        />
        <button
          onClick={onSend}
          className="px-4 py-2 rounded-md bg-black text-white text-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}


// Reuse ChatPanel component from above (same as in GuideWithChat)
