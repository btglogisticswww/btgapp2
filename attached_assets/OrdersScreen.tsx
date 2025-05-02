'use client';
import { useGoogleFont } from '../utils/fonts'
import Components from "../components"
import React, { useState } from "react"

export default function OrdersScreen() {
  const fontFamily = useGoogleFont('Inter')
  const [activeTab, setActiveTab] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  // Sample order data
  const orders = [
    {
      id: "ORD-12345",
      client: "ООО ТрансЛогистик",
      route: "Москва - Санкт-Петербург",
      status: "active",
      date: "15.05.2023",
      price: "85 000 ₽",
      type: "Автоперевозка",
      weight: "1200 кг",
      volume: "3.5 м³",
      manager: "Иванов И.И.",
      details: {
        sender: {
          name: "ООО ТрансЛогистик",
          address: "г. Москва, ул. Ленина, 10",
          contact: "Петров А.А.",
          phone: "+7 (999) 123-45-67"
        },
        recipient: {
          name: "ООО СевероЗапад",
          address: "г. Санкт-Петербург, пр. Невский, 20",
          contact: "Сидоров В.В.",
          phone: "+7 (999) 765-43-21"
        },
        cargo: {
          description: "Электроника",
          packaging: "Коробки",
          hazardClass: "Нет",
          temperature: "Не требуется",
          documents: ["Накладная", "Счет-фактура", "Сертификат соответствия"]
        },
        timeline: [
          { date: "12.05.2023", time: "10:30", event: "Заказ создан" },
          { date: "13.05.2023", time: "14:15", event: "Документы подготовлены" },
          { date: "14.05.2023", time: "09:00", event: "Груз принят" },
          { date: "14.05.2023", time: "12:30", event: "Транспорт выехал" }
        ]
      }
    },
    {
      id: "ORD-12346",
      client: "ИП Смирнов А.В.",
      route: "Екатеринбург - Новосибирск",
      status: "pending",
      date: "16.05.2023",
      price: "120 000 ₽",
      type: "Мультимодальная",
      weight: "3500 кг",
      volume: "8.2 м³",
      manager: "Петрова Е.С.",
      details: {
        sender: {
          name: "ИП Смирнов А.В.",
          address: "г. Екатеринбург, ул. Мира, 15",
          contact: "Смирнов А.В.",
          phone: "+7 (999) 222-33-44"
        },
        recipient: {
          name: "ООО СибТорг",
          address: "г. Новосибирск, ул. Советская, 5",
          contact: "Кузнецов Д.М.",
          phone: "+7 (999) 555-66-77"
        },
        cargo: {
          description: "Строительные материалы",
          packaging: "Паллеты",
          hazardClass: "Нет",
          temperature: "Не требуется",
          documents: ["Накладная", "Счет-фактура", "Договор поставки"]
        },
        timeline: [
          { date: "14.05.2023", time: "11:45", event: "Заказ создан" },
          { date: "15.05.2023", time: "10:20", event: "Документы подготовлены" }
        ]
      }
    },
    {
      id: "ORD-12347",
      client: "АО Металлпром",
      route: "Челябинск - Краснодар",
      status: "completed",
      date: "10.05.2023",
      price: "210 000 ₽",
      type: "Железнодорожная",
      weight: "12000 кг",
      volume: "24 м³",
      manager: "Соколов Д.А.",
      details: {
        sender: {
          name: "АО Металлпром",
          address: "г. Челябинск, ул. Заводская, 1",
          contact: "Морозов К.Л.",
          phone: "+7 (999) 888-99-00"
        },
        recipient: {
          name: "ООО ЮгМеталл",
          address: "г. Краснодар, ул. Промышленная, 8",
          contact: "Волков Р.С.",
          phone: "+7 (999) 111-22-33"
        },
        cargo: {
          description: "Металлопрокат",
          packaging: "Связки",
          hazardClass: "Нет",
          temperature: "Не требуется",
          documents: ["Накладная", "Счет-фактура", "Сертификат качества", "Договор поставки"]
        },
        timeline: [
          { date: "05.05.2023", time: "09:15", event: "Заказ создан" },
          { date: "06.05.2023", time: "14:30", event: "Документы подготовлены" },
          { date: "07.05.2023", time: "10:00", event: "Груз принят" },
          { date: "07.05.2023", time: "16:45", event: "Транспорт выехал" },
          { date: "10.05.2023", time: "11:20", event: "Доставка завершена" }
        ]
      }
    },
    {
      id: "ORD-12348",
      client: "ООО ФудМаркет",
      route: "Воронеж - Ростов-на-Дону",
      status: "active",
      date: "14.05.2023",
      price: "95 000 ₽",
      type: "Рефрижератор",
      weight: "5000 кг",
      volume: "12 м³",
      manager: "Иванов И.И.",
      details: {
        sender: {
          name: "ООО ФудМаркет",
          address: "г. Воронеж, ул. Центральная, 12",
          contact: "Лебедев А.Н.",
          phone: "+7 (999) 444-55-66"
        },
        recipient: {
          name: "ООО ЮжныйТорг",
          address: "г. Ростов-на-Дону, пр. Ворошиловский, 25",
          contact: "Соловьев М.В.",
          phone: "+7 (999) 777-88-99"
        },
        cargo: {
          description: "Продукты питания",
          packaging: "Коробки, паллеты",
          hazardClass: "Нет",
          temperature: "+2°C...+6°C",
          documents: ["Накладная", "Счет-фактура", "Сертификаты качества", "Ветеринарное свидетельство"]
        },
        timeline: [
          { date: "12.05.2023", time: "08:30", event: "Заказ создан" },
          { date: "13.05.2023", time: "11:45", event: "Документы подготовлены" },
          { date: "14.05.2023", time: "07:00", event: "Груз принят" },
          { date: "14.05.2023", time: "10:15", event: "Транспорт выехал" }
        ]
      }
    },
    {
      id: "ORD-12349",
      client: "ООО ТехноПром",
      route: "Москва - Казань",
      status: "pending",
      date: "17.05.2023",
      price: "110 000 ₽",
      type: "Автоперевозка",
      weight: "2800 кг",
      volume: "7.5 м³",
      manager: "Петрова Е.С.",
      details: {
        sender: {
          name: "ООО ТехноПром",
          address: "г. Москва, ул. Тверская, 30",
          contact: "Козлов Д.И.",
          phone: "+7 (999) 333-22-11"
        },
        recipient: {
          name: "ООО КазаньТех",
          address: "г. Казань, ул. Баумана, 18",
          contact: "Новиков А.П.",
          phone: "+7 (999) 666-77-88"
        },
        cargo: {
          description: "Компьютерное оборудование",
          packaging: "Коробки, специальная упаковка",
          hazardClass: "Нет",
          temperature: "Не требуется",
          documents: ["Накладная", "Счет-фактура", "Гарантийные талоны"]
        },
        timeline: [
          { date: "15.05.2023", time: "13:20", event: "Заказ создан" },
          { date: "16.05.2023", time: "15:40", event: "Документы подготовлены" }
        ]
      }
    }
  ]
  
  // Filter orders based on active tab
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab)
  
  // Handle order selection
  const handleOrderSelect = (order) => {
    setSelectedOrder(order)
  }
  
  return (
    <Components.MainLayout title="Заказы">
      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <a 
            onClick={() => setActiveTab('all')}
            className={`border-b-2 py-4 px-1 text-sm font-medium cursor-pointer ${
              activeTab === 'all' 
                ? 'border-[#8B0000] text-[#8B0000]' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Все заказы
          </a>
          <a 
            onClick={() => setActiveTab('active')}
            className={`border-b-2 py-4 px-1 text-sm font-medium cursor-pointer ${
              activeTab === 'active' 
                ? 'border-[#8B0000] text-[#8B0000]' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Активные
          </a>
          <a 
            onClick={() => setActiveTab('pending')}
            className={`border-b-2 py-4 px-1 text-sm font-medium cursor-pointer ${
              activeTab === 'pending' 
                ? 'border-[#8B0000] text-[#8B0000]' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Ожидающие
          </a>
          <a 
            onClick={() => setActiveTab('completed')}
            className={`border-b-2 py-4 px-1 text-sm font-medium cursor-pointer ${
              activeTab === 'completed' 
                ? 'border-[#8B0000] text-[#8B0000]' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Завершенные
          </a>
        </nav>
      </div>
      
      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative w-full sm:w-96">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
            </svg>
          </div>
          <input 
            type="search" 
            className="block w-full p-2.5 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-[#8B0000] focus:border-[#8B0000]" 
            placeholder="Поиск заказов..." 
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Фильтры
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[#8B0000] rounded-lg hover:bg-[#700000]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Новый заказ
          </button>
        </div>
      </div>
      
      {/* Orders List and Details */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Orders List */}
        <div className="w-full lg:w-3/5">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      № Заказа
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Клиент
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Маршрут
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Сумма
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr 
                      key={order.id} 
                      className={`hover:bg-gray-50 cursor-pointer ${selectedOrder?.id === order.id ? 'bg-red-50' : ''}`}
                      onClick={() => handleOrderSelect(order)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.route}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${order.status === 'active' ? 'bg-green-100 text-green-800' : 
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-gray-100 text-gray-800'}`}
                        >
                          {order.status === 'active' ? 'Активный' : 
                           order.status === 'pending' ? 'Ожидает' : 
                           'Завершен'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Показано <span className="font-medium">1</span> - <span className="font-medium">5</span> из <span className="font-medium">12</span> заказов
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Предыдущая</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-[#8B0000]">
                      1
                    </a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      2
                    </a>
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      3
                    </a>
                    <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      <span className="sr-only">Следующая</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Details */}
        <div className="w-full lg:w-2/5">
          {selectedOrder ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedOrder.id}</h2>
                  <p className="text-sm text-gray-500">{selectedOrder.client}</p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full 
                  ${selectedOrder.status === 'active' ? 'bg-green-100 text-green-800' : 
                    selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'}`}
                >
                  {selectedOrder.status === 'active' ? 'Активный' : 
                   selectedOrder.status === 'pending' ? 'Ожидает' : 
                   'Завершен'}
                </span>
              </div>
              
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Тип перевозки</p>
                  <p className="text-sm font-medium">{selectedOrder.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Дата</p>
                  <p className="text-sm font-medium">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Вес</p>
                  <p className="text-sm font-medium">{selectedOrder.weight}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Объем</p>
                  <p className="text-sm font-medium">{selectedOrder.volume}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Маршрут</p>
                  <p className="text-sm font-medium">{selectedOrder.route}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Менеджер</p>
                  <p className="text-sm font-medium">{selectedOrder.manager}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Стоимость</p>
                  <p className="text-lg font-semibold text-[#8B0000]">{selectedOrder.price}</p>
                </div>
              </div>
              
              {/* Sender and Recipient */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Отправитель и получатель</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Отправитель</p>
                    <p className="text-sm font-medium">{selectedOrder.details.sender.name}</p>
                    <p className="text-xs text-gray-500 mt-2">Адрес</p>
                    <p className="text-sm">{selectedOrder.details.sender.address}</p>
                    <p className="text-xs text-gray-500 mt-2">Контактное лицо</p>
                    <p className="text-sm">{selectedOrder.details.sender.contact}</p>
                    <p className="text-xs text-gray-500 mt-2">Телефон</p>
                    <p className="text-sm">{selectedOrder.details.sender.phone}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Получатель</p>
                    <p className="text-sm font-medium">{selectedOrder.details.recipient.name}</p>
                    <p className="text-xs text-gray-500 mt-2">Адрес</p>
                    <p className="text-sm">{selectedOrder.details.recipient.address}</p>
                    <p className="text-xs text-gray-500 mt-2">Контактное лицо</p>
                    <p className="text-sm">{selectedOrder.details.recipient.contact}</p>
                    <p className="text-xs text-gray-500 mt-2">Телефон</p>
                    <p className="text-sm">{selectedOrder.details.recipient.phone}</p>
                  </div>
                </div>
              </div>
              
              {/* Cargo Information */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Информация о грузе</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Описание</p>
                      <p className="text-sm">{selectedOrder.details.cargo.description}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Упаковка</p>
                      <p className="text-sm">{selectedOrder.details.cargo.packaging}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Класс опасности</p>
                      <p className="text-sm">{selectedOrder.details.cargo.hazardClass}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Температурный режим</p>
                      <p className="text-sm">{selectedOrder.details.cargo.temperature}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <p className="text-xs text-gray-500">Документы</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedOrder.details.cargo.documents.map((doc, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-200 text-gray-800">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Timeline */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Хронология</h3>
                <div className="relative">
                  {selectedOrder.details.timeline.map((item, index) => (
                    <div key={index} className="mb-4 ml-6">
                      <div className="absolute w-3 h-3 bg-[#8B0000] rounded-full mt-1.5 -left-1.5 border border-white"></div>
                      <time className="mb-1 text-xs font-normal leading-none text-gray-500">{item.date} {item.time}</time>
                      <p className="text-sm font-medium text-gray-900">{item.event}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="px-4 py-2 text-sm font-medium text-white bg-[#8B0000] rounded-lg hover:bg-[#700000]">
                  Редактировать
                </button>
                <button className="px-4 py-2 text-sm font-medium text-[#8B0000] bg-white border border-[#8B0000] rounded-lg hover:bg-red-50">
                  Документы
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  Отследить
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center h-full min-h-[400px]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Выберите заказ</h3>
              <p className="text-sm text-gray-500">Выберите заказ из списка для просмотра подробной информации</p>
            </div>
          )}
        </div>
      </div>
    </Components.MainLayout>
  )
}