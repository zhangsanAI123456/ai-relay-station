// ============================================
// 模型选择下拉菜单
// ============================================
import { useChat } from '../contexts/ChatContext';

export default function ModelSelector() {
  const { state, dispatch } = useChat();
  const { providers, activeProviderId, conversations } = state;

  const provider = providers.find((p) => p.id === activeProviderId);
  const conversation = conversations[activeProviderId];

  if (!provider) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 font-medium">{provider.icon} {provider.name}</span>
      <select
        value={conversation?.modelId || provider.models[0]?.id || ''}
        onChange={(e) =>
          dispatch({
            type: 'SET_MODEL',
            providerId: activeProviderId,
            modelId: e.target.value,
          })
        }
        className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                   text-gray-700 cursor-pointer"
      >
        {provider.models.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
      {provider.description && (
        <span className="text-xs text-gray-400 hidden sm:inline">{provider.description}</span>
      )}
    </div>
  );
}
