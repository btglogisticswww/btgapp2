'use client';
import { useGoogleFont } from '../utils/fonts'
import React from "react"

export default function LoginScreen() {
  const fontFamily = useGoogleFont('Inter')
  
  return (
    <div className="relative flex h-screen w-full bg-gray-50 overflow-hidden" style={{ fontFamily }}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="https://uxcanvas.ai/api/generated-images/8ad16188-f458-49ad-aeb6-a17593e5c468/34a1c136-5935-4ca5-a09a-81f555edf773" 
          alt="Logistics background pattern" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto px-4 sm:px-6 py-6 z-10">
        {/* Logo with burgundy background */}
        <div className="mb-8 w-full bg-[#8B0000] py-4 px-5 rounded-t-lg shadow-md border-b border-[#6B0000]">
          <div className="flex items-center">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-white">БТГ</span>
              <span className="text-white ml-1">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-white">
                  <path d="M12 4V20M4 12H20" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <div className="ml-3">
              <p className="text-white text-xs tracking-wider uppercase">WORLDWIDE</p>
              <p className="text-white text-xs tracking-wider uppercase">LOGISTICS</p>
            </div>
          </div>
        </div>
        
        {/* Login Form */}
        <div className="w-full bg-white shadow-md p-5 sm:p-6 border-x border-gray-200">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-5 sm:mb-6 text-center">Вход в систему</h2>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="example@btg-logistics.eu"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                  Пароль
                </label>
                <a href="#" className="text-xs text-red-500 hover:underline cursor-pointer">
                  Забыли пароль?
                </a>
              </div>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-800">
                Запомнить меня
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-black transition duration-300 cursor-pointer"
            >
              Войти
            </button>
          </form>
        </div>
        
        {/* User area with burgundy background */}
        <div className="w-full mt-5 bg-[#8B0000] rounded-b-lg p-4 shadow-md">
          {/* Language Selector */}
          <div className="flex justify-center space-x-4 text-sm text-white">
            <button className="font-medium underline cursor-pointer">Русский</button>
            <button className="hover:underline cursor-pointer">English</button>
            <button className="hover:underline cursor-pointer">Deutsch</button>
          </div>
          
          {/* Footer */}
          <div className="mt-4 text-center text-xs text-white">
            <p>© 2023 БТГ+ WORLDWIDE LOGISTICS. Все права защищены.</p>
            <p className="mt-1">Международная транспортно-логистическая компания</p>
          </div>
        </div>
      </div>
    </div>
  )
}