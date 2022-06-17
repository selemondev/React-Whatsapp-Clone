import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Img from "../assets/Whatsapp-Img/whatsapp-img.png";
import Logo from "../assets/Whatsapp-logo/whatsapp.png";
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, Timestamp } from "firebase/firestore";
const Register = () => {
  const [ loading, setLoading ] = useState(false)
  const navigate = useNavigate();

  // handling our form using formik
    const formik = useFormik({
        initialValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        },

        validationSchema: Yup.object({
            username: Yup.string().required("Username is required"),
            email: Yup.string().email("Invalid email address").required("Email is required"),
            password: Yup.string().min(8, "Password must be of 8 characters or more").required("Password is required"),
            confirmPassword: Yup.string().oneOf([Yup.ref("password"), null],"Passwords do not match" ).required("Please re-type your password")
        }),

        onSubmit: () => {
            handleRegister()
        }

    });

    const Username = formik.values.username;
    const Email = formik.values.email;
    // registering our user using firebase version 9
    const handleRegister = async () => {
      setLoading(true)
      try {
        const response = await createUserWithEmailAndPassword(auth, formik.values.email, formik.values.password);
        // keeping our user info in the database for later use
        await setDoc(doc(db, "users", response.user.uid), {
          uid: response.user.uid,
          Username,
          Email,
          createdAt: Timestamp.fromDate(new Date()),
          online: true
        });

        setLoading(false);
        // after everything has been completed and there is no error, we navigate our user to the profile page
        navigate("/profile")
      } catch(err) {
        console.log(err.message)
      }
    }
  return (
    <div className='min-h-screen w-full grid grid-cols-2'>
      <div className='md:w-full md:h-full col-span-3 sm:col-span-1'>
        <header>
          <nav>
            <ul className='flex justify-between items-center p-3'>
              <li className='li-tag'>Web Version</li>
              <li className='li-tag'>Features</li>
              <li className='li-tag'>Help</li>
              <li className='li-tag'>Security</li>
            </ul>
          </nav>
        </header>

        <div className='grid place-items-center'>
          <div className='max-w-sm sm:w-80 w-72 md:mt-6 mt-4'>
            <form className='bg-white shadow-sm rounded-sm w-full px-6 py-4 border border-gray-200' onSubmit={formik.handleSubmit}>
              <div className='grid place-items-center'>
                <img src={Logo} alt="Whatsapp Logo" className='w-14 h-14 mb-3'/>
              </div>
              <div className='sm:pb-4 pb-3'>
                <label htmlFor="Username" className='label'>Username</label>
                <input onBlur={formik.handleBlur} type="text" placeholder='Username' id='username' name='username' value={formik.values.username} className='input' onChange={formik.handleChange} />
                {formik.touched.username && formik.errors.username ? <p className='error'>{formik.errors.username}</p> : null}
              </div>

              <div className='sm:pb-4 pb-3'>
                <label htmlFor="Email" className='label'>Email</label>
                <input onBlur={formik.handleBlur} type="email" placeholder='Email' id='email' name='email' value={formik.values.email} className='input' onChange={formik.handleChange} />
                {formik.touched.email && formik.errors.email? <p className='error'>{formik.errors.email}</p> : null}
              </div>

              <div className='sm:pb-4 pb-3'>
                <label htmlFor="Password" className='label'>Password</label>
                <input onBlur={formik.handleBlur} type="password" placeholder='Password' id="password" name='password' value={formik.values.password} className='input' onChange={formik.handleChange}/>
                {formik.touched.password && formik.errors.password ? <p className='error'>{formik.errors.password}</p> : null}
              </div>

              <div className='sm:pb-4 pb-3'>
                <label htmlFor="confirmPassword" className='label'>ConfirmPassword</label>
                <input onBlur={formik.handleBlur} type="password" placeholder='ConfirmPassword' id="confirmPassword" name="confirmPassword" value={formik.values.confirmPassword} className='input' onChange={formik.handleChange} />
                {formik.touched.confirmPassword && formik.errors.confirmPassword ? <p className='error'>{formik.errors.confirmPassword}</p> : null}
              </div>

              <div>
                <button type='submit' className='w-full bg-green-500 hover:bg-green-600 py-2 px-2 font-bold rounded-md text-white'>
                  {loading ? <p>Signing Up....</p>: <p>Sign Up</p>}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className='bg-[#1F342F] md:w-full md:h-full md:grid md:place-items-center hidden sm:block'>
        <div>
          <img src={Img} alt="Whatsapp" className='w-80 h-full'/>
        </div>
      </div>
    </div>
  )
}

export default Register