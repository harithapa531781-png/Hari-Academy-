import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  BookOpen, 
  Gamepad2, 
  Video, 
  User, 
  Menu, 
  Bell, 
  ChevronRight, 
  Play, 
  Star, 
  Award, 
  Settings, 
  Globe, 
  Info, 
  MessageSquare,
  MessageCircle,
  Mic,
  Headphones,
  Brain,
  PenTool,
  Clock,
  Calendar,
  X,
  PenLine,
  ShieldCheck,
  Phone,
  Camera,
  LogOut
} from 'lucide-react';

import { GoogleGenAI } from "@google/genai";

// --- Gemini Setup ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- Types ---
type Tab = 'home' | 'courses' | 'practice' | 'live' | 'profile' | 'about' | 'contact' | 'chat' | 'settings';

interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string;
  level: number;
  xp: number;
  streak: number;
  isPremium?: boolean;
  purchasedCourses?: string[];
  lastActive: any;
  createdAt: any;
}

// --- Components ---

const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full bg-slate-200 rounded-full h-2.5">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      className="bg-brand h-2.5 rounded-full"
    />
  </div>
);

// --- Sub-views ---

const HomeView = ({ onStart, profile }: { onStart: () => void, profile: UserProfile | null }) => {
  const [aiLesson, setAiLesson] = useState<{title: string, prompt: string} | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const generateDailyTip = async () => {
    setIsGenerating(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Give me a single short, punchy language learning tip (English or Nepali) and a 1-sentence exercise. JSON format: { \"title\": \"string\", \"exercise\": \"string\" }",
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text || "{}");
      setAiLesson({ title: data.title, prompt: data.exercise });
    } catch (e) {
      console.error(e);
      setAiLesson({ title: "Keep practicing!", prompt: "Translate 'Hello' into Nepali: 'Namaste'." });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 pt-4 pb-20">
      <section className="px-4">
        <h2 className="text-2xl mb-1">{getGreeting()}, {profile?.displayName || 'Student'}! 👋</h2>
        <p className="text-slate-500 text-sm">Ready for today's language journey?</p>
      </section>


      {/* AI Daily Tip Section */}
      <section className="px-4">
        <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2 text-brand">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-[10px] font-bold uppercase tracking-widest">AI Weekly Tip</span>
            </div>
            {aiLesson ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <h4 className="font-bold text-lg">{aiLesson.title}</h4>
                <p className="text-sm text-slate-300 italic">"{aiLesson.prompt}"</p>
              </motion.div>
            ) : (
              <h4 className="font-bold text-lg">Daily AI-Powered Tip</h4>
            )}
            <button 
              onClick={generateDailyTip}
              disabled={isGenerating}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold py-2 px-4 rounded-full border border-white/10 transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : aiLesson ? 'Get Another Tip' : 'Reveal Today\'s Tip'}
            </button>
          </div>
          <Brain className="absolute top-[-10%] right-[-10%] w-32 h-32 text-white/5 -rotate-12" />
        </div>
      </section>

    </div>
  );
};

import { beginnerVocabulary, intermediateVocabulary, academicVocabulary } from './vocabularyData';

const VocabularyLesson = ({ onBack, title, subtitle, data }: { 
  onBack: () => void, 
  title: string, 
  subtitle: string, 
  data: { en: string, ne: string }[] 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredVocab = data.filter(v => 
    v.en.toLowerCase().includes(searchQuery.toLowerCase()) || 
    v.ne.includes(searchQuery)
  );

  return (
    <div className="space-y-6 pt-4 pb-24">
      <header className="px-4 flex items-center justify-between">
        <button onClick={onBack} className="p-2 bg-white border border-slate-200 rounded-xl">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div className="text-right">
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{subtitle}</p>
        </div>
      </header>

      <section className="px-4 sticky top-16 z-20 bg-slate-50/80 backdrop-blur-md pb-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search for a word..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 py-4 px-6 pr-12 rounded-2xl text-sm focus:ring-4 focus:ring-brand/10 focus:border-brand focus:outline-none transition-all shadow-sm"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
      </section>

      <section className="px-4 grid grid-cols-1 gap-3">
        {filteredVocab.map((word, i) => (
          <div 
            key={i} 
            className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm active:scale-[0.99] transition-all"
          >
            <div className="space-y-0.5">
              <h4 className="text-lg font-bold text-slate-900">{word.en}</h4>
              <p className="text-[10px] font-bold text-brand uppercase tracking-widest">English Word</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-brand">{word.ne}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Nepali Meaning</p>
            </div>
          </div>
        ))}

        {filteredVocab.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto opacity-50">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">No words found for "{searchQuery}"</p>
          </div>
        )}
      </section>
    </div>
  );
};

