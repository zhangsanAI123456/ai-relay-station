// ============================================
// 整体布局组件
// ============================================
import ProviderTabs from './ProviderTabs';
import ModelSelector from './ModelSelector';
import SettingsPanel from './SettingsPanel';
import ChatWindow from './ChatWindow';
import InputArea from './InputArea';
import { useChat } from '../contexts/ChatContext';

export default function Layout() {
  const { state, dispatch } = useChat();

  const clearCurrentConversation = () => {
    dispatch({ type: 'CLEAR_CONVERSATION', providerId: state.activeProviderId });
  };

  const activeConversation = state.conversations[state.activeProviderId];
  const hasMessages = (activeConversation?.messages?.length || 0) > 0;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部栏 */}
      <header className="bg-white border-b border-gray-200 shadow-sm z-10">
        {/* 第一行：标题 + 设置 */}
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-gray-800">
              🤖 AI中转站
            </h1>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
              AI Relay Station
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasMessages && (
              <button
                onClick={clearCurrentConversation}
                className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded
                           hover:bg-red-50 transition-colors cursor-pointer"
              >
                🗑️ 清空对话
              </button>
            )}
            <SettingsPanel />
          </div>
        </div>

        {/* Provider标签栏 */}
        <ProviderTabs />

        {/* 第三行：模型选择 */}
        <div className="flex items-center px-4 py-2 border-t border-gray-100">
          <ModelSelector />
        </div>
      </header>

      {/* 聊天区域 */}
      <ChatWindow />

      {/* 底部输入区 */}
      <InputArea />

      {/* 错误提示 */}
      {state.error && (
        <div className="fixed bottom-20 right-4 bg-red-50 border border-red-200 text-red-700
                        rounded-lg px-4 py-3 text-sm shadow-lg max-w-sm z-50">
          <div className="flex items-center justify-between">
            <span>⚠️ {state.error}</span>
            <button
              onClick={() => dispatch({ type: 'SET_ERROR', payload: null })}
              className="ml-3 text-red-400 hover:text-red-600 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
