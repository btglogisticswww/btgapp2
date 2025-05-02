'use client';
import { useGoogleFont } from '../utils/fonts'
import Components from "../components"
import React from "react"

export default function DashboardScreen() {
  const fontFamily = useGoogleFont('Inter')
  
  return (
    <Components.MainLayout title="Главная">
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <a 
            href="#" 
            className="border-b-2 border-[#8B0000] py-4 px-1 text-sm font-medium text-[#8B0000] cursor-pointer"
          >
            Обзор
          </a>
          <a 
            href="#" 
            className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer"
          >
            Задачи
          </a>
          <a 
            href="#" 
            className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer"
          >
            Активные заказы
          </a>
          <a 
            href="#" 
            className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 cursor-pointer"
          >
            Финансы
          </a>
        </nav>
      </div>
      
      {/* Key Performance Indicators */}
      <section>
        <h2 className="text-lg font-semibold text-[#8B0000] mb-4">Ключевые показатели</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start">
              <div className="p-2 rounded-md bg-red-50 text-[#8B0000]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Активные заказы</h3>
                <div className="mt-1">
                  <p className="text-2xl font-semibold text-gray-900">24</p>
                  <p className="text-sm text-gray-500">В работе сейчас</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Finances */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start">
              <div className="p-2 rounded-md bg-red-50 text-[#8B0000]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Финансы</h3>
                <div className="mt-1">
                  <p className="text-2xl font-semibold text-gray-900">1 200 000 ₽</p>
                  <p className="text-sm text-gray-500">Оборот за месяц</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Completed */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start">
              <div className="p-2 rounded-md bg-red-50 text-[#8B0000]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Выполнено</h3>
                <div className="mt-1">
                  <p className="text-2xl font-semibold text-gray-900">18</p>
                  <p className="text-sm text-gray-500">Заказов за неделю</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tasks */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start">
              <div className="p-2 rounded-md bg-red-50 text-[#8B0000]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 14l2 2 4-4" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Задачи</h3>
                <div className="mt-1">
                  <p className="text-2xl font-semibold text-gray-900">5</p>
                  <p className="text-sm text-gray-500">Требуют внимания</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Activity Graph */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-[#8B0000] mb-4">График активности</h2>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="h-64">
            <div className="flex items-end justify-between h-48">
              <div className="w-1/24 mx-1">
                <div className="bg-[#333333] h-16 w-6 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center mt-2">Пн</div>
              </div>
              <div className="w-1/24 mx-1">
                <div className="bg-[#333333] h-32 w-6 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center mt-2">Вт</div>
              </div>
              <div className="w-1/24 mx-1">
                <div className="bg-[#333333] h-24 w-6 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center mt-2">Ср</div>
              </div>
              <div className="w-1/24 mx-1">
                <div className="bg-[#333333] h-40 w-6 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center mt-2">Чт</div>
              </div>
              <div className="w-1/24 mx-1">
                <div className="bg-[#333333] h-44 w-6 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center mt-2">Пт</div>
              </div>
              <div className="w-1/24 mx-1">
                <div className="bg-[#333333] h-12 w-6 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center mt-2">Сб</div>
              </div>
              <div className="w-1/24 mx-1">
                <div className="bg-[#333333] h-8 w-6 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center mt-2">Вс</div>
              </div>
              <div className="w-1/24 mx-1">
                <div className="bg-[#333333] h-20 w-6 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center mt-2">Пн</div>
              </div>
              <div className="w-1/24 mx-1">
                <div className="bg-[#333333] h-36 w-6 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center mt-2">Вт</div>
              </div>
              <div className="w-1/24 mx-1">
                <div className="bg-[#333333] h-28 w-6 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center mt-2">Ср</div>
              </div>
              <div className="w-1/24 mx-1">
                <div className="bg-[#333333] h-42 w-6 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center mt-2">Чт</div>
              </div>
              <div className="w-1/24 mx-1">
                <div className="bg-[#333333] h-46 w-6 rounded-t"></div>
                <div className="text-xs text-gray-500 text-center mt-2">Пт</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Upcoming Tasks */}
      <section className="mt-8">
        <h2 className="text-lg font-semibold text-[#8B0000] mb-4">Ближайшие задачи</h2>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-200">
            <li className="p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="flex-shrink-0 text-[#8B0000]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Связаться с клиентом</p>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-500">до 15:00</p>
                      <button className="ml-4 text-gray-400 hover:text-gray-500 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">ООО ТрансЛогистик</p>
                </div>
              </div>
            </li>
            
            <li className="p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="flex-shrink-0 text-[#8B0000]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Проверить документы</p>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-500">до 17:00</p>
                      <button className="ml-4 text-gray-400 hover:text-gray-500 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Заказ #12345</p>
                </div>
              </div>
            </li>
            
            <li className="p-4 hover:bg-gray-50">
              <div className="flex items-center">
                <div className="flex-shrink-0 text-[#8B0000]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">Назначить перевозчика</p>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-500">до 18:00</p>
                      <button className="ml-4 text-gray-400 hover:text-gray-500 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">Заказ #12346</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </Components.MainLayout>
  )
}