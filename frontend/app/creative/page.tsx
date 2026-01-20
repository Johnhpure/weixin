"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { topicApi, articleApi, TopicResponse, TopicIdea, OutlineSection } from '@/lib/api';
import { Loader2, Sparkles, Search, ArrowRight, Edit3, CheckCircle, Smartphone, PenTool, LayoutTemplate, ChevronRight, Menu } from 'lucide-react';
import { WeChatRenderer } from '@/components/WeChatRenderer';
import clsx from 'clsx';

type Step = 'TOPIC' | 'OUTLINE' | 'WRITING' | 'DONE';

const steps = [
    { id: 'TOPIC', label: '灵感', icon: Search },
    { id: 'OUTLINE', label: '大纲', icon: LayoutTemplate },
    { id: 'WRITING', label: '写作', icon: PenTool },
    { id: 'DONE', label: '排版', icon: Smartphone },
];

export default function CreativePage() {
    const [step, setStep] = useState<Step>('TOPIC');
    const [keyword, setKeyword] = useState('');
    const [loading, setLoading] = useState(false);

    // Data State
    const [topicResult, setTopicResult] = useState<TopicResponse | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<TopicIdea | null>(null);
    const [outline, setOutline] = useState<OutlineSection[]>([]);
    const [articleContent, setArticleContent] = useState<string>('');
    const [images, setImages] = useState<string[]>([]);
    const [isPolishing, setIsPolishing] = useState(false);

    // Actions
    const handleGenerateTopics = async () => {
        if (!keyword.trim()) return;
        setLoading(true);
        try {
            const data = await topicApi.generate(keyword);
            setTopicResult(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleSelectTopic = async (topic: TopicIdea) => {
        setSelectedTopic(topic);
        setLoading(true);
        try {
            const data = await articleApi.generateOutline(topic.title, topicResult?.search_summary || "");
            setOutline(data.sections);
            setStep('OUTLINE');
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleStartWriting = async () => {
        setStep('WRITING');
        // Initialize content with title
        setArticleContent(`# ${selectedTopic?.title || '新文章'}\n\n`);

        // Simulate initial "thinking" time or just start
        for (const section of outline) {
            setArticleContent(prev => prev + `\n\n## ${section.title}\n\n*Writing...*`);
            try {
                const res = await articleApi.writeSection(
                    section.title,
                    section.description,
                    topicResult?.search_summary || ""
                );
                setArticleContent(prev => prev.replace('*Writing...*', res.content));
            } catch (e) {
                setArticleContent(prev => prev + "\n[Error generating section]");
            }
        }
        setStep('DONE');
        handleGenerateImages();
    };

    const handleGenerateImages = async () => {
        setLoading(true);
        try {
            if (articleContent.length > 50) {
                const res = await articleApi.generateImage(articleContent.slice(0, 500));
                setImages([res.url]);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handlePolish = async () => {
        if (!articleContent) return;
        setIsPolishing(true);
        try {
            const res = await articleApi.polishContent(articleContent);
            setArticleContent(res.polished_content);
        } catch (e) { console.error(e); }
        finally { setIsPolishing(false); }
    };

    return (
        <div className="h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12">

            {/* LEFT PANEL: Interaction (Scrollable) */}
            <div className="hidden lg:flex lg:col-span-5 flex-col border-r border-gray-200 dark:border-gray-800 h-full bg-white/50 dark:bg-black/50 backdrop-blur-xl">

                {/* Header */}
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                            <Sparkles size={20} />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight">WeCreate Studio</h1>
                    </div>

                    {/* Progress Stepper */}
                    <div className="flex justify-between items-center relative mb-8">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-800 -z-10"></div>
                        {steps.map((s, idx) => {
                            const isActive = steps.findIndex(x => x.id === step) >= idx;
                            return (
                                <div key={s.id} className="flex flex-col items-center gap-2 bg-white dark:bg-black px-2">
                                    <div className={clsx(
                                        "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                                        isActive ? "border-indigo-600 bg-indigo-600 text-white" : "border-gray-200 text-gray-300"
                                    )}>
                                        <s.icon size={14} />
                                    </div>
                                    <span className={clsx("text-[10px] font-bold uppercase tracking-wider", isActive ? "text-indigo-600" : "text-gray-300")}>
                                        {s.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto p-8 pt-0 custom-scrollbar">
                    <AnimatePresence mode="wait">

                        {/* STEP 1: TOPIC */}
                        {step === 'TOPIC' && (
                            <motion.div
                                key="topic"
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold">What to write today?</h2>
                                    <p className="text-gray-500 text-sm">Enter a topic or keyword to brainstorm ideas.</p>
                                </div>

                                <div className="glass-panel p-2 rounded-xl flex items-center gap-2 shadow-sm">
                                    <input
                                        autoFocus
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}
                                        placeholder="e.g. AI Agents, Sustainable Coffee..."
                                        className="flex-1 px-4 py-3 bg-transparent border-none outline-none text-lg placeholder-gray-400"
                                        onKeyDown={(e) => e.key === 'Enter' && handleGenerateTopics()}
                                    />
                                    <button
                                        onClick={handleGenerateTopics}
                                        disabled={loading}
                                        className="p-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                                    </button>
                                </div>

                                {topicResult && (
                                    <div className="space-y-4 pt-4">
                                        <div className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Generated Ideas</div>
                                        <div className="grid gap-3">
                                            {topicResult.topics.map((topic, i) => (
                                                <motion.div
                                                    key={i}
                                                    whileHover={{ x: 4, backgroundColor: "rgba(99, 102, 241, 0.05)" }}
                                                    onClick={() => !loading && handleSelectTopic(topic)}
                                                    className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-indigo-500 transition-colors group bg-white dark:bg-gray-900"
                                                >
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">{topic.angle}</span>
                                                        <ChevronRight size={16} className="text-gray-300 group-hover:text-indigo-500" />
                                                    </div>
                                                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">{topic.title}</h3>
                                                    <p className="text-sm text-gray-500 line-clamp-2">{topic.rationale}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* STEP 2: OUTLINE */}
                        {step === 'OUTLINE' && (
                            <motion.div
                                key="outline"
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                                className="space-y-6"
                            >
                                <div className="flex justify-between items-end">
                                    <div className="space-y-1">
                                        <h2 className="text-xl font-bold">Outline Editor</h2>
                                        <p className="text-gray-500 text-sm">Refine the structure before writing.</p>
                                    </div>
                                    <button
                                        onClick={handleStartWriting}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition-transform active:scale-95"
                                    >
                                        Confirm & Write
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {outline.map((section, i) => (
                                        <div key={i} className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 flex gap-4 group hover:border-indigo-300 transition-colors">
                                            <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400 mt-1">
                                                {i + 1}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <input
                                                    value={section.title}
                                                    onChange={(e) => {
                                                        const newOutline = [...outline];
                                                        newOutline[i].title = e.target.value;
                                                        setOutline(newOutline);
                                                    }}
                                                    className="font-bold w-full bg-transparent outline-none border-b border-transparent focus:border-indigo-200 focus:bg-indigo-50/10 transition-all rounded px-1"
                                                />
                                                <textarea
                                                    value={section.description}
                                                    onChange={(e) => {
                                                        const newOutline = [...outline];
                                                        newOutline[i].description = e.target.value;
                                                        setOutline(newOutline);
                                                    }}
                                                    className="text-sm text-gray-500 w-full bg-transparent outline-none resize-none px-1"
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: WRITING CONTROLS */}
                        {(step === 'WRITING' || step === 'DONE') && (
                            <motion.div
                                key="controls"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold">
                                        {step === 'WRITING' ? 'Writing in progress...' : 'Article Ready'}
                                    </h2>
                                    <p className="text-gray-500 text-sm">
                                        {step === 'WRITING' ? 'AI is composing your article section by section.' : 'Review and polish your content locally.'}
                                    </p>
                                </div>

                                {step === 'WRITING' && (
                                    <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800 flex items-center gap-4 text-indigo-700 dark:text-indigo-300">
                                        <Loader2 className="animate-spin" />
                                        <span className="font-medium animate-pulse">Generating content...</span>
                                    </div>
                                )}

                                {step === 'DONE' && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 flex items-center gap-3 text-green-700">
                                            <CheckCircle size={20} />
                                            <span className="font-medium">Generation Complete</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                onClick={handlePolish}
                                                disabled={isPolishing}
                                                className="p-4 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/20 hover:bg-purple-700 transition-all flex flex-col items-center gap-2"
                                            >
                                                {isPolishing ? <Loader2 className="animate-spin" /> : <Sparkles />}
                                                <span>Humanize (De-AI)</span>
                                            </button>
                                            <button className="p-4 bg-gray-900 dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-all flex flex-col items-center gap-2">
                                                <Smartphone />
                                                <span>Copy for WeChat</span>
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Markdown Source Preview (Mini) */}
                                <div className="pt-8 border-t border-gray-100">
                                    <div className="text-xs font-bold text-gray-400 mb-3 uppercase">Source Preview</div>
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-500 h-64 overflow-y-auto">
                                        {articleContent || '// Content will appear here...'}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

            {/* RIGHT PANEL: Preview Canvas (Background) */}
            <div className="col-span-1 lg:col-span-7 h-full bg-slate-100/50 dark:bg-black relative overflow-hidden flex items-center justify-center p-4 lg:p-12">

                {/* Background Decoration */}
                <div className="absolute inset-0 bg-gradient-mesh opacity-30 pointer-events-none"></div>

                {/* The Phone Mockup - Persistent */}
                <motion.div
                    layout
                    className="relative z-10 scale-[0.85] lg:scale-100 transition-transform duration-500"
                >
                    <WeChatRenderer
                        content={articleContent || (topicResult ? `## 💡 Intelligence Brief\n\n${topicResult.search_summary}\n\n*Select a topic on the left to start generating content...*` : '## Welcome to WeCreate\n\nStart by entering a topic on the left panel.')}
                        images={images}
                    />
                </motion.div>
            </div>

        </div>
    );
}