const CoursesView = ({ profile }: { profile: UserProfile | null }) => {
  const categories = [
    { id: 'Beginner', label: 'Beginner' },
    { id: 'Intermediate', label: 'Intermediate' },
    { id: 'Advanced', label: 'Advanced' }
  ];
  const [activeCatId, setActiveCatId] = useState('Beginner');
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  // Define lessons with corresponding data
  const lessons = activeCatId === 'Beginner' ? [
    { id: 'vocabulary', title: 'Basic Vocabulary', count: '1-1500 Words', icon: Brain, color: 'bg-amber-500' }
  ] : activeCatId === 'Intermediate' ? [
    { id: 'vocab_build', title: 'Vocabulary building', count: '1-3500 Words', icon: Brain, color: 'bg-amber-500' }
  ] : [
    { id: 'acad_vocab', title: 'Academic vocabulary', count: '1-2000', icon: Brain, color: 'bg-indigo-700' }
  ];

  if (selectedLesson === 'vocabulary' && activeCatId === 'Beginner') {
    return (
      <VocabularyLesson 
        onBack={() => setSelectedLesson(null)} 
        title="Basic Vocabulary"
        subtitle="1-1500 Essential Words"
        data={beginnerVocabulary}
      />
    );
  }

  if (selectedLesson === 'vocab_build' && activeCatId === 'Intermediate') {
    return (
      <VocabularyLesson 
        onBack={() => setSelectedLesson(null)} 
        title="Vocabulary building"
        subtitle="1-3500 Intermediate Words"
        data={intermediateVocabulary}
      />
    );
  }

  if (selectedLesson === 'acad_vocab' && activeCatId === 'Advanced') {
    return (
      <VocabularyLesson 
        onBack={() => setSelectedLesson(null)} 
        title="Academic vocabulary"
        subtitle="1-2000 Academic Words"
        data={academicVocabulary}
      />
    );
  }

  return (
    <div className="space-y-6 pt-4 pb-10">
      <section className="px-4">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-2xl font-bold">Explore Courses</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => setActiveCatId(cat.id)}
              className={`px-6 py-3 rounded-2xl whitespace-nowrap text-sm font-semibold transition-all flex flex-col items-start gap-1 ${
                activeCatId === cat.id 
                  ? 'bg-brand text-white shadow-lg shadow-brand/20' 
                  : 'bg-white text-slate-500 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 space-y-4">
        {lessons.map((course, i) => (
          <div 
            key={i} 
            onClick={() => setSelectedLesson(course.id)}
            className="bg-white p-5 rounded-3xl border border-slate-100 flex items-center justify-between card-hover cursor-pointer translate-y-0 active:translate-y-1 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`${course.color} p-3 rounded-2xl text-white shadow-lg shadow-black/10`}>
                <course.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold">{course.title}</h4>
                <p className="text-xs text-slate-500">{course.count}</p>
              </div>
            </div>
            <div className="bg-slate-50 p-2 rounded-full">
              <ChevronRight className="text-slate-400 w-5 h-5" />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

const PracticeView = () => {
  return (
    <div className="space-y-8 pt-4 pb-20">
      <section className="px-4">
        <h2 className="text-2xl font-bold mb-2">Practice Skills</h2>
        <p className="text-slate-500 text-sm">Targeted training for fluency.</p>
      </section>

      <div className="px-4 space-y-4">
        {[
          { title: 'Reading', desc: 'Improve comprehension & vocabulary', icon: BookOpen, color: 'bg-rose-500', light: 'bg-rose-50', text: 'text-rose-600' },
          { title: 'Writing', desc: 'Master grammar & sentence structure', icon: PenTool, color: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-600' },
          { title: 'Listening', desc: 'Understand native accents & flow', icon: Headphones, color: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-600' },
          { title: 'Speaking', desc: 'Perfect your pronunciation', icon: Mic, color: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-600' }
        ].map((item, i) => (
          <button key={i} className="w-full bg-white p-5 rounded-[32px] border border-slate-100 flex items-center gap-5 card-hover group shadow-sm active:scale-[0.98] transition-all">
            <div className={`shrink-0 w-16 h-16 ${item.color} rounded-3xl flex items-center justify-center text-white shadow-lg shadow-black/5`}>
              <item.icon className="w-8 h-8" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-bold text-lg leading-tight">{item.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
            </div>
            <div className={`p-2 rounded-full ${item.light} ${item.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
              <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        ))}
      </div>

      <section className="px-4">
        <div className="bg-slate-900 rounded-[32px] p-6 text-white flex items-center justify-between overflow-hidden relative">
          <div className="relative z-10 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bonus Challenge</p>
            <h3 className="text-lg font-bold">Speed Quiz</h3>
            <p className="text-white/60 text-xs">Test your knowledge under pressure</p>
          </div>
          <button className="bg-white text-slate-900 px-5 py-2.5 rounded-2xl font-bold text-xs relative z-10 shadow-lg">
            Start Quiz
          </button>
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand/20 blur-3xl rounded-full translate-x-10 -translate-y-10" />
        </div>
      </section>
    </div>
  );
};

