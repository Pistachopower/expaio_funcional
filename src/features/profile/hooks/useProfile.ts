import { useState, useEffect } from 'react';
import { ProfileRepository, UserProfile } from '../../../api/repositories/ProfileRepository';

export const useProfile = (user: any) => {
    const [userName, setUserName] = useState('Usuario');
    const [userPhoto, setUserPhoto] = useState('https://ui-avatars.com/api/?name=?&background=638878&color=fff');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            // Try local storage first for speed
            const saved = localStorage.getItem('swisslife_profile');
            if (saved) {
                const data = JSON.parse(saved);
                setUserName(data.name ? data.name.split(' ')[0] : 'Usuario');
                if (data.photo) setUserPhoto(data.photo);
            }

            // Sync with Repository (Supabase)
            try {
                const data = await ProfileRepository.getProfile(user.id);

                if (data) {
                    const fetchedName = data.full_name || 'Usuario';
                    setUserName(fetchedName.split(' ')[0]);
                    const photo = data.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(fetchedName)}&background=638878&color=fff`;
                    setUserPhoto(photo);
                    setProfile(data);

                    // Update local storage backup
                    localStorage.setItem('swisslife_profile', JSON.stringify({
                        name: data.full_name,
                        first_name: (data as any).first_name, // Keeping compatibility with existing LS format
                        last_name: (data as any).last_name,
                        username: (data as any).username,
                        email: user.email,
                        photo: photo,
                        canton: data.canton,
                        permit: data.permit,
                        arrival: data.arrival_date,
                        sector: data.sector,
                        studies: data.studies
                    }));
                }
            } catch (error) {
                console.error('Error in useProfile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user]);

    return {
        userName,
        userPhoto,
        profile,
        loading
    };
};
