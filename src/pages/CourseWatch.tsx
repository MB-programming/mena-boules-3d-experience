import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { 
  Play, 
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Maximize,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Video,
  Link as LinkIcon,
  MessageCircle,
  ThumbsUp,
  Send
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { GlowIcon } from '@/components/AnimatedIcon';

const lessons = [
  { id: 1, title: 'Course Introduction', duration: '5:30', completed: true },
  { id: 2, title: 'Setting Up Your Environment', duration: '12:45', completed: true },
  { id: 3, title: 'Understanding Web Development', duration: '8:20', completed: false },
  { id: 4, title: 'HTML Structure', duration: '15:00', completed: false },
  { id: 5, title: 'Working with Text', duration: '10:30', completed: false },
  { id: 6, title: 'Links and Images', duration: '12:00', completed: false },
  { id: 7, title: 'Forms and Inputs', duration: '18:45', completed: false },
];

const resources = [
  { id: 1, type: 'pdf', title: 'Lesson Notes - Web Development Basics', size: '2.4 MB', url: '#' },
  { id: 2, type: 'zip', title: 'Project Starter Files', size: '15 MB', url: '#' },
  { id: 3, type: 'link', title: 'MDN Web Docs - HTML Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
  { id: 4, type: 'video', title: 'Bonus: Quick Tips for Beginners', duration: '5:20', url: '#' },
];

const questions = [
  { 
    id: 1, 
    user: 'Ahmed M.', 
    avatar: 'https://ui-avatars.com/api/?name=Ahmed+M&background=random',
    question: 'What is the difference between div and span elements?',
    date: '2 days ago',
    likes: 12,
    replies: [
      { 
        id: 1, 
        user: 'Mena Boules', 
        avatar: 'https://minaboules.com/wp-content/uploads/2025/10/mena-profile.png',
        answer: 'Great question! div is a block-level element while span is inline. div takes full width and creates a new line, span only takes the space it needs.',
        date: '1 day ago',
        isInstructor: true
      }
    ]
  },
  { 
    id: 2, 
    user: 'Sara K.', 
    avatar: 'https://ui-avatars.com/api/?name=Sara+K&background=random',
    question: 'Do I need to learn all HTML tags or just the common ones?',
    date: '1 week ago',
    likes: 8,
    replies: []
  },
  { 
    id: 3, 
    user: 'Mohamed A.', 
    avatar: 'https://ui-avatars.com/api/?name=Mohamed+A&background=random',
    question: 'What code editor do you recommend for beginners?',
    date: '2 weeks ago',
    likes: 15,
    replies: [
      { 
        id: 1, 
        user: 'Mena Boules', 
        avatar: 'https://minaboules.com/wp-content/uploads/2025/10/mena-profile.png',
        answer: 'I highly recommend VS Code! It\'s free, powerful, and has great extensions for web development.',
        date: '2 weeks ago',
        isInstructor: true
      }
    ]
  },
];

const CourseWatch = () => {
  const { id, lessonId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(3);
  const [progress, setProgress] = useState(35);
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'qa'>('overview');
  const [newQuestion, setNewQuestion] = useState('');

  const lesson = lessons[currentLesson - 1];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText;
      case 'zip': return Download;
      case 'video': return Video;
      case 'link': return LinkIcon;
      default: return FileText;
    }
  };

  const handleAskQuestion = () => {
    if (newQuestion.trim()) {
      // In a real app, this would submit to the backend
      setNewQuestion('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        <div className="flex flex-col lg:flex-row">
          {/* Video Player */}
          <div className="flex-1">
            <div className="relative bg-black aspect-video">
              {/* Video Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop"
                  alt="Video"
                  className="w-full h-full object-cover opacity-50"
                />
              </div>

              {/* Play Button Overlay */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsPlaying(!isPlaying)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center">
                  {isPlaying ? (
                    <Pause className="w-8 h-8 text-primary-foreground" fill="currentColor" />
                  ) : (
                    <Play className="w-8 h-8 ml-1 text-primary-foreground" fill="currentColor" />
                  )}
                </div>
              </motion.button>

              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Progress Bar */}
                <div 
                  className="w-full h-1 bg-white/30 rounded-full mb-4 cursor-pointer"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = ((e.clientX - rect.left) / rect.width) * 100;
                    setProgress(percent);
                  }}
                >
                  <div 
                    className="h-full bg-primary rounded-full relative"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button onClick={() => setIsPlaying(!isPlaying)}>
                      {isPlaying ? (
                        <Pause className="w-6 h-6 text-white" />
                      ) : (
                        <Play className="w-6 h-6 text-white" />
                      )}
                    </button>
                    <button><SkipBack className="w-5 h-5 text-white" /></button>
                    <button><SkipForward className="w-5 h-5 text-white" /></button>
                    <button onClick={() => setIsMuted(!isMuted)}>
                      {isMuted ? (
                        <VolumeX className="w-5 h-5 text-white" />
                      ) : (
                        <Volume2 className="w-5 h-5 text-white" />
                      )}
                    </button>
                    <span className="text-sm text-white/80">2:45 / 8:20</span>
                  </div>
                  <button><Maximize className="w-5 h-5 text-white" /></button>
                </div>
              </div>
            </div>

            {/* Lesson Info */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Lesson {currentLesson} of {lessons.length}</p>
                  <h1 className="text-2xl font-display font-bold">{lesson.title}</h1>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    disabled={currentLesson === 1}
                    onClick={() => setCurrentLesson(prev => prev - 1)}
                    className="p-2 rounded-lg border border-border hover:border-primary disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    disabled={currentLesson === lessons.length}
                    onClick={() => setCurrentLesson(prev => prev + 1)}
                    className="p-2 rounded-lg border border-border hover:border-primary disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 border-b border-border mb-6">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === 'overview' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('resources')}
                  className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === 'resources' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Resources
                </button>
                <button 
                  onClick={() => setActiveTab('qa')}
                  className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === 'qa' 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Q&A
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="prose prose-invert max-w-none">
                  <p className="text-muted-foreground">
                    In this lesson, you'll learn the fundamentals of web development and understand how 
                    websites work. We'll cover the client-server model, HTTP protocols, and the role of 
                    HTML, CSS, and JavaScript in creating web pages.
                  </p>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-3">
                  {resources.map((resource) => {
                    const Icon = getResourceIcon(resource.type);
                    return (
                      <motion.a
                        key={resource.id}
                        href={resource.url}
                        target={resource.type === 'link' ? '_blank' : undefined}
                        rel={resource.type === 'link' ? 'noopener noreferrer' : undefined}
                        whileHover={{ scale: 1.01, x: 5 }}
                        className="glass-card p-4 flex items-center gap-4 hover-glow cursor-pointer block"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <GlowIcon Icon={Icon} size={24} />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{resource.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {resource.size || resource.duration || 'External Link'}
                          </p>
                        </div>
                        <Download className="w-5 h-5 text-muted-foreground" />
                      </motion.a>
                    );
                  })}
                </div>
              )}

              {activeTab === 'qa' && (
                <div className="space-y-6">
                  {/* Ask Question */}
                  <div className="glass-card p-4">
                    <div className="flex gap-3">
                      <img
                        src="https://ui-avatars.com/api/?name=User&background=random"
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <textarea
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          placeholder="Ask a question about this lesson..."
                          className="w-full p-3 bg-input rounded-lg border border-border text-sm resize-none"
                          rows={2}
                        />
                        <div className="flex justify-end mt-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAskQuestion}
                            className="btn-primary flex items-center gap-2 text-sm py-2 px-4"
                          >
                            <Send className="w-4 h-4" />
                            Ask Question
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Questions List */}
                  {questions.map((q) => (
                    <div key={q.id} className="glass-card p-4 space-y-4">
                      <div className="flex gap-3">
                        <img
                          src={q.avatar}
                          alt={q.user}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{q.user}</span>
                            <span className="text-xs text-muted-foreground">{q.date}</span>
                          </div>
                          <p className="text-sm">{q.question}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <button className="flex items-center gap-1 text-muted-foreground hover:text-primary text-sm">
                              <ThumbsUp className="w-4 h-4" />
                              {q.likes}
                            </button>
                            <button className="flex items-center gap-1 text-muted-foreground hover:text-primary text-sm">
                              <MessageCircle className="w-4 h-4" />
                              {q.replies.length} replies
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Replies */}
                      {q.replies.length > 0 && (
                        <div className="ml-12 space-y-3">
                          {q.replies.map((reply) => (
                            <div key={reply.id} className="glass-card p-3 bg-primary/5">
                              <div className="flex gap-3">
                                <img
                                  src={reply.avatar}
                                  alt={reply.user}
                                  className="w-8 h-8 rounded-full"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{reply.user}</span>
                                    {reply.isInstructor && (
                                      <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs">
                                        Instructor
                                      </span>
                                    )}
                                    <span className="text-xs text-muted-foreground">{reply.date}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">{reply.answer}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Mark Complete Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-6 btn-primary flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Mark as Complete
              </motion.button>
            </div>
          </div>

          {/* Sidebar - Lessons List */}
          <div className="lg:w-80 xl:w-96 border-l border-border">
            <div className="p-4 border-b border-border">
              <h2 className="font-display font-bold">Course Content</h2>
              <p className="text-sm text-muted-foreground">{lessons.filter(l => l.completed).length}/{lessons.length} lessons completed</p>
            </div>
            <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
              {lessons.map((l, index) => (
                <motion.button
                  key={l.id}
                  whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.5)' }}
                  onClick={() => setCurrentLesson(l.id)}
                  className={`w-full p-4 flex items-center gap-3 text-left border-b border-border transition-colors ${
                    currentLesson === l.id ? 'bg-primary/10 border-l-2 border-l-primary' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    l.completed 
                      ? 'bg-green-500/20 text-green-500' 
                      : currentLesson === l.id 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {l.completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium truncate ${currentLesson === l.id ? 'text-primary' : ''}`}>
                      {l.title}
                    </p>
                    <p className="text-sm text-muted-foreground">{l.duration}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseWatch;
