import React from 'react'

import { FcGoogle } from "react-icons/fc";
import { SiGithub } from "react-icons/si";
import { FaSquareXTwitter } from "react-icons/fa6";

const Login = () => {
  return (
    <div>
        <div className='flex justify-center items-center  p-full h-screen'>
            <div className=" h-[80%] max-w-md p-8 space-y-3 rounded-xl bg-gray-100 text-gray-800">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                <form  action="" className="space-y-6">
                    <div className="space-y-1 text-sm">
                        <label htmlFor="username" className="block dark:text-gray-600">Username</label>
                        <input type="text" name="username" id="username" placeholder="Username" className="w-full px-4 py-3 rounded-md border-gray-300 bg-gray-50 text-gray-800 focus:border-violet-600" />
                    </div>
                    <div className="space-y-1 text-sm">
                        <label htmlFor="password" className="block text-gray-600">Password</label>
                        <input type="password" name="password" id="password" placeholder="Password" className="w-full px-4 py-3 rounded-md border-gray-300 bg-gray-50 text-gray-800 focus:border-violet-600" />
                        <div className="flex justify-end text-xs dark:text-gray-600">
                            <a rel="noopener noreferrer" href="#">Forgot Password?</a>
                        </div>
                    </div>
                    <button  className="block w-full  p-3 text-center rounded-sm text-gray-50 bg-violet-600 active:bg-violet-700">Sign in</button>
                </form>
                <div className="flex items-center pt-4 space-x-1">
                    <div className="flex-1 h-px sm:w-16 dark:bg-gray-300"></div>
                    <p className="px-3 text-sm dark:text-gray-600">Login with social accounts</p>
                    <div className="flex-1 h-px sm:w-16 dark:bg-gray-300"></div>
                </div>
                <div className="flex justify-center space-x-4">
                    <button aria-label="Log in with Google"  className="  p-1 rounded active:bg-gray-500 ">
                    <FcGoogle className='size-6' />
                    </button>
                    <button aria-label="Log in with GitHub" className="p-1 rounded active:bg-gray-500">
                <SiGithub className='size-6'/>
                    </button>
                <button aria-label="Log in with GitHub" className="p-1 rounded active:bg-gray-500">
                <FaSquareXTwitter  className='size-6'/>
                    </button>
                </div>
                <p className="text-xs text-center sm:px-6 dark:text-gray-600">Don't have an account?
                    <a rel="noopener noreferrer" href="#" className="underline dark:text-gray-800">Sign up</a>
                </p>
            </div>
        </div>
    </div>
  )
}

export default Login