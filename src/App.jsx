import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function App() {
  const [time, setTime] = useState(new Date());
  const [submission, setSubmission] = useState([]);
  const [todaysProblems, setTodaysProblems] = useState([]);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [celebratoryMessage, setCelebratoryMessage] = useState("");

  const motivationalMessages = [
    "Your daily dose of imposter syndrome awaits 🎭",
    "404: LeetCode submission not found 🔍",
    "The grind doesn't take days off! 😤",
    "Console.log('time to code') 🖥️",
    "Time to make future you proud (or at least employed) 💼"
  ];

  const celebratoryMessages = [
    "One step closer to FAANG 🍎",
    "LinkedIn status update incoming... 💭",
    "Crushing it harder than tech layoffs 💪",
    "Future you is grateful! 🙌",
    "Runtime complexity: EFFICIENT 📈"
  ];

  const isFromToday = (timestamp) => {
    const submissionDate = new Date(timestamp * 1000);
    const today = new Date();

    return (
      submissionDate.getFullYear() === today.getFullYear() &&
      submissionDate.getMonth() === today.getMonth() &&
      submissionDate.getDate() === today.getDate()
    );
  };

  const getTodaysProblems = (submissions) => {
    if (!submissions?.submission || !Array.isArray(submissions.submission)) {
      return [];
    }

    return submissions.submission
      .filter(sub => isFromToday(sub.timestamp))
      .map(sub => sub.title);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    const fetchSubmissions = async () => {
      try {
        const res = await fetch("https://alfa-leetcode-api.onrender.com/cole-hartman/submission");
        const data = await res.json();
        setSubmission(data);
        const todaysProblemsList = getTodaysProblems(data);
        setTodaysProblems(todaysProblemsList);

        if (todaysProblemsList.length > 0) {
          setCelebratoryMessage(celebratoryMessages[Math.floor(Math.random() * celebratoryMessages.length)]);
        } else {
          setMotivationalMessage(motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]);
        }
      } catch (error) {
        // Silently handle error but keep previous state
      }
    };

    fetchSubmissions();

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-zinc-900 h-screen text-white relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute top-8 left-8"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-zinc-600 text-sm font-medium mb-2"
        >
          LEETCODE STATUS
        </motion.div>
        <div className={`text-lg font-light ${todaysProblems.length > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {submission?.submission ? (
            todaysProblems.length > 0 ? (
              <div className="flex flex-col">
                <motion.div
                  className="flex items-center gap-2 mb-2 text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <span>{celebratoryMessage}</span>
                </motion.div>
                <div className="text-sm text-zinc-400 font-light">
                  Problems completed today:
                  {todaysProblems.map((problem, index) => (
                    <motion.div
                      key={problem}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="ml-4 text-green-400"
                    >
                      • {problem}
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <motion.div
                  className="flex items-center gap-2 text-white"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <span>{motivationalMessage}</span>
                </motion.div>
                <span className="text-sm text-zinc-500 mt-1">
                  Last Submission: {submission.submission[0] ?
                    new Date(submission.submission[0].timestamp * 1000).toLocaleDateString() :
                    'No submissions found'}
                </span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-zinc-500 border-t-zinc-200 rounded-full" />
              <span className="text-zinc-400">Loading...</span>
            </div>
          )}
        </div>
      </motion.div>

      <div className="h-full flex flex-col justify-center items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-7xl font-extralight tracking-tight text-white"
        >
          {time.toLocaleTimeString().split('').map((char, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl mt-4 text-zinc-400 font-light tracking-wider"
        >
          {time.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </motion.div>
      </div>
    </div>
  );
}

export default App;
