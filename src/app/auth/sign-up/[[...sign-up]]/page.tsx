'use client';

import * as React from 'react';
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { client } from '@/lib/prisma';

export default function Page() {
    const { isLoaded, signUp, setActive } = useSignUp();
    const [emailAddress, setEmailAddress] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [verifying, setVerifying] = React.useState(false);
    const [code, setCode] = React.useState('');
    const router = useRouter();

    // Handle submission of the sign-up form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLoaded) return;

        // Start the sign-up process using the email and password provided
        try {
            const signUpData = {
                emailAddress,
                password
            };

            await signUp.create(signUpData);

            // Send the user an email with the verification code
            await signUp.prepareEmailAddressVerification({
                strategy: 'email_code',
            });

            // Set 'verifying' true to display second form
            // and capture the OTP code
            setVerifying(true);
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2));
        }
    };

    // Handle the submission of the verification form
    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLoaded) return;

        try {
            // Use the code the user provided to attempt verification
            const completeSignUp = await signUp.attemptEmailAddressVerification({
                code,
            });

            // If verification was completed, set the session to active
            // and redirect the user
            if (completeSignUp.status === 'complete') {

                console.log("Organization created!")

                await setActive({ session: completeSignUp.createdSessionId });
                router.push('/dashboard');
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(completeSignUp, null, 2));
            }
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error('Error:', JSON.stringify(err, null, 2));
        }
    };

    // Display the verification form to capture the OTP code
    if (verifying) {
        return (
            <div className='border border-blue-400 rounded-md p-10 flex flex-col gap-10'>
                <h1 className='text-3xl font-bold text-blue-500'>Verify your email</h1>
                <form onSubmit={handleVerify} className='flex flex-col gap-6'>
                    <label id="code">Enter your verification code</label>
                    <input
                        value={code}
                        id="code"
                        name="code"
                        className='rounded-md p-2 text-black'
                        onChange={(e) => setCode(e.target.value)}
                    />
                    <button type="submit" className='p-2 rounded-md bg-blue-400 w-full'>Verify</button>
                </form>
            </div>
        );
    }

    // Display the initial sign-up form to capture the email, password, and organization details
    return (
        <div className='border border-blue-400 rounded-md p-10 flex flex-col gap-10'>
            <h1 className='text-3xl font-bold text-blue-500'>Sign up</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                <div className='flex flex-col'>
                    <label htmlFor="email">Enter email address</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        className='rounded-md p-2 border border-blue-400 text-black'
                        value={emailAddress}
                        onChange={(e) => setEmailAddress(e.target.value)}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="password">Enter password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        className='rounded-md p-2 border border-blue-400 text-black'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <button type="submit" className='p-2 rounded-md bg-blue-400 w-full'>Next</button>
                </div>
            </form>
        </div>
    );
}
