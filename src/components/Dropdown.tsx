import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownItem {
  label: React.ReactNode;
  value: string | number;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  items: DropdownItem[];
  value?: string | number;
  onChange?: (value: string | number, item: DropdownItem) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
  renderTrigger?: (isOpen: boolean, selectedItem?: DropdownItem) => React.ReactNode;
  align?: 'left' | 'right';
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  value,
  onChange,
  placeholder = 'Select...',
  className = '',
  triggerClassName = '',
  menuClassName = '',
  itemClassName = '',
  renderTrigger,
  align = 'left'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedItem = items.find((item) => item.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return;
    onChange?.(item.value, item);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {renderTrigger ? (
          renderTrigger(isOpen, selectedItem)
        ) : (
          <button
            type="button"
            className={`inline-flex items-center justify-between w-full px-4 py-2 text-sm font-medium bg-bg-card border border-border-color rounded-lg text-text-primary hover:bg-bg-cardHover focus:outline-none focus:ring-2 focus:ring-accent-cyan/50 focus:border-accent-cyan transition-colors ${triggerClassName}`}
          >
            <span className="flex items-center gap-2 truncate">
              {selectedItem?.icon}
              {selectedItem ? selectedItem.label : <span className="text-text-secondary">{placeholder}</span>}
            </span>
            <ChevronDown
              size={16}
              className={`ml-2 transition-transform duration-200 text-text-secondary ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 mt-2 min-w-max w-full bg-bg-card border border-border-color rounded-lg shadow-lg py-1 ${align === 'right' ? 'right-0' : 'left-0'} animate-in fade-in slide-in-from-top-2 duration-200 ${menuClassName}`}
        >
          <ul className="max-h-60 overflow-y-auto custom-scrollbar">
            {items.length === 0 ? (
              <li className="px-4 py-2 text-sm text-text-secondary">No items</li>
            ) : (
              items.map((item, index) => (
                <li
                  key={`${item.value}-${index}`}
                  className={`px-4 py-2 text-sm flex items-center gap-2 cursor-pointer transition-colors ${
                    item.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : item.value === value
                      ? 'bg-accent-cyan/10 text-accent-cyan font-medium'
                      : 'text-text-primary hover:bg-bg-cardHover hover:text-accent-cyan'
                  } ${itemClassName}`}
                  onClick={() => handleSelect(item)}
                >
                  {item.icon}
                  {item.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
