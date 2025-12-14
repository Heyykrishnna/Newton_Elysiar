import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ALL_WEB_DEV_QUESTIONS, WebDevQuestion } from "@/data/webDevQuestions";

interface SubmissionData {
  id: string;
  user_id: string;
  question_id: string;
  html_code: string | null;
  css_code: string | null;
  js_code: string | null;
  time_taken: number | null;
  validation_passed: boolean;
  validation_errors: any;
  test_results: any;
  test_score: number;
  submitted_at: string;
  withdrawn_at: string | null;
  is_active: boolean;
}

interface TopicStats {
  category: string;
  count: number;
  percentage: number;
  avgScore: number;
  color: string;
}

interface DifficultyStats {
  difficulty: "Easy" | "Medium" | "Hard";
  count: number;
  percentage: number;
  avgScore: number;
}

interface TimelineData {
  date: string;
  count: number;
  cumulative: number;
  easy: number;
  medium: number;
  hard: number;
}

interface ProgressAnalytics {
  totalSolved: number;
  averageScore: number;
  topicDistribution: TopicStats[];
  difficultyBreakdown: DifficultyStats[];
  timeline: TimelineData[];
  strongestCategory: string;
  weakestCategory: string;
  recentActivity: {
    questionId: string;
    title: string;
    category: string;
    score: number;
    submittedAt: string;
  }[];
}

const CATEGORY_COLORS: Record<string, string> = {
  HTML: "#f97316",
  CSS: "#3b82f6",
  JavaScript: "#eab308",
  React: "#06b6d4",
  "End Game": "#a855f7",
};

export const useStudentProgressAnalytics = () => {
  return useQuery({
    queryKey: ["student-progress-analytics"],
    queryFn: async (): Promise<ProgressAnalytics> => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Fetch all submissions for the current user
      const { data: submissions, error } = await supabase
        .from("web_dev_submission_history")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .order("submitted_at", { ascending: true });

      if (error) throw error;

      // If no submissions, return empty analytics
      if (!submissions || submissions.length === 0) {
        return {
          totalSolved: 0,
          averageScore: 0,
          topicDistribution: [],
          difficultyBreakdown: [],
          timeline: [],
          strongestCategory: "",
          weakestCategory: "",
          recentActivity: [],
        };
      }

      // Create a map of question IDs to question data
      const questionMap = new Map<string, WebDevQuestion>();
      ALL_WEB_DEV_QUESTIONS.forEach((q) => questionMap.set(q.id, q));

      // Get unique question IDs (count each question only once)
      const uniqueQuestions = new Map<string, SubmissionData>();
      submissions.forEach((sub) => {
        const existing = uniqueQuestions.get(sub.question_id);
        if (
          !existing ||
          new Date(sub.submitted_at) > new Date(existing.submitted_at)
        ) {
          uniqueQuestions.set(sub.question_id, sub);
        }
      });

      const uniqueSubmissions = Array.from(uniqueQuestions.values());

      // Calculate topic distribution
      const topicCounts = new Map<
        string,
        { count: number; totalScore: number }
      >();
      uniqueSubmissions.forEach((sub) => {
        const question = questionMap.get(sub.question_id);
        if (question) {
          const category = question.category;
          const existing = topicCounts.get(category) || {
            count: 0,
            totalScore: 0,
          };
          topicCounts.set(category, {
            count: existing.count + 1,
            totalScore: existing.totalScore + sub.test_score,
          });
        }
      });

      const totalQuestions = uniqueSubmissions.length;
      const topicDistribution: TopicStats[] = Array.from(
        topicCounts.entries()
      ).map(([category, stats]) => ({
        category,
        count: stats.count,
        percentage: (stats.count / totalQuestions) * 100,
        avgScore: stats.totalScore / stats.count,
        color: CATEGORY_COLORS[category] || "#6b7280",
      }));

      // Calculate difficulty breakdown
      const difficultyCounts = new Map<
        "Easy" | "Medium" | "Hard",
        { count: number; totalScore: number }
      >();
      uniqueSubmissions.forEach((sub) => {
        const question = questionMap.get(sub.question_id);
        if (question) {
          const difficulty = question.difficulty;
          const existing = difficultyCounts.get(difficulty) || {
            count: 0,
            totalScore: 0,
          };
          difficultyCounts.set(difficulty, {
            count: existing.count + 1,
            totalScore: existing.totalScore + sub.test_score,
          });
        }
      });

      const difficultyBreakdown: DifficultyStats[] = Array.from(
        difficultyCounts.entries()
      ).map(([difficulty, stats]) => ({
        difficulty,
        count: stats.count,
        percentage: (stats.count / totalQuestions) * 100,
        avgScore: stats.totalScore / stats.count,
      }));

      // Calculate timeline data (group by week)
      const timelineMap = new Map<
        string,
        { easy: number; medium: number; hard: number }
      >();
      submissions.forEach((sub) => {
        const date = new Date(sub.submitted_at);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Start of week
        const weekKey = weekStart.toISOString().split("T")[0];

        const question = questionMap.get(sub.question_id);
        if (question) {
          const existing = timelineMap.get(weekKey) || {
            easy: 0,
            medium: 0,
            hard: 0,
          };
          if (question.difficulty === "Easy") existing.easy++;
          else if (question.difficulty === "Medium") existing.medium++;
          else if (question.difficulty === "Hard") existing.hard++;
          timelineMap.set(weekKey, existing);
        }
      });

      let cumulative = 0;
      const timeline: TimelineData[] = Array.from(timelineMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, counts]) => {
          const count = counts.easy + counts.medium + counts.hard;
          cumulative += count;
          return {
            date,
            count,
            cumulative,
            easy: counts.easy,
            medium: counts.medium,
            hard: counts.hard,
          };
        });

      // Calculate average score
      const totalScore = uniqueSubmissions.reduce(
        (sum, sub) => sum + sub.test_score,
        0
      );
      const averageScore = totalScore / totalQuestions;

      // Find strongest and weakest categories
      const sortedByScore = [...topicDistribution].sort(
        (a, b) => b.avgScore - a.avgScore
      );
      const strongestCategory = sortedByScore[0]?.category || "";
      const weakestCategory =
        sortedByScore[sortedByScore.length - 1]?.category || "";

      // Get recent activity (last 5 submissions)
      const recentActivity = uniqueSubmissions
        .slice(-5)
        .reverse()
        .map((sub) => {
          const question = questionMap.get(sub.question_id);
          return {
            questionId: sub.question_id,
            title: question?.title || "Unknown Question",
            category: question?.category || "Unknown",
            score: sub.test_score,
            submittedAt: sub.submitted_at,
          };
        });

      return {
        totalSolved: totalQuestions,
        averageScore,
        topicDistribution,
        difficultyBreakdown,
        timeline,
        strongestCategory,
        weakestCategory,
        recentActivity,
      };
    },
  });
};
