import { UtensilsCrossed, Pizza, Beef, CupSoda, IceCreamCone } from 'lucide-react'

interface CategoryTabsProps {
  categories: readonly string[]
  active: string
  onSelect: (category: string) => void
}

const icons: Record<string, React.ReactNode> = {
  'Todos': <UtensilsCrossed size={14} />,
  'Pizzas': <Pizza size={14} />,
  'Burgers': <Beef size={14} />,
  'Bebidas': <CupSoda size={14} />,
  'Sobremesas': <IceCreamCone size={14} />,
}

export function CategoryTabs({ categories, active, onSelect }: CategoryTabsProps) {
  return (
    <div className="sticky top-[52px] z-30 bg-gray-50/80 dark:bg-[#0F172A]/80 backdrop-blur-lg border-b border-gray-200/60 dark:border-gray-800/60">
      <div className="flex gap-2 overflow-x-auto px-4 sm:px-6 py-3 scrollbar-hide">
        {categories.map((cat) => {
          const isActive = active === cat
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {icons[cat]}
              {cat}
            </button>
          )
        })}
      </div>
    </div>
  )
}
