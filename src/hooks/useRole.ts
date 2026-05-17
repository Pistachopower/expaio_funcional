import { useAuth } from '../context/AuthContext';

export const useRole = () => {
    const { profile, loading } = useAuth();

    const role = profile?.rol || 'emigrante';

    return {
        role,
        isAdmin: role === 'admin',
        isExpert: ['profesor', 'abogado', 'ayuda'].includes(role),
        isMigrante: role === 'emigrante',
        isPending: profile?.estado_cuenta === 'pendiente',
        isApproved: profile?.estado_cuenta === 'aprobado',
        isRejected: profile?.estado_cuenta === 'rechazado',
        isLoading: loading
    };
};
