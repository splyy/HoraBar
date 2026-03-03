import { useState } from 'react';
import type { ComponentType } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import '../renderer/styles/global.css';
import styles from './App.module.css';
import { SettingsProvider } from './contexts/SettingsContext';
import { ToastProvider } from './components/common/Toast';
import { Today } from './components/tabs/Today';
import { History } from './components/tabs/History';
import { Stats } from './components/tabs/Stats';
import { Settings } from './components/tabs/Settings';
import { IconTabToday, IconTabHistory, IconTabStats, IconTabSettings } from './components/common/Icons';

type Tab = 'today' | 'history' | 'stats' | 'settings';

const tabs: { id: Tab; label: string; Icon: ComponentType<{ size?: number }> }[] = [
  { id: 'today', label: "Aujourd'hui", Icon: IconTabToday },
  { id: 'history', label: 'Historique', Icon: IconTabHistory },
  { id: 'stats', label: 'Stats', Icon: IconTabStats },
  { id: 'settings', label: 'Réglages', Icon: IconTabSettings },
];

export function App() {
  const [activeTab, setActiveTab] = useState<Tab>('today');

  const renderTab = () => {
    switch (activeTab) {
      case 'today':
        return <Today />;
      case 'history':
        return <History />;
      case 'stats':
        return <Stats />;
      case 'settings':
        return <Settings />;
    }
  };

  return (
    <SettingsProvider>
      <ToastProvider>
        <RadixTooltip.Provider delayDuration={600}>
          <div className={styles.app}>
            <div className={styles.content}>{renderTab()}</div>
            <nav className={styles.tabBar}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabBtnActive : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </RadixTooltip.Provider>
      </ToastProvider>
    </SettingsProvider>
  );
}
