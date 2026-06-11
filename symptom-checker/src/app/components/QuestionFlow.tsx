"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./QuestionFlow.module.css";

interface Question {
  id: string;
  text: string;
  type: "yesno" | "multiple";
  options?: string[];
}

interface Message {
  role: "assistant" | "user";
  content: string;
  type?: "question" | "answer";
}

interface QuestionFlowProps {
  region: string;
  subRegion: string;
  initialSymptoms: string[];
  age: number;
  sex: string;
  onComplete: (diseases: any[]) => void;
}

export default function QuestionFlow({
  region,
  subRegion,
  initialSymptoms,
  age,
  sex,
  onComplete,
}: QuestionFlowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasFetchedRef = useRef(false);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Fetch first question on mount
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchFirst = async () => {
      setIsTyping(true);
      setMessages([
        {
          role: "assistant",
          content: `I've noted your symptoms in the ${subRegion.replace(/([A-Z])/g, ' $1').trim()}. Let's dig a bit deeper.`,
        },
      ]);

      await new Promise((r) => setTimeout(r, 800));

      try {
        const res = await fetch("/api/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ age, sex, region, subRegion, initialSymptoms }),
        });
        const data = await res.json();

        if (data.question) {
          setCurrentQuestion(data.question);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: data.question.text, type: "question" },
          ]);
        }
      } catch (err) {
        console.error(err);
      }
      setIsTyping(false);
    };

    fetchFirst();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, subRegion]);

  const fetchResults = async (finalAnswers: Record<string, string>) => {
    try {
      const res = await fetch("/api/result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: finalAnswers, age, sex, region, subRegion, initialSymptoms }),
      });
      const data = await res.json();
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I've analyzed your responses and symptoms. Here are the potential conditions ranked by probability.",
        },
      ]);
      setCurrentQuestion(null);
      setIsTyping(false);

      await new Promise((r) => setTimeout(r, 800));
      onComplete(data.diseases || []);
    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    if (!currentQuestion || isLoading) return;

    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);
    setIsLoading(true);

    // Add user answer to messages
    setMessages((prev) => [...prev, { role: "user", content: answer, type: "answer" }]);

    // Show typing indicator
    setIsTyping(true);
    await new Promise((r) => setTimeout(r, 400));

    try {
      const res = await fetch("/api/next-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ region, subRegion, initialSymptoms, age, sex, answers: newAnswers }),
      });
      const data = await res.json();

      if (data.moveToResult) {
        await fetchResults(newAnswers);
      } else if (data.nextQuestion) {
        setCurrentQuestion(data.nextQuestion);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.nextQuestion.text, type: "question" },
        ]);
        setIsTyping(false);
      }
    } catch (err) {
      console.error(err);
      setIsTyping(false);
    }

    setIsLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageArea} ref={scrollRef}>
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`${styles.message} ${
              msg.role === "user" ? styles.userMessage : styles.assistantMessage
            }`}
          >
            {msg.role === "assistant" && (
              <div className={styles.avatar}>
                <span>+</span>
              </div>
            )}
            <div
              className={`${styles.bubble} ${
                msg.role === "user" ? styles.userBubble : styles.assistantBubble
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className={`${styles.message} ${styles.assistantMessage}`}>
            <div className={styles.avatar}>
              <span>+</span>
            </div>
            <div className={`${styles.bubble} ${styles.assistantBubble}`}>
              <div className={styles.typingDots}>
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        )}
      </div>

      {currentQuestion && !isLoading && !isTyping && (
        <div className={styles.answerArea}>
          <div className={currentQuestion.type === "yesno" ? styles.answerButtons : styles.multipleButtons}>
            {currentQuestion.options?.map((opt) => (
              <button
                key={opt}
                className={currentQuestion.type === "yesno" ? (opt === "Yes" ? styles.answerBtn : styles.answerBtnOutline) : styles.multipleBtn}
                onClick={() => handleAnswer(opt)}
              >
                {opt}
              </button>
            ))}
            {(!currentQuestion.options || currentQuestion.options.length === 0) && currentQuestion.type === "yesno" && (
              <>
                <button className={styles.answerBtn} onClick={() => handleAnswer("Yes")}>Yes</button>
                <button className={styles.answerBtnOutline} onClick={() => handleAnswer("No")}>No</button>
              </>
            )}
          </div>
        </div>
      )}

      {isLoading && (
        <div className={styles.loadingBar}>
          <div className={styles.loadingProgress} />
        </div>
      )}
    </div>
  );
}
