import {
    Moon,
    Sun,
    X,
    KeyRound,
    LogOut,
    User,
    House
} from "lucide-react";

import { Link } from "react-router-dom";

import Button from "../ui/Button";

import { useTheme } from "../../context/ThemeContext";

import { useEffect } from "react";

function SettingsDrawer({
    open,
    onClose,
    user,
    logout,
}) {

    const {
        darkMode,
        toggleTheme,
    } = useTheme();

    useEffect(() => {

        if (open) {

            document.body.style.overflow = "hidden";

        } else {

            document.body.style.overflow = "";

        }

        return () => {

            document.body.style.overflow = "";

        };

    }, [open]);

    return (
        <>
            {/* Overlay */}

            <div

                onClick={onClose}

                className={`
                    fixed
                    inset-0
                    z-40

                    bg-black/40
                    backdrop-blur-sm

                    transition-all
                    duration-300

                    ${
                        open
                            ? "opacity-100"
                            : "pointer-events-none opacity-0"
                    }
                `}
            />

            {/* Drawer */}

            <aside

                className={`
                    fixed

                    right-0
                    top-0

                    z-50

                    flex
                    h-screen
                    w-full
                    max-w-sm
                    flex-col

                    border-l

                    border-zinc-200

                    bg-white

                    dark:border-zinc-800
                    dark:bg-zinc-950

                    transition-transform
                    duration-300

                    ${
                        open
                            ? "translate-x-0"
                            : "translate-x-full"
                    }
                `}
            >

                {/* Header */}

                <div
                    className="
                    flex
                    items-center
                    justify-between

                    border-b

                    border-zinc-200

                    p-6

                    dark:border-zinc-800
                "
                >

                    <div>

                        <h2
                            className="
                            text-lg
                            font-semibold
                        "
                        >
                            Settings
                        </h2>

                        <p
                            className="
                            mt-1

                            flex
                            items-center
                            gap-2

                            text-sm

                            text-zinc-500
                            dark:text-zinc-400
                        "
                        >

                            <User size={15} />

                            {user.username}

                        </p>

                    </div>

                    <Button

                        size="icon"

                        variant="ghost"

                        onClick={onClose}

                    >

                        <X size={18}/>

                    </Button>

                </div>

                {/* Content */}

                <div
                    className="
                    flex-1

                    space-y-3

                    p-6
                "
                >

                    <Button

                        variant="secondary"

                        fullWidth

                        className="justify-start"

                        leftIcon={
                            darkMode
                                ? <Sun size={18}/>
                                : <Moon size={18}/>
                        }

                        onClick={toggleTheme}

                    >

                        {darkMode
                            ? "Light Mode"
                            : "Dark Mode"}

                    </Button>

                    <Link to="#" onClick={onClose}>

                        <Button

                            variant="ghost"

                            fullWidth

                            className="justify-start"

                            leftIcon={<House size={18}/>}

                        >

                            Home

                        </Button>

                    </Link>

                    <Link to="#">

                        <Button

                            variant="ghost"

                            fullWidth

                            className="justify-start"

                            leftIcon={<KeyRound size={18}/>}

                            onClick={onClose}

                        >

                            Change Password

                        </Button>

                    </Link>

                </div>

                {/* Footer */}

                <div
                    className="
                    border-t

                    border-zinc-200

                    p-6

                    dark:border-zinc-800
                "
                >

                    <Button

                        variant="destructive"

                        fullWidth

                        leftIcon={<LogOut size={18}/>}

                        onClick={logout}

                    >

                        Logout

                    </Button>

                </div>

            </aside>

        </>
    );

}

export default SettingsDrawer;