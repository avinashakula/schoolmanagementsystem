import axios from "axios";

const API = "http://localhost:5000/api/notifications";

export const getNotifications = () => {
    return axios.get(API);
};

export const createNotification = (data: FormData) => {
    return axios.post(API, data, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
};

export const updateNotificationStatus = (
    id: number,
    status: boolean,
) => {
    return axios.put(`${API}/status/${id}`, {
        status,
    });
};