import Home from "../../components/pages/home";
import ProtectedRoute from "../../../utils/ProtectedRoute";

export default function PageHome() {
    return (
        <>
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        </>
    )
}