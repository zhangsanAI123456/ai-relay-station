// ============================================
// 输入区域
// ============================================
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useChat } from '../contexts/ChatContext';

export default function InputArea() {
  const { state, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeConversation = state.conversations[state.activeProviderId];
  const isLoading = activeConversation?.isLoading ?? false;

  // 自动调整textarea高度
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    }
  }, [input]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput('');
    await sendMessage(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-4xl mx-auto flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息... (Enter发送, Shift+Enter换行)"
          rows={1}
          disabled={isLoading}
          className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:bg-gray-100 disabled:cursor-not-allowed
                     scrollbar-thin"
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="px-5 py-3 bg-blue-600 text-white rounded-xl font-medium text-sm
                     hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed
                     transition-colors duration-200 shrink-0 cursor-pointer"
        >
          {isLoading ? '⏳' : '发送'}
        </button>
      </div>
    </div>
  );
}
