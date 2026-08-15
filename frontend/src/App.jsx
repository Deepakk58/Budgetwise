import AppRoutes from "./routes/AppRoutes";
import AuthLoader from "./components/common/AuthLoader";
import useAuth from "./hooks/useAuth";

function App() {

    const { loading } = useAuth();

    if (loading) {
        return (

            <div className="min-h-screen bg-(--background) text-(--foreground) transition-colors duration-300">

                <AuthLoader/>

            </div>

        );
    }

    return (

        <div className="min-h-screen bg-(--background) text-(--foreground) transition-colors duration-300">

            <AppRoutes/>

        </div>

    );

    
}

export default App;