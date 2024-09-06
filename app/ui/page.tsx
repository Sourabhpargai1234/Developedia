"use client";
import React, { useState, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession, signIn } from 'next-auth/react';

const OtpInput: React.FC = () => {
    const { data: session } = useSession(); // Access the session object
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']); // Array to handle each input field
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Refs for OTP input fields
    const router = useRouter(); // Initialize the router for navigation

    const handleSubmit = async () => {
        // Combine the OTP array into a single string
        const userEnteredOtp = otp.join('');
        try {
            // Retrieve the formData from localStorage
            const storedData = localStorage.getItem("formData");
            if (!storedData) {
                throw new Error("No form data found in localStorage.");
            }

            // Parse the stored data
            const { value: formDataObject, expiration } = JSON.parse(storedData);
            
            // Check if the stored data has expired
            if (new Date().getTime() > expiration) {
                throw new Error("Stored form data has expired.");
            }

            // Add the OTP to the formData object
            formDataObject.otp = userEnteredOtp;

            // Create a new FormData object to properly handle multipart data
            const formData = new FormData();
            formData.append("name", formDataObject.name);
            formData.append("email", formDataObject.email);
            formData.append("password", formDataObject.password);
            formData.append("bio", formDataObject.bio || "");
            formData.append("otp", userEnteredOtp);

            // Send a POST request with the OTP and other form data
            const signupResponse = await axios.post(`/api/auth/signup`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': `Bearer ${session}`,
                },
            });
            console.log("Data=", signupResponse.data);

            // Sign in the user after successful OTP verification
            const res = await signIn("credentials", {
                email: signupResponse.data.email,
                password: formDataObject.password, // Use the actual password you received
                redirect: false,
            });

            // Navigate to the profile page if the login is successful
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

            // Automatically move focus to the next input field
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
        if (/^\d{6}$/.test(pastedData)) { // Expecting a 6-digit OTP
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
        <div className="flex justify-center flex-col items-center h-screen">
            <div className='gap-2 flex mb-4'>
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
            </div>
            <button onClick={handleSubmit} className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded">
                Submit
            </button>
        </div>
    );
};

export default OtpInput;
