import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase/firebaseConfig";
import MessageInput from "../components/MessageInput";
import LeftArrow from "../components/LeftArrow";
import TimeAgo from "timeago-react";
import { Link } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import Message from "../components/Message";
import Sidebar from "../components/Sidebar";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [ search, setSearch ] = useState("")
  const [messages, setMessages] = useState([]);

  const currentUser = auth.currentUser.uid;

  useEffect(() => {
    const usersReference = collection(db, "users");
    // we create a query object and then we find all the users that are not online
    const q = query(usersReference, where("uid", "not-in", [currentUser]));
    const unsubscribe= onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsubscribe();
  }, []);

  const selectUser = async (user) => {
    setChat(user);

    const selectedUser = user.uid;

    // all the conversation between the currentUser and the selectedUser will be stored in this id
    const id = currentUser > selectedUser ? `${currentUser + selectedUser}` : `${selectedUser + currentUser}`;

    const messagesReference = collection(db, "messages", id, "chat");
    const q = query(messagesReference, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let messages = [];
      querySnapshot.forEach((doc) => {
        messages.push(doc.data());
      });
      setMessages(messages);
    });

    // we get the last messages between the currentUser and the selectedUser
    const docSnap = await getDoc(doc(db, "lastMessage", id));
    // if the last message is not from the currentUser the unread will be false
    if (docSnap.data() && docSnap.data().from !== currentUser) {
      // update last message document and set unread to false
      await updateDoc(doc(db, "lastMessage", id),{ 
        unread: false 
      });
    }
  };
  return (
    <div className="min-h-screen w-full grid grid-cols-5 relative">
      <div className="xl:col-span-2 w-full h-full bg-white">
        <div className="flex items-center m-2 pl-2 cursor-pointer hover:text-green-600">
          <span className=" xl:block hidden"><Link to='/profile'><LeftArrow/></Link></span>
          <h3 className="font-bold ml-2  xl:block hidden"><Link to="/profile">Profile </Link></h3>
        </div>
  <form className="xl:grid xl:place-items-center hidden">   
    <div class="relative">
        <div class="flex absolute inset-y-0 left-0 items-center pl-3 mt-3 pointer-events-none">
            <svg class="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input type="search" class="appearance-none block py-2 px-2 pl-10 mt-3  xl:w-96 w-48 text-sm bg-gray-50 rounded-lg border border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 " placeholder="Search or start a new Chat" onChange={(e) => setSearch(e.target.value)}/>
    </div>
</form>
        {users.filter((user) => user.Username.toLowerCase().includes(search)).map((user) => (
          <Sidebar
            key={user.uid}
            user={user}
            selectUser={selectUser}
            currentUser={currentUser}
          />
        ))}
      </div>

      <div className="xl:col-span-3 md:col-span-4 col-span-4 h-full w-full bg-[#F5F2EC]">
      <div className="relative min-h-screen w-full">
        {chat ? (
          <>
            <div className="messages_user bg-[#FFFFFF]">
             <div className="flex ml-2">
             <img src={chat.avatar} className="w-10 h-10 rounded-full ml-2" />
              <div>
              <h3 className="font-bold ml-2">{chat.Username}</h3>
              <div className="ml-2 text-gray-500 md:text-md text-sm">{ chat.online ? (<p>Online</p>) : (<p>Last Seen : {<TimeAgo datetime={chat?.createdAt.toDate()} />}</p>)}</div>
              </div>
             </div>
            </div>
            <div className="message_container overflow-y-auto">
              {messages.length
                ? messages.map((message, i) => (
                    <Message key={i} message={message} currentUser={currentUser} />
                  ))
                : null}
            </div>
            <MessageInput
              currentUser={currentUser}
              chat={chat}
            />
          </>
        ) : (

          <div className="flex justify-center items-center mt-64 md:mt-72">
             <h3 className="font-bold text-sm md:text-lg">Select a user to start conversation</h3>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Home;