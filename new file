import React, { useState, useEffect, createContext, useContext, useMemo, useRef } from 'react';
import { 
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis 
} from 'recharts';
import { 
  Home, BarChart2, MessageSquare, Utensils, User, LogOut, Settings, 
  Bell, Mic, Volume2, Send, Droplet, Zap, Fish, Leaf, Drumstick, 
  Brain, Sun, Moon, Calendar, Download, Target, Plus, Trash2, X, 
  ChevronDown, CheckCircle, Search, Clock, PlusCircle, Lock, Mail 
} from 'lucide-react';

// --- Global Context for State Management ---
const AppContext = createContext();

// --- Mock Data Constants ---
const MOCK_USER = {
  id: 'user-1',
  name: 'Alex Johnson',
  email: 'alex@example.com',
  age: 28,
  height: 175,
  weight: 70,
  activityLevel: 'moderate',
  goal: 'lose',
};

const MOCK_GOALS = {
  id: 'goal-1',
  userId: 'user-1',
  calories: 2200,
  protein: 140,
  carbs: 250,
  fat: 70,
};

const MOCK_MEALS = [
  { id: 1, date: new Date().toISOString(), name: 'Oatmeal & Berries', calories: 350, protein: 12, carbs: 60, fat: 6, type: 'breakfast' },
  { id: 2, date: new Date().toISOString(), name: 'Grilled Chicken Salad', calories: 450, protein: 40, carbs: 15, fat: 20, type: 'lunch' },
  { id: 3, date: new Date(Date.now() - 86400000).toISOString(), name: 'Salmon & Rice', calories: 600, protein: 45, carbs: 50, fat: 22, type: 'dinner' },
];

// --- Main App Component ---
export default function App() {
  const [auth, setAuth] = useState({ isLoggedIn: false, token: null });
  const [user, setUser] = useState(null);
  const [goals, setGoals] = useState(null);
  const [meals, setMeals] = useState([]);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [notification, setNotification] = useState(null);
  const [isLoadingApp, setIsLoadingApp] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // --- Notification Helper ---
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // --- Auth & Data Functions (Simulating Backend) ---
  const handleLogin = async (email, password) => {
    setIsLoadingApp(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // For demo, accept any login or the mock one
    setAuth({ isLoggedIn: true, token: 'mock-token-123' });
    setUser(MOCK_USER);
    setGoals(MOCK_GOALS);
    setMeals(MOCK_MEALS);
    setCurrentPage('dashboard');
    showNotification('Welcome back, ' + MOCK_USER.name + '!');
    setIsLoadingApp(false);
  };

  const handleRegister = async (regData) => {
    setIsLoadingApp(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setAuth({ isLoggedIn: true, token: 'new-user-token' });
    setUser({ ...MOCK_USER, ...regData });
    setGoals(MOCK_GOALS); // Assign default goals
    setMeals([]);
    setCurrentPage('dashboard');
    showNotification('Account created successfully!');
    setIsLoadingApp(false);
  };

  const handleLogout = () => {
    setAuth({ isLoggedIn: false, token: null });
    setUser(null);
    setGoals(null);
    setMeals([]);
    setCurrentPage('dashboard');
    showNotification('Logged out successfully.', 'info');
  };

  const handleForgotPassword = async (email) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { message: `Reset code sent to ${email}` };
  };

  const handleResetPassword = async (email, token, newPassword) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { message: 'Password reset successfully. Please login.' };
  };

  // --- Data Mutation Functions ---
  const addMeal = async (meal) => {
    // Add timestamp id
    const newMeal = { ...meal, id: Date.now(), date: meal.date || new Date().toISOString() };
    setMeals(prevMeals => [...prevMeals, newMeal]);
    showNotification('Meal added!');
    return newMeal;
  };

  const deleteMeal = async (id) => {
    setMeals(prevMeals => prevMeals.filter(meal => meal.id !== id));
    showNotification('Meal removed.', 'info');
  };

  const updateProfile = async (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
    showNotification('Profile updated!');
  };

  const updateGoals = async (updatedGoals) => {
    setGoals(prev => ({ ...prev, ...updatedGoals }));
    showNotification('Goals updated!');
  };

  // --- Utility Functions (Memoization) ---
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const todayTotals = useMemo(() => {
    if (!meals) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    const today = getTodayString();
    return meals
      .filter(meal => meal.date.startsWith(today))
      .reduce((acc, meal) => {
        acc.calories += meal.calories;
        acc.protein += meal.protein;
        acc.carbs += meal.carbs;
        acc.fat += meal.fat;
        return acc;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [meals]);

  const contextValue = {
    auth,
    user,
    goals,
    meals,
    todayTotals,
    theme,
    currentPage,
    handleLogin,
    handleRegister,
    handleLogout,
    addMeal,
    deleteMeal,
    updateProfile,
    updateGoals,
    handleForgotPassword,
    handleResetPassword,
    setCurrentPage,
    setTheme,
    showNotification,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`relative min-h-screen ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900 text-white'} font-sans transition-colors duration-300`}>
        <BackgroundAnimation />
        
        {notification && (
          <NotificationBanner 
            message={notification.message} 
            type={notification.type} 
            onClose={() => setNotification(null)} 
          />
        )}
        
        <div className="relative z-10">
          {!auth.isLoggedIn ? (
            isLoadingApp ? (
              <div className="flex flex-col items-center justify-center min-h-screen">
                 <Brain className="w-16 h-16 text-blue-500 animate-bounce mb-4" />
                 <p className="text-lg font-medium text-gray-600 dark:text-gray-300 animate-pulse">Loading NutriPal...</p>
              </div>
            ) : (
              <LoginRegister />
            )
          ) : (
            <div className="flex h-screen overflow-hidden">
              <DesktopSidebar />
              <div className="flex-1 flex flex-col h-full overflow-hidden lg:ml-64">
                <MobileHeader />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 lg:pb-6">
                  {currentPage === 'dashboard' && <Dashboard />}
                  {currentPage === 'tracker' && <MealTracker />}
                  {currentPage === 'chatbot' && <Chatbot />}
                  {currentPage === 'profile' && <ProfileSettings />}
                </main>
                <MobileBottomNav />
              </div>
            </div>
          )}
        </div>
      </div>
    </AppContext.Provider>
  );
}

// --- 1. Navigation Components ---
function DesktopSidebar() {
  const { user, handleLogout, currentPage, setCurrentPage } = useContext(AppContext);

  const navItems = [
    { name: 'Dashboard', icon: Home, page: 'dashboard' },
    { name: 'Meal Tracker', icon: Utensils, page: 'tracker' },
    { name: 'AI Coach', icon: MessageSquare, page: 'chatbot' },
    { name: 'Profile', icon: User, page: 'profile' },
  ];

  return (
    <nav className="hidden lg:flex flex-col fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-xl z-20">
      <div className="flex items-center h-20 px-6 border-b dark:border-gray-700 bg-blue-50 dark:bg-gray-900/50">
        <div className="bg-blue-500 p-2 rounded-lg mr-3 shadow-lg shadow-blue-500/30">
            <Brain className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">NutriPal AI</span>
      </div>
      
      <div className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.page}
            onClick={() => setCurrentPage(item.page)}
            className={`flex items-center w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              currentPage === item.page 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 translate-x-1' 
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:translate-x-1'
            }`}
          >
            <item.icon className={`w-5 h-5 mr-3 ${currentPage === item.page ? 'text-white' : 'text-gray-400'}`} />
            {item.name}
          </button>
        ))}
      </div>
      
      <div className="p-4 border-t dark:border-gray-700">
        <div className="flex items-center mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                {user.name.charAt(0)}
            </div>
            <div className="ml-3 overflow-hidden">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </nav>
  );
}

