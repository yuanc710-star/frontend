import React from "react";

export type ChatMsg = { user: string; text: string; ts: number };

export default function ChatPanel({
  title,
  messages,
  msg,
  setMsg,
  onSend,
}: {
  title: string;
  messages: ChatMsg[];
  msg: string;
  setMsg: (s: string) => void;
  onSend: () => void;
}) {
  type ChatMsg = { user: string; text: string; ts: number };

function ChatPanel({
  title,
  messages,
  msg,
  setMsg,
  onSend,
}: {
  title: string;
  messages: ChatMsg[];
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
        {messages.length === 0 ? (
          <p className="text-gray-400 text-sm italic">No messages yet…</p>
        ) : (
          messages.map((m, i) => (
            <div key={i} className="bg-gray-50 p-2 rounded-md shadow-sm">
              <div className="text-sm font-semibold">{m.user}</div>
              <div className="text-sm">{m.text}</div>
              <div className="text-xs text-gray-400">
                {new Date(m.ts).toLocaleTimeString()}
              </div>
            </div>
          ))
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
        <button onClick={onSend} className="px-4 py-2 rounded-md bg-black text-white text-sm">
          Send
        </button>
      </div>
    </div>
  );
}

}
