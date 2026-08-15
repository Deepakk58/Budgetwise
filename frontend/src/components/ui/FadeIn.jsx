import { motion } from "framer-motion";
import { cn } from "../../lib/cn";

function FadeIn({
    children,
    className = "",
    delay = 0,
    duration = 0.35,
    y = 16,
    x = 0,
    once = true,
}) {
    return (
        <motion.div
            className={cn(className)}
            initial={{
                opacity: 0,
                x,
                y,
            }}
            whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
            }}
            viewport={{
                once,
                amount: 0.15,
            }}
            transition={{
                duration,
                delay,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            {children}
        </motion.div>
    );
}

export default FadeIn;