import React, { useState, useEffect, createContext, useContext, useMemo, useRef } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar, PolarAngleAxis } from 'recharts';
import { Home, BarChart2, MessageSquare, Utensils, User, LogOut, Settings, Bell, Mic, Volume2, Send, Droplet, Zap, Fish, Leaf, Drumstick, Brain, Sun, Moon, Calendar, Download, Target, Plus, Trash2, X, ChevronDown, CheckCircle, Search, Clock, PlusCircle, Lock, Mail } from 'lucide-react';

// --- Global Context for State Management ---
const AppContext = createContext();

// --- Main App Component ---
export default function App() {
  const [auth, setAuth] = useState({ isLoggedIn: false, token: null });
  const [user, setUser] = useState(null); // Start as null
  const [goals, setGoals] = useState(null); // Start as null
  const [meals, setMeals] = useState([]); // Start as empty
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [theme, setTheme] = useState('light');
  const [notification, setNotification] = useState(null);
  const [isLoadingApp, setIsLoadingApp] = useState(false); // To prevent flashing login screen

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  
  // --- Notification Helper ---
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };
  
  // --- API Helper Function ---
  const api = async (url, method, body = null) => {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    if (auth.token) {
      headers.append('Authorization', `Bearer ${auth.token}`);
    }
    
    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }
    
    try {
      const response = await fetch(`http://localhost:3001${url}`, options);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API call failed');
      }
      return await response.json();
    } catch (error) {
      console.error('API Error:', error.message);
      showNotification(error.message, 'error');
      throw error; // Re-throw to stop calling function
    }
  };

  // --- API-like Functions (Now Real) ---
  
  const loadAppData = async (token) => {
    // Temporarily set auth state to make the API call
    // We update state *functionally* to ensure we use the new token
    setAuth({ isLoggedIn: true, token: token });
    
    try {
      // Use a temporary auth object for the API call
      // This is a workaround for api helper not having the new token yet
      const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      const response = await fetch(`http://localhost:3001/api/me`, { headers });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API call failed');
      }
      const data = await response.json();
      
      setUser(data.user);
      setGoals(data.goals);
      setMeals(data.meals);
      setCurrentPage('dashboard');
      showNotification('Welcome back, ' + data.user.name + '!');
    } catch (error) {
      // If load fails, log them out
      setAuth({ isLoggedIn: false, token: null });
    }
  };

  const handleLogin = async (email, password) => {
    
    // --- MOCK USER ---
    if (email === 'mock@user.com') {
      console.log('Using Mock User');
      setAuth({ isLoggedIn: true, token: 'mock-token' });
      setUser({
        id: 'mock-id',
        name: 'Mock User',
        email: 'mock@user.com',
        age: 30,
        height: 175,
        weight: 70,
        activityLevel: 'moderate',
        goal: 'maintain',
      });
      setGoals({
        id: 'mock-goal-id',
        userId: 'mock-id',
        calories: 2500,
        protein: 150,
        carbs: 300,
        fat: 80,
      });
      setMeals([
        {id: 1, date: new Date().toISOString(), name: 'Mock Breakfast', calories: 450, protein: 30, carbs: 50, fat: 15, type: 'breakfast'},
        {id: 2, date: new Date().toISOString(), name: 'Mock Lunch', calories: 650, protein: 40, carbs: 70, fat: 25, type: 'lunch'},
      ]);
      setCurrentPage('dashboard');
      showNotification('Logged in as Mock User!');
      return; // Skip API call
    }
    // --- END MOCK USER ---
    
    try {
      const data = await api('/api/login', 'POST', { email, password });
      // We got a token, now load all the user's data
      await loadAppData(data.token);
    } catch (error) {
      console.log('Login failed');
      throw error; // <-- Re-throw error so LoginRegister can catch it
    }
  };

  const handleRegister = async (regData) => {
    try {
      const data = await api('/api/register', 'POST', regData);
      // We got a token, now load the new user's data
      await loadAppData(data.token);
    } catch (error) {
      console.log('Registration failed');
      throw error; // <-- Re-throw error so LoginRegister can catch it
    }
  };

  const handleLogout = () => {
    setAuth({ isLoggedIn: false, token: null });
    setUser(null);
    setGoals(null);
    setMeals([]);
    showNotification('Logged out successfully.', 'info');
  };

  const handleForgotPassword = async (email) => {
    try {
      const data = await api('/api/forgot-password', 'POST', { email });
      return data; // Return success data
    } catch (error) {
      console.log('Forgot password request failed');
      throw error; // Re-throw for the component to catch
    }
  };

  const handleResetPassword = async (email, token, newPassword) => {
    try {
      const data = await api('/api/reset-password', 'POST', { email, token, newPassword });
      return data; // Return success data
    } catch (error) {
      console.log('Reset password request failed');
      throw error; // Re-throw for the component to catch
    }
  };
  
  const addMeal = async (meal) => {
    try {
      // Add date here, ensuring it's the *selected date* not just 'today'
      // For simplicity, we'll keep it as today. A better implementation
      // would pass the selectedDate from MealTracker to the modal.
      const newMeal = await api('/api/meals', 'POST', { ...meal, date: meal.date || new Date().toISOString() });
      setMeals(prevMeals => [...prevMeals, newMeal]);
      showNotification('Meal added!');
    } catch (error) {
      console.log('Add meal failed');
    }
  };

  const deleteMeal = async (id) => {
    try {
      await api(`/api/meals/${id}`, 'DELETE');
      setMeals(prevMeals => prevMeals.filter(meal => meal.id !== id));
      showNotification('Meal removed.', 'info');
    } catch (error) {
      console.log('Delete meal failed');
    }
  };

  const updateProfile = async (updatedUser) => {
    try {
      const data = await api('/api/profile', 'PUT', updatedUser);
      setUser(data);
      showNotification('Profile updated!');
    } catch(error) {
      console.log('Profile update failed');
    }
  };

  const updateGoals = async (updatedGoals) => {
    try {
      const data = await api('/api/goals', 'PUT', updatedGoals);
      setGoals(data);
      showNotification('Goals updated!');
    } catch(error) {
      console.log('Goal update failed');
    }
  };

  // --- Utility Functions (Memoization) ---
  const getTodayString = () => new Date().toISOString().split('T')[0];

  const todayTotals = useMemo(() => {
    if (!meals) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    const today = getTodayString();
    return meals
      .filter(meal => meal.date.startsWith(today)) // Use startsWith as date is now DateTime
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

  // Show a loading spinner or nothing while user/goals are null
  const isLoading = !user || !goals;

  return (
    <AppContext.Provider value={contextValue}>
      <div className={`relative min-h-screen ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900 text-white'} font-inter`}>
        <BackgroundAnimation />
        
        {notification && <NotificationBanner message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
        
        <div className="relative z-10">
          {!auth.isLoggedIn ? (
            <LoginRegister />
          ) : (
            // Wait for user and goals to be loaded before rendering app
            isLoading ? (
              <div className="flex items-center justify-center min-h-screen">
                <Brain className="w-12 h-12 text-blue-500 animate-spin" />
              </div>
            ) : (
              <div className="flex">
                <DesktopSidebar />
                <div className="flex-1 flex flex-col lg:ml-64">
                  <MobileHeader />
                  <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {currentPage === 'dashboard' && <Dashboard />}
                    {currentPage === 'tracker' && <MealTracker />}
                    {currentPage === 'chatbot' && <Chatbot />}
                    {currentPage === 'profile' && <ProfileSettings />}
                  </main>
                </div>
                <MobileBottomNav />
              </div>
            )
          )}
        </div>
      </div>
    </AppContext.Provider>
  );
}

// --- 1. Navigation Components (Refactored) ---
function DesktopSidebar() {
  const { user, handleLogout, currentPage, setCurrentPage } = useContext(AppContext);
  const userInitials = user.name.split(' ').map(n => n[0]).join('');

  const navItems = [
    { name: 'Dashboard', icon: Home, page: 'dashboard' },
    { name: 'Meal Tracker', icon: Utensils, page: 'tracker' },
    { name: 'AI Coach', icon: MessageSquare, page: 'chatbot' },
    { name: 'Profile', icon: User, page: 'profile' },
  ];

  return (
    <nav className="hidden lg:flex flex-col fixed top-0 left-0 w-64 h-full bg-white dark:bg-gray-800 border-r dark:border-gray-700 shadow-sm">
      <div className="flex items-center h-20 px-6 border-b dark:border-gray-700">
        <Brain className="text-blue-500 w-8 h-8 mr-2" />
        <span className="text-xl font-bold text-gray-900 dark:text-white">NutriPal AI</span>
      </div>
      
      <div className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <button
            key={item.page}
            onClick={() => setCurrentPage(item.page)}
            className={`flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium ${currentPage === item.page ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.name}
          </button>
        ))}
      </div>
      
      <div className="p-4 border-t dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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
  const [profileOpen, setProfileOpen] = useState(false);
  const userInitials = user.name.split(' ').map(n => n[0]).join('');

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
    <header className="lg:hidden sticky top-0 flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 z-10">
      <h1 className="text-lg font-bold text-gray-900 dark:text-white">{pageTitle}</h1>
      <div className="flex items-center gap-2">
        <button className="text-gray-500 dark:text-gray-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <Bell className="w-6 h-6" />
          <span className="absolute top-3 right-10 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
            {userInitials}
          </div>
        </button>
      </div>
    </header>
  );
}

function MobileBottomNav() {
  const { currentPage, setCurrentPage } = useContext(AppContext);
  const navItems = [
    { name: 'Dashboard', icon: Home, page: 'dashboard' },
    { name: 'Tracker', icon: Utensils, page: 'tracker' },
    { name: 'AI Coach', icon: MessageSquare, page: 'chatbot' },
    { name: 'Profile', icon: User, page: 'profile' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-800 border-t dark:border-gray-700 z-20 flex justify-around items-center h-16">
      {navItems.map(item => (
        <button
          key={item.page}
          onClick={() => setCurrentPage(item.page)}
          className={`flex flex-col items-center justify-center p-2 rounded-lg ${currentPage === item.page ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`}
        >
          <item.icon className="w-6 h-6" />
          <span className="text-xs font-medium">{item.name}</span>
        </button>
      ))}
    </nav>
  );
}

// --- 2. Chatbot Component ---
function Chatbot() {
  const { user, goals, todayTotals, addMeal, showNotification } = useContext(AppContext);
  const [messages, setMessages] = useState([
    { role: 'bot', text: `Hi ${user.name}! I'm NutriPal, your AI nutrition coach. How can I help you today? You can ask me to log meals, give you suggestions, or create a plan.` }
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
1.  **Be Conversational & Encouraging:** Use their name. Keep replies concise.
2.  **Analyze User Goals:** If they ask for a plan (e.g., "lose 5kg in 2 months"), create a high-level, sample plan.
3.  **Give Meal Suggestions:** Base suggestions on their remaining calories and macros.
4.  **Log Meals:** If a user says "Log 2 eggs and a banana for breakfast", you MUST respond with a JSON object in this *exact* format:
    {"action": "log_meal", "meal": {"name": "2 eggs and a banana", "calories": 230, "protein": 13, "carbs": 28, "fat": 10, "type": "breakfast"}}
    (Estimate macros if not provided). For any other request, just respond with natural text.
5.  **Answer Questions:** Provide nutritional tips and answer questions based on science.
6.  **Contextual Memory:** Remember the last few messages (they will be provided in the chat history).
7.  **DO NOT:** Give medical advice. Defer to a doctor.`;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const callGeminiAPI = async (chatHistory) => {
    setIsLoading(true);
    
    const apiKey = "AIzaSyD-fl2r8BtwL6TdVO75e6ZYjnZOYdH_y1o"; // API key is handled by the environment
    const apiUrl = `https://generativanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    const contents = chatHistory.map(msg => ({
      role: msg.role === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
    };
    
    let response;
    let delay = 1000;
    for (let i = 0; i < 5; i++) {
      try {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          break; 
        } else if (response.status === 429 || response.status >= 500) {
          console.warn(`API call failed with status ${response.status}. Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2;
        } else {
          // --- NEW: Better error logging ---
          // Try to parse the error response from Google
          let errorBody = { error: { message: `API call failed with status ${response.status}` } };
          try {
            errorBody = await response.json();
          } catch (e) {
            // Do nothing, just use the default error
          }
          const errorMessage = errorBody.error?.message || `API call failed with status ${response.status}`;
          console.error('Gemini API Error:', response.status, errorBody);
          throw new Error(errorMessage);
          // --- End of new logic ---
        }
      } catch (error) {
        if (i === 4) {
          console.error('Error fetching from Gemini API:', error);
          setIsLoading(false);
          setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
          return;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= 2;
      }
    }

    if (!response || !response.ok) {
       console.error('API call failed after retries. Last status:', response?.status); // Improved log
       setIsLoading(false);
       setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
       return;
    }

    const result = await response.json();
    let botResponse = "Sorry, I couldn't generate a response.";
    
    try {
      botResponse = result.candidates[0].content.parts[0].text;
    } catch (e) {
      console.error('Error parsing Gemini response:', e, result);
    }
    
    try {
      const jsonResponse = JSON.parse(botResponse);
      if (jsonResponse.action === 'log_meal' && jsonResponse.meal) {
        // Use the addMeal function from context, which is now an API call
        await addMeal(jsonResponse.meal);
        const confirmation = `Got it! I've logged "${jsonResponse.meal.name}" (${jsonResponse.meal.calories} kcal) for you. Anything else?`;
        setMessages(prev => [...prev, { role: 'bot', text: confirmation }]);
      } else {
        setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', text: botResponse }]);
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
    callGeminiAPI(newChatHistory.slice(-10));
  };

  const handleToggleListen = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        showNotification('Voice recognition is not supported in your browser.', 'error');
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
        const newUserMessage = { role: 'user', text: transcript };
        const newChatHistory = [...messages, newUserMessage];
        setMessages(newChatHistory);
        setUserInput('');
        callGeminiAPI(newChatHistory.slice(-10));
      };
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
      recognitionRef.current.start();
    }
  };

  const handleSpeak = (text) => {
    if (!window.speechSynthesis) {
      showNotification('Text-to-speech is not supported in your browser.', 'error');
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };
  
  const handleSmartReply = (text) => {
    const newUserMessage = { role: 'user', text: text };
    const newChatHistory = [...messages, newUserMessage];
    setMessages(newChatHistory);
    callGeminiAPI(newChatHistory.slice(-10));
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-14rem)] lg:h-[calc(100vh-6rem)]">
      <div className="flex-1 overflow-y-auto p-4 bg-white dark:bg-gray-800 rounded-lg shadow-inner space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-lg' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-lg'}`}>
              <p>{msg.text}</p>
              {msg.role === 'bot' && (
                <button onClick={() => handleSpeak(msg.text)} className="mt-2 text-blue-500 dark:text-blue-400 opacity-70 hover:opacity-100">
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-2xl bg-gray-200 dark:bg-gray-700 rounded-bl-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce-fast"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce-medium"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce-slow"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="mt-4">
        <div className="flex gap-2 mb-2">
          <button onClick={() => handleSmartReply("What's my status for today?")} className="text-xs px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">Today's Status</button>
          <button onClick={() => handleSmartPla("Suggest a healthy snack.")} className="text-xs px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">Suggest Snack</button>
          <button onClick={() => handleSmartReply("What should I have for dinner?")} className="text-xs px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600">Dinner Idea</button>
        </div>
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleListen}
            className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
          >
            <Mic className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message or use mic..."
            className="flex-1 px-4 py-2 border rounded-full bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
            disabled={isLoading || !userInput.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

// --- 3. Dashboard Component ---
function Dashboard() {
  const { user, goals, meals, todayTotals, setCurrentPage, theme } = useContext(AppContext);
  
  // Prepare chart data
  const calorieProgress = Math.min((todayTotals.calories / goals.calories) * 100, 100);
  const caloriesLeft = Math.max(0, goals.calories - todayTotals.calories);
  
  const calorieData = [
    { name: 'Calories', value: calorieProgress, fill: '#3b82f6' }
  ];

  const macroData = [
    { name: 'Protein', value: todayTotals.protein, goal: goals.protein, icon: Drumstick, color: 'text-green-500', bg: 'bg-green-500' },
    { name: 'Carbs', value: todayTotals.carbs, goal: goals.carbs, icon: Leaf, color: 'text-yellow-500', bg: 'bg-yellow-500' },
    { name: 'Fat', value: todayTotals.fat, goal: goals.fat, icon: Droplet, color: 'text-red-500', bg: 'bg-red-500' },
  ];

  // Get last 7 days of data
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
    .sort((a, b) => b.id - a.id) // Show most recent first
    .slice(0, 3);
    
  const healthTip = "Your fat intake was a bit high yesterday. Try incorporating more leafy greens or lean protein sources today!";

  return (
    <div className="space-y-6 pb-16 lg:pb-0">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Good morning, {user.name.split(' ')[0]}!</h2>
      
      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Main) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Progress Card */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Today's Progress</h3>
            <div className="flex flex-col sm:flex-row items-center justify-around">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius="70%"
                    outerRadius="90%"
                    barSize={20}
                    data={calorieData}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={10}
                      fill="#3b82f6"
                    />
                    <text
                      x="50%"
                      y="50%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-4xl font-bold fill-current dark:fill-white"
                    >
                      {Math.round(todayTotals.calories)}
                    </text>
                     <text
                      x="50%"
                      y="65%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-sm fill-gray-500 dark:fill-gray-400"
                    >
                      Kcal
                    </text>
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">Calories Eaten</p>
                <p className="text-4xl font-bold text-gray-900 dark:text-white">{Math.round(todayTotals.calories)}</p>
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400">Remaining</p>
                  <p className="text-2xl font-bold text-blue-500">{caloriesLeft} <span className="text-lg">kcal</span></p>
                </div>
              </div>
              
              {/* Macro Stats */}
              <div className="flex flex-row sm:flex-col gap-4 mt-4 sm:mt-0">
                {macroData.map(macro => (
                  <div key={macro.name} className="flex items-center gap-2">
                    <macro.icon className={`w-5 h-5 ${macro.color}`} />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{macro.name}</p>
                      <p className="text-md font-bold text-gray-900 dark:text-white">{Math.round(macro.value)}g</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Weekly Chart */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Weekly Calorie Trend</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} className="dark:fill-gray-300" />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} className="dark:fill-gray-300" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'light' ? '#fff' : '#1f2937',
                      borderColor: theme === 'light' ? '#e5e7eb' : '#374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Bar dataKey="Calories" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Goal" fill={theme === 'light' ? '#e5e7eb' : '#4b5563'} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
        </div>
        
        {/* Right Column (Secondary) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Macro Goals */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Macro Goals</h3>
            <div className="space-y-4">
              {macroData.map(macro => (
                <MacroProgressCard key={macro.name} {...macro} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Quick Add</h3>
            <div className="grid grid-cols-2 gap-2">
              <QuickAddButton label="Breakfast" onClick={() => setCurrentPage('tracker')} />
              <QuickAddButton label="Lunch" onClick={() => setCurrentPage('tracker')} />
              <QuickAddButton label="Dinner" onClick={() => setCurrentPage('tracker')} />
              <QuickAddButton label="Snack" onClick={() => setCurrentPage('tracker')} />
            </div>
          </div>
          
          {/* Recent Meals */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Recent Meals Today</h3>
            <div className="space-y-3">
              {recentMeals.length > 0 ? (
                recentMeals.map(meal => (
                  <div key={meal.id} className="flex items-center">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 dark:text-white">{meal.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{meal.calories} kcal &bull; {meal.type}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No meals logged yet today.</p>
              )}
               <button onClick={() => setCurrentPage('tracker')} className="w-full mt-2 text-sm text-blue-500 font-medium hover:underline">
                See all
              </button>
            </div>
          </div>

          {/* Health Tip */}
          <div className="p-6 bg-green-50 dark:bg-green-900/20 rounded-xl shadow-lg border border-green-200 dark:border-green-800">
             <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-green-500" />
              <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">Health Tip</h3>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300">{healthTip}</p>
          </div>
          
        </div>
      </div>
    </div>
  );
}

// --- 4. MealTracker Component ---
function MealTracker() {
  const { meals, addMeal, deleteMeal } = useContext(AppContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredMeals = meals.filter(meal => meal.date.startsWith(selectedDate));
  
  const getMealsByType = (type) => {
    return filteredMeals.filter(meal => meal.type === type);
  }
  
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];
  const totals = filteredMeals.reduce((acc, meal) => {
        acc.calories += meal.calories;
        acc.protein += meal.protein;
        acc.carbs += meal.carbs;
        acc.fat += meal.fat;
        return acc;
      }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  return (
    <div className="space-y-6 pb-16 lg:pb-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Meal Tracker</h2>
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={() => setShowModal(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 shadow">
            <PlusCircle className="w-5 h-5" />
            Add Meal
          </button>
        </div>
      </div>
      
      {/* Daily Summary Card */}
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Summary for {selectedDate}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
          <MacroSummary value={totals.calories} label="Calories" color="text-blue-500" />
          <MacroSummary value={totals.protein} label="Protein (g)" color="text-green-500" />
          <MacroSummary value={totals.carbs} label="Carbs (g)" color="text-yellow-500" />
          <MacroSummary value={totals.fat} label="Fat (g)" color="text-red-500" />
        </div>
      </div>

      {/* Meal List */}
      <div className="space-y-6">
        {mealTypes.map(type => {
          const mealsOfType = getMealsByType(type);
          if (mealsOfType.length === 0) return null;
          return (
            <div key={type}>
              <h3 className="text-xl font-semibold capitalize mb-3 text-gray-900 dark:text-white">{type}</h3>
              <div className="space-y-3">
                {mealsOfType.map(meal => (
                  <MealCard key={meal.id} meal={meal} onDelete={() => deleteMeal(meal.id)} />
                ))}
              </div>
            </div>
          );
        })}
        {filteredMeals.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">No meals logged for this day.</p>
          </div>
        )}
      </div>
      
      {showModal && <AddMealModal onClose={() => setShowModal(false)} selectedDate={selectedDate} />}
    </div>
  );
}

// --- 5. LoginRegister Component ---
function LoginRegister() {
  const { handleLogin, handleRegister, handleForgotPassword, handleResetPassword } = useContext(AppContext);
  const { theme } = useContext(AppContext);
  const [view, setView] = useState('login'); // 'login', 'register', 'forgotEmail', 'forgotReset'
  const [form, setForm] = useState({
    email: '', password: '', name: '', age: '', height: '', weight: '',
    activityLevel: 'moderate', goal: 'maintain',
    token: '', newPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (view === 'register') {
        await handleRegister({
          email: form.email,
          password: form.password,
          name: form.name,
          age: form.age,
          height: form.height,
          weight: form.weight,
          activityLevel: form.activityLevel,
          goal: form.goal
        });
      } else if (view === 'login') {
        await handleLogin(form.email, form.password);
      }
    } catch (error) {
      console.error("Login/Register failed");
      setIsLoading(false); // <-- FIX: Reset loading on error
    }
    // Don't reset loading on success, component will unmount
  };

  const onForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const res = await handleForgotPassword(form.email);
      setMessage(res.message);
      setView('forgotReset');
    } catch (error) {
      setMessage(error.message || 'An error occurred.');
    } finally {
      setIsLoading(false); // <-- FIX: Use finally to always reset loading
    }
  };

  const onResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const res = await handleResetPassword(form.email, form.token, form.newPassword);
      setMessage(res.message);
      setView('login');
      setForm({ ...form, token: '', newPassword: '', password: '' });
    } catch (error) {
      setMessage(error.message || 'An error occurred.');
    } finally {
      setIsLoading(false); // <-- FIX: Use finally to always reset loading
    }
  };
  
  const renderView = () => {
    switch(view) {
      case 'login':
        return (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <AppInput label="Email" name="email" icon={<Mail className="w-5 h-5" />} onChange={handleChange} value={form.email} placeholder="alex@example.com" type="email" required />
            <AppInput label="Password" name="password" icon={<Lock className="w-5 h-5" />} onChange={handleChange} value={form.password} placeholder="••••••••" type="password" required />
            <div className="text-right text-sm">
              <button type="button" onClick={() => { setView('forgotEmail'); setMessage(''); }} className="font-medium text-blue-500 hover:underline">
                Forgot password?
              </button>
            </div>
            <button type="submit" disabled={isLoading} className="w-full p-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 shadow-md transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50">
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?
              <button type="button" onClick={() => { setView('register'); setMessage(''); }} className="font-medium text-blue-500 hover:underline ml-1">
                Sign up
              </button>
            </p>
          </form>
        );
      case 'register':
        return (
          <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
            <AppInput label="Full Name" name="name" icon={<User className="w-5 h-5" />} onChange={handleChange} value={form.name} placeholder="Alex Johnson" required />
            <AppInput label="Email" name="email" icon={<Mail className="w-5 h-5" />} onChange={handleChange} value={form.email} placeholder="alex@example.com" type="email" required />
            <AppInput label="Password" name="password" icon={<Lock className="w-5 h-5" />} onChange={handleChange} value={form.password} placeholder="••••••••" type="password" required />
            <div className="grid grid-cols-3 gap-4">
              <AppInput label="Age" name="age" onChange={handleChange} value={form.age} placeholder="28" type="number" required noIcon />
              <AppInput label="H (cm)" name="height" onChange={handleChange} value={form.height} placeholder="175" type="number" required noIcon />
              <AppInput label="W (kg)" name="weight" onChange={handleChange} value={form.weight} placeholder="70" type="number" required noIcon />
            </div>
            <AppSelect label="Activity Level" name="activityLevel" onChange={handleChange} value={form.activityLevel}>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
            </AppSelect>
            <AppSelect label="Goal" name="goal" onChange={handleChange} value={form.goal}>
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain</option>
              <option value="gain">Gain Weight</option>
            </AppSelect>
            <button type="submit" disabled={isLoading} className="w-full p-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 shadow-md transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?
              <button type="button" onClick={() => { setView('login'); setMessage(''); }} className="font-medium text-blue-500 hover:underline ml-1">
                Login
              </button>
            </p>
          </form>
        );
      case 'forgotEmail':
        return (
          <form onSubmit={onForgotPassword} className="space-y-4 animate-fade-in">
            <AppInput label="Email" name="email" icon={<Mail className="w-5 h-5" />} onChange={handleChange} value={form.email} placeholder="alex@example.com" type="email" required />
            {message && (
               <p className={`text-sm ${message.includes('error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
            )}
            <button type="submit" disabled={isLoading} className="w-full p-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 shadow-md transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50">
              {isLoading ? 'Sending...' : 'Send Reset Code'}
            </button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Remembered your password?
              <button type="button" onClick={() => { setView('login'); setMessage(''); }} className="font-medium text-blue-500 hover:underline ml-1">
                Back to Login
              </button>
            </p>
          </form>
        );
      case 'forgotReset':
        return (
          <form onSubmit={onResetPassword} className="space-y-4 animate-fade-in">
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              A 6-digit code was sent to {form.email}. Check your email (or the backend console!).
            </p>
            <AppInput label="6-Digit Code" name="token" icon={<Lock className="w-5 h-5" />} onChange={handleChange} value={form.token} placeholder="123456" type="text" required />
            <AppInput label="New Password" name="newPassword" icon={<Lock className="w-5 h-5" />} onChange={handleChange} value={form.newPassword} placeholder="••••••••" type="password" required />

            {message && (
               <p className={`text-sm ${message.includes('error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>
            )}
            <button type="submit" disabled={isLoading} className="w-full p-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 shadow-md transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50">
              {isLoading ? 'Resetting...' : 'Set New Password'}
            </button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              <button type="button" onClick={() => { setView('login'); setMessage(''); }} className="font-medium text-blue-500 hover:underline ml-1">
                Back to Login
              </button>
            </p>
          </form>
        );
      default:
        return null;
    }
  };

  const title = {
    login: 'Login',
    register: 'Create Account',
    forgotEmail: 'Reset Password',
    forgotReset: 'Enter Your Code'
  };

  const subTitle = {
    login: 'Welcome back! Please enter your details.',
    register: 'Please fill in the details to join.',
    forgotEmail: 'Enter your email to receive a reset code.',
    forgotReset: 'Check your email for a 6-digit code.'
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-8 text-center border-b dark:border-gray-700">
          <Brain className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {title[view]}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {subTitle[view]}
          </p>
        </div>
        <div className="p-8">
          {renderView()}
        </div>
      </div>
    </div>
  );
}

// --- 6. Profile & Settings Component ---
function ProfileSettings() {
  const { user, goals, updateProfile, updateGoals, theme, setTheme } = useContext(AppContext);
  const [profile, setProfile] = useState(user);
  const [goalData, setGoalData] = useState(goals);

  // Sync state if user prop changes
  useEffect(() => {
    setProfile(user);
    setGoalData(goals);
  }, [user, goals]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleGoalChange = (e) => {
    setGoalData({ ...goalData, [e.target.name]: e.target.value });
  };
  
  const handleProfileSave = () => {
    updateProfile(profile);
  };
  
  const handleGoalSave = () => {
    updateGoals(goalData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 lg:pb-0">
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">My Profile</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Name" name="name" value={profile.name} onChange={handleProfileChange} />
          <Input label="Email" name="email" value={profile.email} onChange={handleProfileChange} type="email" />
          <Input label="Age" name="age" value={profile.age} onChange={handleProfileChange} type="number" />
          <Input label="Height (cm)" name="height" value={profile.height} onChange={handleProfileChange} type="number" />
          <Input label="Weight (kg)" name="weight" value={profile.weight} onChange={handleProfileChange} type="number" />
          <Select label="Activity Level" name="activityLevel" value={profile.activityLevel} onChange={handleProfileChange}>
            <option value="sedentary">Sedentary</option>
            <option value="light">Light Activity</option>
            <option value="moderate">Moderate Activity</option>
            <option value="active">Active</option>
            <option value="very_active">Very Active</option>
          </Select>
        </div>
        <button onClick={handleProfileSave} className="mt-8 px-5 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 shadow-md">Save Profile</button>
      </div>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">My Goals</h3>
        <p className="text-sm text-gray-500 dark:text-gray-300 mb-6">You can manually adjust your nutrition goals here. Be careful, as these are normally auto-calculated.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Input label="Calories (kcal)" name="calories" value={goalData.calories} onChange={handleGoalChange} type="number" />
          <Input label="Protein (g)" name="protein" value={goalData.protein} onChange={handleGoalChange} type="number" />
          <Input label="Carbs (g)" name="carbs" value={goalData.carbs} onChange={handleGoalChange} type="number" />
          <Input label="Fat (g)" name="fat" value={goalData.fat} onChange={handleGoalChange} type="number" />
        </div>
        <button onClick={handleGoalSave} className="mt-8 px-5 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 shadow-md">Save Goals</button>
      </div>
      
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">App Settings</h3>
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700 dark:text-gray-200">Dark Mode</span>
          <button 
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} 
            className={`relative inline-flex items-center h-6 rounded-full w-11 ${theme === 'dark' ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
          >
            <span
              className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}


// --- Helper Components ---

function BackgroundAnimation() {
  const { theme } = useContext(AppContext);
  const bgColor = theme === 'light' ? 'bg-gray-100' : 'bg-gray-900';

  return (
    <div className={`absolute inset-0 w-full h-full ${bgColor} overflow-hidden -z-10`}>
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 -left-1/4 w-96 h-96 bg-blue-200 dark:bg-blue-900 rounded-full opacity-30 dark:opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-1/4 w-96 h-96 bg-green-200 dark:bg-green-900 rounded-full opacity-30 dark:opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-1/4 left-1/3 w-96 h-96 bg-pink-200 dark:bg-pink-900 rounded-full opacity-30 dark:opacity-20 animate-blob animation-delay-4000"></div>
      </div>
    </div>
  );
}

function AppInput({ label, name, value, onChange, type = 'text', placeholder = '', required = false, icon, noIcon = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <div className="relative">
        {!noIcon && (
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full p-3 ${noIcon ? '' : 'pl-11'} border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
      </div>
    </div>
  );
}

function AppSelect({ label, name, value, onChange, children }) {
   return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {children}
      </select>
    </div>
  );
}

function Input({ label, name, value, onChange, type = 'text', placeholder = '', required = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, children }) {
   return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {children}
      </select>
    </div>
  );
}


function MacroProgressCard({ name, value, goal, icon: Icon, color, bg }) {
  const progress = Math.min((value / goal) * 100, 100);
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className={`flex items-center gap-2 font-semibold ${color}`}>
          <Icon className="w-5 h-5" />
          <span>{name}</span>
        </div>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{Math.round(value)}g / {goal}g</span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${bg}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}

function QuickAddButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center gap-2"
    >
      <PlusCircle className="w-4 h-4 text-blue-500" />
      {label}
    </button>
  );
}

function MacroSummary({ value, goal, label, color }) {
  return (
    <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
      <span className={`text-xl font-bold ${color}`}>{Math.round(value)}</span>
      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</p>
    </div>
  );
}

function MealCard({ meal, onDelete }) {
  return (
    <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border dark:border-gray-700">
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800 dark:text-white">{meal.name}</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {meal.calories} kcal &bull; {meal.protein}g P &bull; {meal.carbs}g C &bull; {meal.fat}g F
        </p>
      </div>
      <button onClick={onDelete} className="ml-4 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-100 dark:hover:text-red-400 dark:hover:bg-gray-700">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

function AddMealModal({ onClose, selectedDate }) {
  const { addMeal } = useContext(AppContext); // Get addMeal from context
  const [form, setForm] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '', type: 'snack' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMeal = {
      name: form.name,
      calories: parseInt(form.calories) || 0,
      protein: parseInt(form.protein) || 0,
      carbs: parseInt(form.carbs) || 0,
      fat: parseInt(form.fat) || 0,
      type: form.type,
      date: new Date(selectedDate).toISOString() // <-- FIX: Use selectedDate
    };
    // This is now an async API call
    await addMeal(newMeal); // addMeal function needs to be updated to pass the date
    setForm({ name: '', calories: '', protein: '', carbs: '', fat: '', type: 'snack' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg p-6 space-y-4 animate-slide-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Meal</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Food Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g., '2 Eggs and 1 Banana'" required />
          
          <div className="grid grid-cols-2 gap-4">
            <Input label="Calories" name="calories" value={form.calories} onChange={handleChange} placeholder="e.g., 230" type="number" required />
            <Select label="Meal Type" name="type" value={form.type} onChange={handleChange}>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Input label="Protein (g)" name="protein" value={form.protein} onChange={handleChange} placeholder="13" type="number" />
            <Input label="Carbs (g)" name="carbs" value={form.carbs} onChange={handleChange} placeholder="28" type="number" />
            <Input label="Fat (g)" name="fat" value={form.fat} onChange={handleChange} placeholder="10" type="number" />
          </div>
          
          <button type="submit" className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 shadow-md">
            Add Meal
          </button>
        </form>
      </div>
    </div>
  );
}

function NotificationBanner({ message, type, onClose }) {
  const colors = {
    success: 'bg-green-500 border-green-600',
    error: 'bg-red-500 border-red-600',
    info: 'bg-blue-500 border-blue-600',
  };
  const bgColor = colors[type] || 'bg-gray-900 border-gray-900';
  
  return (
    <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-lg shadow-lg text-white ${bgColor} border-b-4 flex items-center gap-3 animate-slide-in`}>
      <p className="font-medium">{message}</p>
      <button onClick={onClose}><X className="w-5 h-5" /></button>
    </div>
  );
}
