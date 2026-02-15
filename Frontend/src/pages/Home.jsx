import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import ChatMobileBar from "../components/chat/ChatMobileBar.jsx";
import ChatSidebar from "../components/chat/ChatSidebar.jsx";
import ChatMessages from "../components/chat/ChatMessages.jsx";
import ChatComposer from "../components/chat/ChatComposer.jsx";
import "../components/chat/ChatLayout.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  startNewChat,
  selectChat,
  setInput,
  sendingStarted,
  sendingFinished,
  addUserMessage,
  setChats,
} from "../store/chatSlice.js";
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const chats = useSelector((state) => state.chat.chats);
  const input = useSelector((state) => state.chat.input);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isSending = useSelector((state) => state.chat.isSending);
  const activeChatId = useSelector((state) => state.chat.activeChatId);

  // const activeChat = chats.find((c) => (c.id || c._id) === activeChatId) || null;
  const [messages, setMessages] = useState([
    // {
    //   type: 'user',
    //   content: 'Hello, how can I help you today?'
    // },
    // {
    //   type: 'ai',
    //   content: 'Hi there! I need assistance with my account.'
    // }
  ]);

  // const handleNewChat = async () => {
  //   // Prompt user for title of new chat, fallback to 'New Chat'
  //   let title = window.prompt('Enter a title for the new chat:', '');
  //   if (title) title = title.trim();
  //   if (!title) return

  //   const response = await axios.post("https://jarvis-ai-chatbot-backend.onrender.com/api/chat",
  //     { title },
  //     { withCredentials: true }
  //   )
  //   getMessages(response.data.chat._id);
  //   dispatch(startNewChat(response.data.chat));
  //   setSidebarOpen(false);
  // }

  const handleNewChat = async () => {
    let title = window.prompt("Enter a title for the new chat:").trim();
    if (!title) return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/`,
        { title },
        { withCredentials: true },
      );
      const chat = response.data?.chat;
      if (!chat || !chat._id) {
        console.error("Invalid chat data received:");
        alert("chat data ?");
        return;
      }

      getMessages(chat._id);
      dispatch(startNewChat(chat));
      setSidebarOpen(false);
    } catch (error) {
      console.error("Failed to create new chat:", error);
      alert("Error creating new chat. Please try again.");
    }
  };

  // Ensure at least one chat exists initially
  // useEffect(() => {
  //   axios
  //     .get("https://jarvis-ai-chatbot-backend.onrender.com/api/chat", { withCredentials: true })
  //     .then((response) => {
  //       dispatch(setChats(response.data.chats.reverse()));
  //     });

  //   const tempSocket = io("https://jarvis-ai-chatbot-backend.onrender.com", {
  //     withCredentials: true,
  //   });

  //   tempSocket.on("ai-response", (messagePayload) => {
  //     console.log("Received AI response:", messagePayload);

  //     setMessages((prevMessages) => [
  //       ...prevMessages,
  //       {
  //         type: "ai",
  //         content: messagePayload.content,
  //       },
  //     ]);

  //     dispatch(sendingFinished());
  //   });

  //   setSocket(tempSocket);
  // }, []);
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/chat/`,
          {
            withCredentials: true,
          },
        );
        dispatch(setChats(response.data.chats.reverse()));
      } catch (e) {
        console.error("Failed to fetch chats:");
      }
    };
    fetchChats();

    const tempSocket = io(import.meta.env.VITE_API_BASE_URL, {
      withCredentials: true,
    });

    tempSocket.on("ai-response", (messagePayload) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "ai",
          content: messagePayload.content,
        },
      ]);

      dispatch(sendingFinished());
    });

    setSocket(tempSocket);

    // Cleanup socket on unmount to prevent memory leaks
    return () => {
      tempSocket.disconnect();
    };
  }, []);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || !activeChatId || isSending) return;
    dispatch(sendingStarted());

    const newMessages = [
      ...messages,
      {
        type: "user",
        content: trimmed,
      },
    ];
    setMessages(newMessages);
    dispatch(setInput(""));

    socket.emit("ai-message", {
      chat: activeChatId,
      content: trimmed,
    });
  };

  const getMessages = async (chatId) => {
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/api/chat/messages/${chatId}`,
      { withCredentials: true },
    );
    setMessages(
      response.data.messages.map((m) => ({
        type: m.type === "user" ? "user" : "ai",
        content: m.content,
      })),
    );
  };
  useEffect(() => {
    if (activeChatId) {
      getMessages(activeChatId);
    }
  }, [activeChatId]);

  const handleSidebarClose = () => setSidebarOpen(false);

  return (
    <div className="chat-layout minimal">
      <ChatMobileBar
        onToggleSidebar={() => setSidebarOpen((o) => !o)}
        onNewChat={handleNewChat}
      />

      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={(id) => {
          if (id !== activeChatId) {
            dispatch(selectChat(id));
            setSidebarOpen(false);
            //getMessages(id);  //  your latest state may not reflect the new value until the next render cycle.
          }
        }}
        onNewChat={handleNewChat}
        open={sidebarOpen}
        onClose={handleSidebarClose}
      />

      <main className="chat-main" role="main">
        <p className="chip">
          {" "}
          • <Link to="/register">👤</Link>{" "}
        </p>
        {messages.length === 0 && (
          <div className="chat-welcome" aria-hidden="true">
            <h1>JARVIS</h1>
            <h1>Select/Create chat to start searching.</h1>
            <p>
              Ask anything. Paste text, brainstorm ideas, or get quick
              explanations. Your chats stay in the sidebar so you can pick up
              where you left off.
            </p>
          </div>
        )}
        <ChatMessages messages={messages} isSending={isSending} />
        {activeChatId && (
          <ChatComposer
            input={input}
            setInput={(v) => dispatch(setInput(v))}
            onSend={sendMessage}
            isSending={isSending}
          />
        )}
      </main>
      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;
