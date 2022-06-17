import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Placeholder from "../assets/Whatsapp-Img/Profile Placeholder.png";
import Camera from '../components/Camera';
import { getDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import { auth, db, storage } from '../firebase/firebaseConfig';
import Pencil from '../components/Pencil';
import { useNavigate } from 'react-router-dom';
const Profile = () => {
  const [profileImg, setProfileImg] = useState("");
  const [ user, setUser] = useState(null);
  const [ loading, setLoading] = useState(false);
  const [ bio, setBio] = useState('Hey there, I am using Whatsapp');
  const navigate = useNavigate();

  // we use getDoc to get all our data once
  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if(docSnap.exists()) {
        setUser(docSnap.data())
      }
    });


    // if profileImg has been selected then we upload our image to firebase storage
    if(profileImg) {
      const uploadProfileImg = async () => {
        const imageRef = ref(storage, `avatar/${new Date().getTime()}`);
        try {
          // if an image already exists, we delete the previous image so as to upload the new one
          if(user.avatarPath) {
            await deleteObject(ref(storage, user.avatarPath))
          }

          const snap = await uploadBytes(imageRef, profileImg);
          const profileImageUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));

          // after uploading our image to the firebase storage, we update our users collection with our new profile image
          // we need the avatarPath so that we can be able to delete our profile image if needed
          await updateDoc(doc(db, "users", auth.currentUser.uid), {
            avatar: profileImageUrl,
            avatarPath: snap.ref.fullPath
          });

          setProfileImg("")
        } catch(err) {
          console.log(err.message)
        }
      };
      uploadProfileImg()
    }
  }, [profileImg]);


  // here we delete the profile image
  const deleteProfileImage = async () => {
    setLoading(true);
    try {
      await deleteObject(ref(storage, user.avatarPath));

      // after we delete our profile we update our firestore database and set the avatar and the avatarpath to null or empty
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        avatar: "",
        avatarPath: ""
      });

      setLoading(false);

    } catch(err) {
      console.log(err.message)
    }
  };

  const handleSubmit = async () => {
    try {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        bio
      });
      navigate("/chat")

    } catch(error) {
      console.log(error.message)
    }
  }
  return user ? (
    (
      <div>
        <div>
        <Navbar/>
        </div>
        <div className='grid place-items-center'>
          <div className='max-w-sm md:w-96 w-72 mt-2'>
            <form className='bg-white shadow-sm rounded-sm w-full px-6 py-4 border border-gray-200'>
              <div className='grid place-items-center py-2'>
                <h3 className='font-bold text-green-500 text-2xl'>Set Up Your Profile</h3>
              </div>
              <div className='grid place-items-center relative group'>
                <label htmlFor="photo" className='opacity-0 group-hover:opacity-100 duration-300 absolute left-0 top-50 right-0 z-10 flex justify-center items-end text-xl text-black'>
                  <Camera/>
                </label>
                <img src={user?.avatar || Placeholder} alt="profile-placeholder" className='h-48 w-48 rounded-full' />
                <input
                  type="file"
                  accept="image/*"
                  className='hidden'
                  id="photo"
                  onChange={(e) => setProfileImg(e.target.files[0])}
                />
                {user?.avatar ? <p className='text-red-500 font-bold mt-2 cursor-pointer hover:text-red-600' onClick={deleteProfileImage}>{ loading ? <p>Deleting.......</p> : <p>Delete Profile Picture?</p> }</p> : null}
              </div>
  
              <div className='mt-3'>
                <label htmlFor="Username" className='flex justify-between items-center'>
                  <span className='font-bold'>Username</span>
                  <span><Pencil/></span>
                </label>
                <h3 className='mt-2'>{user.Username}</h3>
              </div>

              <div className='mt-3'>
                <label htmlFor="Username" className='flex justify-between items-center'>
                  <span className='font-bold'>Bio</span>
                  <span><Pencil/></span>
                </label>
                <input type="text" placeholder={bio} value={bio} onChange={(e) => setBio(e.target.value)} className='input'/>
              </div>

              <div className='mt-4'>
                <button type='button' onClick={handleSubmit} className='w-full py-2 px-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-bold'>Start Chat</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  ) : null;
}

export default Profile