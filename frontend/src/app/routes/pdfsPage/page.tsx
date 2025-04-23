import PdfsPage from "../../components/pages/pdfsPage";
import ProtectedRoute from "../../../utils/ProtectedRoute";

export default function PagePdfs() {
    return (
        <>
            <ProtectedRoute>
                <PdfsPage />
            </ProtectedRoute>
        </>
    )
}