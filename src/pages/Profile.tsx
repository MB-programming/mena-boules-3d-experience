import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Camera, 
  Settings, 
  BookOpen, 
  Award,
  LogOut,
  ArrowLeft,
  Edit2,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { AnimatedSparkle, GlowIcon } from '@/components/AnimatedIcon';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Ahmed Mohamed',
    email: 'ahmed@example.com',
    bio: 'Passionate web developer learning new skills every day.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  });

  const enrolledCourses = [
    { id: 1, title: 'Complete Web Development', progress: 65, image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop' },
    { id: 2, title: 'UI/UX Design Masterclass', progress: 30, image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=300&h=200&fit=crop' },
  ];

  const certificates = [
    { id: 1, title: 'Web Development Fundamentals', date: 'Dec 2024' },
    { id: 2, title: 'React Basics', date: 'Nov 2024' },
  ];

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="glass-card p-6 text-center sticky top-24">
                <div className="relative inline-block mb-4">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-28 h-28 rounded-full border-4 border-primary/30 object-cover"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                  >
                    <Camera className="w-5 h-5" />
                  </motion.button>
                </div>

                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="text-xl font-display font-bold text-center w-full bg-transparent border-b border-primary mb-2 outline-none"
                  />
                ) : (
                  <h2 className="text-xl font-display font-bold mb-2">{profile.name}</h2>
                )}
                
                <p className="text-muted-foreground text-sm mb-4">{profile.email}</p>

                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="w-full p-2 bg-input rounded-lg border border-border text-sm mb-4"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground mb-6">{profile.bio}</p>
                )}

                <div className="space-y-2">
                  {isEditing ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      className="w-full btn-primary flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save Changes
                    </motion.button>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditing(true)}
                      className="w-full btn-outline flex items-center justify-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </motion.button>
                  )}
                  
                  <Link
                    to="/auth"
                    className="w-full btn-outline flex items-center justify-center gap-2 text-red-500 border-red-500/30 hover:bg-red-500/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Enrolled Courses */}
              <div>
                <h3 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                  <GlowIcon Icon={BookOpen} size={24} className="text-primary" />
                  My Courses
                </h3>
                <div className="space-y-4">
                  {enrolledCourses.map((course) => (
                    <Link
                      key={course.id}
                      to={`/course/${course.id}`}
                      className="glass-card p-4 flex gap-4 hover-glow group block"
                    >
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-24 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium group-hover:text-primary transition-colors">
                          {course.title}
                        </h4>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-primary">{course.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${course.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Certificates */}
              <div>
                <h3 className="text-xl font-display font-semibold mb-4 flex items-center gap-2">
                  <GlowIcon Icon={Award} size={24} className="text-primary" />
                  Certificates
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {certificates.map((cert) => (
                    <motion.div
                      key={cert.id}
                      whileHover={{ scale: 1.02 }}
                      className="glass-card p-4 hover-glow cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium mb-1">{cert.title}</h4>
                          <p className="text-sm text-muted-foreground">{cert.date}</p>
                        </div>
                        <AnimatedSparkle />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
