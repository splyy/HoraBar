import { useState } from 'react';
import type { ComponentType } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import '../renderer/styles/global.css';
import styles from './App.module.css';
import { Today } from './components/tabs/Today';
import { History } from './components/tabs/History';
import { Stats } from './components/tabs/Stats';
import { Settings } from './components/tabs/Settings';
import { IconSun, IconClipboard, IconChart, IconCog } from './components/common/Icons';

type Tab = 'today' | 'history' | 'stats' | 'settings';

const tabs: { id: Tab; label: string; Icon: ComponentType<{ size?: number }> }[] = [
  { id: 'today', label: "Aujourd'hui", Icon: IconSun },
  { id: 'history', label: 'Historique', Icon: IconClipboard },
  { id: 'stats', label: 'Stats', Icon: IconChart },
  { id: 'settings', label: 'Réglages', Icon: IconCog },
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
    <RadixTooltip.Provider delayDuration={600}>
      <div className={styles.app}>
        <div className={styles.content}>{renderTab()}</div>
        <nav className={styles.tabBar}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={styles.tabIcon}><tab.Icon size={18} /></span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </RadixTooltip.Provider>
  );
}