function MobileHeader() {
  const { user, currentPage } = useContext(AppContext);
  const userInitials = user.name.split(' ').map(n => n[0]).join('').substring(0,2);

  const pageTitle = useMemo(() => {
    switch(currentPage) {
      case 'dashboard': return 'Dashboard';
      case 'tracker': return 'Meal Tracker';
      case 'chatbot': return 'AI Coach';
      case 'profile': return 'Profile & Settings';
      default: return 'NutriPal AI';
    }
  }, [currentPage]);

  return (
    <header className="lg:hidden sticky top-0 flex items-center justify-between h-16 px-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b dark:border-gray-700 z-20 shadow-sm">
      <div className="flex items-center gap-2">
         <Brain className="w-6 h-6 text-blue-500" />
         <h1 className="text-lg font-bold text-gray-900 dark:text-white">{pageTitle}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold shadow-md">
            {userInitials}
        </div>
      </div>
    </header>
  );
}

function MobileBottomNav() {
  const { currentPage, setCurrentPage } = useContext(AppContext);
  const navItems = [
    { name: 'Home', icon: Home, page: 'dashboard' },
    { name: 'Track', icon: Utensils, page: 'tracker' },
    { name: 'Coach', icon: MessageSquare, page: 'chatbot' },
    { name: 'Profile', icon: User, page: 'profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t dark:border-gray-700 z-30 flex justify-around items-center h-16 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      {navItems.map(item => (
        <button
          key={item.page}
          onClick={() => setCurrentPage(item.page)}
          className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
            currentPage === item.page ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600'
          }`}
        >
          <item.icon className={`w-6 h-6 mb-1 ${currentPage === item.page ? 'fill-current opacity-20' : ''}`} strokeWidth={currentPage === item.page ? 2.5 : 2} />
          <span className="text-[10px] font-medium">{item.name}</span>
        </button>
      ))}
    </nav>
  );
}

// --- 2. Chatbot Component ---
function Chatbot() {
  const { user, goals, todayTotals, addMeal, showNotification } = useContext(AppContext);
  const [messages, setMessages] = useState([
    { role: 'bot', text: `Hi ${user.name.split(' ')[0]}! I'm NutriPal, your personal nutrition AI. \n\nI can help you log meals, suggest healthy recipes, or analyze your macros. What's on your mind?` }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  
  const systemPrompt = `You are 'NutriPal', a friendly, expert nutrition chatbot.
You are talking to ${user.name}, who is ${user.age} years old, ${user.height}cm tall, and weighs ${user.weight}kg.
Their goal is to ${user.goal} weight.
Their daily targets are: ${goals.calories} kcal, ${goals.protein}g protein, ${goals.carbs}g carbs, and ${goals.fat}g fat.
Today, they have consumed: ${todayTotals.calories} kcal, ${todayTotals.protein}g protein, ${todayTotals.carbs}g carbs, and ${todayTotals.fat}g fat.

Your tasks:
1. Be Conversational & Encouraging: Use their name. Keep replies concise and helpful.
2. Analyze User Goals: If they ask for a plan (e.g., "lose 5kg in 2 months"), create a high-level, sample plan.
3. Give Meal Suggestions: Base suggestions on their remaining calories and macros.
4. Log Meals: If a user says "Log 2 eggs and a banana for breakfast", you MUST respond with a JSON object in this *exact* format (no markdown code blocks):
   {"action": "log_meal", "meal": {"name": "2 eggs and a banana", "calories": 230, "protein": 13, "carbs": 28, "fat": 10, "type": "breakfast"}}
   (Estimate macros if not provided). For any other request, just respond with natural text.
5. Answer Questions: Provide nutritional tips and answer questions based on science.
6. DO NOT: Give medical advice. Defer to a doctor.`;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const callGeminiAPI = async (chatHistory) => {
    setIsLoading(true);
    
    const apiKey = ""; // Empty string allows the environment to inject the key
    
    // Use the text generation model
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const contents = chatHistory.map(msg => ({
      role: msg.role === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const payload = {
      contents: [{ role: "user", parts: [{ text: userInput }] }], // In a real app, we'd send full history, but here simplified for the snippet limit
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
    };
    
    // Override payload to include history correctly for better context
    payload.contents = contents;

    let response;
    let delay = 1000;
    for (let i = 0; i < 3; i++) {
      try {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) break;
        if (response.status === 429 || response.status >= 500) {
           await new Promise(resolve => setTimeout(resolve, delay));
           delay *= 2;
        } else {
           throw new Error(`API Error: ${response.status}`);
        }
      } catch (error) {
        console.error(error);
        if (i === 2) {
            setIsLoading(false);
            setMessages(prev => [...prev, { role: 'bot', text: "I'm having trouble connecting to the server. Please try again." }]);
            return;
        }
      }
    }

    try {
      const result = await response.json();
      let botResponse = result.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";
      
      // Clean up if the model adds markdown code blocks around the JSON
      const jsonMatch = botResponse.match(/\{[\s\S]*\}/);
      
      let processed = false;
      if (jsonMatch) {
          try {
            const possibleJson = jsonMatch[0];
            const jsonResponse = JSON.parse(possibleJson);
            
            if (jsonResponse.action === 'log_meal' && jsonResponse.meal) {
                await addMeal(jsonResponse.meal);
                const confirmation = `Got it! I've logged "${jsonResponse.meal.name}" (${jsonResponse.meal.calories} kcal) for you. Keep it up!`;
                setMessages(prev => [...prev, { role: 'bot', text: confirmation }]);
                processed = true;
            }
          } catch (e) {
              // Not valid JSON, treat as text
          }
      }
      
      if (!processed) {
        setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
      }

    } catch (e) {
      console.error('Parsing Error', e);
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, something went wrong processing my thought." }]);
    }
    setIsLoading(false);
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    const newUserMessage = { role: 'user', text: userInput };
    const newChatHistory = [...messages, newUserMessage];
    setMessages(newChatHistory);
    setUserInput('');
    callGeminiAPI(newChatHistory); // Limit history size in production
  };

  const handleToggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        showNotification('Voice recognition not supported in this browser.', 'error');
        return;
      }
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        // Auto send? Let's just fill input for now so user can confirm
      };
      recognitionRef.current.start();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-in`}>
            <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                    msg.role === 'user' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-blue-500 text-white'
                }`}>
                    {msg.role === 'user' ? <User className="w-5 h-5 text-gray-600 dark:text-gray-300" /> : <Brain className="w-5 h-5" />}
                </div>
                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                    msg.role === 'user' 
                    ? 'bg-blue-500 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border dark:border-gray-700'
                }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start animate-pulse">
            <div className="flex max-w-[75%] gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex-shrink-0 flex items-center justify-center mt-1">
                    <Brain className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border dark:border-gray-700 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      
      <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        {messages.length < 3 && (
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            <button onClick={() => setUserInput("Log a chicken salad for lunch")} className="whitespace-nowrap text-xs font-medium px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300 rounded-full hover:bg-blue-100 border border-blue-100 dark:border-blue-800/50 transition-colors">
                🥗 Log Salad
            </button>
            <button onClick={() => setUserInput("How much protein do I have left?")} className="whitespace-nowrap text-xs font-medium px-3 py-1.5 bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300 rounded-full hover:bg-purple-100 border border-purple-100 dark:border-purple-800/50 transition-colors">
                🥩 Protein Status
            </button>
            <button onClick={() => setUserInput("Suggest a low carb dinner")} className="whitespace-nowrap text-xs font-medium px-3 py-1.5 bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-300 rounded-full hover:bg-green-100 border border-green-100 dark:border-green-800/50 transition-colors">
                🍽 Dinner Idea
            </button>
            </div>
        )}
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/50 p-2 rounded-full border dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all shadow-inner">
          <button
            type="button"
            onClick={handleToggleListen}
            className={`flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask NutriPal..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-500"
          />
          <button
            type="submit"
            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-transform hover:scale-105 active:scale-95"
            disabled={isLoading || !userInput.trim()}
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}

// --- 3. Dashboard Component ---
function Dashboard() {
  const { user, goals, meals, todayTotals, setCurrentPage, theme } = useContext(AppContext);
  
  const calorieProgress = Math.min((todayTotals.calories / goals.calories) * 100, 100);
  const caloriesLeft = Math.max(0, goals.calories - todayTotals.calories);
  
  const calorieData = [
    { name: 'Calories', value: calorieProgress, fill: '#3b82f6' }
  ];

  const macroData = [
    { name: 'Protein', value: todayTotals.protein, goal: goals.protein, icon: Drumstick, color: 'text-emerald-500', bg: 'bg-emerald-500', barBg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { name: 'Carbs', value: todayTotals.carbs, goal: goals.carbs, icon: Leaf, color: 'text-amber-500', bg: 'bg-amber-500', barBg: 'bg-amber-100 dark:bg-amber-900/30' },
    { name: 'Fat', value: todayTotals.fat, goal: goals.fat, icon: Droplet, color: 'text-rose-500', bg: 'bg-rose-500', barBg: 'bg-rose-100 dark:bg-rose-900/30' },
  ];

  const weeklyData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      const dayMeals = meals.filter(m => m.date.startsWith(date));
      const totalCals = dayMeals.reduce((acc, m) => acc + m.calories, 0);
      data.push({
        name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        Calories: totalCals,
        Goal: goals.calories,
      });
    }
    return data;
  }, [meals, goals.calories]);

  const today = new Date().toISOString().split('T')[0];
  const recentMeals = meals
    .filter(meal => meal.date.startsWith(today))
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);
    
  const healthTip = "Based on your recent logs, try boosting your fiber intake with more vegetables at lunch!";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Dashboard</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <button onClick={() => setCurrentPage('tracker')} className="w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">
            <PlusCircle className="w-5 h-5" />
            Log Meal
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Calorie Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
           <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Calories Remaining</h3>
             <div className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">Goal: {goals.calories}</div>
           </div>
           
           <div className="flex flex-col sm:flex-row items-center justify-around gap-8">
             <div className="w-48 h-48 relative">
                {/* Custom Circular Progress Implementation using Recharts */}
               <ResponsiveContainer width="100%" height="100%">
                 <RadialBarChart 
                    cx="50%" cy="50%" innerRadius="70%" outerRadius="90%" 
                    barSize={20} data={calorieData} startAngle={90} endAngle={-270}
                 >
                   <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                   <RadialBar background dataKey="value" cornerRadius={10} fill="#3b82f6" />
                   <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold fill-gray-900 dark:fill-white">
                     {caloriesLeft}
                   </text>
                   <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-xs font-medium fill-gray-500 uppercase tracking-wider">
                     Left
                   </text>
                 </RadialBarChart>
               </ResponsiveContainer>
             </div>
             
             <div className="flex-1 w-full space-y-6">
               {macroData.map(macro => (
                 <MacroProgressCard key={macro.name} {...macro} />
               ))}
             </div>
           </div>
        </div>
        
        {/* Quick Actions & Tips */}
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Add</h3>
                <div className="grid grid-cols-2 gap-3">
                    {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(type => (
                        <button key={type} onClick={() => setCurrentPage('tracker')} className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition-colors group">
                            <div className="bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                {type === 'Breakfast' ? <Sun className="w-5 h-5 text-orange-400" /> : 
                                 type === 'Lunch' ? <Utensils className="w-5 h-5 text-blue-400" /> :
                                 type === 'Dinner' ? <Moon className="w-5 h-5 text-purple-400" /> :
                                 <Zap className="w-5 h-5 text-yellow-400" />}
                            </div>
                            <span className="text-xs font-semibold">{type}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-2xl shadow-sm border border-green-100 dark:border-green-800 p-5">
                <div className="flex items-start gap-3">
                    <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg flex-shrink-0">
                        <Leaf className="w-5 h-5 text-green-600 dark:text-green-300" />
                    </div>
                    <div>
                        <h4 className="font-bold text-green-800 dark:text-green-200 text-sm">Daily Insight</h4>
                        <p className="text-xs leading-relaxed text-green-700 dark:text-green-300 mt-1 opacity-90">{healthTip}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Weekly Chart */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Trends</h3>
                 <select className="text-sm bg-gray-100 dark:bg-gray-700 border-none rounded-lg px-3 py-1 focus:ring-0">
                     <option>Calories</option>
                     <option>Protein</option>
                 </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'light' ? '#f3f4f6' : '#374151'} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} dy={10} stroke={theme === 'light' ? '#9ca3af' : '#9ca3af'} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} stroke={theme === 'light' ? '#9ca3af' : '#9ca3af'} />
                  <Tooltip 
                    cursor={{ fill: theme === 'light' ? '#f9fafb' : '#1f2937' }}
                    contentStyle={{ backgroundColor: theme === 'light' ? '#fff' : '#1f2937', borderColor: theme === 'light' ? '#e5e7eb' : '#374151', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Bar dataKey="Calories" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
}

// --- 4. MealTracker Component ---
function MealTracker() {
  const { meals, deleteMeal } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredMeals = meals.filter(meal => meal.date.startsWith(selectedDate));
  
  const getMealsByType = (type) => filteredMeals.filter(meal => meal.type === type);
  
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  const totals = filteredMeals.reduce((acc, meal) => {
        acc.calories += meal.calories;
        acc.protein += meal.protein;
        acc.carbs += meal.carbs;
        acc.fat += meal.fat;
        return acc;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border dark:border-gray-700">
         <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Meal Log</h2>
            <p className="text-sm text-gray-500">Track your nutrition journey</p>
         </div>
         <div className="flex items-center gap-3">
            <div className="relative">
                <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)} 
                    className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500"
                />
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            </div>
            <button onClick={() => setShowModal(true)} className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 shadow-md transition-transform active:scale-95">
                <Plus className="w-5 h-5" />
            </button>
         </div>
      </div>
      
      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <StatStripCard label="Calories" value={totals.calories} unit="kcal" color="text-blue-600" bg="bg-blue-50 dark:bg-blue-900/20" />
         <StatStripCard label="Protein" value={totals.protein} unit="g" color="text-emerald-600" bg="bg-emerald-50 dark:bg-emerald-900/20" />
         <StatStripCard label="Carbs" value={totals.carbs} unit="g" color="text-amber-600" bg="bg-amber-50 dark:bg-amber-900/20" />
         <StatStripCard label="Fat" value={totals.fat} unit="g" color="text-rose-600" bg="bg-rose-50 dark:bg-rose-900/20" />
      </div>

      <div className="space-y-6">
        {mealTypes.map(type => {
          const mealsOfType = getMealsByType(type);
          return (
            <div key={type} className="animate-slide-in">
              <div className="flex items-center gap-3 mb-3 px-1">
                 <div className={`p-1.5 rounded-lg ${
                     type === 'breakfast' ? 'bg-orange-100 text-orange-600' :
                     type === 'lunch' ? 'bg-blue-100 text-blue-600' :
                     type === 'dinner' ? 'bg-purple-100 text-purple-600' :
                     'bg-yellow-100 text-yellow-600'
                 }`}>
                     {type === 'breakfast' ? <Sun className="w-4 h-4" /> :
                      type === 'lunch' ? <Utensils className="w-4 h-4" /> :
                      type === 'dinner' ? <Moon className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                 </div>
                 <h3 className="text-md font-bold capitalize text-gray-800 dark:text-gray-200">{type}</h3>
                 <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                 <span className="text-xs font-medium text-gray-500">
                    {mealsOfType.reduce((s, m) => s + m.calories, 0)} kcal
                 </span>
              </div>
              
              {mealsOfType.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {mealsOfType.map(meal => (
                      <MealCard key={meal.id} meal={meal} onDelete={() => deleteMeal(meal.id)} />
                    ))}
                  </div>
              ) : (
                  <div onClick={() => { /* open modal pre-filled */ }} className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 text-center cursor-pointer hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
                      <span className="text-sm text-gray-400 group-hover:text-blue-500 transition-colors">No {type} logged. Click + to add.</span>
                  </div>
              )}
            </div>
          );
        })}
      </div>
      
      {showModal && <AddMealModal onClose={() => setShowModal(false)} selectedDate={selectedDate} />}
    </div>
  );
}

function StatStripCard({ label, value, unit, color, bg }) {
    return (
        <div className={`${bg} p-4 rounded-xl flex flex-col items-center justify-center border border-white/10`}>
            <span className={`text-2xl font-bold ${color}`}>{Math.round(value)}</span>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label} <span className="normal-case opacity-70">({unit})</span></span>
        </div>
    )
}

// --- 5. LoginRegister Component ---
function LoginRegister() {
  const { handleLogin, handleRegister, handleForgotPassword, handleResetPassword } = useContext(AppContext);
  const [view, setView] = useState('login');
  const [form, setForm] = useState({
    email: '', password: '', name: '', age: '', height: '', weight: '',
    activityLevel: 'moderate', goal: 'lose', token: '', newPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (view === 'register') {
        await handleRegister({
          email: form.email, name: form.name, age: form.age,
          height: form.height, weight: form.weight,
          activityLevel: form.activityLevel, goal: form.goal
        });
      } else if (view === 'login') {
        await handleLogin(form.email, form.password);
      }
    } catch (error) {
      console.error("Auth failed");
    } finally {
        setIsLoading(false);
    }
  };

  const onForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await handleForgotPassword(form.email);
      setMessage(res.message);
      setTimeout(() => { setView('forgotReset'); setMessage(''); }, 1500);
    } catch (error) {
      setMessage('Error sending code');
    } finally { setIsLoading(false); }
  };

  const onResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await handleResetPassword(form.email, form.token, form.newPassword);
      setMessage(res.message);
      setTimeout(() => { setView('login'); setMessage(''); }, 1500);
    } catch (error) {
      setMessage('Error resetting password');
    } finally { setIsLoading(false); }
  };
  
  const renderView = () => {
    switch(view) {
      case 'login':
        return (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <AppInput label="Email" name="email" icon={<Mail className="w-5 h-5" />} onChange={handleChange} value={form.email} placeholder="alex@example.com" type="email" required />
            <AppInput label="Password" name="password" icon={<Lock className="w-5 h-5" />} onChange={handleChange} value={form.password} placeholder="••••••••" type="password" required />
            <div className="flex justify-between items-center text-sm">
               <label className="flex items-center text-gray-500">
                   <input type="checkbox" className="mr-2 rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
                   Remember me
               </label>
              <button type="button" onClick={() => { setView('forgotEmail'); setMessage(''); }} className="font-medium text-blue-600 hover:text-blue-500">Forgot password?</button>
            </div>
            <button type="submit" disabled={isLoading} className="w-full p-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-wait flex justify-center">
              {isLoading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In'}
            </button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              Don't have an account?
              <button type="button" onClick={() => { setView('register'); setMessage(''); }} className="font-bold text-blue-600 hover:underline ml-1">Sign up</button>
            </p>
          </form>
        );
      case 'register':
        return (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <AppInput label="Full Name" name="name" icon={<User className="w-5 h-5" />} onChange={handleChange} value={form.name} placeholder="Alex Johnson" required />
            <AppInput label="Email" name="email" icon={<Mail className="w-5 h-5" />} onChange={handleChange} value={form.email} placeholder="alex@example.com" type="email" required />
            <div className="grid grid-cols-3 gap-3">
              <AppInput label="Age" name="age" onChange={handleChange} value={form.age} placeholder="28" type="number" required noIcon />
              <AppInput label="H (cm)" name="height" onChange={handleChange} value={form.height} placeholder="175" type="number" required noIcon />
              <AppInput label="W (kg)" name="weight" onChange={handleChange} value={form.weight} placeholder="70" type="number" required noIcon />
            </div>
            <AppSelect label="Activity Level" name="activityLevel" onChange={handleChange} value={form.activityLevel}>
              <option value="sedentary">Sedentary (Office job)</option>
              <option value="light">Light (1-2 days/week)</option>
              <option value="moderate">Moderate (3-5 days/week)</option>
              <option value="active">Active (6-7 days/week)</option>
            </AppSelect>
             <AppSelect label="Goal" name="goal" onChange={handleChange} value={form.goal}>
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain">Gain Muscle</option>
            </AppSelect>
            <button type="submit" disabled={isLoading} className="w-full p-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 disabled:opacity-70 mt-4">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
             <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Already have an account? <button type="button" onClick={() => setView('login')} className="font-bold text-blue-600 hover:underline">Log in</button>
            </p>
          </form>
        );
      case 'forgotEmail':
        return (
          <form onSubmit={onForgotPassword} className="space-y-4 animate-fade-in">
            <p className="text-sm text-gray-500 mb-4">Enter your email address and we'll send you a code to reset your password.</p>
            <AppInput label="Email" name="email" icon={<Mail className="w-5 h-5" />} onChange={handleChange} value={form.email} placeholder="alex@example.com" type="email" required />
            {message && <p className="text-sm text-green-500 font-medium bg-green-50 p-2 rounded-lg">{message}</p>}
            <button type="submit" disabled={isLoading} className="w-full p-3 bg-blue-600 text-white rounded-xl font-semibold">
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
            <button type="button" onClick={() => setView('login')} className="w-full text-center text-sm text-gray-500 mt-2 hover:text-gray-700">Back to Login</button>
          </form>
        );
      case 'forgotReset':
        return (
           <form onSubmit={onResetPassword} className="space-y-4 animate-fade-in">
            <AppInput label="6-Digit Code" name="token" icon={<Lock className="w-5 h-5" />} onChange={handleChange} value={form.token} placeholder="123456" type="text" required />
            <AppInput label="New Password" name="newPassword" icon={<Lock className="w-5 h-5" />} onChange={handleChange} value={form.newPassword} placeholder="••••••••" type="password" required />
            {message && <p className="text-sm text-green-500 font-medium bg-green-50 p-2 rounded-lg">{message}</p>}
            <button type="submit" disabled={isLoading} className="w-full p-3 bg-blue-600 text-white rounded-xl font-semibold">
              {isLoading ? 'Resetting...' : 'Set New Password'}
            </button>
          </form>
        )
      default: return null;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-slide-up">
        <div className="p-8 text-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-700 dark:to-gray-800">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-500/40 transform -rotate-6">
             <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {view === 'login' ? 'Welcome Back!' : view === 'register' ? 'Join NutriPal' : 'Reset Password'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
             {view === 'login' ? 'Your personal AI nutrition coach awaits.' : 'Start your healthy journey today.'}
          </p>
        </div>
        <div className="p-8 pt-2">
          {renderView()}
        </div>
      </div>
    </div>
  );
}

// --- 6. Profile & Settings ---
function ProfileSettings() {
  const { user, goals, updateProfile, updateGoals, theme, setTheme } = useContext(AppContext);
  const [profile, setProfile] = useState(user);
  const [goalData, setGoalData] = useState(goals);

  useEffect(() => {
    setProfile(user);
    setGoalData(goals);
  }, [user, goals]);

  const handleProfileChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });
  const handleGoalChange = (e) => setGoalData({ ...goalData, [e.target.name]: e.target.value });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden">
         <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
             <h3 className="text-xl font-bold text-gray-900 dark:text-white">Personal Details</h3>
             <button onClick={() => updateProfile(profile)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">Save Changes</button>
         </div>
         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <AppInput label="Full Name" name="name" value={profile.name} onChange={handleProfileChange} icon={<User className="w-4 h-4"/>} />
            <AppInput label="Email" name="email" value={profile.email} onChange={handleProfileChange} type="email" icon={<Mail className="w-4 h-4"/>} />
            <div className="grid grid-cols-3 gap-4 md:col-span-2">
                <AppInput label="Age" name="age" value={profile.age} onChange={handleProfileChange} type="number" noIcon />
                <AppInput label="Height (cm)" name="height" value={profile.height} onChange={handleProfileChange} type="number" noIcon />
                <AppInput label="Weight (kg)" name="weight" value={profile.weight} onChange={handleProfileChange} type="number" noIcon />
            </div>
         </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 overflow-hidden">
         <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
             <div>
                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">Nutrition Goals</h3>
                 <p className="text-sm text-gray-500">Daily macro targets</p>
             </div>
             <button onClick={() => updateGoals(goalData)} className="px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors">Update Goals</button>
         </div>
         <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="col-span-2 md:col-span-1">
               <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Calories</label>
               <div className="relative">
                   <input type="number" name="calories" value={goalData.calories} onChange={handleGoalChange} className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-mono text-lg" />
                   <span className="absolute right-3 top-3.5 text-xs text-gray-400">kcal</span>
               </div>
            </div>
            <div>
               <label className="block text-xs font-bold text-emerald-600 uppercase mb-1">Protein</label>
               <div className="relative">
                   <input type="number" name="protein" value={goalData.protein} onChange={handleGoalChange} className="w-full p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border-none focus:ring-2 focus:ring-emerald-500 font-mono text-lg text-emerald-700 dark:text-emerald-300" />
                   <span className="absolute right-3 top-3.5 text-xs text-emerald-400 opacity-70">g</span>
               </div>
            </div>
            <div>
               <label className="block text-xs font-bold text-amber-600 uppercase mb-1">Carbs</label>
               <div className="relative">
                   <input type="number" name="carbs" value={goalData.carbs} onChange={handleGoalChange} className="w-full p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border-none focus:ring-2 focus:ring-amber-500 font-mono text-lg text-amber-700 dark:text-amber-300" />
                   <span className="absolute right-3 top-3.5 text-xs text-amber-400 opacity-70">g</span>
               </div>
            </div>
            <div>
               <label className="block text-xs font-bold text-rose-600 uppercase mb-1">Fat</label>
               <div className="relative">
                   <input type="number" name="fat" value={goalData.fat} onChange={handleGoalChange} className="w-full p-3 bg-rose-50 dark:bg-rose-900/20 rounded-xl border-none focus:ring-2 focus:ring-rose-500 font-mono text-lg text-rose-700 dark:text-rose-300" />
                   <span className="absolute right-3 top-3.5 text-xs text-rose-400 opacity-70">g</span>
               </div>
            </div>
         </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border dark:border-gray-700 p-6 flex items-center justify-between">
         <div className="flex items-center gap-3">
             <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-yellow-100 text-yellow-600'}`}>
                 {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
             </div>
             <div>
                 <h3 className="font-bold text-gray-900 dark:text-white">Appearance</h3>
                 <p className="text-sm text-gray-500">Toggle dark mode theme</p>
             </div>
         </div>
         <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'}`}
         >
            <span className={`${theme === 'dark' ? 'translate-x-7' : 'translate-x-1'} inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm`} />
         </button>
      </div>
    </div>
  );
}

