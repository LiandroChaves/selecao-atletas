import { motion } from "framer-motion";
import { useTheme } from "../../../utils/context/ThemeContext";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
    const { isDarkMode } = useTheme();
    if (!isOpen) return null;

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 ${isDarkMode
                ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700"
                : "bg-gradient-to-br from-white via-gray-100 to-gray-200"
                }`}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`${isDarkMode ? "bg-teal-800 text-white" : "bg-gray-700 text-gray-800"} 
                    rounded-2xl shadow-lg p-6 w-full max-w-2xl max-h-[80vh] relative overflow-hidden`}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                    ✖
                </button>

                <div className="text-inherit overflow-y-auto max-h-[60vh] pr-2">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
