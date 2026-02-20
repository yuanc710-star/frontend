import { useState, useCallback } from "react";
import { WebRTCAdaptor } from "@antmedia/webrtc_adaptor";

export interface ChatMessage {
  user: string;
  text: string;
  ts: number;
}

export interface UseChatOptions {
  adaptor: WebRTCAdaptor | null;
  streamId: string;
  userName: string;
}

export interface UseChatReturn {
  msg: string;
  setMsg: (msg: string) => void;
  messages: ChatMessage[];
  sendChat: () => void;
  handleIncomingMessage: (obj: any) => void;
}

export function useChat({
  adaptor,
  streamId,
  userName,
}: UseChatOptions): UseChatReturn {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const handleIncomingMessage = useCallback((obj: any) => {
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
  }, []);

  const sendChat = useCallback(() => {
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
  }, [adaptor, streamId, userName, msg]);

  return {
    msg,
    setMsg,
    messages,
    sendChat,
    handleIncomingMessage,
  };
}