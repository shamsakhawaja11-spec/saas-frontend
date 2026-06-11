import UseAuthStore from "../../store/auth.store";
import { Navigate } from "react-router-dom";

const protectedRoute=({children}:{children:React.ReactNode})=>{
    const{isAuthenticated}=UseAuthStore();
    if(!isAuthenticated){
        return<Navigate to="/login" replace />
    }
    return<>{children}</>
};
export default protectedRoute;