"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

async function getotp(email: string) {
  const verifyotp = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/send-otp`, { email });
  console.log("verify otp=",verifyotp?.data?.otp)
  return verifyotp;
}

const verifyotp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    profilePicture: ''
  });
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [serverOtp, setServerOtp] = useState('');
  const [session, setSession] = useState('');
  console.log("verify otp=", verifyotp)
  console.log("Otp from the server=",serverOtp);
  console.log("otp from user=",otp)

  useEffect(() => {
    const localStorageData = localStorage.getItem('formData');
    if (localStorageData) {
      const data = JSON.parse(localStorageData);
      setFormData({
        name: data?.name,
        email: data?.email,
        password: data?.password,
        bio: data?.bio,
        profilePicture: data?.pic
      });

      // Fetch and store the OTP sent by the server
      getotp(data?.email).then((response) => {
        setServerOtp(response.data.otp); // Assuming the OTP is returned in the response
        setSession(response.data.session); // Assuming the session is returned in the response
      }).catch((error) => {
        console.error('Error sending OTP', error);
      });
    }
  }, []);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;

    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input field automatically
      if (index < 5 && value !== '') {
        const nextSibling = document.getElementById(`otp-input-${index + 1}`);
        if (nextSibling) {
          (nextSibling as HTMLInputElement).focus();
        }
      }
    }
  };

  const handleOtpSubmit = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp == serverOtp) {
      try {
        // Perform signup operation
        const signupResponse = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/signup`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            'Authorization': `Bearer ${session}`,
          },
        });

        // Sign in the user using credentials after successful signup
        const res = await signIn("credentials", {
          email: signupResponse.data.email,
          password: formData.password,
          redirect: false,
        });

        if (res?.ok) return router.push("/dashboard/profile");

      } catch (error) {
        console.error('Error during signup', error);
      }
    } else {
      alert("Incorrect OTP. Please try again.");
    }
  };

  return (
<div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Verify OTP</h1>
      <p className="text-gray-700 mb-6">We have sent an OTP to your email: {formData.email}</p>
      <div className="flex space-x-2 mb-4">
        {otp.map((digit, index) => (
          <input
            key={index}
            id={`otp-input-${index}`}
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            value={digit}
            onChange={(e) => handleOtpChange(e, index)}
          />
        ))}
      </div>
      <button
        onClick={handleOtpSubmit}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
      >
        Submit OTP
      </button>
    </div>
  );
}

export default verifyotp;
