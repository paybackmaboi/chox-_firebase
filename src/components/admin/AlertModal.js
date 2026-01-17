import React from 'react';

const AlertModal = ({ isOpen, onClose, title, message, type = 'info', onConfirm }) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success': return 'check_circle';
            case 'error': return 'error';
            case 'warning': return 'warning';
            case 'confirm': return 'help'; // Icon for confirmation
            default: return 'info';
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success': return 'text-green-500';
            case 'error': return 'text-red-500';
            case 'warning': return 'text-yellow-500';
            case 'confirm': return 'text-red-500'; // Red color for delete confirmation
            default: return 'text-[#ffd700]';
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#1a1612] border border-[#393528] rounded-xl w-full max-w-md shadow-2xl scale-100 animate-in zoom-in-95 duration-200 overflow-hidden">

                {/* Header */}
                <div className="p-6 text-center border-b border-[#393528]/50">
                    <div className={`mx-auto w-12 h-12 rounded-full bg-[#2a2214] flex items-center justify-center mb-4 border border-[#393528] ${getColor()}`}>
                        <span className="material-symbols-outlined text-3xl">{getIcon()}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#e8dcc6]">{title || type.charAt(0).toUpperCase() + type.slice(1)}</h3>
                </div>

                {/* content */}
                <div className="p-6 text-center">
                    <p className="text-[#8b7a63]">{message}</p>
                </div>

                {/* Footer */}
                <div className="p-4 bg-[#2a2214] border-t border-[#393528]/50 flex justify-center gap-3">
                    {type === 'confirm' ? (
                        <>
                            <button
                                onClick={onClose}
                                className="px-6 py-2 bg-transparent border border-[#393528] text-[#8b7a63] font-bold rounded-lg hover:text-[#e8dcc6] hover:bg-[#393528] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    if (onConfirm) onConfirm();
                                    onClose();
                                }}
                                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_15px_rgba(220,38,38,0.3)]"
                            >
                                Delete
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-[#ffd700] hover:bg-[#ffed4e] text-black font-bold rounded-lg transition-transform hover:-translate-y-0.5 active:translate-y-0"
                        >
                            Okay
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AlertModal;
