import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "../models/routes"; // Importa PrivateRoutes y PublicRoutes
import useUserStore from "../zustand/useUserStore";

interface Props {
    privateValidation: boolean;
}

const PrivateValidationFragment = <Outlet />;
const PublicValidationFragment = <Navigate replace to={'/'} />

export const AuthGuard = ({ privateValidation }: Props) => {
    const { user } = useUserStore();

    return user?.id ? (
        privateValidation ? (
            PrivateValidationFragment
        ) : (
            PublicValidationFragment
        )
    )   :   (
        <Navigate replace to={PublicRoutes.LOGIN} />
    )
};

export default AuthGuard;

