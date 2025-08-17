import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout(){
    const nav = useNavigate();
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar onNew={() => nav('/nova-consulta')} />
            <main style={{ 
                flex: 1, 
                padding: '24px',
                backgroundColor: '#f5f5f5',
                overflow: 'auto'
            }}>
                <Outlet />
            </main>
        </div>
    )
}