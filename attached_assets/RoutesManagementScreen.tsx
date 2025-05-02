'use client';
import { useGoogleFont } from '../utils/fonts'
import Components from "../components"
import React from "react"

export default function RoutesManagementScreen() {
  const fontFamily = useGoogleFont('Inter')
  
  return (
    <Components.MainLayout title="Маршруты">
      {/* Header with actions */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[#333333]">Управление маршрутами</h1>
        
        <div className="flex space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Фильтры
          </button>
          
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#8B0000] hover:bg-[#700000] cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Новый маршрут
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Active Routes */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-medium text-gray-900">Активные маршруты</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              <div className="p-4 hover:bg-gray-50 cursor-pointer bg-red-50">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-[#8B0000]">Москва → Берлин</h3>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    В пути
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Заказ #12345</span>
                  <span>20.06 - 25.06</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
              
              <div className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">Санкт-Петербург → Хельсинки</h3>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Подготовка
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Заказ #12346</span>
                  <span>22.06 - 24.06</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
              
              <div className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">Минск → Варшава</h3>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Ожидание
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Заказ #12347</span>
                  <span>25.06 - 27.06</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div className="bg-yellow-500 h-1.5 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Vehicles */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-medium text-gray-900">Транспортные средства</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              <div className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">MAN TGX</h3>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Активен
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Рег. номер: AB123CD</span>
                  <span>Водитель: Петров А.</span>
                </div>
              </div>
              
              <div className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">Volvo FH</h3>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    Свободен
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Рег. номер: XY789ZW</span>
                  <span>Водитель: Сидоров И.</span>
                </div>
              </div>
              
              <div className="p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium text-gray-900">Mercedes Actros</h3>
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Ремонт
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Рег. номер: PQ456RS</span>
                  <span>До: 22.06.2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map and Route Details */}
        <div className="lg:col-span-3 space-y-6">
          {/* Map */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-sm font-medium text-gray-900">Карта маршрутов</h2>
              
              <div className="flex space-x-2">
                <button className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Найти
                </button>
                
                <button className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Фильтр
                </button>
                
                <button className="inline-flex items-center px-2 py-1 border border-gray-300 rounded text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                  Масштаб
                </button>
              </div>
            </div>
            
            <div className="h-96 bg-gray-100 relative">
              {/* Placeholder for the map */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Интерактивная карта маршрутов</p>
                  <p className="text-xs text-gray-400">Здесь будет отображаться карта с текущими маршрутами и транспортными средствами</p>
                </div>
              </div>
              
              {/* Map Controls */}
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2">
                <div className="flex flex-col space-y-2">
                  <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Selected Route Details */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-medium text-gray-900">Детали маршрута: Москва → Берлин (Заказ #12345)</h2>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-xs font-medium text-gray-500 mb-1">Транспортное средство</h3>
                  <p className="text-sm font-medium text-gray-900">MAN TGX (AB123CD)</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-xs font-medium text-gray-500 mb-1">Водитель</h3>
                  <p className="text-sm font-medium text-gray-900">Петров Алексей</p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h3 className="text-xs font-medium text-gray-500 mb-1">Текущее местоположение</h3>
                  <p className="text-sm font-medium text-gray-900">Польша, Познань</p>
                </div>
              </div>
              
              {/* Timeline */}
              <h3 className="text-sm font-medium text-gray-900 mb-3">График движения</h3>
              <div className="relative pb-8">
                <div className="flex items-center mb-4">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full h-6 w-6 flex items-center justify-center bg-[#8B0000] text-white text-xs">
                      1
                    </div>
                    <div className="h-12 w-0.5 bg-gray-300"></div>
                  </div>
                  
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium text-gray-900">Москва, Складская ул., 10</h4>
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Выполнено
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Загрузка: 20.06.2023, 10:00</p>
                    <p className="text-xs text-gray-500">Фактически: 20.06.2023, 10:15</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full h-6 w-6 flex items-center justify-center bg-[#8B0000] text-white text-xs">
                      2
                    </div>
                    <div className="h-12 w-0.5 bg-gray-300"></div>
                  </div>
                  
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium text-gray-900">Беларусь, Брест (граница)</h4>
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Выполнено
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Таможня: 21.06.2023, 08:00</p>
                    <p className="text-xs text-gray-500">Фактически: 21.06.2023, 10:30</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full h-6 w-6 flex items-center justify-center bg-green-500 text-white text-xs">
                      3
                    </div>
                    <div className="h-12 w-0.5 bg-gray-300"></div>
                  </div>
                  
                  <div className="ml-4">
                    <div className="flex items-center">
                      <h4 className="text-sm font-medium text-gray-900">Польша, Познань</h4>
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Текущее положение
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Остановка: 22.06.2023, 14:00</p>
                    <p className="text-xs text-gray-500">Фактически: 22.06.2023, 13:45</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full h-6 w-6 flex items-center justify-center bg-gray-300 text-white text-xs">
                      4
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Берлин, Lagerstraße 15</h4>
                    <p className="text-xs text-gray-500">Разгрузка: 25.06.2023, 14:00</p>
                    <p className="text-xs text-gray-500">Ожидается</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Components.MainLayout>
  )
}