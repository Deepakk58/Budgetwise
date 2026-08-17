import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    Menu,
    Wallet,
    X,
} from "lucide-react";

import SettingsDrawer from "./SettingsDrawer";

import useAuth from "../../hooks/useAuth.js";
import { cn } from "../../lib/cn";

function Navbar() {

    const { user, logout } = useAuth();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const navLinks = [
        { to: "/home", label: "Dashboard" },
        { to: "/expenses", label: "Expenses" },
        { to: "/income", label: "Income" },
        { to: "/groups", label: "Shared Expenses" },
    ];

    const navLink = ({ isActive }) =>
        cn(
            `
                rounded-xl

                px-4
                py-2

                text-sm
                font-medium

                transition-all
                duration-200
            `,
isActive
    ? `
        bg-blue-600
        !text-white

        hover:bg-blue-700

        dark:bg-blue-500
        dark:hover:bg-blue-600
        dark:!text-white
    `
    : `
        text-zinc-600

        hover:bg-zinc-100
        hover:text-zinc-900

        dark:text-zinc-400
        dark:hover:bg-zinc-800
        dark:hover:text-white
    `
        );

return (
    <>
        <nav
            className="
                sticky
                top-0
                z-50

                border-b
                border-zinc-200/80

                bg-white/80
                backdrop-blur-xl

                dark:border-zinc-800
                dark:bg-zinc-950/80
            "
        >
            <div
                className="
                    mx-auto

                    flex
                    h-16

                    w-full
                    max-w-7xl

                    items-center
                    justify-between

                    px-4
                    sm:px-6
                    lg:px-8
                "
            >
                {/* Logo */}
                <NavLink
                    to="/home"
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center

                            rounded-xl

                            bg-blue-600
                            text-white

                            shadow-lg
                            shadow-blue-500/25
                        "
                    >
                        <Wallet size={18} />
                    </div>

                    <div>
                        <h1
                            className="
                                text-lg
                                font-bold
                                tracking-tight
                            "
                        >
                            Budgetwise
                        </h1>

                        <p
                            className="
                                -mt-1
                                text-xs

                                text-zinc-500

                                dark:text-zinc-400
                            "
                        >
                            Track Budget and Expenses
                        </p>
                    </div>
                </NavLink>

                {/* Navigation */}
                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >
                    {!user ? (
                        <>
                            <NavLink
                                to="/login"
                                className={navLink}
                            >
                                Login
                            </NavLink>

                            <NavLink
                                to="/register"
                                className={navLink}
                            >
                                Register
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <div
                                className="
                                    hidden
                                    items-center
                                    gap-1

                                    md:flex
                                "
                            >
                                {navLinks.map((link) => (
                                    <NavLink
                                        key={link.to}
                                        to={link.to}
                                        className={navLink}
                                    >
                                        {link.label}
                                    </NavLink>
                                ))}
                            </div>

                            <button
                                type="button"
                                onClick={() => setMobileOpen((open) => !open)}
                                className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center

                                    rounded-xl

                                    text-zinc-600

                                    transition-all

                                    hover:bg-zinc-100

                                    md:hidden

                                    dark:text-zinc-400
                                    dark:hover:bg-zinc-800
                                "
                                aria-label="Toggle menu"
                            >
                                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>

                            <button
                                onClick={() => setDrawerOpen(true)}
                                className="
                                    ml-1

                                    flex
                                    items-center
                                    gap-3

                                    cursor-pointer

                                    rounded-xl

                                    border
                                    border-zinc-200

                                    bg-white

                                    px-3
                                    py-2

                                    transition-all

                                    hover:border-zinc-300
                                    hover:shadow-sm

                                    dark:border-zinc-800
                                    dark:bg-zinc-900
                                    dark:hover:border-zinc-700
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-8
                                        w-8

                                        items-center
                                        justify-center

                                        rounded-full

                                        bg-blue-600

                                        text-sm
                                        font-semibold
                                        text-white
                                    "
                                >
                                    {user.username
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>

                                <span
                                    className="
                                        hidden
                                        text-sm
                                        font-medium

                                        sm:inline
                                    "
                                >
                                    {user.username}
                                </span>
                            </button>
                        </>
                    )}
                </div>

                
            </div>

            
        </nav>

        {user && mobileOpen && (
            <div
                className="
                    border-b
                    border-zinc-200

                    bg-white

                    px-4
                    py-3

                    md:hidden

                    dark:border-zinc-800
                    dark:bg-zinc-950
                "
            >
                <div className="flex flex-col gap-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            className={navLink}
                            onClick={() => setMobileOpen(false)}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>
            </div>
        )}

        {user && (
            <SettingsDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                user={user}
                logout={logout}
            />
        )}
    </>
);
}

export default Navbar;
