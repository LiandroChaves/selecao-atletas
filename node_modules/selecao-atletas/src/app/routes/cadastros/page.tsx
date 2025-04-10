import ProtectedRoute from "@/utils/ProtectedRoute";
import CadastroOptions from "../../components/pages/cadastro";

export default function PageCadastros() {
    return (
        <>
            <ProtectedRoute>
                <CadastroOptions />
            </ProtectedRoute>
        </>
    )
}