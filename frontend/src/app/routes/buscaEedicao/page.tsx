import BuscaEedicao from "../../components/pages/buscaEedicao";
import ProtectedRoute from "../../../utils/ProtectedRoute";

export default function PageBuscaEedicao() {
    return (
        <>
            <ProtectedRoute>
                <BuscaEedicao />
            </ProtectedRoute>
        </>
    )
}