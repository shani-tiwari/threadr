import './ChatSidebar.css';
import { useDispatch } from 'react-redux';
import { deleteChat } from '../../store/chatSlice';


const ChatSidebar = ({ chats, activeChatId, onSelectChat, onNewChat, open , onClose}) => {
  const dispatch = useDispatch();

  // Handler to delete chat
  const handleDeleteChat = (chatId) => {
    dispatch(deleteChat(chatId));
    // Optionally, add backend deletion logic here
  };

  return (
    <aside className={"chat-sidebar " + (open ? 'open' : '')} aria-label="Previous chats">
      <span className="close-bar" onClick={onClose} role="button" tabIndex={0} aria-label="Close chats sidebar">
        ❌
      </span>      
      <div className="sidebar-header">
        <h2>Chats</h2>
        <button className="small-btn" onClick={onNewChat}>New</button>
      </div>

      <nav className="chat-list" aria-live="polite">
        {chats.map(c => (
          // console.log(c.id),
          <div  key={c.id || c._id} className='chat-list-items  '>
            <button
              className={"chat-list-item " + ((c.id || c._id) === activeChatId ? 'active' : '')}
              onClick={() => onSelectChat(c.id || c._id)}
            >
              <span className="title-line">{c.title}</span>
            </button>
            <button
              className="chat-delete-btn "
              onClick={() => handleDeleteChat(c.id || c._id)}
              aria-label={`Delete chat ${c.title}`}
            >
              ❌
            </button>
          </div>
        ))}
        {chats.length === 0 && <p className="empty-hint">No chats yet.</p>}
      </nav>

    </aside>
  );
};

export default ChatSidebar;