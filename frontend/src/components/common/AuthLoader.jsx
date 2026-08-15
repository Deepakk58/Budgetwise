import Spinner from "../ui/Spinner";

function AuthLoader() {
    return (
        <div
            className="
                flex
                min-h-screen

                flex-col
                items-center
                justify-center

                gap-5

                bg-zinc-50

                dark:bg-zinc-950
            "
        >

            <Spinner size="lg" />

            <p
                className="
                    text-sm
                    font-medium

                    text-zinc-500

                    dark:text-zinc-400
                "
            >
                Loading your workspace...
            </p>

        </div>
    );
}

export default AuthLoader;