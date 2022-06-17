import TimeAgo from "timeago-react";
import React, { useRef, useEffect } from "react";

const Message = ({ message, currentUser }) => {
  const scrollRef = useRef();

  // this functionality will enable our page to scroll to the bottom if there is a new message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);
  return (
    <div>
      {/* if the message is from the currentUser, it will be aligned to the right side */}
        <div className={`message_wrapper ${message.from === currentUser ? "text-right" : ""}`} ref={scrollRef}>
{/* 
          // if the message is from the currentUser the background will be green */}
      <div className={`message ${message.from === currentUser ? " bg-green-500 rounded-md text-white" : 'bg-white rounded-md'}`}>
       <span> {message.media ? <img src={message.media} alt={message.text} className="xl:w-full w-20 rounded-md" /> : null}</span>
        <span className="xl:text-lg text-sm">{message.text}</span>
        <br />
       <span className="mt-5 text-sm text-gray-600 time"> {<TimeAgo datetime={message.createdAt.toDate()}/>}</span>
      </div>
    </div>
    </div>
  );
};

export default Message;