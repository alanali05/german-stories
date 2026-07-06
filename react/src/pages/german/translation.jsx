import { useState, useRef, useCallback } from 'react';

// Only the languages you actually need
const LANGUAGES = [
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'Englisch' },
    { code: 'tr', name: 'Türkisch' },
    { code: 'ar', name: 'Arabisch' },
    { code: 'ku', name: 'Kurdish (Badini)' },
    { code: 'ckb', name: 'Kurdish (Sorani)' },
];

export default function Translator() {
    // Default: German -> Kurdish (Badini), as requested
    const [sourceText, setSourceText] = useState('');
    const [translatedText, setTranslatedText] = useState('');
    const [sourceLang, setSourceLang] = useState('de');
    const [targetLang, setTargetLang] = useState('ku');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const debounceRef = useRef(null);
    const requestIdRef = useRef(0);

    const copytext = () => {
        navigator.clipboard.writeText(translatedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Helper to detect if a language uses Right-to-Left script
    const isRtl = (langCode) => ['ar', 'ckb', 'ku'].includes(langCode);

    // Google Translate's public endpoint — supports both Kurmanji (ku) and
    // Sorani (ckb) properly, unlike MyMemory which silently fails on them.
    const translateText = useCallback(async (text, sl, tl) => {
        const thisRequestId = ++requestIdRef.current;
        setIsLoading(true);
        setErrorMsg('');

        try {
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(text)}`;
            const response = await fetch(url);

            if (!response.ok) throw new Error('Netzwerkantwort war nicht ok');

            const data = await response.json();

            // Response shape: [[[translatedChunk, originalChunk, ...], ...], ...]
            const translated = data[0].map((chunk) => chunk[0]).join('');

            // Ignore stale responses if the user kept typing
            if (thisRequestId === requestIdRef.current) {
                setTranslatedText(translated);
            }
        } catch (error) {
            console.error('Translation error:', error);
            if (thisRequestId === requestIdRef.current) {
                setErrorMsg('Der Übersetzungsdienst ist nicht erreichbar. Überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.');
                setTranslatedText('');
            }
        } finally {
            if (thisRequestId === requestIdRef.current) {
                setIsLoading(false);
            }
        }
    }, []);

    const handleTranslate = () => {
        if (!sourceText.trim()) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        translateText(sourceText, sourceLang, targetLang);
    };
    
    const handleSwapLanguages = () => {
        const tempLang = sourceLang;
        setSourceLang(targetLang);
        setTargetLang(tempLang);
        setSourceText(translatedText);
        setTranslatedText(sourceText);
    };

    const handleClear = () => {
        setSourceText('');
        setTranslatedText('');
        setErrorMsg('');
    };

    return (
        <div className="min-h-screen bg-[#0b111e] text-slate-100 flex flex-col justify-between font-sans">

            {/* Main Container */}
            <main className="flex-grow max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col justify-center">

                {/* Card Layout */}
                <div className="bg-[#0f172a] rounded-2xl shadow-2xl border border-slate-800/80 overflow-hidden flex flex-col lg:flex-row min-h-[400px]">

                    {/* LEFT SIDE: Source Text Input */}
                    <div className="flex-1 flex flex-col p-5 border-b lg:border-b-0 lg:border-r border-slate-800">
                        {/* Language Selector Left */}
                        <div className="flex items-center justify-between mb-4">
                            <select
                                value={sourceLang}
                                onChange={(e) => setSourceLang(e.target.value)}
                                className="bg-[#1e293b] hover:bg-slate-700 text-slate-200 font-medium py-2 px-4 rounded-xl border border-slate-700 focus:ring-2 focus:ring-blue-500 transition cursor-pointer outline-none text-sm"
                            >
                                {LANGUAGES.map((lang) => (
                                    <option key={lang.code} value={lang.code} className="bg-[#0f172a]">{lang.name}</option>
                                ))}
                            </select>

                            {sourceText && (
                                <button
                                    onClick={handleClear}
                                    className="p-2 text-slate-500 hover:text-slate-300 rounded-full hover:bg-slate-800 transition"
                                    title="Text löschen"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            )}
                        </div>

                        {/* Input Box */}
                        <div className="flex-grow relative">
                            <textarea
                                value={sourceText}
                                onChange={(e) => setSourceText(e.target.value)}
                                placeholder="Geben Sie hier Ihr Wort oder Ihren Satz ein..."
                                maxLength={500}
                                dir={isRtl(sourceLang) ? 'rtl' : 'ltr'}
                                className="w-full h-full min-h-[150px] lg:min-h-[250px] resize-none bg-transparent border-none outline-none text-slate-100 text-lg placeholder-slate-500 focus:ring-0"
                            />
                        </div>

                        {/* Bottom bar for Input */}
                        <div className="flex justify-between items-center pt-4 border-t border-slate-800 mt-2">
                            <span className="text-xs text-slate-500 font-medium">
                                {sourceText.length} / 500 Zeichen
                            </span>
                            <button
                                onClick={handleTranslate}
                                disabled={!sourceText.trim() || isLoading}
                                className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-slate-400 font-semibold py-2 px-6 rounded-xl shadow-lg shadow-blue-950/50 transition flex items-center space-x-2"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <circle className="opacity-75" fill="currentColor" cx="12" cy="12" r="10" />
                                        </svg>
                                        <span>Übersetze...</span>
                                    </>
                                ) : (
                                    <span>Übersetzen</span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* MIDDLE: Swap Button for Large Screens */}
                    <div className="hidden lg:flex items-center justify-center -mx-4 z-10">
                        <button
                            onClick={handleSwapLanguages}
                            className="bg-[#1e293b] border border-slate-700 p-3 rounded-full shadow-md text-blue-400 hover:text-blue-300 hover:border-slate-600 transition transform hover:rotate-180 duration-300"
                            title="Sprachen tauschen"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                            </svg>
                        </button>
                    </div>

                    {/* RIGHT SIDE: Target Text Output */}
                    <div className="flex-1 flex flex-col p-5 bg-[#0b111e]/40">
                        {/* Language Selector Right */}
                        <div className="flex items-center justify-between mb-4">
                            <select
                                value={targetLang}
                                onChange={(e) => setTargetLang(e.target.value)}
                                className="bg-[#1e293b] hover:bg-slate-700 text-slate-200 font-medium py-2 px-4 rounded-xl border border-slate-700 focus:ring-2 focus:ring-blue-500 transition cursor-pointer outline-none text-sm"
                            >
                                {LANGUAGES.map((lang) => (
                                    <option key={lang.code} value={lang.code} className="bg-[#0f172a]">{lang.name}</option>
                                ))}
                            </select>

                            {/* Mobile Only Swap Button */}
                            <button
                                onClick={handleSwapLanguages}
                                className="lg:hidden p-2 text-blue-400 hover:bg-slate-800 rounded-xl transition"
                                title="Sprachen tauschen"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                                </svg>
                            </button>
                        </div>

                        {/* Output Box */}
                        <div className="flex-grow">
                            {isLoading ? (
                                <div className="h-full flex items-center justify-center min-h-[150px] lg:min-h-[250px]">
                                    <div className="space-y-2 w-full animate-pulse">
                                        <div className="h-4 bg-slate-800 rounded w-3/4"></div>
                                        <div className="h-4 bg-slate-800 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ) : errorMsg ? (
                                <div className="h-full flex items-center min-h-[150px] lg:min-h-[250px]">
                                    <p className="text-rose-400 text-sm">{errorMsg}</p>
                                </div>
                            ) : (
                                <div
                                    dir={isRtl(targetLang) ? 'rtl' : 'ltr'}
                                    className={`w-full h-full min-h-[150px] lg:min-h-[250px] text-lg font-medium whitespace-pre-wrap ${translatedText ? 'text-white' : 'text-slate-500 italic'
                                        }`}
                                >
                                    {translatedText || 'Die Übersetzung wird hier angezeigt...'}
                                </div>
                            )}
                        </div>


                        {/* Bottom info for Output */}
                        <div className="pt-4 relative border-t border-slate-800 mt-2 flex justify-end">

                            {copied && (
                                <div className="absolute -top-10 right-0 text-xs font-semibold text-white px-2.5 py-1.5 bg-blue-600 rounded-md shadow-md animate-fade-in-up z-20">
                                    Kopiert!
                                </div>
                            )}

                            {translatedText && (
                                <button
                                    onClick={copytext}
                                    className="text-slate-500 hover:text-blue-400 flex items-center space-x-1 text-xs font-semibold p-1.5 rounded-lg hover:bg-slate-800 transition"
                                    title="In die Zwischenablage kopieren"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                                    </svg>
                                    <span>Kopieren</span>
                                </button>
                            )}
                        </div>
                    </div>

                </div>

                {/* Tip section */}
                <p className="text-center text-xs text-slate-500 mt-4">
                    Geben Sie oben ein beliebiges Wort oder einen Satz ein, um die Übersetzung live zu sehen.
                </p>
            </main >
        </div >
    );
}