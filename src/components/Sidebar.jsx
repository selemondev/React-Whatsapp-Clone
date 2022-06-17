import React, { useEffect, useState } from "react";
import TimeAgo from "timeago-react";
import PlaceHolder from "../assets/Whatsapp-Img/Profile Placeholder.png";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
const Sidebar = ({ currentUser, user, selectUser}) => {
  const selectedUser = user?.uid;
  const [data, setData] = useState("");
  useEffect(() => {
    const id = currentUser > selectedUser ? `${currentUser + selectedUser}` : `${selectedUser + currentUser}`;
    let unsubscribe = onSnapshot(doc(db, "lastMessage", id), (doc) => {
      setData(doc.data());
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
     <div onClick={() => selectUser(user)} className="cursor-pointer">
  <div class="flex items-center space-x-4 mt-2 ml-2 hover:bg-gray-100 rounded-sm py-2 px-2">
  <div class="relative">
    <img class="w-10 h-10 rounded-full" src={user.avatar || PlaceHolder} alt="" />
    {user?.online ? (<span class="bottom-0 left-7 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></span>) : (<span class="bottom-0 left-7 absolute  w-3.5 h-3.5 bg-red-400 border-2 border-white rounded-full"></span>)}
</div>
    <div class="space-y-1 font-medium dark:text-white hidden xl:block">
        <div className="flex justify-between items-center w-[430px]">
        <h2 className="xl:text-lg font-bold">{user.Username}</h2>
        <p className="text-sm">{<TimeAgo datetime={data?.createdAt?.toDate()} />}</p>
        </div>
        <div class="text-sm flex justify-between items-center">
        <div>{data && (
          <div className=" flex items-center">
            <p className="mr-2">{data.from === currentUser ? "Me:" : null}</p>
            <p>{data.text}</p>
          </div>
        )}</div>

        <div>
        {data?.from !== currentUser && data?.unread ? (<p className="h-6 w-6 pt-[2px] text-white text-center rounded-full bg-green-500">1</p>) : (<p><i class="fa fa-check-double text-blue-500"></i></p>)}
        </div>
        </div>
    </div>
</div>
     </div>
    </>
  );
};

export default Sidebar;