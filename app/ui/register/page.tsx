"use client";

import { FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BiLogoGoogle } from 'react-icons/bi';
import { BiSolidShow } from 'react-icons/bi';
import { BiSolidHide } from 'react-icons/bi';

const Signup = () => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();
  console.log("Session=", session)
  const labelStyles = "w-full text-sm text-black";

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("bio", bio);

      console.log("formData", formData)

      // Convert FormData to a plain object for storage
      const formDataObject: { [key: string]: any } = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
      });


      // Store the formData in localStorage with a 10-minute expiration
      const expirationInMinutes = 5;
      const expirationDate = new Date().getTime() + expirationInMinutes * 60 * 1000;
      localStorage.setItem(
        "formData",
        JSON.stringify({ value: formDataObject, expiration: expirationDate })
      );

      // Send OTP request
      const generateOtp = await axios.post(`/api/auth/send-otp`, { email });
      console.log(generateOtp.data.message);

      // Redirect to the OTP verification page
      router.push("/verifyotp");

    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        const errorMessage = error.response?.data.message;
        setError(errorMessage);
      }
    }
  };


  return (
    <section className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 via-pink-50 to-blue-100">
      <form
        onSubmit={handleSubmit}
        className="p-6 xs:p-10	w-full max-w-[350px] flex flex-col justify-between items-center gap-2.5	
        border border-solid border-[#242424] bg-[#0a0a0a] rounded-lg bg-gradient-to-l from-pink-100 via-pink-50 to-blue-100"
      >
        {error && <div className="">{error}</div>}
        <h1 className="mb-5 w-full text-2xl	font-bold text-black">Signup</h1>

        <label className={labelStyles}>Username:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Fullname"
          className="w-full h-8 border border-solid border-[#242424] py-1 px-2.5 rounded bg-white text-[13px] text-black"
          name="name"
        />

        <label className={labelStyles}>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full h-8 border border-solid border-[#242424] py-1 px-2.5 rounded bg-white text-[13px]"
          name="email"
        />

        <label className={labelStyles}>Password:</label>
        <div className="flex w-full">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full h-8 border border-solid border-[#242424] py-1 px-2.5 rounded-l bg-white text-[13px] text-black"
            name="password"
          />
          <button
            className="w-2/12	border-y border-r border-solid border-[#242424] bg-white rounded-r 
            flex items-center justify-center transition duration-150 ease hover:bg-[#1A1A1A]"
            onClick={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
          >
            {showPassword ? <BiSolidHide /> : <BiSolidShow />}
          </button>
        </div>

        <label className={labelStyles}>Bio:</label>
        <input
          type="text"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Not compulsory"
          className="w-full h-8 border border-solid border-[#242424] py-1 px-2.5 rounded bg-white text-[13px]"
          name="bio"
        />

        <button className="w-full bg-black border border-solid border-[#242424] py-1.5 mt-2.5 rounded
        transition duration-150 ease hover:bg-[#1A1A1A] text-[13px] text-white">
          Signup
        </button>

        <div className="w-full h-10	relative flex items-center justify-center">
          <div className="absolute h-px w-full top-2/4 bg-[#242424]"></div>
          <p className="w-8	h-6 bg-[#0a0a0a] z-10 flex items-center justify-center text-white">or</p>
        </div>

        <button
          className="flex py-2 px-4 text-sm	align-middle items-center rounded text-999 bg-black 
          border border-solid border-[#242424] transition duration-150 ease hover:bg-[#1A1A1A] gap-3 text-white"
          onClick={() => signIn("google")}>
          <BiLogoGoogle className="text-2xl" /> Sign in with Google
        </button>
        <Link href="/ui/login" className="text-sm	text-[#888] transition duration-150 ease text-black hover:text-blue-800">
          Already have an account?
        </Link>
      </form>
    </section>
  );
}

export default Signup;
