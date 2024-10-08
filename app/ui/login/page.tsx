"use client";

import { FormEvent, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { BiLogoGoogle } from 'react-icons/bi';
import { BiSolidShow } from 'react-icons/bi';
import { BiSolidHide } from 'react-icons/bi';

const Signin = () => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const labelStyles = "w-full text-sm text-black";
  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard/profile");
    }
  }, [session, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.error) {
      setError(res.error as string)
    };

    if (!res?.error) {
      return router.push("/")
    };
  };

  return (
    <section className="w-full h-screen flex items-center justify-center bg-gradient-to-r from-pink-100 via-pink-50 to-blue-100">
      <form
        className="p-6 xs:p-10	w-full max-w-[350px] flex flex-col justify-between items-center gap-2.5	
        border border-solid border-[#242424] bg-[#0a0a0a] rounded bg-gradient-to-l from-pink-100 via-pink-50 to-blue-100 rounded-lg"
        onSubmit={handleSubmit}
      >
        {error && <div className="">{error}</div>}
        <h1 className="mb-5 w-full text-black text-2xl font-bold">Signin</h1>

        <label className={labelStyles}>Email:</label>
        <input
          type="email"
          placeholder="Email"
          className="w-full h-8 border border-solid border-[#242424] py-1 px-2.5 rounded bg-white text-[13px] text-black"
          name="email"
        />

        <label className={labelStyles}>Password:</label>
        <div className="flex w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full h-8 border border-solid border-[#242424] py-1 px-2.5 rounded-l bg-white text-[13px] text-black"
            name="password"
          />
          <button
            className="w-2/12	border-y border-r border-solid border-[#242424] bg-black rounded-r 
          flex items-center justify-center transition duration-150 ease   bg-white"
            onClick={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword)
            }}
          >
            {showPassword ? <BiSolidHide /> : <BiSolidShow />}
          </button>
        </div>
        <button className="w-full bg-black border border-solid border-[#242424] py-1.5 mt-2.5 rounded
        transition duration-150 ease hover:bg-[#1A1A1A] text-[13px] text-white"
        >
          Signup
        </button>

        <div className="w-full h-10	relative flex items-center justify-center">
          <div className="absolute h-px w-full top-2/4 bg-[#242424]"></div>
          <p className="w-8	h-6 bg-[#0a0a0a] z-10 flex items-center justify-center text-white">or</p>
        </div>

        <button
          className="flex py-2 px-4 text-sm	align-middle items-center rounded text-999 bg-black text-white
          border border-solid border-[#242424] transition duration-150 ease hover:bg-[#1A1A1A] gap-3"
          onClick={(e) => {
            e.preventDefault();
            signIn("google")
          }}>
          <BiLogoGoogle className="text-2xl text-white" /> Sign in with Google
        </button>
        <Link href="/ui/register" className="text-sm hover:text-blue-800 text-[#888] transition duration-150 ease text-black">
          Don&apos;t have an account?
        </Link>
      </form>
    </section>
  );
}

export default Signin;
