import { useEffect, useRef, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import storyone from "../../assets/storyone.png";
import { Play, Pause, Square, RotateCcw, CheckCircle2, XCircle, Sparkles, AlertTriangle } from 'lucide-react';

// --- 1. Story Data (A2 Level with Extensive Vocabulary & Quiz) ---
const a2Story = {
  id: "simple-morning",
  titleDe: "Ein einfacher Morgen",
  titleKu: "سپێدەیەکا سادە",
  level: "A2 (Anfänger)",
  readTime: "2 min",
  coverImage: "https://images.unsplash.com/photo-1506869640319-fea1a2ab8e40?auto=format&fit=crop&q=80&w=1200",
  segments: [
    { de: "Tom wacht früh am Morgen auf.", ku: "تۆم زوو د سپێدێ دا ژ خەو رادبیت." },
    { de: "Er trinkt ein Glas kaltes Wasser.", ku: "ئەو پەرداخەکا ئاڤا سار ڤەدخۆت." },
    { de: "Er zieht seine blaue Jacke an.", ku: "ئەو چاکێتێ خۆ یێ شین ل بەر خۆ دکەت." },
    { de: "Tom geht zu Fuß zum lokalen Markt.", ku: "تۆم ب پیادە دچیتە بازاڕێ ناوچەیێ." },
    { de: "Er kauft frisches Brot und süße Äpfel.", ku: "ئەو نانێ تازە و سێڤێن شیرین دکڕیت." },
    { de: "Das Wetter ist sonnig und warm.", ku: "سەقا یێ ساوی و گەرمە." },
    { de: "Er trifft seinen guten Freund Ali.", ku: "ئەو هەڤالێ خۆ یێ باش عەلی دبینیت." },
    { de: "Sie trinken zusammen heißen Tee.", ku: "ئەو پێکڤە چایا گەرم ڤەدخۆن." },
    { de: "Tom geht mit einem Lächeln nach Hause zurück.", ku: "تۆم ب خەندەیەکێ ڤە دزڤڕیتە مال." },
    { de: "Es ist ein schöner und einfacher Tag.", ku: "ئەڤە رۆژەکا جوان و سادەیە." }
  ],
  vocabulary: [
    { wordDe: "wacht", sentenceDe: "Er wacht früh auf.", wordKu: "ژ خەو رادبیت", sentenceKu: "ئەو زوو ژ خەو رادبیت." },
    { wordDe: "früh", sentenceDe: "Er wacht früh auf.", wordKu: "زوو", sentenceKu: "ئەو زوو ژ خەو رادبیت." },
    { wordDe: "Morgen", sentenceDe: "Das Wetter ist kalt am Morgen.", wordKu: "سپێدە", sentenceKu: "د سپێدێ دا هەوا سارە." },
    { wordDe: "trinkt", sentenceDe: "Er trinkt Wasser.", wordKu: "ڤەدخۆت", sentenceKu: "ئەو ئاڤێ ڤەدخۆت." },
    { wordDe: "Glas", sentenceDe: "Ein Glas Wasser.", wordKu: "پەرداخ", sentenceKu: "پەرداخەکا ئاڤێ." },
    { wordDe: "kaltes", sentenceDe: "Das Wasser ist sehr kalt.", wordKu: "سار", sentenceKu: "ئاڤ گەلەک سارە." },
    { wordDe: "Wasser", sentenceDe: "Wasser ist wichtig für das Leben.", wordKu: "ئاڤ", sentenceKu: "ئاڤ بۆ ژینێ گرنگە." },
    { wordDe: "zieht", sentenceDe: "Er zieht die Jacke an.", wordKu: "ل بەر خۆ دکەت", sentenceKu: "ئەو چاکێتی ل بەر خۆ دکەت." },
    { wordDe: "blaue", sentenceDe: "Seine Jacke ist blau.", wordKu: "شین", sentenceKu: "چاکێتێ وی شینە." },
    { wordDe: "Jacke", sentenceDe: "Meine Jacke ist neu.", wordKu: "چاکێت", sentenceKu: "چاکێتێ من یێ نوویە." },
    { wordDe: "geht", sentenceDe: "Er geht zum Markt.", wordKu: "ب پیادە دچیت", sentenceKu: "ئەو ب پیادە دچیتە بازاڕی." },
    { wordDe: "lokalen", sentenceDe: "Das ist der lokale Markt.", wordKu: "ناوچەیێ", sentenceKu: "ئەڤە بازاڕێ ناوچەیێ یە." },
    { wordDe: "Markt", sentenceDe: "Der Markt ist sehr voll.", wordKu: "بازاڕ", sentenceKu: "بازاڕ گەلەک یێ قەلەبالغە." },
    { wordDe: "kauft", sentenceDe: "Er kauft Brot.", wordKu: "دکڕیت", sentenceKu: "ئەو نانی دکڕیت." },
    { wordDe: "frisches", sentenceDe: "Frisches Brot ist sehr lecker.", wordKu: "تازە", sentenceKu: "نانێ تازە گەلەک یێ خوشە." },
    { wordDe: "Brot", sentenceDe: "Ich liebe Brot.", wordKu: "نان", sentenceKu: "ئەز حەژ نانی دکم." },
    { wordDe: "süße", sentenceDe: "Ein süßer Apfel.", wordKu: "شیرین", sentenceKu: "سێڤەکا شیرین." },
    { wordDe: "Äpfel", sentenceDe: "Ich kaufe Äpfel.", wordKu: "سێڤ", sentenceKu: "ئەز سێڤان دکڕم." },
    { wordDe: "Wetter", sentenceDe: "Das Wetter ist sehr schön.", wordKu: "سەقا", sentenceKu: "سەقا گەلەک یێ خۆشە." },
    { wordDe: "sonnig", sentenceDe: "Heute ist das Wetter sonnig.", wordKu: "ساوی / هەتاڤ", sentenceKu: "ئەڤرۆ سەقا یێ ساوی یە." },
    { wordDe: "warm", sentenceDe: "Die Sonne ist sehr warm.", wordKu: "گەرم", sentenceKu: "رۆژ گەلەک یا گەرمە." },
    { wordDe: "trifft", sentenceDe: "Er trifft seinen Freund.", wordKu: "دبینیت", sentenceKu: "ئەو هەڤالێ خوە دبینیت." },
    { wordDe: "guten", sentenceDe: "Hab einen guten Tag!", wordKu: "باش", sentenceKu: "رۆژەکا باش بۆ تە!" },
    { wordDe: "Freund", sentenceDe: "Er ist mein guter Freund.", wordKu: "هەڤال", sentenceKu: "ئەو هەڤالێ منێ باشە." },
    { wordDe: "heißen", sentenceDe: "Der Tee ist heiß.", wordKu: "گەرم", sentenceKu: "چای یا گەرمە." },
    { wordDe: "Tee", sentenceDe: "Ich trinke Tee.", wordKu: "چای", sentenceKu: "ئەز چایێ ڤەدخۆم." },
    { wordDe: "zusammen", sentenceDe: "Wir gehen zusammen.", wordKu: "پێکڤە", sentenceKu: "ئەم پێکڤە دچین." },
    { wordDe: "zurück", sentenceDe: "Er geht zurück nach Hause.", wordKu: "دزڤڕیت", sentenceKu: "ئەو دزڤڕیتە مال." },
    { wordDe: "Hause", sentenceDe: "Mein Zuhause ist schön.", wordKu: "مال", sentenceKu: "مالا من یا جوانە." },
    { wordDe: "Lächeln", sentenceDe: "Möge ein Lächeln auf deinem Gesicht sein.", wordKu: "خەندە", sentenceKu: "ل سەر دەم و چاڤێن تە خەندە بیت." },
    { wordDe: "schöner", sentenceDe: "Es ist ein schöner Tag.", wordKu: "جوان", sentenceKu: "ئەو رۆژەکا جوانە." },
    { wordDe: "einfacher", sentenceDe: "Ein einfaches Leben ist schön.", wordKu: "سادە", sentenceKu: "ژیانا سادە یا خۆشە." },
    { wordDe: "Tag", sentenceDe: "Heute ist ein schöner Tag.", wordKu: "رۆژ", sentenceKu: "ئەڤرۆ رۆژەکا خۆشە." }
  ],
  quiz: [
  {
    questionDe: "Was bedeutet das Wort 'schön' auf Kurdisch?",
    questionKu: "رامانا پەیڤا 'schön' ب کوردی چییە؟",
    options: ["سار", "گەرم", "جوان", "شیرین"],
    correctAnswer: 2
  },
  {
    questionDe: "Wie sagt man 'Ein einfacher Morgen' auf Kurdisch?",
    questionKu: "تۆ چەوا دبێژی 'Ein einfacher Morgen' ب کوردی؟",
    options: ["رۆژەکا سادە", "سپێدەیەکا سادە", "سپێدەیەکا سار", "نانێ تازە"],
    correctAnswer: 1
  },
  {
    questionDe: "Wähle das richtige deutsche Wort für 'ئاڤ':",
    questionKu: "پەیڤا ئەلمانی یا دروست بۆ 'ئاڤ' هەلبژێرە:",
    options: ["das Brot", "der Tee", "das Wasser", "die Jacke"],
    correctAnswer: 2
  },
  {
    questionDe: "Was bedeutet 'wacht auf' auf Kurdisch?",
    questionKu: "رامانا پەیڤا 'wacht auf' ب کوردی چییە؟",
    options: ["دزڤڕیت", "ژ خەو رادبیت", "دبینیت", "ل بەر خۆ دکەت"],
    correctAnswer: 1
  },
  {
    questionDe: "Wähle die richtige deutsche Übersetzung für 'زوو':",
    questionKu: "وەرگێڕانا ئەلمانی یا دروست بۆ 'زوو' هەلبژێرە:",
    options: ["Spät", "Früh", "Kalt", "Frisch"],
    correctAnswer: 1
  },
  {
    questionDe: "Wie sagt man 'Er trinkt kaltes Wasser' auf Kurdisch?",
    questionKu: "تۆ چەوا دبێژی 'Er trinkt kaltes Wasser' ب کوردی؟",
    options: [
      "ئەو پەرداخەکا ئاڤێ ڤەدخۆت",
      "ئەو چایا گەرم ڤەدخۆت",
      "ئەو ئاڤا سار ڤەدخۆت",
      "ئەو نانێ تازە دکڕیت"
    ],
    correctAnswer: 2
  },
  {
    questionDe: "Wie lautet das kurdische Wort für 'die Jacke'?",
    questionKu: "پەیڤا کوردی بۆ 'die Jacke' چییە؟",
    options: ["نان", "سێڤ", "پەرداخ", "چاکێت"],
    correctAnswer: 3
  },
  {
    questionDe: "Wähle das richtige deutsche Wort für 'شین':",
    questionKu: "پەیڤا ئەلمانی یا دروست بۆ 'شین' هەلبژێرە:",
    options: ["Rot", "Grün", "Blau", "Gelb"],
    correctAnswer: 2
  },
  {
    questionDe: "Was bedeutet 'geht zu Fuß' auf Kurdisch?",
    questionKu: "رامانا پەیڤا 'geht zu Fuß' ب کوردی چییە؟",
    options: ["دزڤڕیت", "ب پیادە دچیت", "ڤەدخۆت", "دکڕیت"],
    correctAnswer: 1
  },
  {
    questionDe: "Wie sagt man 'lokaler Markt' auf Kurdisch?",
    questionKu: "تۆ چەوا دبێژی 'lokaler Markt' ب کوردی؟",
    options: ["بازاڕێ مەزن", "بازاڕێ ناوچەیێ", "مالا جوان", "سەقایێ گەرم"],
    correctAnswer: 1
  },
  {
    questionDe: "Wähle das richtige deutsche Wort für 'تازە':",
    questionKu: "پەیڤا ئەلمانی یا دروست بۆ 'تازە' هەلبژێرە:",
    options: ["Süß", "Kalt", "Heiß", "Frisch"],
    correctAnswer: 3
  },
  {
    questionDe: "Was bedeutet 'das Brot' auf Kurdisch?",
    questionKu: "رامانا پەیڤا 'das Brot' ب کوردی چییە؟",
    options: ["چای", "سێڤ", "نان", "ئاڤ"],
    correctAnswer: 2
  },
  {
    questionDe: "Wähle das richtige deutsche Wort für 'شیرین':",
    questionKu: "پەیڤا ئەلمانی یا دروست بۆ 'شیرین' هەلبژێرە:",
    options: ["Bitter", "Einfach", "Süß", "Gut"],
    correctAnswer: 2
  },
  {
    questionDe: "Was bedeutet 'das Wetter' auf Kurdisch?",
    questionKu: "رامانا پەیڤا 'das Wetter' ب کوردی چییە؟",
    options: ["سەقا", "رۆژ", "مال", "بازاڕ"],
    correctAnswer: 0
  },
  {
    questionDe: "Wie sagt man 'sonnig und warm' auf Kurdisch?",
    questionKu: "تۆ چەوا دبێژی 'sonnig und warm' ب کوردی؟",
    options: ["سار و باران", "ساوی و گەرم", "تار و سار", "جوان و سادە"],
    correctAnswer: 1
  },
  {
    questionDe: "Wähle die richtige deutsche Übersetzung für 'هەڤال':",
    questionKu: "وەرگێڕانا ئەلمانی یا دروست بۆ 'هەڤال' هەلبژێرە:",
    options: ["der Junge", "der Freund", "der Bruder", "der Mann"],
    correctAnswer: 1
  },
  {
    questionDe: "Was bedeutet 'trifft' auf Kurdisch?",
    questionKu: "رامانا پەیڤا 'trifft' ب کوردی چییە؟",
    options: ["دکڕیت", "دبینیت", "ڤەدخۆت", "دزڤڕیت"],
    correctAnswer: 1
  },
  {
    questionDe: "Wie sagt man 'heißer Tee' auf Kurdisch?",
    questionKu: "تۆ چەوا دبێژی 'heißer Tee' ب کوردی؟",
    options: ["ئاڤا سار", "چایا سار", "چایا گەرم", "نانێ گەرم"],
    correctAnswer: 2
  },
  {
    questionDe: "Was bedeutet 'zusammen' auf Kurdisch?",
    questionKu: "رامانا پەیڤا 'zusammen' ب کوردی چییە؟",
    options: ["ب تنێ", "زوو", "پێکڤە", "باش"],
    correctAnswer: 2
  },
  {
    questionDe: "Wähle das richtige deutsche Wort für 'خەندە':",
    questionKu: "پەیڤا ئەلمانی یا دروست بۆ 'خەندە' هەلبژێرە:",
    options: ["Weinen", "Lachen", "Lächeln", "Schauen"],
    correctAnswer: 2
  }
]
};

const sortedVocabulary = [...a2Story.vocabulary].sort((a, b) => b.wordDe.length - a.wordDe.length);

const renderTextWithTooltips = (text) => {
  const pattern = new RegExp(`\\b(${sortedVocabulary.map(v => v.wordDe).join('|')})\\b`, 'gi');
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const vocabItem = a2Story.vocabulary.find(v => v.wordDe.toLowerCase() === part.toLowerCase());

    if (vocabItem) {
      return (
        <span key={index} className="group relative inline-block cursor-pointer px-0.5">
          <span className="border-b-[1.5px] border-dashed border-blue-400 text-blue-300 transition-colors group-hover:text-cyan-300">
            {part}
          </span>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-max max-w-50 flex-col items-center group-hover:flex z-50 pointer-events-none">
            <span className="bg-slate-800 border border-slate-600 text-white text-sm rounded-xl py-2 px-3 shadow-2xl flex flex-col items-center">
              <span className="text-emerald-400 font-bold text-base" dir="rtl">{vocabItem.wordKu}</span>
              <span className="text-slate-300 text-[11px] text-center mt-1">{vocabItem.sentenceKu}</span>
            </span>
            <span className="w-2.5 h-2.5 bg-slate-800 border-b border-r border-slate-600 transform rotate-45 -mt-1.5"></span>
          </span>
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export default function StoryPage() {
  // const navigate = useNavigate();
  const story = a2Story;

  const [viewMode, setViewMode] = useState("bilingual");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeSegment, setActiveSegment] = useState(-1);
  const utteranceRef = useRef(null);

  // --- Step-by-Step Quiz State ---
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedJustNow, setSelectedJustNow] = useState(null);

  const [writeIndex, setWriteIndex] = useState(0);
  const [writeInput, setWriteInput] = useState("");
  const [writeChecked, setWriteChecked] = useState(false);
  const [writeScore, setWriteScore] = useState(0);
  const [showWriteResults, setShowWriteResults] = useState(false);
  const [writeFeedback, setWriteFeedback] = useState(null);

  // Expanded list with Articles
  const writingQuestions = useMemo(() => [
    { ku: "ئاڤ", de: "das Wasser", hint: "Er trinkt ein Glas kaltes..." },
    { ku: "نان", de: "das Brot", hint: "Er kauft frisches..." },
    { ku: "سپێدە", de: "der Morgen", hint: "Tom wacht früh am ... auf." },
    { ku: "هەڤال", de: "der Freund", hint: "Er trifft seinen guten ... Ali." },
    { ku: "چاکێت", de: "die Jacke", hint: "Er zieht seine blaue ... an." },
    { ku: "بازاڕ", de: "der Markt", hint: "Tom geht zu Fuß zum lokalen..." },
    { ku: "سەقا", de: "das Wetter", hint: "Das ... ist sonnig und warm." },
    { ku: "چای", de: "der Tee", hint: "Sie trinken zusammen heißen..." },
    { ku: "رۆژ", de: "der Tag", hint: "Es ist ein schöner und einfacher..." },
    { ku: "سێڤ (Plural)", de: "die Äpfel", hint: "Er kauft frisches Brot und süße..." },
    { ku: "خەندە", de: "das Lächeln", hint: "Tom geht mit einem ... nach Hause zurück." },
    { ku: "سار", de: "kalt", hint: "Adjektiv: Nicht warm, sondern..." },
    { ku: "زوو", de: "früh", hint: "Adverb: Am Anfang des Tages, sehr..." },
    { ku: "گەرم", de: "warm", hint: "Adjektiv: Die Sonne ist sehr..." },
    { ku: "جوان", de: "schön", hint: "Adjektiv: Ein ...er Tag." }
  ], []);

  const fullTextDe = useMemo(() => story.segments.map(s => s.de).join(" "), [story]);
  const segmentRanges = useMemo(() => {
    let currentIndex = 0;
    return story.segments.map((s) => {
      const start = currentIndex;
      const end = start + s.de.length;
      // Adding 1 for the space joined in fullTextDe
      currentIndex = end + 1;
      return { start, end };
    });
  }, [story]);

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const handlePlay = () => {
    window.speechSynthesis.cancel();
    
    // FIX 1: Instantiate directly onto the ref to completely protect it 
    // from browser Garbage Collection
    utteranceRef.current = new SpeechSynthesisUtterance(fullTextDe);
    const utterance = utteranceRef.current;

    utterance.lang = 'de-DE'; // Set language to German
    utterance.rate = 0.80;
    utterance.pitch = 1.0;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    let bestVoice = voices.find(v =>
      v.lang.startsWith("de") &&
      (v.name.toLowerCase().includes("male") || v.name.includes("Hans") || v.name.includes("Conrad"))
    );

    if (!bestVoice) bestVoice = voices.find(v => v.lang.startsWith("de") && v.name.includes("Google"));
    if (!bestVoice) bestVoice = voices.find(v => v.lang.startsWith("de"));

    if (bestVoice) utterance.voice = bestVoice;

    utterance.onboundary = (event) => {
      // Debug Log: Check your console to see if boundaries fire and what they report
      console.log(`Boundary hit! Name: "${event.name}", charIndex: ${event.charIndex}`);

      // FIX 2: Loosen the check. If event.name is missing or reports as 'word', track it.
      if (!event.name || event.name === "word") {
        const charIndex = event.charIndex;
        const activeIdx = segmentRanges.findIndex(
          (r) => charIndex >= r.start && charIndex <= r.end
        );
        
        if (activeIdx !== -1) {
          setActiveSegment(activeIdx);
        }
      }
    };

    utterance.onend = () => resetSpeechState();
    utterance.onerror = (err) => {
      console.error("SpeechSynthesis Error:", err);
      resetSpeechState();
    };

    // Start speaking
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const handleResume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    resetSpeechState();
  };

  const resetSpeechState = () => {
    setIsSpeaking(false);
    setIsPaused(false);
    setActiveSegment(-1);
  };

  // --- Quiz Handlers (Step-by-Step Logic) ---
  const handleOptionSelect = (optionIndex) => {
    // Guard: block clicks once results are shown, or while a click is already
    // being processed (this is what was causing the crash on the last question —
    // double clicks pushed currentQuestionIndex past the end of the quiz array).
    if (showQuizResults || selectedJustNow !== null) return;

    setSelectedJustNow(optionIndex); // Used to show yellow/red feedback styling

    // Save the answer
    const updatedAnswers = { ...quizAnswers, [currentQuestionIndex]: optionIndex };
    setQuizAnswers(updatedAnswers);

    // Wait so the user sees the yellow/red feedback, then advance
    setTimeout(() => {
      if (currentQuestionIndex < story.quiz.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedJustNow(null);
      } else {
        // Calculate Score
        let score = 0;
        story.quiz.forEach((q, i) => {
          if (updatedAnswers[i] === q.correctAnswer) score++;
        });
        setQuizScore(score);
        setShowQuizResults(true);
        setSelectedJustNow(null); // reset so state stays clean if quiz is retaken
      }
    }, 700); // slightly longer so the color feedback is clearly visible
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuizAnswers({});
    setShowQuizResults(false);
    setQuizScore(0);
    setSelectedJustNow(null);
  };

  const handleCheckWriteSubmit = (e) => {
    e.preventDefault();
    if (writeChecked || !writeInput.trim()) return;

    const currentTarget = writingQuestions[writeIndex].de.toLowerCase();
    const userAns = writeInput.trim().toLowerCase();
    const validArticles = ["der", "die", "das"];

    if (userAns === currentTarget) {
      setWriteScore(prev => prev + 1);
      setWriteFeedback("correct");
    } else {
      const targetParts = currentTarget.split(" ");
      const isNounWithArticle = targetParts.length === 2 && validArticles.includes(targetParts[0]);

      if (isNounWithArticle) {
        const targetNoun = targetParts[1];
        const userParts = userAns.split(" ");

        if (userAns === targetNoun) {
          setWriteFeedback("missing_article");
        }
        else if (userParts.length === 2 && userParts[1] === targetNoun && validArticles.includes(userParts[0])) {
          setWriteFeedback("wrong_article");
        }
        else {
          setWriteFeedback("incorrect");
        }
      } else {
        setWriteFeedback("incorrect");
      }
    }
    setWriteChecked(true);
  };

  const handleNextWriteQuestion = () => {
    if (writeIndex < writingQuestions.length - 1) {
      setWriteIndex(prev => prev + 1);
      setWriteInput("");
      setWriteChecked(false);
      setWriteFeedback(null);
    } else {
      setShowWriteResults(true);
    }
  };

  const resetWriteQuiz = () => {
    setWriteIndex(0);
    setWriteInput("");
    setWriteChecked(false);
    setWriteScore(0);
    setShowWriteResults(false);
    setWriteFeedback(null);
  };

  return (
    

// This is the return() JSX for your story component — drop it in place of your
// current return, keeping all your existing state/handlers (story, viewMode,
// isSpeaking, isPaused, activeSegment, handlePlay, handlePause, handleResume,
// handleStop, renderTextWithTooltips, sortedVocabulary, quiz state, write state, etc.)

  <div className="min-h-screen bg-[#0a0f1a] text-slate-200 selection:bg-cyan-500/30 font-sans pb-40 relative overflow-hidden">

    {/* Ambient glow accents — same treatment as the rest of the site */}
    <div className="absolute top-0 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
    <div className="absolute top-96 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

    {/* Hero Header */}
    <div className="relative h-64 w-full overflow-hidden md:h-80">
      <img src={storyone} alt="Story Cover" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1a] via-[#0a0f1a]/60 to-transparent" />

      <div className="absolute bottom-0 left-0 w-full px-6 pb-6 md:px-12">
        <div className="flex gap-3 mb-3">
          <span className="rounded-md border border-cyan-500/40 bg-cyan-500/15 backdrop-blur-sm px-2 py-1 text-xs font-semibold text-cyan-400">
            {story.level}
          </span>
          <span className="rounded-md border border-emerald-500/40 bg-emerald-500/15 backdrop-blur-sm px-2 py-1 text-xs font-semibold text-emerald-400">
            {story.readTime}
          </span>
        </div>
        <h1 className="text-3xl font-extrabold text-white md:text-5xl tracking-tight">
          {story.titleDe}
        </h1>
        <h2 className="text-xl font-medium text-slate-400 mt-2" dir="rtl">
          {story.titleKu}
        </h2>
      </div>
    </div>

    <main className="relative mx-auto max-w-4xl">

      {/* Sticky Control Bar — now a floating glass pill instead of a flat bar */}
      <div className="sticky top-4 z-40 mx-4 md:mx-8 mb-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-5 py-3 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {!isSpeaking ? (
              <button
                onClick={handlePlay}
                className="flex h-10 px-5 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 font-semibold text-white shadow-[0_4px_20px_rgba(34,211,238,0.25)] transition-all active:scale-[0.98]"
              >
                <Play size={16} fill="white" /> Vorlesen
              </button>
            ) : (
              <>
                {!isPaused ? (
                  <button
                    onClick={handlePause}
                    className="flex h-10 px-5 items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 font-medium text-cyan-400 hover:bg-cyan-500/20 transition"
                  >
                    <Pause size={16} /> Pause
                  </button>
                ) : (
                  <button
                    onClick={handleResume}
                    className="flex h-10 px-5 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 font-semibold text-white shadow-[0_4px_20px_rgba(34,211,238,0.25)] transition"
                  >
                    <Play size={16} fill="white" /> Wieder aufnehmen
                  </button>
                )}
                <button
                  onClick={handleStop}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition"
                >
                  <Square size={16} fill="currentColor" />
                </button>
              </>
            )}
          </div>

          <div className="flex bg-slate-950/80 p-1 rounded-xl border border-slate-800">
            {['german', 'bilingual', 'kurdish'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all capitalize ${
                  viewMode === mode
                    ? "bg-gradient-to-r from-cyan-600 to-emerald-600 text-white shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {mode === 'kurdish' ? 'کوردی' : mode === 'german' ? 'Deutsch' : mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Story Text Area */}
      <section className="px-6 py-6 md:px-12 text-left">
        <div className="flex flex-col gap-4">
          {story.segments.map((segment, i) => {
            const isReadingThis = activeSegment === i;

            return (
              <div
                key={i}
                className={`flex flex-col md:flex-row gap-4 p-5 rounded-2xl transition-all duration-300 border ${
                  isReadingThis
                    ? "bg-gradient-to-r from-cyan-500/10 to-emerald-500/5 border-cyan-500/30 shadow-[0_0_25px_rgba(34,211,238,0.12)] scale-[1.01] border-l-4 border-l-cyan-400"
                    : "bg-slate-900/30 border-slate-800/60 hover:bg-slate-900/50"
                }`}
              >
                {(viewMode === "german" || viewMode === "bilingual") && (
                  <div className="flex-1 text-left">
                    <p className={`font-story font-medium text-[20px] leading-[1.9] tracking-[0.01em] ${isReadingThis ? "text-white" : "text-slate-300"}`}>
                      {renderTextWithTooltips(segment.de)}
                    </p>
                  </div>
                )}

                {(viewMode === "kurdish" || viewMode === "bilingual") && (
                  <div className={`flex-1 text-right ${viewMode === "bilingual" ? "md:border-r md:border-slate-800 md:pr-4" : ""}`} dir="rtl">
                    <p className={`text-[19px] leading-[1.9] font-medium ${isReadingThis ? "text-emerald-400" : "text-slate-400"}`}>
                      {segment.ku}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Massive Vocabulary Table */}
      <section className="px-6 md:px-12">
        <div className="mb-6 border-t border-slate-800 pt-10">
          <h2 className="text-lg font-extrabold uppercase tracking-widest bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Vokabular / فەرهەنگا پەیڤان
          </h2>
          <p className="text-slate-500 text-sm mt-1">Fast jedes Wort aus der Geschichte ist unten aufgeführt.</p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
          <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
            <table className="w-full text-left text-sm md:text-base">
              <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-10 shadow-sm">
                <tr>
                  <th className="px-5 py-3 font-semibold text-cyan-400 md:text-left">Wort (Deutsch)</th>
                  <th className="px-5 py-3 font-semibold text-emerald-400 md:text-right" dir="rtl">رامان ب کوردی</th>
                  <th className="px-5 py-3 font-semibold text-slate-300 table-cell">Bedeutung auf Deutsch</th>
                  <th className="px-5 py-3 font-semibold table-cell text-emerald-400 text-right" dir="rtl">رامان ب کوردی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {sortedVocabulary.map((item, index) => (
                  <tr key={index} className="transition-colors hover:bg-cyan-500/5">
                    <td className="px-5 py-3 font-bold text-cyan-200 align-top md:text-left">{item.wordDe}</td>
                    <td className="md:text-right px-5 py-3 font-bold text-emerald-300 align-top" dir="rtl">{item.wordKu}</td>
                    <td className="px-5 py-3 text-slate-400 align-top table-cell text-sm">
                      {item.sentenceDe}
                    </td>
                    <td className="px-5 py-3 text-slate-400 align-top table-cell text-sm">
                      {item.sentenceKu}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Step-by-Step Interactive Quiz Section */}
      <section className="px-6 md:px-12 mt-10">
        <div className="mb-6 border-t border-slate-800 pt-10">
          <h2 className="text-lg font-extrabold uppercase tracking-widest bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Schnelles Quiz / پرسیار و بەرسڤ
          </h2>
          <p className="text-slate-500 text-sm mt-1">Bîra xwe biceribînin! Bersivek hilbijêrin ku pêşde biçin.</p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 min-h-[300px] flex flex-col justify-center">

          {!showQuizResults ? (
            <div className="animate-fade-in-up">
              <div className="flex justify-between items-center gap-5 mb-6">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Question {currentQuestionIndex + 1} of {story.quiz.length}
                </span>
                <div className="flex flex-wrap gap-y-3 gap-x-1">
                  {story.quiz.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 w-6 rounded-full ${
                        idx === currentQuestionIndex
                          ? "bg-gradient-to-r from-cyan-400 to-emerald-400"
                          : idx < currentQuestionIndex
                          ? "bg-slate-600"
                          : "bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-slate-200">{story.quiz[currentQuestionIndex].questionDe}</h3>
                <h3 className="text-lg text-slate-400 mt-2" dir="rtl">{story.quiz[currentQuestionIndex].questionKu}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {story.quiz[currentQuestionIndex].options.map((option, oIndex) => {
                  const isSelected = selectedJustNow === oIndex;
                  const isCorrectAnswer = oIndex === story.quiz[currentQuestionIndex].correctAnswer;

                  let styleClasses =
                    "border-slate-700 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-500 text-slate-300";

                  if (selectedJustNow !== null) {
                    if (isSelected && isCorrectAnswer) {
                      styleClasses =
                        "border-2 border-emerald-400 bg-emerald-400/10 text-emerald-300 font-bold shadow-[0_0_20px_rgba(52,211,153,0.35)] scale-[0.98]";
                    } else if (isSelected && !isCorrectAnswer) {
                      styleClasses =
                        "border-2 border-rose-500 bg-rose-500/10 text-rose-300 font-bold shadow-[0_0_20px_rgba(244,63,94,0.35)] scale-[0.98]";
                    } else {
                      styleClasses = "border-slate-800 bg-slate-800/20 text-slate-600 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={oIndex}
                      onClick={() => handleOptionSelect(oIndex)}
                      disabled={selectedJustNow !== null}
                      className={`p-4 border rounded-xl text-left transition-all duration-200 flex items-center justify-between gap-2 ${styleClasses}`}
                    >
                      <span>{option}</span>
                      {selectedJustNow !== null && isSelected && isCorrectAnswer && <CheckCircle2 size={18} />}
                      {selectedJustNow !== null && isSelected && !isCorrectAnswer && <XCircle size={18} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center animate-fade-in-up py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-slate-700 mb-6">
                <span className="text-3xl font-bold text-white">{quizScore}/{story.quiz.length}</span>
              </div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-2 flex items-center justify-center gap-2">
                <Sparkles size={22} /> Quiz abgeschlossen!
              </h3>
              <p className="text-slate-400 mb-8">
                {quizScore === story.quiz.length ? "Perfect score! Great job." : "Good effort! Keep practicing."}
              </p>
              <button
                onClick={resetQuiz}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold py-3 px-8 rounded-xl shadow-[0_4px_20px_rgba(34,211,238,0.25)] transition-all active:scale-[0.98]"
              >
                <RotateCcw size={16} /> Wiederholen Sie das Quiz
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Writing Practice Section */}
      <section className="px-6 md:px-12 mt-10">
        <div className="mb-6 border-t border-slate-800 pt-10">
          <h2 className="text-lg font-extrabold uppercase tracking-widest bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
            Schreibpraxis / تاقیکرنا نڤیسینێ
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Geben Sie die richtige deutsche Übersetzung ein.{" "}
            <strong className="text-slate-300">Wenn es sich um ein Substantiv handelt, müssen Sie den Artikel angeben (der, die, das)!</strong>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-6 min-h-[300px] flex flex-col justify-center">
          {!showWriteResults ? (
            <div>
              <div className="flex justify-between items-center gap-5 mb-6">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Exercise {writeIndex + 1} of {writingQuestions.length}
                </span>
                <div className="flex gap-x-1 flex-wrap max-w-[60%] justify-end">
                  {writingQuestions.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 w-6 rounded-full mb-1 ${
                        idx === writeIndex
                          ? "bg-gradient-to-r from-cyan-400 to-emerald-400"
                          : idx < writeIndex
                          ? "bg-slate-600"
                          : "bg-slate-800"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6 text-center md:text-left">
                <span className="text-xs uppercase bg-slate-950/80 border border-slate-800 text-cyan-400 px-2 py-1 rounded-md font-mono">
                  Übersetzen Sie dieses Wort:
                </span>
                <h3 className="text-3xl font-bold text-emerald-400 mt-2" dir="rtl">{writingQuestions[writeIndex].ku}</h3>
                <p className="text-sm text-slate-400 italic mt-2">Hinweis: "{writingQuestions[writeIndex].hint}"</p>
              </div>

              <form onSubmit={handleCheckWriteSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={writeInput}
                    onChange={(e) => !writeChecked && setWriteInput(e.target.value)}
                    disabled={writeChecked}
                    placeholder="e.g. das Wasser, schön, der Tag..."
                    className={`w-full bg-slate-950/80 border text-lg rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 transition-all ${
                      writeChecked
                        ? writeFeedback === "correct"
                          ? "border-emerald-500 focus:ring-emerald-500 bg-emerald-950/20"
                          : "border-rose-500 focus:ring-rose-500 bg-rose-950/20"
                        : "border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/30"
                    }`}
                  />
                </div>

                {writeChecked && (
                  <div
                    className={`p-4 rounded-xl border text-sm flex items-start gap-2 ${
                      writeFeedback === "correct"
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        : writeFeedback === "missing_article"
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    }`}
                  >
                    {writeFeedback === "correct" && (
                      <>
                        <Sparkles size={18} className="shrink-0 mt-0.5" />
                        <span><strong>Richtig!</strong> Ausgezeichnete Rechtschreibung.</span>
                      </>
                    )}
                    {writeFeedback === "missing_article" && (
                      <>
                        <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                        <span>
                          <strong>Fast richtig!</strong> Du hast den Artikel vergessen. Die vollständige richtige Antwort lautet
                          <strong className="underline text-white">{writingQuestions[writeIndex].de}</strong>.
                        </span>
                      </>
                    )}
                    {writeFeedback === "wrong_article" && (
                      <>
                        <XCircle size={18} className="shrink-0 mt-0.5" />
                        <span>
                          <strong>Falscher Artikel!</strong> Das Substantiv ist richtig, aber der Artikel ist falsch. Die richtige Antwort ist
                          <strong className="underline text-white">{writingQuestions[writeIndex].de}</strong>.
                        </span>
                      </>
                    )}
                    {writeFeedback === "incorrect" && (
                      <>
                        <XCircle size={18} className="shrink-0 mt-0.5" />
                        <span>
                          <strong>Falsch.</strong> Das richtige Wort ist{" "}
                          <strong className="underline text-white">{writingQuestions[writeIndex].de}</strong>.
                        </span>
                      </>
                    )}
                  </div>
                )}

                <div className="flex justify-end">
                  {!writeChecked ? (
                    <button
                      type="submit"
                      disabled={!writeInput.trim()}
                      className="bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_4px_20px_rgba(52,211,153,0.25)] active:scale-[0.98]"
                    >
                      Antwort prüfen
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextWriteQuestion}
                      className="bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-bold py-2.5 px-6 rounded-xl transition-all shadow-[0_4px_20px_rgba(34,211,238,0.25)] active:scale-[0.98]"
                    >
                      {writeIndex < writingQuestions.length - 1 ? "Next Exercise →" : "Finish & View Results"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-slate-700 mb-6">
                <span className="text-3xl font-bold text-white">{writeScore}/{writingQuestions.length}</span>
              </div>
              <h3 className="text-2xl font-bold text-emerald-400 mb-2 flex items-center justify-center gap-2">
                <Sparkles size={22} /> Schreiben abgeschlossen!
              </h3>
              <p className="text-slate-400 mb-8">
                {writeScore === writingQuestions.length
                  ? "Incredible! You nailed the spelling and the articles."
                  : "Spelling and articles can be tricky. Try again to get 100%!"}
              </p>
              <button
                onClick={resetWriteQuiz}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold py-3 px-8 rounded-xl shadow-[0_4px_20px_rgba(52,211,153,0.25)] transition-all active:scale-[0.98]"
              >
                <RotateCcw size={16} /> Wiederholen Sie das Schreibquiz
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  </div>
);

}