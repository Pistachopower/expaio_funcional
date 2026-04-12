import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BottomNav, SideNav, ThemeToggle } from './components';
import { HomeScreen } from './features/profile/screens/HomeScreen';
import { ChecklistScreen } from './features/checklist/screens/ChecklistScreen';
import { ProfileScreen } from './features/profile/screens/ProfileScreen';
import { SafetyCenterScreen } from './features/safety/screens/SafetyCenterScreen';
import { OfferVerifierScreen } from './features/safety/screens/OfferVerifierScreen';
import { HousingVerificationScreen } from './features/safety/screens/HousingVerificationScreen';
import { DirectoryScreen } from './features/resources/screens/DirectoryScreen';
import { CalculatorScreen } from './features/resources/screens/CalculatorScreen';
import AudioScreen from './features/resources/screens/AudioScreen';
import { InitialGuideScreen } from './features/resources/screens/InitialGuideScreen';
import { GuideScreen } from './features/resources/screens/GuideScreen';
import { ChatScreen } from './features/chat/screens/ChatScreen';
import { AuthScreen } from './features/auth/screens/AuthScreen';
import { UpdatePasswordScreen } from './features/auth/screens/UpdatePasswordScreen';
import { AboutUsScreen } from './features/about/screens/AboutUsScreen';
import { PendingScreen } from './features/profile/screens/PendingScreen';
import { AdminDashboard } from './features/profile/screens/AdminDashboard';

import { useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, profile, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark text-primary"><span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span></div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (profile?.estado_cuenta === 'pendiente') {
        return <PendingScreen />;
    }

    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <Router>
            <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-[#111815] dark:text-white overflow-hidden relative">
                {/* Desktop Sidebar */}
                <SideNav />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col relative overflow-hidden h-full">
                    <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                        <div className="min-h-full">
                            <Routes>
                                <Route path="/login" element={<AuthScreen />} />
                                <Route path="/update-password" element={<UpdatePasswordScreen />} />
                                <Route path="/about" element={<AboutUsScreen />} />

                                {/* Protected Routes */}
                                <Route path="/" element={<ProtectedRoute><HomeScreen /></ProtectedRoute>} />
                                <Route path="/offer-verifier" element={<ProtectedRoute><OfferVerifierScreen /></ProtectedRoute>} />
                                <Route path="/housing-verification" element={<ProtectedRoute><HousingVerificationScreen /></ProtectedRoute>} />
                                <Route path="/safety" element={<ProtectedRoute><SafetyCenterScreen /></ProtectedRoute>} />
                                <Route path="/directory" element={<ProtectedRoute><DirectoryScreen /></ProtectedRoute>} />
                                <Route path="/checklist" element={<ProtectedRoute><ChecklistScreen /></ProtectedRoute>} />
                                <Route path="/calculator" element={<ProtectedRoute><CalculatorScreen /></ProtectedRoute>} />
                                <Route path="/guia/:tipo" element={<ProtectedRoute><GuideScreen /></ProtectedRoute>} />
                                {/* Mantener rutas viejas por retrocompatibilidad temporal o redirección si es necesario */}
                                <Route path="/tax-guide" element={<ProtectedRoute><Navigate to="/guia/impuestos" replace /></ProtectedRoute>} />
                                <Route path="/insurance-guide" element={<ProtectedRoute><Navigate to="/guia/seguros" replace /></ProtectedRoute>} />
                                <Route path="/rent-guide" element={<ProtectedRoute><Navigate to="/guia/alquiler" replace /></ProtectedRoute>} />
                                <Route path="/labor-guide" element={<ProtectedRoute><Navigate to="/guia/trabajo" replace /></ProtectedRoute>} />
                                <Route path="/job-guide" element={<ProtectedRoute><Navigate to="/guia/trabajo" replace /></ProtectedRoute>} />
                                <Route path="/transport-guide" element={<ProtectedRoute><Navigate to="/guia/transporte" replace /></ProtectedRoute>} />
                                <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
                                <Route path="/chat" element={<ProtectedRoute><ChatScreen /></ProtectedRoute>} />
                                <Route path="/audios-integracion" element={<ProtectedRoute><AudioScreen /></ProtectedRoute>} />
                                <Route path="/guia-inicial" element={<ProtectedRoute><InitialGuideScreen /></ProtectedRoute>} />
                                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                            </Routes>
                        </div>
                        {/* Spacer for bottom nav on mobile */}
                        <div className="h-24 md:hidden"></div>
                    </div>

                    {/* Mobile Bottom Nav */}
                    <BottomNav />
                </div>
            </div>
        </Router>
    );
};

export default App;