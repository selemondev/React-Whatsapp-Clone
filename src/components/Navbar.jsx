import Logo from "../assets/Whatsapp-logo/whatsapp.png";
import { auth, db } from '../firebase/firebaseConfig';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { updateDoc, doc } from "firebase/firestore";
const Navbar = () => {
  const navigate = useNavigate();
  const currentUser = auth.currentUser.uid;
  // logging out the user
  const handleSignOut = async () => {
      await signOut(auth);
      // if our user logs out, we update our database by setting online to false
      await updateDoc(doc(db, "users", currentUser), {
        online: false,
      });
      navigate("/")
  }
  return (
    <div>
        <header>
            <nav className='flex justify-between items-center p-2 bg-white border-b border-gray-200'>
                <div>
                    <img src={Logo} alt="Whatsapp Logo" className='w-10 h-10' />
                </div>

                <div>
                <button onClick={handleSignOut} type="button" class="focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-bold rounded-lg text-sm py-2.5 px-5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Log Out</button>
                </div>
            </nav>
        </header>
    </div>
  )
}

export default Navbar