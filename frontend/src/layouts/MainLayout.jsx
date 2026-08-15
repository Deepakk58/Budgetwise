import Navbar from "../components/layout/Navbar";

function MainLayout({ children }) {
    return (
        <div
            className="
                min-h-screen

                bg-zinc-50
                text-zinc-900

                dark:bg-zinc-950
                dark:text-zinc-100

                transition-colors
            "
        >
            <Navbar />

            <main
                className="
                    mx-auto
                    w-full
                    max-w-7xl

                    px-4
                    sm:px-6
                    lg:px-8

                    py-6

                "
            >
                {children}
            </main>
        </div>
    );
}

export default MainLayout;