import { useState } from "react";

import { changePassword } from "../api/authApi";

export default function useChangePassword() {
    const [loading, setLoading] = useState(false);

    const updatePassword = async (data) => {
        setLoading(true);

        try {
            const response = await changePassword(data);
            return response;
        } finally {
            setLoading(false);
        }
    };

    return {
        updatePassword,
        loading,
    };
}