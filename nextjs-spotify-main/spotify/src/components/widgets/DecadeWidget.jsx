// src/components/widgets/DecadeWidget.jsx
'use client';

const DECADES = [
    { value: '1950', label: '1950s' },
    { value: '1960', label: '1960s' },
    { value: '1970', label: '1970s' },
    { value: '1980', label: '1980s' },
    { value: '1990', label: '1990s' },
    { value: '2000', label: '2000s' },
    { value: '2010', label: '2010s' },
    { value: '2020', label: '2020s' }
];

export default function DecadeWidget({ selectedDecades, onSelect }) {
    const handleToggleDecade = (decade) => {
        if (selectedDecades.includes(decade)) {
            onSelect(selectedDecades.filter(d => d !== decade));
        } else {
            onSelect([...selectedDecades, decade]);
        }
    };

    const handleSelectAll = () => {
        if (selectedDecades.length === DECADES.length) {
            onSelect([]);
        } else {
            onSelect(DECADES.map(d => d.value));
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    📅 Décadas
                    <span className="text-sm font-normal text-gray-400">
            ({selectedDecades.length})
          </span>
                </h3>
                <button
                    onClick={handleSelectAll}
                    className="text-green-400 hover:text-green-300 text-sm font-medium transition-colors"
                >
                    {selectedDecades.length === DECADES.length ? 'Deseleccionar' : 'Todas'}
                </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {DECADES.map(decade => {
                    const isSelected = selectedDecades.includes(decade.value);
                    return (
                        <button
                            key={decade.value}
                            onClick={() => handleToggleDecade(decade.value)}
                            className={`py-3 px-4 rounded-lg font-medium transition-all transform hover:scale-105 ${
                                isSelected
                                    ? 'bg-green-600 text-white shadow-lg'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                        >
                            {decade.label}
                        </button>
                    );
                })}
            </div>

            {selectedDecades.length === 0 && (
                <p className="text-gray-400 text-sm text-center mt-4">
                    Selecciona al menos una década
                </p>
            )}
        </div>
    );
}