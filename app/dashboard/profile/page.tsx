"use client";
import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession, signIn } from 'next-auth/react';

const OtpInput: React.FC = () => {
    const { data: session } = useSession();
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']); 
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]); 
    const router = useRouter();

    const handleSubmit = async () => {
        const userEnteredOtp = otp.join('');
        try {
            const storedData = localStorage.getItem("formData");
            if (!storedData) {
                throw new Error("No form data found in localStorage.");
            }

            const { value: formDataObject, expiration } = JSON.parse(storedData);


            if (new Date().getTime() > expiration) {
                throw new Error("Stored form data has expired.");
            }

            formDataObject.otp = userEnteredOtp;

            const signupResponse = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/signup`, formDataObject, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${session}`,
                },
            });
            console.log("Data=", signupResponse.data);


            const res = await signIn("credentials", {
                email: signupResponse.data.email,
                password: formDataObject.password, // Use the actual password you received
                redirect: false,
            });


            if (res?.ok) return router.push("/dashboard/profile");
        } catch (error: any) {
            console.log("Error:", error.message || error);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if (/^[0-9]$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < otp.length - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && otp[index] === '') {
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handlePaste = (e: ClipboardEvent) => {
        const pastedData = e.clipboardData?.getData('text') || '';
        if (/^\d{6}$/.test(pastedData)) { 
            const newOtp = pastedData.split('');
            setOtp(newOtp);
        }
    };

    useEffect(() => {
        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('paste', handlePaste);
        };
    }, []);

    return (
        <div className="flex gap-2">
            {otp.map((value, index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el; }} // Ensure the function returns void
                    type="text"
                    value={value}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    maxLength={1}
                    className="w-12 h-12 text-center text-xl border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                />
            ))}
            <button onClick={handleSubmit} className="cursor-pointer ml-4 px-4 py-2 bg-blue-500 text-white rounded">
              Submit otp
            </button>
        </div>
    );
};

export default OtpInput;
