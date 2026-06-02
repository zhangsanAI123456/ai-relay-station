// ============================================
// 设置面板 - API Key管理
// ============================================
import { useState } from 'react';
import { useChat } from '../contexts/ChatContext';

export default function SettingsPanel() {
  const { state, dispatch } = useChat();
  const [isOpen, setIsOpen] = useState(false);

  const activeProvider = state.providers.find((p) => p.id === state.activeProviderId);
  const currentApiKey = state.apiKeys[state.activeProviderId] || '';

  if (!activeProvider) return null;

  return (
    <>
      {/* 设置按钮 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700
                   hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
        title="API Key 设置"
      >
        ⚙️ 设置
      </button>

      {/* 设置面板 */}
      {isOpen && (
        <div className="absolute right-4 top-14 w-96 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">🔑 API Key 设置</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600 mb-1">
              当前提供商：{activeProvider.icon} {activeProvider.name}
            </label>
            <input
              type="password"
              value={currentApiKey}
              onChange={(e) =>
                dispatch({
                  type: 'SET_API_KEY',
                  providerId: state.activeProviderId,
                  apiKey: e.target.value,
                })
              }
              placeholder={`输入 ${activeProvider.name} 的 API Key...`}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {activeProvider.id === 'baidu' && (
              <p className="text-xs text-gray-400 mt-1">
                百度需要格式：API_KEY:SECRET_KEY
              </p>
            )}
          </div>

          <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
            <p className="font-medium mb-1">💡 提示：</p>
            <ul className="list-disc ml-4 space-y-1">
              <li>API Key 仅保存在浏览器本地存储</li>
              <li>不会被上传到服务器</li>
              <li>也可在服务端 .env 文件中统一配置</li>
            </ul>
          </div>

          {/* 所有provider的API Key快速概览 */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">已配置的 API Key：</p>
            <div className="space-y-1">
              {state.providers.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">
                    {p.icon} {p.name}
                  </span>
                  <span
                    className={state.apiKeys[p.id] ? 'text-green-500' : 'text-gray-300'}
                  >
                    {state.apiKeys[p.id] ? '✅ 已配置' : '⚪ 未配置'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
