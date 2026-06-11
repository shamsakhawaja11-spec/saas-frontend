import useAuthStore from "../../store/auth.store";
import { Navigate } from "react-router-dom";

const ProtectedRoute=({children}:{children:React.ReactNode})=>{
    const{isAuthenticated}=useAuthStore();
    if(!isAuthenticated){
        return<Navigate to="/login" replace />
    }
    return<>{children}</>
};
export default ProtectedRoute;