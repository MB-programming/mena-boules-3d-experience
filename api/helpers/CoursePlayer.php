<?php
class CoursePlayer {
    private $db;
    private $conn;

    public function __construct($db) {
        $this->db = $db;
        $this->conn = $db->getConnection();
    }

    public function getCourseContent($userId, $courseId) {
        // Check if user enrolled
        $sql = "SELECT * FROM course_enrollments WHERE user_id = ? AND course_id = ?";
        $enrollment = $this->db->querySingle($sql, [$userId, $courseId]);
        
        if (!$enrollment) {
            return ['success' => false, 'message' => 'غير مسجل في هذا الكورس'];
        }

        // Get course info
        $sql = "SELECT * FROM courses WHERE id = ?";
        $course = $this->db->querySingle($sql, [$courseId]);

        // Get lessons
        $sql = "SELECT * FROM course_lessons WHERE course_id = ? ORDER BY order_index ASC";
        $lessons = $this->db->query($sql, [$courseId]);

        // Get progress for each lesson
        foreach ($lessons as &$lesson) {
            $sql = "SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ?";
            $progress = $this->db->querySingle($sql, [$userId, $lesson['id']]);
            $lesson['progress'] = $progress;
        }

        // Get course progress
        $sql = "SELECT * FROM course_progress WHERE user_id = ? AND course_id = ?";
        $courseProgress = $this->db->querySingle($sql, [$userId, $courseId]);

        return [
            'success' => true,
            'course' => $course,
            'lessons' => $lessons,
            'progress' => $courseProgress
        ];
    }

    public function updateLessonProgress($userId, $lessonId, $courseId, $data) {
        $watchDuration = isset($data['watch_duration']) ? intval($data['watch_duration']) : 0;
        $lastPosition = isset($data['last_position']) ? intval($data['last_position']) : 0;
        $completed = isset($data['completed']) ? intval($data['completed']) : 0;

        try {
            $this->db->beginTransaction();

            // Update lesson progress
            $sql = "INSERT INTO lesson_progress 
                    (user_id, lesson_id, course_id, watched, watch_duration, last_position, completed, completed_at)
                    VALUES (?, ?, ?, 1, ?, ?, ?, " . ($completed ? "NOW()" : "NULL") . ")
                    ON DUPLICATE KEY UPDATE 
                    watched = 1, 
                    watch_duration = ?,
                    last_position = ?,
                    completed = ?,
                    completed_at = " . ($completed ? "COALESCE(completed_at, NOW())" : "completed_at");
            
            $this->db->execute($sql, [
                $userId, $lessonId, $courseId, $watchDuration, $lastPosition, $completed,
                $watchDuration, $lastPosition, $completed
            ]);

            // Update course progress
            $this->updateCourseProgress($userId, $courseId);

            $this->db->commit();

            return [
                'success' => true,
                'message' => 'تم تحديث التقدم',
                'progress' => $this->getCourseProgress($userId, $courseId)
            ];
        } catch (Exception $e) {
            $this->db->rollback();
            error_log("Update Progress Error: " . $e->getMessage());
            return ['success' => false, 'message' => 'حدث خطأ أثناء تحديث التقدم'];
        }
    }

    private function updateCourseProgress($userId, $courseId) {
        // Count total and completed lessons
        $sql = "SELECT COUNT(*) as total FROM course_lessons WHERE course_id = ?";
        $totalResult = $this->db->querySingle($sql, [$courseId]);
        $totalLessons = $totalResult['total'];

        $sql = "SELECT COUNT(*) as completed FROM lesson_progress 
                WHERE user_id = ? AND course_id = ? AND completed = 1";
        $completedResult = $this->db->querySingle($sql, [$userId, $courseId]);
        $completedLessons = $completedResult['completed'];

        $percentage = $totalLessons > 0 ? intval(($completedLessons / $totalLessons) * 100) : 0;
        $isCompleted = $percentage >= 100 ? 1 : 0;

        // Get last watched lesson
        $sql = "SELECT lesson_id FROM lesson_progress 
                WHERE user_id = ? AND course_id = ?
                ORDER BY updated_at DESC LIMIT 1";
        $lastLesson = $this->db->querySingle($sql, [$userId, $courseId]);
        $lastLessonId = $lastLesson ? $lastLesson['lesson_id'] : null;

        // Update course_progress
        $sql = "INSERT INTO course_progress 
                (user_id, course_id, progress_percentage, last_watched_lesson, completed, completed_at)
                VALUES (?, ?, ?, ?, ?, " . ($isCompleted ? "NOW()" : "NULL") . ")
                ON DUPLICATE KEY UPDATE 
                progress_percentage = ?,
                last_watched_lesson = ?,
                completed = ?,
                completed_at = " . ($isCompleted ? "COALESCE(completed_at, NOW())" : "completed_at");
        
        $this->db->execute($sql, [
            $userId, $courseId, $percentage, $lastLessonId, $isCompleted,
            $percentage, $lastLessonId, $isCompleted
        ]);

        // Update enrollment
        $sql = "UPDATE course_enrollments 
                SET progress = ?, completed = ?, completed_at = " . ($isCompleted ? "COALESCE(completed_at, NOW())" : "NULL") . "
                WHERE user_id = ? AND course_id = ?";
        $this->db->execute($sql, [$percentage, $isCompleted, $userId, $courseId]);

        // Create certificate if completed
        if ($isCompleted) {
            $certificate = new Certificate($this->db);
            $certificate->createCertificate($userId, $courseId);
        }
    }

    public function getCourseProgress($userId, $courseId) {
        $sql = "SELECT * FROM course_progress WHERE user_id = ? AND course_id = ?";
        return $this->db->querySingle($sql, [$userId, $courseId]);
    }

    public function getEnrolledCourses($userId) {
        $sql = "SELECT 
                    c.*,
                    ce.enrolled_at,
                    ce.progress,
                    ce.completed,
                    ce.completed_at,
                    cp.last_watched_lesson,
                    cp.watch_time
                FROM course_enrollments ce
                INNER JOIN courses c ON ce.course_id = c.id
                LEFT JOIN course_progress cp ON cp.user_id = ce.user_id AND cp.course_id = ce.course_id
                WHERE ce.user_id = ?
                ORDER BY ce.enrolled_at DESC";
        
        return $this->db->query($sql, [$userId]);
    }
}
