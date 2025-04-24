import InstrucoesPage from "../../components/pages/instrucoes";
import ProtectedRoute from "../../../utils/ProtectedRoute";

export default function PageInstrucoesPage() {
    return (
        <>
            <ProtectedRoute>
                <InstrucoesPage />
            </ProtectedRoute>
        </>
    )
}