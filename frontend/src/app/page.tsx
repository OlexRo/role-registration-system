'use client';

import { useState } from 'react';
import { UserRole } from '@/types/user';
import RoleSelection from '@/components/RoleSelection';
import UserForm from '@/components/forms/UserForm';
import {FaCalendarAlt, FaMapMarkerAlt, FaMicrophone, FaPhotoVideo} from 'react-icons/fa';
import { GoClockFill } from 'react-icons/go';
import { IoIosArrowDown } from 'react-icons/io';
import { FaMusic, FaGift, FaPrint, FaChalkboard, FaTicketAlt } from "react-icons/fa";
import {FaRadio} from 'react-icons/fa6';
export default function HomePage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setIsSuccess(false);
  };
  
  const handleSuccess = () => {
    setIsSuccess(true);
    setSelectedRole(null);
  };
  
  const handleCancel = () => {
    setSelectedRole(null);
  };
  
  const scrollToRegistration = () => {
    const element = document.getElementById('registration-section');
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };
  
  const wishItems = [
    {
      id: '1',
      name: 'Рации',
      description: '18 штук',
      icon: <FaRadio size={40} color="#5600BE"/>
    },
    {
      id: '2',
      name: 'Проектор',
      icon: <FaPhotoVideo size={40} color="#5600BE"/>
    },
    {
      id: '3',
      name: 'Принтер',
      icon: <FaPrint size={40} color="#5600BE"/>
    },
    {
      id: '4',
      name: 'Колонка',
      icon: <FaMusic size={40} color="#5600BE"/>
    },
    {
      id: '5',
      name: 'Флипчарт',
      description: 'с маркерами',
      icon: <FaChalkboard size={40} color="#5600BE"/>
    },
    {
      id: '6',
      name: 'Подарочные сертификаты',
      description: 'Типография, продуктовый и т.д.',
      icon: <FaGift size={40} color="#5600BE"/>
    },
    {
      id: '7',
      name: 'Развлечения',
      description: 'билеты в кино/театр, каток, квесты',
      icon: <FaTicketAlt size={40} color="#5600BE"/>
    },
    {
      id: '8',
      name: 'Микрофоны',
      description: '2 беспроводных микрофона',
      icon: <FaMicrophone size={40} color="#5600BE"/>
    }
  ];
  
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-8 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-[#AB80DF] mb-6">
            <svg className="h-10 w-10 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Успешно!
          </h2>
          <p className="text-gray-600 mb-8">
            Мы получили от Вас обратную связь 🙏
          </p>
          <button
            onClick={() => setIsSuccess(false)}
            className="px-8 py-3 cursor-pointer bg-[#AB80DF] text-white font-medium rounded-lg hover:bg-[#4500A0] transition-colors duration-200"
          >
            Вернуться обратно
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Секция 1 - Герой блок */}
      <section className="relative flex flex-col justify-center items-center min-h-screen px-4 text-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/fon.png')" }}
        />
        
        <div className="relative z-10 max-w-4xl mx-auto w-full">
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-white/90 mb-12 font-light">
            СПО "Альтаир" им. В.П. Правика
          </h1>
          <p className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-great-vibes text-white mb-6 leading-tight">
            Юбилей 40 лет
          </p>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl text-white leading-relaxed max-w-2xl mx-auto mb-12 font-light">
            Окунитесь в атмосферу волшебного леса и магии...
          </h2>
          
          <button
            onClick={scrollToRegistration}
            className="border-2 cursor-pointer border-white rounded-full p-4 hover:bg-white/10 transition-colors duration-300 animate-bounce"
          >
            <IoIosArrowDown className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </button>
        </div>
      </section>
      
      {/* Секция 2 - Приглашение */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Дорогие друзья!
            </h2>
            
            <div className="bg-gray-50 rounded-2xl p-8 sm:p-12">
              <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
                Сердечно приглашаем вас на юбилей{' '}
                <span className="text-[#AB80DF] font-semibold">Студенческого педагогического отряда "Альтаир" им. Правика</span>.
                Давайте вместе окунёмся в атмосферу незабываемых лет, полных энтузиазма и студенческого задора.
                Будем рады встрече с каждым, кто причастен к нашей большой истории!
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Секция 3 - Информация о мероприятии */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Детали мероприятия
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: FaMapMarkerAlt,
                title: "Где?",
                content: "КРК 'Ладога'\nСоветская 109/1\nЗал 'Лофт'"
              },
              {
                icon: FaCalendarAlt,
                title: "Когда?",
                content: "29\nНоября"
              },
              {
                icon: GoClockFill,
                title: "Во сколько?",
                content: "16:00"
              }
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 text-center border border-gray-200 hover:border-[#AB80DF] transition-colors duration-300"
              >
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#AB80DF] flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {item.title}
                </h3>
                
                <div className="text-lg text-gray-600 leading-relaxed whitespace-pre-line">
                  {item.content}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Секция 4 - Дресс-код */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Дресс-код
            </h2>
            <div className="w-20 h-1 bg-[#AB80DF] mx-auto rounded-full"></div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-8 sm:p-12">
            <div className="text-center mb-8">
              <p className="text-xl text-gray-700 leading-relaxed">
                Наш юбилей — это путешествие в сказку, и мы приглашаем вас стать частью этого волшебства.
                Давайте вместе создадим неповторимую атмосферу таинственного леса, где возможно всё!
              </p>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Элементы стиля */}
              <div className="space-y-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center lg:text-left">
                  Элементы стиля
                </h4>
                <div className="space-y-4">
                  {[
                    {
                      category: "Флора",
                      elements: "листья, папоротники, ветки, цветы, древесная кора",
                      icon: "🌿"
                    },
                    {
                      category: "Фауна",
                      elements: "крылья бабочек или фей, перья, оленьи рога, следы зверей",
                      icon: "🦋"
                    },
                    {
                      category: "Магия",
                      elements: "капли росы, сверкающие блики, сказочные узоры, лунное сияние",
                      icon: "✨"
                    },
                    {
                      category: "Детали",
                      elements: "венки, кружево, струящиеся ткани, тематические аксессуары",
                      icon: "👑"
                    }
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="group p-4 rounded-lg bg-white border border-gray-200 hover:border-[#AB80DF] transition-all duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="text-2xl">{item.icon}</div>
                        <div className="flex-1">
                          <h5 className="font-semibold text-gray-900 mb-1">
                            {item.category}
                          </h5>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {item.elements}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {/* Основные цвета */}
              <div className="space-y-6">
                <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center lg:text-left">
                  Основные цвета
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      color: "bg-[#A2EEFF]",
                      name: "Небесный"
                    },
                    {
                      color: "bg-[#DFC7FD]",
                      name: "Лавандовый"
                    },
                    {
                      color: "bg-[#B5FFB8]",
                      name: "Мятный"
                    },
                    {
                      color: "bg-[#AD855E]",
                      name: "Древесный"
                    }
                  ].map((colorItem, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-white border border-gray-200 text-center"
                    >
                      <div className={`w-16 h-16 rounded-full ${colorItem.color} border-2 border-white shadow-sm mx-auto mb-2`}></div>
                      <h5 className="font-medium text-gray-900">
                        {colorItem.name}
                      </h5>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              ВишЛист
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Для вашего удобства прикрепляем то, что мы хотели бы получить в подарок 😄
            </p>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              По поводу брони каких-либо позиций писать Комиссару
              <br/>
              СПО "Альтаир" им. Правика -  <a href="https://vk.com/imarlekino" className="text-[#AB80DF]">Захожевой Алине</a>
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-8 sm:p-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {wishItems.map((item) => (
                <div
                  key={item.id}
                  className="group flex flex-col items-center text-center p-4 sm:p-6 rounded-xl bg-white border border-gray-200 hover:border-[#AB80DF] transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative mb-3">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#DFC7FD] to-[#AB80DF] transition-all duration-300 flex items-center justify-center">
                      <div className="transform group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
              <span className="text-base sm:text-lg font-medium text-gray-900 group-hover:text-[#5600BE] transition-colors duration-300 leading-tight">
                {item.name}
              </span>
                    {item.description && (
                      <span className="text-xs sm:text-sm text-gray-500 mt-1 leading-tight">
                  {item.description}
                </span>
                    )}
                  </div>
                  
                  <div className="mt-2 w-8 h-0.5 bg-[#AB80DF] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Секция 5 - Регистрация */}
      <section id="registration-section" className="py-16 sm:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-8">
            {!selectedRole ? (
              <RoleSelection
                selectedRole={selectedRole}
                onRoleSelect={handleRoleSelect}
              />
            ) : (
              <UserForm
                selectedRole={selectedRole}
                onSuccess={handleSuccess}
                onCancel={handleCancel}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}