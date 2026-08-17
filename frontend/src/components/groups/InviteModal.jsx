import { Copy, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { buildInviteUrl } from "../../lib/groupUtils";

function InviteModal({
    isOpen,
    onClose,
    inviteToken,
    isOwner = false,
    onRefresh,
    refreshing = false,
}) {
    const inviteUrl = inviteToken
        ? buildInviteUrl(inviteToken)
        : "";

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(inviteUrl);
            toast.success("Invite link copied!");
        } catch {
            toast.error("Failed to copy invite link.");
        }
    };

    const handleRefresh = async () => {
        try {
            await onRefresh();
            toast.success("Invite link refreshed!");
        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                "Something went wrong."
            );
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            title="Invite Members"
            onClose={onClose}
        >
            <div className="space-y-5">
                <p
                    className="
                        text-sm
                        leading-6

                        text-zinc-500
                        dark:text-zinc-400
                    "
                >
                    Share this link with friends to invite them to the group.
                </p>

                <div
                    className="
                        rounded-xl

                        border
                        border-zinc-200

                        bg-zinc-50

                        px-4
                        py-3

                        dark:border-zinc-800
                        dark:bg-zinc-900/50
                    "
                >
                    <p
                        className="
                            break-all
                            text-sm
                            font-medium
                        "
                    >
                        {inviteUrl || "Loading invite link..."}
                    </p>
                </div>

                <div
                    className="
                        flex
                        flex-col
                        gap-3

                        sm:flex-row
                    "
                >
                    <Button
                        variant="blue"
                        leftIcon={<Copy size={16} />}
                        onClick={handleCopy}
                        disabled={!inviteUrl}
                        fullWidth
                    >
                        Copy Invite
                    </Button>

                    {isOwner && (
                        <Button
                            variant="secondary"
                            leftIcon={<RefreshCw size={16} />}
                            onClick={handleRefresh}
                            loading={refreshing}
                            fullWidth
                        >
                            Refresh Invite
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    );
}

export default InviteModal;
