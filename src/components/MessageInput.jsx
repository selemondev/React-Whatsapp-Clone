import SendButton from "./SendButton";
import { useState, useRef } from "react";
import { db, storage } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  Timestamp,
  setDoc,
  doc
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import data from "@emoji-mart/data"
import Attachment from "./Attachment";
import Emoji from "./Emoji";
const MessageInput = ({ currentUser, chat}) => {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedUser = chat.uid;

    const id = currentUser > selectedUser ? `${currentUser + selectedUser}` : `${selectedUser + currentUser}`;

    let sentImage;
    if (image) {
      const imageReference = ref( storage,`images/${new Date().getTime()}`);
      const snap = await uploadBytes(imageReference, image);
      const downloadImageUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      sentImage = downloadImageUrl;
    }

    await addDoc(collection(db, "messages", id, "chat"), {
      text,
      from: currentUser,
      to: selectedUser,
      createdAt: Timestamp.fromDate(new Date()),
      media: sentImage || "",
    });

    await setDoc(doc(db, "lastMessage", id), {
      text,
      from: currentUser,
      to: selectedUser,
      createdAt: Timestamp.fromDate(new Date()),
      media: sentImage || "",
      unread: true,
    });

    setText("");
    setImage("");
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setText(text + emoji);
  };

  function Picker(props={}) {
    const ref = useRef();
      import ("emoji-mart").then((EmojiMart) => {
        new EmojiMart.Picker({...props, data, ref})
      })

    return <div ref={ref}></div>
  }
    return (
      <div className="w-full">
        <form className="absolute bottom-0 flex items-center xl:ml-2 md:ml-10 sm:ml-6 ml-2 md:bg-[#eee]" onSubmit={handleSubmit}>
        <label htmlFor="image" className="ml-10 hidden md:block">
          <Attachment/>
        </label>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          id="image"
          accept="image/*"
          className="hidden"
        />
        <div className="mx-2 hidden md:block">
          <label htmlFor="emoji" onClick={() => setShowEmojis(!showEmojis)}><Emoji/></label>
          {showEmojis && (
                <div className="absolute w-[40px] left-1 -top-[440px]">
                  <Picker
                  onEmojiSelect={addEmoji}
                  theme="light"
                />
                </div>
              )}
        </div>
       <div className="flex justify-center items-center md:-ml-15 ml-4">
       <div>
          <input
            type="text"
            placeholder="Enter message"
            className="xl:w-[550px] md:w-[300px] w-[200px] sm:w-[180px] md:py-3 md:px-3 py-2 px-2  appearance-none focus:ring-1 focus:ring-green-500 border border-green-500 focus:outline-none rounded-md md:text-md text-sm"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div>
          <button className="xl:py-4 xl:px-4 ml-2 md:py-2 md:px-2 md:bg-green-500 hover:bg-green-600 rounded-full"><SendButton/></button>
        </div>
       </div>
      </form>
      </div>
    );
  };
  
  export default MessageInput;