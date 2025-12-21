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
  BookOpen,
  MessageCircle,
  FileText
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const lessons = [
  { id: 1, title: 'Course Introduction', duration: '5:30', completed: true },
  { id: 2, title: 'Setting Up Your Environment', duration: '12:45', completed: true },
  { id: 3, title: 'Understanding Web Development', duration: '8:20', completed: false },
  { id: 4, title: 'HTML Structure', duration: '15:00', completed: false },
  { id: 5, title: 'Working with Text', duration: '10:30', completed: false },
  { id: 6, title: 'Links and Images', duration: '12:00', completed: false },
  { id: 7, title: 'Forms and Inputs', duration: '18:45', completed: false },
];

const CourseWatch = () => {
  const { id, lessonId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLesson, setCurrentLesson] = useState(3);
  const [progress, setProgress] = useState(35);

  const lesson = lessons[currentLesson - 1];

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
                <button className="pb-3 px-1 border-b-2 border-primary text-primary font-medium">
                  Overview
                </button>
                <button className="pb-3 px-1 text-muted-foreground hover:text-foreground">
                  Resources
                </button>
                <button className="pb-3 px-1 text-muted-foreground hover:text-foreground">
                  Q&A
                </button>
              </div>

              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground">
                  In this lesson, you'll learn the fundamentals of web development and understand how 
                  websites work. We'll cover the client-server model, HTTP protocols, and the role of 
                  HTML, CSS, and JavaScript in creating web pages.
                </p>
              </div>

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
