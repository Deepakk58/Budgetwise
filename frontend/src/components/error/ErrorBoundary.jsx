import React from "react";

class ErrorBoundary extends React.Component {

    state = {
        hasError: false,
    };


    static getDerivedStateFromError() {

        return {
            hasError: true,
        };

    }


    componentDidCatch(error, info) {

        console.error(
            "Application Error:",
            error,
            info
        );

    }


    render() {

        if (this.state.hasError) {

            return (

                <div
                    className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-zinc-50
                    dark:bg-zinc-950
                    "
                >

                    <div
                        className="
                        rounded-2xl
                        border
                        bg-white
                        p-8
                        text-center
                        shadow-lg
                        dark:border-zinc-800
                        dark:bg-zinc-900
                        "
                    >

                        <h1 className="text-xl font-bold">
                            Something went wrong
                        </h1>

                        <p className="
                            mt-2
                            text-zinc-500
                            dark:text-zinc-400
                        ">
                            Please refresh the page and try again.
                        </p>

                    </div>

                </div>

            );

        }


        return this.props.children;

    }

}

export default ErrorBoundary;