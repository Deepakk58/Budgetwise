import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TriangleAlert } from "lucide-react";

import Button from "./Button";

function ConfirmModal({
    isOpen,
    title = "Confirm",
    message = "Are you sure?",
    confirmText = "Delete",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    loading = false,
}) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === "Escape" && !loading) {
                onCancel();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () =>
            window.removeEventListener(
                "keydown",
                handleKeyDown
            );
    }, [isOpen, loading, onCancel]);

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
                    onClick={!loading ? onCancel : undefined}
                >

                    <motion.div
                        className="
                            w-full
                            max-w-md

                            rounded-2xl

                            border
                            border-zinc-200

                            bg-white

                            p-6

                            shadow-2xl

                            dark:border-zinc-800
                            dark:bg-zinc-900
                        "
                        initial={{
                            opacity: 0,
                            scale: 0.96,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            scale: 0.96,
                            y: 20,
                        }}
                        transition={{
                            duration: 0.2,
                            ease: "easeOut",
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >

                        <div className="flex items-start gap-4">

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center

                                    rounded-xl

                                    bg-red-100

                                    dark:bg-red-900/30
                                "
                            >

                                <TriangleAlert
                                    size={24}
                                    className="
                                        text-red-600
                                        dark:text-red-400
                                    "
                                />

                            </div>

                            <div className="flex-1">

                                <h2
                                    className="
                                        text-xl
                                        font-semibold
                                        tracking-tight
                                    "
                                >
                                    {title}
                                </h2>

                                <p
                                    className="
                                        mt-2

                                        text-sm
                                        leading-6

                                        text-zinc-500
                                        dark:text-zinc-400
                                    "
                                >
                                    {message}
                                </p>

                            </div>

                        </div>

                        <div
                            className="
                                mt-8

                                flex
                                flex-col-reverse
                                gap-3

                                sm:flex-row
                                sm:justify-end
                            "
                        >

                            <Button
                                variant="secondary"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                {cancelText}
                            </Button>

                            <Button
                                variant="destructive"
                                loading={loading}
                                onClick={onConfirm}
                            >
                                {confirmText}
                            </Button>

                        </div>

                    </motion.div>

                </motion.div>

            )}

        </AnimatePresence>
    );
}

export default ConfirmModal;