const LiveClassView = () => {
  return (
    <div className="space-y-6 pt-4 pb-20">
      <section className="px-4">
        <h2 className="text-2xl font-bold mb-4">Live Classes</h2>
        <div className="bg-brand rounded-3xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2">
              <div className="bg-red-500 w-2 h-2 rounded-full animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest">Live Now</span>
            </div>
            <div>
              <h3 className="text-xl font-bold leading-tight">Mastering Pronunciation with Hari Thapa</h3>
              <p className="text-white/80 text-sm mt-1">456 students attending</p>
            </div>
            <button className="bg-white text-brand px-6 py-3 rounded-2xl font-bold text-sm w-full sm:w-auto">
              Join Session
            </button>
          </div>
          <Video className="absolute bottom-[-20%] right-[-10%] w-48 h-48 text-white/10 rotate-12" />
        </div>
      </section>

      <section className="px-4">
        <h3 className="text-lg font-bold mb-4">Schedule</h3>
        <div className="space-y-4">
          {[
            { time: '14:00', date: 'TODAY', title: 'Nepali Basic Phrases', coach: 'Arjun P.' },
            { time: '18:30', date: 'MON, 04 MAY', title: 'Advanced English Grammar', coach: 'Sita K.' }
          ].map((item, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-4">
              <div className="flex flex-col items-center justify-center border-r border-slate-100 pr-4 shrink-0 min-w-[70px]">
                <span className="text-lg font-bold">{item.time}</span>
                <span className="text-[10px] font-bold text-slate-400">{item.date}</span>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-sm">{item.title}</h4>
                <p className="text-xs text-slate-500">Coach: {item.coach}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4">
        <h3 className="text-lg font-bold mb-4">Recorded Classes</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {[
            { title: 'Tense Mastery', length: '45m', views: '2.4k' },
            { title: 'Daily Nepali', length: '30m', views: '1.8k' },
            { title: 'Public Speaking', length: '60m', views: '3.1k' }
          ].map((item, i) => (
            <div key={i} className="shrink-0 w-48 bg-white p-3 rounded-2xl border border-slate-100 space-y-2">
              <div className="w-full aspect-video bg-slate-100 rounded-xl flex items-center justify-center relative">
                <Play className="w-8 h-8 text-slate-400 opacity-50" />
                <span className="absolute bottom-2 right-2 text-[10px] font-bold bg-black/60 text-white px-2 py-0.5 rounded-md">{item.length}</span>
              </div>
              <h4 className="font-bold text-xs line-clamp-1">{item.title}</h4>
              <p className="text-[10px] text-slate-500">{item.views} views</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const ProfileView = ({ profile, onUpdate }: { profile: UserProfile | null, onUpdate: (p: Partial<UserProfile>) => void }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ photoURL: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 pt-4 pb-20">
      <section className="px-4 flex flex-col items-center text-center gap-4">
        <div className="relative group cursor-pointer" onClick={() => document.getElementById('photo-upload')?.click()}>
          <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-100 flex items-center justify-center relative">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className="w-12 h-12 text-brand" />
            )}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <input 
            id="photo-upload" 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleFileChange}
          />
          <div className="absolute bottom-0 right-0 bg-brand text-white p-1.5 rounded-full border-2 border-white shadow-md">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{profile?.displayName || 'Student'}</h2>
          <p className="text-slate-500 text-sm">Level {profile?.level || 1} • Fluent Path</p>
        </div>
      </section>

      <div className="grid grid-cols-3 gap-4 px-4">
        {[
          { label: 'Day Streak', value: '14', icon: Clock },
          { label: 'Total XP', value: '8.4k', icon: Star },
          { label: 'Awards', value: '12', icon: Award }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 text-center space-y-1">
            <stat.icon className="w-5 h-5 mx-auto text-brand mb-1 opacity-50" />
            <div className="text-lg font-bold leading-none">{stat.value}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase">{stat.label}</div>
          </div>
        ))}
      </div>

      <section className="px-4">
        <h3 className="text-lg font-bold mb-4">Achievements</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {[1,2,3,4].map(i => (
            <div key={i} className="shrink-0 w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center opacity-50 grayscale">
              <Award className="w-8 h-8 text-slate-400" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const AboutView = () => {
  return (
    <div className="space-y-8 pt-4 pb-24 px-4 no-scrollbar">
      <section className="text-center space-y-4">
        <div className="w-20 h-20 bg-brand-light rounded-[32%] flex items-center justify-center rotate-12 mx-auto mb-6">
          <BookOpen className="w-10 h-10 text-brand -rotate-12" />
        </div>
        <h2 className="text-3xl font-display font-bold">About Hari Academy</h2>
        <p className="text-slate-600 leading-relaxed text-sm">
          Hari Academy is an online learning platform designed to help students improve their English skills from basic to advanced levels. Our goal is to make learning simple, practical, and accessible for everyone.
        </p>
      </section>

      <section className="space-y-4 bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Brain className="w-5 h-5 text-brand" />
          Our Approach
        </h3>
        <p className="text-slate-600 text-sm leading-relaxed">
          We provide structured courses that focus on grammar, vocabulary, speaking, and writing. Each lesson is designed to be easy to understand and useful in real-life communication.
        </p>
        <p className="text-slate-600 text-sm leading-relaxed">
          At Hari Academy, we believe that practice is the key to success. That’s why we offer interactive exercises, daily practice tasks, and real-life conversation training.
        </p>
      </section>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[32px] border border-slate-100 space-y-2 shadow-sm">
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm">Our Mission</h4>
          <p className="text-[10px] text-slate-500 leading-tight">
            To help learners build confidence and communicate effectively in English.
          </p>
        </div>
        <div className="bg-white p-5 rounded-[32px] border border-slate-100 space-y-2 shadow-sm">
          <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Star className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm">Our Vision</h4>
          <p className="text-[10px] text-slate-500 leading-tight">
            To become a trusted learning platform for students who want to grow their skills and achieve their goals.
          </p>
        </div>
      </div>

      <section className="bg-slate-900 rounded-[40px] p-8 text-white space-y-6 overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-4">What We Offer</h3>
          <ul className="space-y-4">
            {[
              "Step-by-step English courses (Basic to Advanced)",
              "Speaking and writing practice",
              "Interactive exercises and quizzes",
              "Simple and clear learning materials"
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="bg-brand text-white p-1 rounded-full mt-0.5 shrink-0">
                  <ChevronRight className="w-3 h-3" />
                </div>
                <span className="text-sm text-slate-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <Globe className="absolute bottom-[-10%] right-[-10%] w-40 h-40 text-white/5 -rotate-12" />
      </section>

      <div className="text-center pt-4">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Join Hari Academy today!</p>
        <p className="text-slate-500 text-[10px] mt-1">Start your journey toward better English with us.</p>
      </div>
    </div>
  );
};

const ContactView = ({ onNavigate }: { onNavigate: (tab: Tab) => void }) => {
  const contactOptions = [
    { 
      label: 'Email Us', 
      desc: 'support@hariacademy.com', 
      icon: Headphones, 
      color: 'bg-blue-500', 
      action: () => window.location.href = 'mailto:support@hariacademy.com'
    },
    { 
      label: 'Call NTC', 
      desc: '+977 976-3973712', 
      icon: Phone, 
      color: 'bg-sky-500', 
      action: () => window.location.href = 'tel:+9779763973712'
    },
    { 
      label: 'Call Ncell', 
      desc: '+977 981-0878412', 
      icon: Phone, 
      color: 'bg-emerald-500', 
      action: () => window.location.href = 'tel:+9779810878412'
    },
    { 
      label: 'WhatsApp Chat', 
      desc: 'Instant replies', 
      icon: MessageCircle, 
      color: 'bg-[#25D366]', 
      action: () => window.open('https://wa.me/9779763973712', '_blank')
    },
    { 
      label: 'Live Chat', 
      desc: 'In-app support', 
      icon: MessageSquare, 
      color: 'bg-slate-900', 
      action: () => onNavigate('chat')
    }
  ];

  return (
    <div className="space-y-8 pt-4 pb-24 px-4">
      <section className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Contact Support</h2>
        <p className="text-sm text-slate-500">We're here to help you 24/7</p>
      </section>

      <div className="grid grid-cols-1 gap-4">
        {contactOptions.map((opt, i) => (
          <button 
            key={i}
            onClick={opt.action}
            className="bg-white p-5 rounded-[32px] border border-slate-100 flex items-center gap-4 transition-all hover:scale-[1.02] active:scale-95 shadow-sm text-left"
          >
            <div className={`${opt.color} p-4 rounded-2xl text-white shadow-lg shadow-black/5`}>
              <opt.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold">{opt.label}</h4>
              <p className="text-xs text-slate-500">{opt.desc}</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>
        ))}
      </div>

      <div className="bg-slate-50 rounded-[32px] p-6 border border-slate-100">
        <h4 className="font-bold text-sm mb-3">Frequently Asked Questions</h4>
        <div className="space-y-3">
          {[
            "How to unlock courses?",
            "Can I get a refund?",
            "How to join live classes?"
          ].map((q, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-slate-200 last:border-0">
              <span className="text-xs text-slate-600">{q}</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const LiveChatView = ({ onBack }: { onBack: () => void }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I am Hari Academy Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages([...messages, { role: 'user', text: userMsg }]);
    setInput('');

    // Simulate reply
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', text: "Thank you for reaching out! A human agent will be with you shortly, or tell me more about your issue." }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-slate-50">
      <div className="p-4 flex items-center gap-4 bg-white border-b border-slate-100">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg">
          <ChevronRight className="w-5 h-5 rotate-180" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center text-white">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Support Chat</h4>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-bold text-slate-400 uppercase">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
              m.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Type your message..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-slate-50 border border-slate-200 py-3 px-5 rounded-2xl text-sm focus:ring-2 focus:ring-brand focus:outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            className="bg-brand text-white p-3 rounded-2xl active:scale-95 shadow-lg shadow-brand/20"
          >
            <Play className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};



const LoginView = ({ onLogin }: { onLogin: (name: string) => void }) => {
  const [name, setName] = useState('');

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 space-y-12">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center space-y-4"
      >
        <div className="w-24 h-24 bg-brand-light rounded-[40%] flex items-center justify-center rotate-12 mx-auto mb-8 shadow-xl shadow-brand/10">
          <BookOpen className="w-12 h-12 text-brand -rotate-12" />
        </div>
        <h1 className="text-4xl font-display font-black text-slate-900 tracking-tight">Hari Academy</h1>
        <p className="text-slate-500 font-medium">Your journey to English fluency begins here.</p>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="w-full space-y-6"
      >
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4">What should we call you?</label>
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-100 py-5 px-8 rounded-[32px] text-lg font-bold focus:ring-4 focus:ring-brand/10 focus:border-brand focus:outline-none transition-all placeholder:text-slate-300"
          />
        </div>

        <button 
          onClick={() => name.trim() && onLogin(name)}
          disabled={!name.trim()}
          className={`w-full py-5 rounded-[32px] font-bold text-lg shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
            name.trim() 
              ? 'bg-brand text-white shadow-brand/30 hover:bg-brand/90' 
              : 'bg-slate-100 text-slate-300 shadow-none grayscale pointer-events-none'
          }`}
        >
          Join the Academy
          <ChevronRight className="w-6 h-6" />
        </button>
      </motion.div>

      <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest absolute bottom-12">Designed for Excellence</p>
    </div>
  );
};

const SettingsView = ({ onLogout }: { onLogout: () => void }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className="space-y-8 pt-4 pb-24 px-4 text-slate-900">
      <section className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Settings</h2>
      </section>

      <div className="space-y-4">
        {/* Language Selection */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2.5 rounded-xl text-blue-500">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Language</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">English</p>
              </div>
            </div>
            <div className="bg-slate-50 px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-500 border border-slate-200/50">
              Change
            </div>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-900 p-2.5 rounded-xl text-white">
                <Play className="w-5 h-5 rotate-90" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Dark Mode</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{darkMode ? 'Active' : 'Off'}</p>
              </div>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-all relative ${darkMode ? 'bg-slate-900' : 'bg-slate-200'}`}
            >
              <motion.div 
                animate={{ x: darkMode ? 24 : 0 }}
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
        </div>

        {/* Notifications Toggle */}
        <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-orange-50 p-2.5 rounded-xl text-orange-500">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Notifications</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{notificationsEnabled ? 'Enabled' : 'Disabled'}</p>
              </div>
            </div>
            <button 
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-12 h-6 rounded-full transition-all relative ${notificationsEnabled ? 'bg-brand' : 'bg-slate-200'}`}
            >
              <motion.div 
                animate={{ x: notificationsEnabled ? 24 : 0 }}
                className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
        </div>

        {/* Logout Section */}
        <button 
          onClick={onLogout}
          className="w-full bg-rose-50 p-6 rounded-[32px] border border-rose-100 flex items-center justify-between group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="bg-white p-2.5 rounded-xl text-rose-500 shadow-sm">
              <LogOut className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h4 className="font-bold text-sm text-rose-600">Logout</h4>
              <p className="text-[10px] text-rose-400 font-bold uppercase">Sign out of your account</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-rose-300 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="text-center">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-none mb-1">App Version 1.0.4</p>
        <p className="text-[8px] font-medium text-slate-400">Hari Academy © 2024</p>
      </div>
    </div>
  );
};

// --- Layout Components ---

const Sidebar = ({ isOpen, onClose, onNavigate, profile, onLogout }: { isOpen: boolean, onClose: () => void, onNavigate: (tab: Tab) => void, profile: UserProfile | null, onLogout: () => void }) => {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 shadow-2xl p-6 flex flex-col"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-brand">Hari Academy</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-slate-50 rounded-2xl flex items-center gap-3 cursor-pointer" onClick={() => { onNavigate('profile'); onClose(); }}>
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border border-slate-200">
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              <User className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold text-sm truncate">{profile?.displayName || 'Student'}</p>
            <p className="text-[10px] text-slate-500 truncate">Hari Academy Learner</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'contact', label: 'Contact Support', icon: MessageSquare },
            { id: 'about', label: 'About Academy', icon: Info },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'logout', label: 'Log Out', icon: LogOut, color: 'text-rose-500' }
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={() => {
                if (item.id === 'logout') {
                  onLogout();
                  onClose();
                } else if (item.id === 'about') {
                  onNavigate('about');
                  onClose();
                } else if (item.id === 'contact') {
                  onNavigate('contact');
                  onClose();
                } else if (item.id === 'settings') {
                  onNavigate('settings');
                  onClose();
                }
              }}
              className={`flex items-center gap-4 w-full p-4 hover:bg-slate-50 rounded-2xl transition-colors ${item.color || 'text-slate-700'}`}
            >
              <item.icon className="w-5 h-5 opacity-70" />
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
      </motion.aside>
    </>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>({
    displayName: 'Student',
    email: 'student@hariacademy.com',
    photoURL: '',
    level: 1,
    xp: 8400,
    streak: 14,
    isPremium: true,
    purchasedCourses: [],
    lastActive: new Date(),
    createdAt: new Date()
  });

  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'practice', label: 'Practice', icon: Gamepad2 },
    { id: 'live', label: 'Live', icon: Video },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeView onStart={() => setActiveTab('courses')} profile={profile} />;
      case 'courses': return <CoursesView profile={profile} />;
      case 'practice': return <PracticeView />;
      case 'live': return <LiveClassView />;
      case 'profile': return <ProfileView profile={profile} onUpdate={(p) => setProfile(prev => prev ? { ...prev, ...p } : null)} />;
      case 'about': return <AboutView />;
      case 'contact': return <ContactView onNavigate={(t) => setActiveTab(t)} />;
      case 'chat': return <LiveChatView onBack={() => setActiveTab('contact')} />;
      case 'settings': return <SettingsView onLogout={() => setIsLoggedIn(false)} />;
    }
  };

  if (!isLoggedIn) {
    return <LoginView onLogin={(name) => {
      setProfile(prev => prev ? { ...prev, displayName: name } : null);
      setIsLoggedIn(true);
    }} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto relative overflow-hidden flex flex-col">
      {/* Top Bar */}
      <header className="px-4 py-4 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-30">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-display font-bold text-brand">Hari Academy</h1>
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <p className="text-[10px] font-black text-slate-400 leading-none">STUDENT</p>
            <p className="text-xs font-bold text-slate-900">{profile?.displayName}</p>
          </div>
          <button 
            onClick={() => setActiveTab('profile')}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden shadow-sm"
          >
            {profile?.photoURL ? (
              <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6 text-brand" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav-blur p-4 pb-6 flex justify-between items-center fixed bottom-0 max-w-md w-full border-t border-slate-100 z-30">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 transition-colors relative ${
              activeTab === tab.id ? 'text-brand' : 'text-slate-400'
            }`}
          >
            {activeTab === tab.id && (
              <motion.div 
                layoutId="tab-highlight"
                className="absolute -top-1 w-1 h-1 bg-brand rounded-full"
              />
            )}
            <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'stroke-[2.5px]' : ''}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
          </button>
        ))}
      </nav>

      {/* Sidebar Overlay/Drawer */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onNavigate={(tab) => setActiveTab(tab)} 
        profile={profile}
        onLogout={() => setIsLoggedIn(false)}
      />
    </div>
  );
}
