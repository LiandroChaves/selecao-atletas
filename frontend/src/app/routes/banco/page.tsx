import BancoDeDadosPage from "../../components/pages/banco";
import ProtectedRoute from "../../../utils/ProtectedRoute";

export default function PageBancoDeDadosPage() {
    return (
        <>
            <ProtectedRoute>
                <BancoDeDadosPage />
            </ProtectedRoute>
        </>
    )
}