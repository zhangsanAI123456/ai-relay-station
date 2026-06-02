// ============================================
// 聊天窗口
// ============================================
import { useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import MessageBubble from './MessageBubble';

export default function ChatWindow() {
  const { state } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  const provider = state.providers.find((p) => p.id === state.activeProviderId);
  const conversation = state.conversations[state.activeProviderId];
  const messages = conversation?.messages || [];

  // 自动滚动到底部
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!provider) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        {state.error ? (
          <div className="text-center">
            <p className="text-red-500 text-lg">⚠️ 连接服务器失败</p>
            <p className="text-sm mt-2">{state.error}</p>
          </div>
        ) : (
          <p>加载中...</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin bg-gray-50">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <div className="text-6xl mb-4">{provider.icon}</div>
          <p className="text-xl font-medium text-gray-600">{provider.name}</p>
          <p className="text-sm mt-2">{provider.description}</p>
          <div className="mt-6 bg-white border border-gray-200 rounded-xl px-5 py-3 text-sm text-gray-500 max-w-md text-center">
            请在下方输入消息开始对话，或先选择模型
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto px-4 py-2">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} provider={provider} />
          ))}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
