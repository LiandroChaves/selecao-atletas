import { motion } from "framer-motion";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
}

export const ModalLicencaExpirada = ({ isOpen, onClose, title, message }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 max-w-md w-full"
            >
                <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
                <p className="text-center mb-6">{message}</p>
                <div className="flex justify-center">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-all"
                    >
                        Fechar
                    </button>
                </div>
            </motion.div>
        </div>
    );
};
