// ============================================
// 顶部AI提供商标签栏
// ============================================
import { useChat } from '../contexts/ChatContext';

export default function ProviderTabs() {
  const { state, dispatch } = useChat();
  const { providers, activeProviderId } = state;

  const international = providers.filter((p) => p.category === 'international');
  const domestic = providers.filter((p) => p.category === 'domestic');

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center px-4 py-2 gap-1 overflow-x-auto scrollbar-thin">
        {/* 国际 */}
        <span className="text-xs text-gray-400 font-medium mr-2 shrink-0">🌍 国际</span>
        {international.map((p) => (
          <button
            key={p.id}
            onClick={() => dispatch({ type: 'SET_ACTIVE_PROVIDER', payload: p.id })}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
              transition-all duration-200 shrink-0 cursor-pointer
              ${
                activeProviderId === p.id
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }
            `}
          >
            <span>{p.icon}</span>
            <span>{p.name}</span>
          </button>
        ))}

        {/* 分隔 */}
        <span className="w-px h-6 bg-gray-200 mx-2 shrink-0" />

        {/* 国内 */}
        <span className="text-xs text-gray-400 font-medium mr-2 shrink-0">🇨🇳 国内</span>
        {domestic.map((p) => (
          <button
            key={p.id}
            onClick={() => dispatch({ type: 'SET_ACTIVE_PROVIDER', payload: p.id })}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
              transition-all duration-200 shrink-0 cursor-pointer
              ${
                activeProviderId === p.id
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }
            `}
          >
            <span>{p.icon}</span>
            <span>{p.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
