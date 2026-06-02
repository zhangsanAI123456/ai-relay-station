// ============================================
// 聊天状态管理 - 管理多Tab对话状态
// ============================================
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { AIProvider, ChatMessage, Conversation } from '../types';
import { fetchProviders, streamChat } from '../services/api';

interface ChatState {
  providers: AIProvider[];
  activeProviderId: string;
  conversations: Record<string, Conversation>;
  apiKeys: Record<string, string>;
  isLoading: boolean;
  error: string | null;
}

type ChatAction =
  | { type: 'SET_PROVIDERS'; payload: AIProvider[] }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ACTIVE_PROVIDER'; payload: string }
  | { type: 'SET_MODEL'; providerId: string; modelId: string }
  | { type: 'ADD_MESSAGE'; providerId: string; message: ChatMessage }
  | { type: 'UPDATE_LAST_MESSAGE'; providerId: string; content: string }
  | { type: 'SET_LOADING'; providerId: string; loading: boolean }
  | { type: 'SET_API_KEY'; providerId: string; apiKey: string }
  | { type: 'CLEAR_CONVERSATION'; providerId: string };

function createEmptyConversation(providerId: string, modelId: string): Conversation {
  return {
    providerId,
    modelId,
    messages: [],
    isLoading: false,
  };
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_PROVIDERS':
      return { ...state, providers: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    case 'SET_ACTIVE_PROVIDER':
      return { ...state, activeProviderId: action.payload };

    case 'SET_MODEL': {
      const existing = state.conversations[action.providerId];
      if (existing && existing.modelId === action.modelId) return state;
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.providerId]: createEmptyConversation(action.providerId, action.modelId),
        },
      };
    }

    case 'ADD_MESSAGE': {
      const conv = state.conversations[action.providerId];
      const messages = conv
        ? [...conv.messages, { ...action.message, timestamp: Date.now() }]
        : [{ ...action.message, timestamp: Date.now() }];

      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.providerId]: {
            ...(conv || createEmptyConversation(action.providerId, '')),
            messages,
          },
        },
      };
    }

    case 'UPDATE_LAST_MESSAGE': {
      const conv = state.conversations[action.providerId];
      if (!conv) return state;
      const messages = [...conv.messages];
      if (messages.length > 0) {
        const last = { ...messages[messages.length - 1] };
        last.content += action.content;
        messages[messages.length - 1] = last;
      }
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.providerId]: { ...conv, messages },
        },
      };
    }

    case 'SET_LOADING':
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.providerId]: {
            ...(state.conversations[action.providerId] ||
              createEmptyConversation(action.providerId, '')),
            isLoading: action.loading,
          },
        },
      };

    case 'SET_API_KEY':
      return {
        ...state,
        apiKeys: { ...state.apiKeys, [action.providerId]: action.apiKey },
      };

    case 'CLEAR_CONVERSATION': {
      const conv = state.conversations[action.providerId];
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.providerId]: {
            ...(conv || createEmptyConversation(action.providerId, '')),
            messages: [],
          },
        },
      };
    }

    default:
      return state;
  }
}

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (content: string) => Promise<void>;
} | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, {
    providers: [],
    activeProviderId: 'openai',
    conversations: {},
    apiKeys: {},
    isLoading: false,
    error: null,
  });

  // 加载providers
  useEffect(() => {
    fetchProviders()
      .then((providers) => {
        dispatch({ type: 'SET_PROVIDERS', payload: providers });
        // 初始化第一个provider的对话
        if (providers.length > 0) {
          const first = providers[0];
          dispatch({
            type: 'SET_MODEL',
            providerId: first.id,
            modelId: first.models[0]?.id || '',
          });
        }
      })
      .catch((err) => {
        dispatch({ type: 'SET_ERROR', payload: err.message });
      });
  }, []);

  // 从localStorage加载API Keys
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ai-relay-api-keys');
      if (saved) {
        const keys = JSON.parse(saved);
        Object.entries(keys).forEach(([providerId, apiKey]) => {
          dispatch({ type: 'SET_API_KEY', providerId, apiKey: apiKey as string });
        });
      }
    } catch {
      // ignore
    }
  }, []);

  // 保存API Keys到localStorage
  useEffect(() => {
    const keysToSave = Object.fromEntries(
      Object.entries(state.apiKeys).filter(([, v]) => v)
    );
    if (Object.keys(keysToSave).length > 0) {
      localStorage.setItem('ai-relay-api-keys', JSON.stringify(keysToSave));
    }
  }, [state.apiKeys]);

  const sendMessage = useCallback(
    async (content: string) => {
      const providerId = state.activeProviderId;
      const conversation = state.conversations[providerId];
      if (!conversation) return;

      const userMessage: ChatMessage = { role: 'user', content };
      dispatch({ type: 'ADD_MESSAGE', providerId, message: userMessage });

      // 构建发送给API的消息列表（保留完整历史）
      const allMessages = [...conversation.messages, userMessage];

      // 添加空assistant消息占位
      const assistantMessage: ChatMessage = { role: 'assistant', content: '' };
      dispatch({ type: 'ADD_MESSAGE', providerId, message: assistantMessage });
      dispatch({ type: 'SET_LOADING', providerId, loading: true });

      try {
        const apiKey = state.apiKeys[providerId];
        const stream = streamChat(providerId, conversation.modelId, allMessages, apiKey);

        for await (const chunk of stream) {
          if (chunk.error) {
            dispatch({ type: 'SET_ERROR', payload: chunk.error });
            break;
          }
          if (chunk.content) {
            dispatch({ type: 'UPDATE_LAST_MESSAGE', providerId, content: chunk.content });
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        dispatch({ type: 'SET_ERROR', payload: msg });
        // 更新最后一条消息显示错误
        dispatch({
          type: 'UPDATE_LAST_MESSAGE',
          providerId,
          content: `\n\n❌ 错误：${msg}`,
        });
      } finally {
        dispatch({ type: 'SET_LOADING', providerId, loading: false });
      }
    },
    [state.activeProviderId, state.conversations, state.apiKeys]
  );

  return (
    <ChatContext.Provider value={{ state, dispatch, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
