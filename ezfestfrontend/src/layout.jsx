
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { Home, QrCode, User as UserIcon, ShoppingBag, Bell } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

import HomeHeader from "./components/layout/HomeHeader";
import PageHeader from "./components/layout/PageHeader";

const welcomeMessages = [
  { title: (name) => `Fala ${name}!`, subtitle: "bom te ver por aqui." },
  { title: (name) => `Olá, ${name}!`, subtitle: "aproveite o momento." },
  { title: (name) => `E aí, ${name}?`, subtitle: "pronto para a festa?" },
  { title: (name) => `Bem-vindo, ${name}!`, subtitle: "o que vamos beber hoje?" },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);
  const [welcome, setWelcome] = useState({ title: () => "", subtitle: "" });
  const [cartCount, setCartCount] = useState(0);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
        
        // Verificar se o usuário precisa completar o onboarding
        if (!currentUser.cpf || !currentUser.birth_date) {
          setNeedsOnboarding(true);
        }
      } catch (e) {
        setUser(null);
      } finally {
        setIsAuthCheckComplete(true);
      }
    };
    
    const updateCartCount = () => {
      const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = savedCart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    fetchUser();
    updateCartCount();
    setWelcome(welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)]);
    
    window.addEventListener('storage', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
    }
  }, [location.pathname]);

  // Redirecionar para onboarding se necessário (exceto se já estiver na tela de onboarding)
  useEffect(() => {
    if (isAuthCheckComplete && user && needsOnboarding && currentPageName !== 'Onboarding') {
      window.location.href = createPageUrl('Onboarding');
    }
  }, [isAuthCheckComplete, user, needsOnboarding, currentPageName]);

  const handleProfileClick = async (e) => {
    if (!user) {
      e.preventDefault();
      await User.login();
    }
  };

  // Redirecionar usuários do estabelecimento para o dashboard correto
  useEffect(() => {
    if (user && user.user_type === 'establishment') {
      if (user.establishment_role === 'admin' && currentPageName !== 'AdminDashboard') {
        window.location.href = createPageUrl('AdminDashboard');
      } else if (user.establishment_role === 'waiter' && currentPageName !== 'WaiterDashboard') {
        window.location.href = createPageUrl('WaiterDashboard');
      }
    }
  }, [user, currentPageName]);

  const navItems = [
    { name: "Cardápio", path: "Home", icon: Home, requiresAuth: false },
    { name: "Meus pedidos", path: "Orders", icon: QrCode, requiresAuth: true },
    { name: "Perfil", path: "Profile", icon: UserIcon, requiresAuth: true }
  ];

  const showNavbar = currentPageName === "Home"; 
  const isHomePage = currentPageName === "Home";
  
  const getPageDetails = (pageName) => {
      const details = {
          "Cart": { title: "Meu carrinho", subtitle: "" },
          "Payment": { title: "Pagamento", subtitle: "Meu carrinho", backPath: createPageUrl('Cart') },
          "PixPayment": { title: "Pagamento PIX", subtitle: "Aguardando pagamento", backPath: createPageUrl('Orders') },
          "OrderSuccess": { title: "Pedido Aprovado", subtitle: "" },
          "Orders": { title: "Meus pedidos", subtitle: "", backPath: createPageUrl('Home') },
          "Profile": { title: "Meu Perfil", subtitle: "" },
          "ViewQRCode": { title: "Código do Pedido", subtitle: "" },
          "Onboarding": { title: "Complete seu perfil", subtitle: "" },
          // Add AdminDashboard details if needed, otherwise it will use default empty strings
          "AdminDashboard": { title: "Dashboard", subtitle: "Gerenciamento do estabelecimento" }, 
          "WaiterDashboard": { title: "Scanner de Pedidos", subtitle: "Validação de retirada" },
          "TestStripe": { title: "Teste do Stripe", subtitle: "Verificação de conexão", backPath: createPageUrl('Home') }
      };
      return details[pageName] || { title: "", subtitle: "", backPath: createPageUrl('Home') };
  }
  
  const { title, subtitle, backPath } = getPageDetails(currentPageName);

  // Layout para onboarding e dashboards de estabelecimento
  if (['Onboarding', 'AdminDashboard', 'WaiterDashboard'].includes(currentPageName)) {
    return (
      <div className="min-h-screen font-sans">
        <style>{`
          :root {
            --primary: #7C9885;
            --primary-dark: #6B8574;
            --accent: #FAEEDD; 
            --neutral: #FFFFFF;
            --text-dark: #333333;
          }
          .btn-primary {
            background-color: var(--primary);
            color: white;
            transition: background-color 0.3s ease;
          }
          .btn-primary:hover {
            background-color: var(--primary-dark);
          }
          body {
              font-family: 'Inter', sans-serif;
          }
        `}</style>
        {children}
      </div>
    );
  }

  // Common styles to be applied to both layouts
  const commonStyles = (
    <style>{`
      :root {
        --primary: #7C9885;
        --primary-dark: #6B8574;
        --accent: #FAEEDD; 
        --neutral: #FFFFFF;
        --text-dark: #333333;
      }
      .floating-nav {
        background: rgba(255, 255, 255, 0.95);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(15px);
        -webkit-backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.3);
      }
      .card-shadow {
        box-shadow: 0 8px 24px rgba(149, 157, 165, 0.1);
      }
      .btn-primary {
        background-color: var(--primary);
        color: white;
        transition: background-color 0.3s ease;
      }
      .btn-primary:hover {
        background-color: var(--primary-dark);
      }
      body {
          font-family: 'Inter', sans-serif;
      }
    `}</style>
  );

  if (isHomePage) {
    return (
      <div className="min-h-screen font-sans bg-[#7C9885]">
        {commonStyles}
        
        {/* Header verde da página Home */}
        <div className="px-6 pt-12 pb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl font-bold">
                {welcome.title(user ? user.full_name.split(' ')[0] : 'Visitante')}
              </h1>
              <p className="text-white/80 text-sm">{welcome.subtitle}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 bg-white/20 rounded-xl">
                <Bell className="w-5 h-5 text-white" />
              </button>
              <Link to={createPageUrl("Cart")}>
                <div className="relative p-2 bg-white/20 rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-white" />
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.div 
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        {cartCount}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Área de conteúdo bege com border radius */}
        <main className="bg-[#FAEEDD] rounded-t-3xl min-h-screen pt-8 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Navbar */}
        {isAuthCheckComplete && showNavbar && ( 
          <nav className="fixed bottom-6 left-6 right-6 z-50 bg-[#7C9885] rounded-full shadow-lg px-8 py-3">
            <div className="flex justify-around items-center">
              {navItems.map((item) => {
                const isActive = location.pathname === createPageUrl(item.path);
                const effectivePath = item.requiresAuth && !user ? "#" : createPageUrl(item.path);
                const onClickAction = item.requiresAuth ? handleProfileClick : undefined;

                return (
                  <Link
                    key={item.name}
                    to={effectivePath}
                    onClick={onClickAction}
                    className={`flex flex-col items-center space-y-0.5 p-1.5 rounded-lg transition-all duration-200 ${
                      isActive && (!item.requiresAuth || user)
                        ? 'text-white bg-white/20' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    );
  }

  // Layout para outras páginas (não Home)
  return (
    <div className="min-h-screen font-sans bg-[#7C9885]">
      {commonStyles}
      
      {/* Mostrar PageHeader em todas as outras páginas */}
      <PageHeader 
        title={title} 
        subtitle={subtitle} 
        hideBackButton={currentPageName === 'OrderSuccess' || currentPageName === 'ViewQRCode'}
        backPath={backPath}
      />

      <main className="flex-1 bg-[#FAEEDD] rounded-t-3xl overflow-y-auto min-h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
