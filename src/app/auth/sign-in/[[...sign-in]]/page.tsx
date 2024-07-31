'use client';

import * as React from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function SignInForm() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const router = useRouter();

    // Handle the submission of the sign-in form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLoaded) {
            return;
        }

        // Start the sign-in process using the email and password provided
        try {
            const signInAttempt = await signIn.create({
                identifier: email,
                password,
            });

            // If sign-in process is complete, set the created session as active
            // and redirect the user
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.push('/');
            } else {
                // If the status is not complete, check why. User may need to
                // complete further steps.
                console.error(JSON.stringify(signInAttempt, null, 2));
            }
        } catch (err: any) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.error(JSON.stringify(err, null, 2));
        }
    };

    // Display a form to capture the user's email and password
    return (
        <div className='border border-blue-400 rounded-md p-10 flex flex-col gap-10'>
            <h1 className='text-3xl font-bold text-blue-500'>Sign in</h1>
            <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col gap-6'>
                <div className='flex flex-col'>
                    <label htmlFor="email">Enter email address</label>
                    <input
                        onChange={(e) => setEmail(e.target.value)}
                        id="email"
                        name="email"
                        type="email"
                        className='rounded-md p-2 text-black'
                        value={email}
                    />
                </div>
                <div className='flex flex-col'>
                    <label htmlFor="password">Enter password</label>
                    <input
                        onChange={(e) => setPassword(e.target.value)}
                        id="password"
                        name="password"
                        type="password"
                        className='rounded-md p-2 text-black'
                        value={password}
                    />
                </div>
                <button type="submit" className='p-2 rounded-md bg-blue-400 w-full'>Sign in</button>
            </form>
        </div>
    );
}