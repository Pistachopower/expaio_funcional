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
import { TaxGuideScreen } from './features/resources/screens/TaxGuideScreen';
import { InsuranceGuideScreen } from './features/resources/screens/InsuranceGuideScreen';
import { RentGuideScreen } from './features/resources/screens/RentGuideScreen';
import { LaborGuideScreen } from './features/resources/screens/LaborGuideScreen';
import { JobGuideScreen } from './features/resources/screens/JobGuideScreen';
import { TransportGuideScreen } from './features/resources/screens/TransportGuideScreen';
import { ChatScreen } from './features/chat/screens/ChatScreen';
import { AuthScreen } from './features/auth/screens/AuthScreen';
import { UpdatePasswordScreen } from './features/auth/screens/UpdatePasswordScreen';
import { AboutUsScreen } from './features/about/screens/AboutUsScreen';
import AudioScreen from './features/resources/screens/AudioScreen';
import { InitialGuideScreen } from './features/resources/screens/InitialGuideScreen';

import { useAuth } from './context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex items-center justify-center h-screen bg-background-light dark:bg-background-dark text-primary"><span className="material-symbols-outlined animate-spin text-4xl">progress_activity</span></div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
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
                                <Route path="/tax-guide" element={<ProtectedRoute><TaxGuideScreen /></ProtectedRoute>} />
                                <Route path="/insurance-guide" element={<ProtectedRoute><InsuranceGuideScreen /></ProtectedRoute>} />
                                <Route path="/rent-guide" element={<ProtectedRoute><RentGuideScreen /></ProtectedRoute>} />
                                <Route path="/labor-guide" element={<ProtectedRoute><LaborGuideScreen /></ProtectedRoute>} />
                                <Route path="/job-guide" element={<ProtectedRoute><JobGuideScreen /></ProtectedRoute>} />
                                <Route path="/transport-guide" element={<ProtectedRoute><TransportGuideScreen /></ProtectedRoute>} />
                                <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
                                <Route path="/chat" element={<ProtectedRoute><ChatScreen /></ProtectedRoute>} />
                                <Route path="/audios-integracion" element={<ProtectedRoute><AudioScreen /></ProtectedRoute>} />
                                <Route path="/guia-inicial" element={<ProtectedRoute><InitialGuideScreen /></ProtectedRoute>} />
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