// --- Helper Components ---
function BackgroundAnimation() {
  const { theme } = useContext(AppContext);
  return (
    <div className={`fixed inset-0 w-full h-full -z-10 overflow-hidden ${theme === 'light' ? 'bg-gray-50' : 'bg-gray-900'}`}>
      <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-200/30 dark:bg-blue-900/20 blur-[100px] animate-pulse"></div>
      <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 dark:bg-purple-900/20 blur-[100px] animate-pulse delay-700"></div>
    </div>
  );
}

function AppInput({ label, name, value, onChange, type = 'text', placeholder = '', required = false, icon, noIcon = false }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">{label}</label>
      <div className="relative">
        {!noIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full py-2.5 ${noIcon ? 'px-3' : 'pl-10 pr-3'} bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow`}
        />
      </div>
    </div>
  );
}

function AppSelect({ label, name, value, onChange, children }) {
   return (
    <div>
      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">{label}</label>
      <div className="relative">
          <select
            name={name}
            value={value}
            onChange={onChange}
            className="w-full py-2.5 pl-3 pr-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
          >
            {children}
          </select>
          <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

function MacroProgressCard({ name, value, goal, icon: Icon, color, bg, barBg }) {
  const progress = Math.min((value / goal) * 100, 100);
  return (
    <div className="group">
      <div className="flex justify-between items-end mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="font-medium text-gray-700 dark:text-gray-200">{name}</span>
        </div>
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
            <span className={`text-sm font-bold ${color}`}>{Math.round(value)}</span> / {goal}g
        </div>
      </div>
      <div className={`w-full ${barBg} rounded-full h-2.5 overflow-hidden`}>
        <div
          className={`h-full rounded-full ${bg} transition-all duration-1000 ease-out group-hover:opacity-80`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

function MealCard({ meal, onDelete }) {
  return (
    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors group">
      <div className="flex items-center gap-3">
          <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg text-gray-500 dark:text-gray-400">
             {meal.type === 'breakfast' ? <Sun className="w-4 h-4" /> :
              meal.type === 'lunch' ? <Utensils className="w-4 h-4" /> :
              meal.type === 'dinner' ? <Moon className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white text-sm">{meal.name}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="font-medium text-blue-600 dark:text-blue-400">{meal.calories} kcal</span>
                <span>•</span>
                <span>P: {meal.protein}g</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">C: {meal.carbs}g</span>
            </div>
          </div>
      </div>
      <button 
        onClick={onDelete} 
        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Delete meal"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function AddMealModal({ onClose, selectedDate }) {
  const { addMeal } = useContext(AppContext);
  const [form, setForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', type: 'snack' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMeal = {
      name: form.name,
      calories: parseInt(form.calories) || 0,
      protein: parseInt(form.protein) || 0,
      carbs: parseInt(form.carbs) || 0,
      fat: parseInt(form.fat) || 0,
      type: form.type,
      date: new Date(selectedDate).toISOString()
    };
    await addMeal(newMeal);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b dark:border-gray-700 pb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Meal</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <AppInput label="Food Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g., Avocado Toast" required />
          
          <div className="grid grid-cols-2 gap-4">
            <AppInput label="Calories" name="calories" value={form.calories} onChange={handleChange} placeholder="350" type="number" required />
            <AppSelect label="Meal Type" name="type" value={form.type} onChange={handleChange}>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </AppSelect>
          </div>
          
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
              <p className="text-xs font-bold text-gray-500 uppercase mb-3">Macros (Optional)</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                    <input type="number" name="protein" value={form.protein} onChange={handleChange} placeholder="0" className="w-full p-2 text-center text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500" />
                    <span className="text-[10px] text-gray-400 mt-1 block">Protein (g)</span>
                </div>
                <div className="text-center">
                    <input type="number" name="carbs" value={form.carbs} onChange={handleChange} placeholder="0" className="w-full p-2 text-center text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500" />
                    <span className="text-[10px] text-gray-400 mt-1 block">Carbs (g)</span>
                </div>
                <div className="text-center">
                    <input type="number" name="fat" value={form.fat} onChange={handleChange} placeholder="0" className="w-full p-2 text-center text-sm bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-1 focus:ring-blue-500" />
                    <span className="text-[10px] text-gray-400 mt-1 block">Fat (g)</span>
                </div>
              </div>
          </div>
          
          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all active:scale-95">
            Add Entry
          </button>
        </form>
      </div>
    </div>
  );
}

function NotificationBanner({ message, type, onClose }) {
  const styles = {
    success: 'bg-emerald-500 text-white shadow-emerald-500/30',
    error: 'bg-red-500 text-white shadow-red-500/30',
    info: 'bg-blue-500 text-white shadow-blue-500/30',
  };
  
  return (
    <div className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-slide-in-right ${styles[type] || styles.info}`}>
      {type === 'success' ? <CheckCircle className="w-5 h-5" /> : type === 'error' ? <X className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
      <p className="font-medium text-sm">{message}</p>
      <button onClick={onClose} className="ml-2 opacity-80 hover:opacity-100"><X className="w-4 h-4" /></button>
    </div>
  );
}
