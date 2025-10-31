import { useChat } from "@/hooks/use-chat";
import { useSocket } from "@/hooks/use-scoket"; // ✅ fixed typo
import type { MessageType } from "@/types/chat-type";
import { useEffect, useRef, useState } from "react";
import ChatBodyMessage from "./chat-body-message";

interface Props {
  chatId: string | null;
  messages: MessageType[];
  onReply: (message: MessageType) => void;
}

const ChatBody = ({ chatId, messages, onReply }: Props) => {
  const { socket } = useSocket();
  const { addNewMessage, addOrUpdateMessage } = useChat();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [_, setAiChunk] = useState<string>("");

  // ✅ Optional optimization: useRef to track latest messages
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Handle new messages from socket
  useEffect(() => {
    if (!chatId || !socket) return;

    const handleNewMessage = (msg: MessageType) => addNewMessage(chatId, msg);

    socket.on("message:new", handleNewMessage);
    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [socket, chatId, addNewMessage]);

  // Handle AI streaming chunks
  useEffect(() => {
    if (!socket || !chatId) return;

    const handleAIStream = ({
      chatId: streamChatId,
      chunk,
      done,
      message,
    }: any) => {
      if (streamChatId !== chatId) return;

      const lastMsg = messagesRef.current.at(-1);
      if (!lastMsg?._id || !lastMsg?.streaming) return;

      if (chunk?.trim() && !done) {
        setAiChunk((prev) => {
          const newContent = prev + chunk;
          addOrUpdateMessage(
            chatId,
            { ...lastMsg, content: newContent } as MessageType,
            lastMsg._id
          );
          return newContent;
        });
      }

      if (done && message) {
        console.log("AI stream done:", message);
        setAiChunk("");
        addOrUpdateMessage(chatId, message, lastMsg._id);
      }
    };

    socket.on("chat:ai", handleAIStream);

    return () => {
      socket.off("chat:ai", handleAIStream);
    };
  }, [socket, chatId, addOrUpdateMessage]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!messages.length) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col px-3 py-2">
      {messages.map((message) => (
        <ChatBodyMessage
          key={message._id}
          message={message}
          onReply={onReply}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatBody;
