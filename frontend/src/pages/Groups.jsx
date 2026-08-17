import { useState } from "react";
import { Plus, UsersRound } from "lucide-react";

import useGroups from "../hooks/useGroups";

import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import FadeIn from "../components/ui/FadeIn";
import Card from "../components/ui/Card";
import EmptyState from "../components/ui/EmptyState";
import CreateGroupModal from "../components/groups/CreateGroupModal";
import GroupList from "../components/groups/GroupList";

function Groups() {
    const {
        groupsQuery,
        createMutation,
        isLoading,
        isError,
        error,
        refetch,
    } = useGroups();

    const [createOpen, setCreateOpen] = useState(false);

    const groups = groupsQuery.data || [];

    const handleCreate = async (data) => {
        await createMutation.mutateAsync(data);
    };

    if (isLoading) {
        return <Spinner fullScreen />;
    }

    if (isError) {
        return (
            <div className="py-10">
                <Card className="mx-auto max-w-lg p-8 text-center">
                    <h2 className="text-xl font-semibold">
                        Unable to load groups
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
                            "Something went wrong while fetching your groups."}
                    </p>

                    <div className="mt-6">
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

    return (
        <FadeIn>
            <PageHeader
                title="Groups"
                subtitle="Split expenses with friends and track who owes what."
                action={
                    <Button
                        variant="blue"
                        leftIcon={<Plus size={18} />}
                        onClick={() => setCreateOpen(true)}
                    >
                        Create Group
                    </Button>
                }
            />

            {groups.length === 0 ? (
                <EmptyState
                    icon={UsersRound}
                    title="No groups yet"
                    description="Create a group to start splitting expenses with others."
                    action={
                        <Button
                            variant="blue"
                            leftIcon={<Plus size={18} />}
                            onClick={() => setCreateOpen(true)}
                        >
                            Create Group
                        </Button>
                    }
                />
            ) : (
                <GroupList groups={groups} />
            )}

            <CreateGroupModal
                isOpen={createOpen}
                onClose={() => setCreateOpen(false)}
                onSubmit={handleCreate}
                loading={createMutation.isPending}
            />
        </FadeIn>
    );
}

export default Groups;
