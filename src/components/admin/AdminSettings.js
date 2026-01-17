import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { updateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import AlertModal from './AlertModal';

const AdminSettings = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [displayName, setDisplayName] = useState('');

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Alert State
    const [alertState, setAlertState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setDisplayName(currentUser.displayName || '');
            }
        });
        return () => unsubscribe();
    }, []);

    const showAlert = (title, message, type = 'info') => {
        setAlertState({ isOpen: true, title, message, type });
    };

    const closeAlert = () => {
        setAlertState({ ...alertState, isOpen: false });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            await updateProfile(user, {
                displayName: displayName
            });
            showAlert("Success", "Profile updated successfully!", "success");
        } catch (error) {
            console.error(error);
            showAlert("Error", error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            showAlert("Error", "New passwords do not match.", "error");
            return;
        }
        if (newPassword.length < 6) {
            showAlert("Error", "Password must be at least 6 characters.", "error");
            return;
        }

        setLoading(true);

        try {
            // Re-authenticate user before changing password
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);

            // Update password
            await updatePassword(user, newPassword);

            showAlert("Success", "Password changed successfully!", "success");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error(error);
            if (error.code === 'auth/wrong-password') {
                showAlert("Error", "Incorrect current password.", "error");
            } else {
                showAlert("Error", error.message, "error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
            <div className="bg-[#1a1612] p-8 rounded-2xl border border-[#393528] shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#ffd700] opacity-5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>

                <h1 className="text-3xl font-bold text-[#e8dcc6] tracking-tight mb-2">
                    Account Settings
                    <span className="text-[#ffd700] ml-2">.</span>
                </h1>
                <p className="text-[#8b7a63] text-sm">Manage your admin profile and security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Profile Section */}
                <div className="bg-[#1a1612] p-8 rounded-2xl border border-[#393528] shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="p-3 bg-[#ffd700]/10 rounded-xl text-[#ffd700] material-symbols-outlined">badge</span>
                        <h2 className="text-xl font-bold text-[#e8dcc6]">Profile Information</h2>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-[#8b7a63] uppercase mb-2">Email Address</label>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="w-full bg-[#2a2214]/50 border border-[#393528] rounded-xl p-4 text-[#8b7a63] cursor-not-allowed"
                            />
                            <p className="text-[10px] text-[#8b7a63] mt-1 italic">* Email cannot be changed here.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#8b7a63] uppercase mb-2">Display Name (Username)</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full bg-[#2a2214] border border-[#393528] rounded-xl p-4 text-[#e8dcc6] focus:border-[#ffd700] outline-none transition-colors"
                                placeholder="Enter your name"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-[#2a2214] border border-[#393528] text-[#e8dcc6] font-bold rounded-xl hover:border-[#ffd700] hover:text-[#ffd700] transition-all"
                        >
                            {loading ? 'Saving...' : 'Update Profile'}
                        </button>
                    </form>
                </div>

                {/* Security Section */}
                <div className="bg-[#1a1612] p-8 rounded-2xl border border-[#393528] shadow-lg">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="p-3 bg-red-500/10 rounded-xl text-red-500 material-symbols-outlined">lock</span>
                        <h2 className="text-xl font-bold text-[#e8dcc6]">Security</h2>
                    </div>

                    <form onSubmit={handleChangePassword} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-[#8b7a63] uppercase mb-2">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full bg-[#2a2214] border border-[#393528] rounded-xl p-4 text-[#e8dcc6] focus:border-[#ffd700] outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#8b7a63] uppercase mb-2">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-[#2a2214] border border-[#393528] rounded-xl p-4 text-[#e8dcc6] focus:border-[#ffd700] outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-[#8b7a63] uppercase mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-[#2a2214] border border-[#393528] rounded-xl p-4 text-[#e8dcc6] focus:border-[#ffd700] outline-none transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-[#ffd700] to-[#b8860b] text-[#1a1612] font-bold rounded-xl shadow-lg hover:shadow-[#ffd700]/20 transition-all opacity-90 hover:opacity-100"
                        >
                            {loading ? 'Processing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            </div>

            <AlertModal
                isOpen={alertState.isOpen}
                onClose={closeAlert}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
            />
        </div>
    );
};

export default AdminSettings;
