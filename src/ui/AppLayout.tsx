import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout(){
    const nav = useNavigate();
    return (
        <div>
            <Sidebar onNew={() => nav('/nova-consulta')} />
            <main>
                <Outlet></Outlet>
            </main>
        </div>
    )
}