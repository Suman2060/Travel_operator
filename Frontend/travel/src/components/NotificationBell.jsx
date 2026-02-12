import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchNotifications();
            fetchUnreadCount();
            // Poll for new notifications every 30 seconds
            const interval = setInterval(() => {
                fetchUnreadCount();
            }, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            const response = await api.get('/notifications/?limit=5');
            setNotifications(response.data.results || response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await api.get('/notifications/unread_count/');
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.post(`/notifications/${id}/mark_read/`);
            fetchNotifications();
            fetchUnreadCount();
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.post('/notifications/mark_all_read/');
            fetchNotifications();
            fetchUnreadCount();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    if (!user) return null;

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
                <Bell size={24} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 hover:text-blue-700"
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">
                                No notifications
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.is_read ? 'bg-blue-50' : ''
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <h4 className="font-semibold text-sm text-gray-900">
                                            {notification.title}
                                        </h4>
                                        {!notification.is_read && (
                                            <span className="bg-blue-600 h-2 w-2 rounded-full"></span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-600">{notification.message}</p>
                                    <span className="text-xs text-gray-400 mt-1 block">
                                        {new Date(notification.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="p-3 text-center border-t border-gray-200">
                            <a
                                href="/notifications"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                onClick={() => setShowDropdown(false)}
                            >
                                View All Notifications
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
