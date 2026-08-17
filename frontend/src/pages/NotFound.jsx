import { Link } from "react-router-dom";
import { Home } from "lucide-react";

import CenteredLayout from "../components/layout/CenteredLayout";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

function NotFound() {

    return (

        <CenteredLayout>

            <Card
                className="
                    w-full
                    max-w-md

                    p-10

                    text-center
                "
            >

                <div
                    className="
                        text-7xl
                        font-bold
                        tracking-tight

                        text-zinc-900

                        dark:text-white
                    "
                >
                    404
                </div>


                <h1
                    className="
                        mt-6

                        text-2xl
                        font-semibold
                    "
                >
                    Page not found
                </h1>


                <p
                    className="
                        mt-3

                        text-sm
                        leading-6

                        text-zinc-500

                        dark:text-zinc-400
                    "
                >
                    The page you are looking for doesn't exist
                    or may have been moved.
                </p>


                <Link
                    to="/"
                    className="mt-8 block"
                >

                    <Button
                        fullWidth
                        cursor
                        leftIcon={<Home size={18}/>}
                    >
                        Go Home
                    </Button>

                </Link>


            </Card>

        </CenteredLayout>

    );

}


export default NotFound;