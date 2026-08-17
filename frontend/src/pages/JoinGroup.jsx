import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { joinGroup } from "../api/groupApi";
import useAuth from "../hooks/useAuth.js";

import Spinner from "../components/ui/Spinner";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

// StrictMode remounts components in development. Keep an in-flight request
// outside the component so that remount cannot issue a second POST for the
// same user's invite.
const pendingJoinRequests = new Map();

function joinGroupOnce(token, userId) {
    const requestKey = `${userId}:${token}`;
    const pendingRequest = pendingJoinRequests.get(requestKey);

    if (pendingRequest) {
        return pendingRequest;
    }

    const request = joinGroup(token).then(
        (response) => {
            if (pendingJoinRequests.get(requestKey) === request) {
                pendingJoinRequests.delete(requestKey);
            }

            return response;
        },
        (error) => {
            if (pendingJoinRequests.get(requestKey) === request) {
                pendingJoinRequests.delete(requestKey);
            }

            throw error;
        }
    );

    pendingJoinRequests.set(requestKey, request);
    return request;
}

function JoinGroup() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();

    const [status, setStatus] = useState("joining");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            navigate("/login", {
                replace: true,
                state: { from: `/groups/join/${token}` },
            });
            return;
        }

        if (!token) {
            setStatus("error");
            setErrorMessage("Invalid invite link.");
            return;
        }

        let cancelled = false;

        const join = async () => {
            try {
                const response = await joinGroupOnce(
                    token,
                    user._id || user.id
                );

                if (cancelled) return;

                const member = response.data.data;
                const groupId =
                    member.group?._id ||
                    member.group;

                toast.success(
                    response.data.message ||
                    "Joined group successfully!"
                );

                navigate(`/groups/${groupId}`, { replace: true });
            } catch (error) {
                if (cancelled) return;

                setStatus("error");
                setErrorMessage(
                    error.response?.data?.message ||
                    "Unable to join this group."
                );
            }
        };

        join();

        return () => {
            cancelled = true;
        };
    }, [authLoading, user, token, navigate]);

    if (authLoading || status === "joining") {
        return (
            <div className="py-20">
                <Spinner fullScreen />
            </div>
        );
    }

    return (
        <div className="py-10">
            <Card className="mx-auto max-w-lg p-8 text-center">
                <h2 className="text-xl font-semibold">
                    Unable to join group
                </h2>
                <p
                    className="
                        mt-3
                        text-sm
                        leading-6

                        text-zinc-500
                        dark:text-zinc-400
                    "
                >
                    {errorMessage}
                </p>

                <div className="mt-6">
                    <Button
                        variant="blue"
                        onClick={() => navigate("/groups")}
                    >
                        Go to Groups
                    </Button>
                </div>
            </Card>
        </div>
    );
}

export default JoinGroup;
