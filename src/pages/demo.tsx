import { useEffect, useRef, useState, useCallback } from "react";
import { WebRTCAdaptor } from "@antmedia/webrtc_adaptor";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Video, Loader2 } from "lucide-react";
import { AuthDialog } from "@/components/AuthDialog";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const WS_URL = import.meta.env.VITE_ANT_WS;
const DEFAULT_ID = import.meta.env.VITE_DEFAULT_STREAM_ID || "demo123";

export default function VisitorWithChat({
  userName = "Guest",
  streamId = DEFAULT_ID,
}) {
  const remoteRef = useRef<HTMLVideoElement | null>(null);
  const [adaptor, setAdaptor] = useState<WebRTCAdaptor | null>(null);
  const [playing, setPlaying] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showNavigationWarning, setShowNavigationWarning] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const { toast } = useToast();

  // chat state
  const { msg, setMsg, messages, sendChat, handleIncomingMessage } = useChat({
    adaptor,
    streamId,
    userName,
  });

  // Store handleIncomingMessage and toast in refs to always use the latest version
  const handleIncomingMessageRef = useRef(handleIncomingMessage);
  const toastRef = useRef(toast);
  useEffect(() => {
    handleIncomingMessageRef.current = handleIncomingMessage;
  }, [handleIncomingMessage]);
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  useEffect(() => {
    const a = new WebRTCAdaptor({
      websocket_url: WS_URL,
      // viewer: receive tracks
      sdp_constraints: { OfferToReceiveAudio: true, OfferToReceiveVideo: true },
      remoteVideoId: "remoteVideo",
      callback: (info, obj) => {
        console.log("WS:", info, obj || "");
        if (info === "play_started") {
          setIsConnecting(false);
          setConnectionError(null);
          setPlaying(true);
          toastRef.current({
            title: "Connected",
            description: "Successfully connected to the stream.",
          });
        }
        if (info === "play_finished" || info === "closed") {
          setIsConnecting(false);
          setPlaying((wasPlaying) => {
            if (wasPlaying) {
              toastRef.current({
                title: "Stream ended",
                description: "The live stream has ended.",
              });
            }
            return false;
          });
        }
        if (info === "publish_started" || info === "started") {
          setIsConnecting(false);
          setConnectionError(null);
        }

        if (
          info === "data_received" ||
          info === "newDataChannelMessage"
        ) {
          handleIncomingMessageRef.current(obj);
        }
      },
      callbackError: (e) => {
        console.error("WS error:", e);
        setIsConnecting(false);
        const errMsg = typeof e === "string" ? e : e?.message || "Connection failed";
        setConnectionError(errMsg);
        toastRef.current({
          title: "Connection failed",
          description: "Failed to connect to the stream. Please try again.",
          variant: "destructive",
        });
      },
    });
    setAdaptor(a);
  }, []);

  const startPlay = () => {
    setConnectionError(null);
    setIsConnecting(true);
    adaptor?.play(streamId);
  };
  const stopPlay = () => adaptor?.stop(streamId);

  // Handle navigation with stream state check
  const handleNavigation = useCallback((path: string) => {
    if (playing) {
      setPendingNavigation(path);
      setShowNavigationWarning(true);
    } else {
      navigate(path);
    }
  }, [playing, navigate]);

  // Confirm navigation and stop stream if needed
  const confirmNavigation = useCallback(() => {
    if (pendingNavigation) {
      stopPlay();
      setShowNavigationWarning(false);
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [pendingNavigation, navigate, stopPlay]);

  // Cancel navigation
  const cancelNavigation = useCallback(() => {
    setShowNavigationWarning(false);
    setPendingNavigation(null);
  }, []);

  // Browser navigation protection (refresh/close)
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (playing) {
        e.preventDefault();
        e.returnValue = "You're currently watching a live stream. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [playing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Skip link for keyboard users */}
      <a
        href="#main-content"
        className="absolute left-4 top-0 -translate-y-full focus:translate-y-4 focus:z-[100] px-4 py-2 bg-white rounded-md ring-2 ring-blue-500 shadow-lg transition-transform focus:outline-none"
      >
        Skip to main content
      </a>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleNavigation("/")}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded"
              aria-label="CampusTours Live - Go to home"
            >
              <Video className="h-8 w-8 text-blue-600" aria-hidden />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                CampusTours Live
              </h1>
            </button>
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <Button 
                  variant="outline" 
                  onClick={() => handleNavigation("/dashboard")}
                  aria-label="Go to dashboard"
                >
                  Dashboard
                </Button>
              )}
              <AuthDialog />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Welcome, {userName}</h2>
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
              playing
                ? "bg-green-100 text-green-800 ring-1 ring-green-200"
                : isConnecting
                  ? "bg-amber-100 text-amber-800 ring-1 ring-amber-200"
                  : "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
            }`}
            role="status"
            aria-live="polite"
            aria-label={`Stream status: ${playing ? "Live" : isConnecting ? "Connecting" : "Offline"}`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                playing
                  ? "bg-green-500 animate-pulse"
                  : isConnecting
                    ? "bg-amber-500 animate-pulse"
                    : "bg-gray-400"
              }`}
              aria-hidden
            />
            {playing ? "Live" : isConnecting ? "Connecting…" : "Offline"}
          </span>
        </div>

        <div className="flex gap-6">
          <div className="flex-1 space-y-4">
            <div
              className="relative bg-gray-100 rounded-lg overflow-hidden aspect-video"
              role="region"
              aria-label="Live stream video"
            >
              <video
                id="remoteVideo"
                ref={remoteRef}
                autoPlay
                playsInline
                controls={false}
                className="w-full h-full bg-black object-cover"
                aria-label={playing ? "Live campus tour stream" : "Stream not yet started"}
              />
              {!playing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900/80 to-slate-900">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-orange-500/20 animate-pulse" />
                  <div className="relative flex flex-col items-center gap-4 text-white/90">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/30 rounded-full blur-xl animate-pulse" />
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                        {isConnecting ? (
                          <Loader2 className="h-10 w-10 text-white/80 animate-spin" strokeWidth={1.5} aria-hidden />
                        ) : (
                          <Video className="h-10 w-10 text-white/80 animate-pulse" strokeWidth={1.5} aria-hidden />
                        )}
                      </div>
                    </div>
                    <div className="text-center space-y-1">
                      {isConnecting ? (
                        <>
                          <p className="text-lg font-medium">Connecting to stream…</p>
                          <p className="text-sm text-white/60">Please wait while we establish the connection</p>
                        </>
                      ) : connectionError ? (
                        <>
                          <p className="text-lg font-medium">Connection failed</p>
                          <p className="text-sm text-white/60">The stream may be offline. Try again in a moment.</p>
                        </>
                      ) : (
                        <>
                          <p className="text-lg font-medium">Stream not started yet</p>
                          <p className="text-sm text-white/60">Click &quot;Join Stream&quot; when the tour goes live</p>
                        </>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-3">
                {!playing && (
                  <Button
                    onClick={startPlay}
                    disabled={isConnecting}
                    className="px-6 py-2 rounded-md bg-black text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-70"
                    aria-label={isConnecting ? "Connecting to stream" : "Join live stream"}
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                        Connecting…
                      </>
                    ) : (
                      "Join Stream"
                    )}
                  </Button>
                )}
                {playing && (
                  <Button
                    variant="secondary"
                    onClick={stopPlay}
                    className="px-6 py-2 rounded-md"
                    aria-label="Leave stream"
                  >
                    Leave
                  </Button>
                )}
              </div>
              {connectionError && !playing && (
                <p className="text-sm text-amber-600" role="alert">
                  Connection failed. Click &quot;Join Stream&quot; to try again.
                </p>
              )}
            </div>
          </div>

          <ChatPanel
            title="Live Chat"
            messages={messages}
            msg={msg}
            setMsg={setMsg}
            onSend={sendChat}
            userName={userName}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 mt-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Video className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">CampusTours Live</span>
              </div>
              <p className="text-gray-400">
                Connecting prospective students with authentic college experiences through live, guided virtual tours.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => handleNavigation("/")} className="hover:text-white focus:outline-none focus-visible:underline" aria-label="Browse tours">Browse Tours</button></li>
                <li><button onClick={() => handleNavigation("/university-integration")} className="hover:text-white focus:outline-none focus-visible:underline" aria-label="Campus jobs">Campus Jobs</button></li>
                <li><button onClick={() => handleNavigation("/dashboard")} className="hover:text-white focus:outline-none focus-visible:underline" aria-label="Go to dashboard">Dashboard</button></li>
                <li>Ask Questions</li>
                <li>Get Insights</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">For Guides</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Become a Guide</li>
                <li>Earn Money</li>
                <li>Share Experience</li>
                <li>Help Students</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CampusTours Live. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Navigation Warning Dialog */}
      <AlertDialog 
        open={showNavigationWarning} 
        onOpenChange={(open) => {
          setShowNavigationWarning(open);
          if (!open) {
            // Clear pending navigation when dialog is closed (ESC or outside click)
            setPendingNavigation(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leave Live Stream?</AlertDialogTitle>
            <AlertDialogDescription>
              You're currently watching a live stream. Are you sure you want to leave? 
              This will disconnect you from the stream.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelNavigation}>
              Stay
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmNavigation}>
              Leave Stream
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function ChatPanel({
  title,
  messages,
  msg,
  setMsg,
  onSend,
  userName,
}: {
  title: string;
  messages: { user: string; text: string; ts: number }[];
  msg: string;
  setMsg: (s: string) => void;
  onSend: () => void;
  userName: string;
}) {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <section
      className="w-96 bg-gray-100 rounded-lg p-4 flex flex-col"
      aria-label="Live chat"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-medium" id="chat-title">{title}</h2>
        <span className="text-sm bg-white px-2 py-0.5 rounded-full text-gray-600">
          {messages.length}
        </span>
      </div>
      <div
        className="flex-1 overflow-y-auto space-y-2 bg-white rounded-md p-2 min-h-[200px] max-h-[400px]"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((m, i) => {
          const isOwn = m.user === userName;
          const fullDate = new Date(m.ts).toLocaleString();
          return (
            <div
              key={i}
              className={`p-2 rounded-md shadow-sm ${
                isOwn
                  ? "bg-blue-50 border-l-2 border-blue-500 ml-2"
                  : "bg-gray-50"
              }`}
            >
              <div className="text-sm font-semibold">{m.user}</div>
              <div className="text-sm">{m.text}</div>
              <div
                className="text-xs text-gray-400"
                title={fullDate}
              >
                {new Date(m.ts).toLocaleTimeString()}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
        {messages.length === 0 && (
          <p className="text-gray-400 text-sm italic">No messages yet…</p>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <label htmlFor="chat-input" className="sr-only">
          Type a message
        </label>
        <input
          id="chat-input"
          className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1"
          placeholder="Type a message…"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSend()}
          aria-label="Chat message input"
          aria-describedby="chat-title"
        />
        <Button
          onClick={onSend}
          disabled={!msg.trim()}
          size="sm"
          className="px-4 py-2 rounded-md bg-black text-white text-sm disabled:opacity-50"
          aria-label="Send message"
        >
          Send
        </Button>
      </div>
    </section>
  );
}
