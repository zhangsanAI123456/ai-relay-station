// ============================================
// App入口
// ============================================
import { ChatProvider } from './contexts/ChatContext';
import Layout from './components/Layout';

export default function App() {
  return (
    <ChatProvider>
      <Layout />
    </ChatProvider>
  );
}
