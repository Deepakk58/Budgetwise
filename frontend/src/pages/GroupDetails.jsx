import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    HandCoins,
    Plus,
    UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";

import useGroupDetails from "../hooks/useGroupDetails";
import useAuth from "../hooks/useAuth.js";

import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import FadeIn from "../components/ui/FadeIn";
import Card from "../components/ui/Card";
import Section from "../components/ui/Section";
import ConfirmModal from "../components/ui/ConfirmModal";
import MemberBalanceRow from "../components/groups/MemberBalanceRow";
import InviteModal from "../components/groups/InviteModal";
import AddGroupExpenseModal from "../components/groups/AddGroupExpenseModal";
import GroupExpenseList from "../components/groups/GroupExpenseList";
import SettleUpModal from "../components/groups/SettleUpModal";

function GroupDetails() {
    const { groupId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [inviteOpen, setInviteOpen] = useState(false);
    const [expenseOpen, setExpenseOpen] = useState(false);
    const [settleOpen, setSettleOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [settlingId, setSettlingId] = useState(null);
    const [inviteToken, setInviteToken] = useState("");

    const {
        groupQuery,
        suggestionsQuery,
        historyQuery,
        addExpenseMutation,
        deleteExpenseMutation,
        refreshInviteMutation,
        recordSettlementMutation,
        isLoading,
        isError,
        error,
        refetch,
    } = useGroupDetails(groupId, {
        enableSettlements: settleOpen,
    });

    const groupData = groupQuery.data;

    const isOwner = useMemo(() => {
        if (!groupData?.group || !user) return false;

        return (
            groupData.group.owner?.toString() ===
            user._id?.toString()
        );
    }, [groupData, user]);

    useEffect(() => {
        if (groupData?.group?.inviteToken) {
            setInviteToken(groupData.group.inviteToken);
        }
    }, [groupData?.group?.inviteToken]);

    const balanceMap = useMemo(() => {
        const map = new Map();

        (groupData?.balances || []).forEach((item) => {
            map.set(item.member._id, item.balance);
        });

        return map;
    }, [groupData?.balances]);

    const handleRefreshInvite = async () => {
        const response = await refreshInviteMutation.mutateAsync();
        const nextToken = response.data.data.inviteToken;
        setInviteToken(nextToken);
    };

    const handleAddExpense = async (data) => {
        await addExpenseMutation.mutateAsync(data);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;

        try {
            await deleteExpenseMutation.mutateAsync(deleteTarget._id);
            toast.success("Expense deleted successfully!");
            setDeleteTarget(null);
        } catch (deleteError) {
            toast.error(
                deleteError.response?.data?.message ||
                "Something went wrong."
            );
        }
    };

    const handleMarkPaid = async (payload) => {
        const settlementKey = `${payload.paidBy}-${payload.paidTo}-${payload.amount}`;
        setSettlingId(settlementKey);

        try {
            await recordSettlementMutation.mutateAsync(payload);
        } finally {
            setSettlingId(null);
        }
    };

    if (isLoading) {
        return <Spinner fullScreen />;
    }

    if (isError || !groupData) {
        return (
            <div className="py-10">
                <Card className="mx-auto max-w-lg p-8 text-center">
                    <h2 className="text-xl font-semibold">
                        Unable to load group
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
                        {error?.response?.data?.message ||
                            error?.message ||
                            "Something went wrong while fetching this group."}
                    </p>

                    <div
                        className="
                            mt-6
                            flex
                            flex-col
                            gap-3

                            sm:flex-row
                            sm:justify-center
                        "
                    >
                        <Button
                            variant="secondary"
                            leftIcon={<ArrowLeft size={16} />}
                            onClick={() => navigate("/groups")}
                        >
                            Back to Groups
                        </Button>

                        <Button
                            variant="blue"
                            onClick={() => refetch()}
                        >
                            Try Again
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    const { group, members, expenses } = groupData;

    return (
        <FadeIn>
            <div className="mb-6">
                <Link
                    to="/groups"
                    className="
                        inline-flex
                        items-center
                        gap-2

                        text-sm
                        font-medium

                        text-zinc-500

                        transition-colors

                        hover:text-zinc-900

                        dark:text-zinc-400
                        dark:hover:text-white
                    "
                >
                    <ArrowLeft size={16} />
                    Back to Groups
                </Link>
            </div>

            <PageHeader
                title={group.name}
                subtitle="Manage members, expenses, and settlements."
                action={
                    <div
                        className="
                            flex
                            flex-col
                            gap-3

                            sm:flex-row
                        "
                    >
                        <Button
                            variant="secondary"
                            leftIcon={<UserPlus size={16} />}
                            onClick={() => setInviteOpen(true)}
                        >
                            Invite
                        </Button>

                        <Button
                            variant="blue"
                            leftIcon={<Plus size={16} />}
                            onClick={() => setExpenseOpen(true)}
                        >
                            Add Expense
                        </Button>

                        <Button
                            variant="success"
                            leftIcon={<HandCoins size={16} />}
                            onClick={() => setSettleOpen(true)}
                        >
                            Settle Up
                        </Button>
                    </div>
                }
            />

            <div className="space-y-8">
                <Section title="Members & Balances">
                    <Card className="overflow-hidden p-0">
                        <ul
                            className="
                                divide-y
                                divide-zinc-200

                                dark:divide-zinc-800
                            "
                        >
                            {members.map((member) => (
                                <li key={member._id}>
                                    <MemberBalanceRow
                                        member={member}
                                        balance={
                                            balanceMap.get(member._id) ?? 0
                                        }
                                    />
                                </li>
                            ))}
                        </ul>
                    </Card>
                </Section>

                <Section
                    title="Past Expenses"
                >
                    <GroupExpenseList
                        expenses={expenses}
                        canDelete={isOwner}
                        onDelete={setDeleteTarget}
                    />
                </Section>
            </div>

            <InviteModal
                isOpen={inviteOpen}
                onClose={() => setInviteOpen(false)}
                inviteToken={inviteToken}
                isOwner={isOwner}
                onRefresh={handleRefreshInvite}
                refreshing={refreshInviteMutation.isPending}
            />

            <AddGroupExpenseModal
                isOpen={expenseOpen}
                onClose={() => setExpenseOpen(false)}
                onSubmit={handleAddExpense}
                members={members}
                loading={addExpenseMutation.isPending}
            />

            <SettleUpModal
                isOpen={settleOpen}
                onClose={() => setSettleOpen(false)}
                suggestions={suggestionsQuery.data || []}
                history={historyQuery.data || []}
                loading={
                    suggestionsQuery.isLoading ||
                    historyQuery.isLoading
                }
                settlingId={settlingId}
                onMarkPaid={handleMarkPaid}
            />

            <ConfirmModal
                isOpen={Boolean(deleteTarget)}
                title="Delete expense?"
                message={
                    deleteTarget
                        ? `Are you sure you want to delete "${deleteTarget.title}"? This action cannot be undone.`
                        : ""
                }
                confirmText="Delete"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
                loading={deleteExpenseMutation.isPending}
            />
        </FadeIn>
    );
}

export default GroupDetails;
