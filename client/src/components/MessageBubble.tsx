// ============================================
// 消息气泡组件
// ============================================
import ReactMarkdown from 'react-markdown';
import { ChatMessage, AIProvider } from '../types';

interface Props {
  message: ChatMessage;
  provider?: AIProvider;
}

export default function MessageBubble({ message, provider }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 py-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm shrink-0">
          {provider?.icon || '🤖'}
        </div>
      )}

      <div
        className={`
          max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed
          ${isUser
            ? 'bg-blue-600 text-white rounded-br-md'
            : 'bg-white border border-gray-200 rounded-bl-md shadow-sm'
          }
        `}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="message-content prose prose-sm max-w-none">
            {message.content ? (
              <ReactMarkdown>{message.content}</ReactMarkdown>
            ) : (
              <div className="flex gap-1 py-1">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm shrink-0">
          👤
        </div>
      )}
    </div>
  );
}
