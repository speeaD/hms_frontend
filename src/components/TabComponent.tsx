import { Dispatch, SetStateAction } from 'react'

interface TabProps {
  tabs: string[]
  activeTab: string
  setActiveTab: Dispatch<SetStateAction<string>>
}

export function Tab({ tabs, activeTab, setActiveTab }: TabProps) {
  return (
    <div className="flex gap-8 border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-4 font-medium transition-colors relative ${
            activeTab === tab ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab}
          {activeTab === tab && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
      ))}
    </div>
  )
}