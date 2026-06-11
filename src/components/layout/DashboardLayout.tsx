import { Sidebar } from "lucide-react";

const DashboardLayout=({children}:{children:React.ReactNode})=>{
    return(
        <div className="flex min-h-screen bg-dark-900">
            <Sidebar/>
            <main className="flex-1 ml-64 p-8">
                {children}
            </main>
        </div>
    );
};
export default DashboardLayout;
