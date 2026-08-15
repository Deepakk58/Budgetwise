import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

function Modal({
    isOpen,
    title,
    children,
    onClose,
}) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () =>
            window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>

            {isOpen && (

                <motion.div
                    className="
                        fixed
                        inset-0
                        z-150

                        flex
                        items-center
                        justify-center

                        bg-black/50
                        backdrop-blur-sm

                        px-4
                    "
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >

                    <motion.div
                        className="
                            w-full
                            max-w-lg

                            rounded-2xl

                            border
                            border-(--border)

                            bg-(--card)

                            p-6

                            shadow-2xl
                        "
                        initial={{
                            opacity: 0,
                            scale: .97,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: .97,
                            y: 20,
                        }}
                        transition={{
                            duration: .2,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >

                        {title && (

                            <h2 className="mb-6 text-xl font-semibold">

                                {title}

                            </h2>

                        )}

                        {children}

                    </motion.div>

                </motion.div>

            )}

        </AnimatePresence>
    );
}

export default Modal;