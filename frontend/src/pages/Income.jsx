import { useState } from "react";
import { Plus, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

import useIncomes from "../hooks/useIncomes";
import { useFilteredTransactions } from "../hooks/useTransactionFilters";

import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";
import Button from "../components/ui/Button";
import FadeIn from "../components/ui/FadeIn";
import Card from "../components/ui/Card";
import ConfirmModal from "../components/ui/ConfirmModal";
import TransactionFilters from "../components/common/TransactionFilters";
import TransactionPagination from "../components/common/TransactionPagination";
import EmptyState from "../components/ui/EmptyState";
import IncomeList from "../components/income/IncomeList";
import IncomeFormModal from "../components/income/IncomeFormModal";

const DEFAULT_FILTERS = {
    startDate: "",
    endDate: "",
    sortBy: "date-desc",
};

function Income() {
    const {
        incomesQuery,
        addMutation,
        editMutation,
        deleteMutation,
        isLoading,
        isError,
        error,
        refetch,
    } = useIncomes();

    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [page, setPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const incomes = incomesQuery.data || [];

    const {
        items,
        totalPages,
        currentPage,
        totalItems,
    } = useFilteredTransactions(incomes, filters, page);

    const handleFiltersChange = (nextFilters) => {
        setFilters(nextFilters);
        setPage(1);
    };

    const handleAdd = () => {
        setSelectedIncome(null);
        setFormOpen(true);
    };

    const handleEdit = (income) => {
        setSelectedIncome(income);
        setFormOpen(true);
    };

    const handleFormClose = () => {
        setFormOpen(false);
        setSelectedIncome(null);
    };

    const handleFormSubmit = async (data) => {
        if (selectedIncome) {
            await editMutation.mutateAsync({
                id: selectedIncome._id,
                data,
            });
        } else {
            await addMutation.mutateAsync(data);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget) return;

        try {
            await deleteMutation.mutateAsync(deleteTarget._id);
            toast.success("Income deleted successfully!");
            setDeleteTarget(null);
        } catch (deleteError) {
            toast.error(
                deleteError.response?.data?.message ||
                "Something went wrong."
            );
        }
    };

    if (isLoading) {
        return <Spinner fullScreen />;
    }

    if (isError) {
        return (
            <div className="py-10">
                <Card className="mx-auto max-w-lg p-8 text-center">
                    <h2 className="text-xl font-semibold">
                        Unable to load income
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
                            "Something went wrong while fetching your income records."}
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
                title="Income"
                subtitle="Track and manage your income sources."
                action={
                    <Button
                        variant="blue"
                        leftIcon={<Plus size={18} />}
                        onClick={handleAdd}
                    >
                        Add Income
                    </Button>
                }
            />

            <div className="space-y-6">
                <TransactionFilters
                    filters={filters}
                    onChange={handleFiltersChange}
                />

                {incomes.length === 0 ? (
                    <EmptyState
                        icon={TrendingUp}
                        title="No income yet"
                        description="Add your first income record to start tracking earnings."
                        action={
                            <Button
                                variant="blue"
                                leftIcon={<Plus size={18} />}
                                onClick={handleAdd}
                            >
                                Add Income
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <IncomeList
                            incomes={items}
                            onEdit={handleEdit}
                            onDelete={setDeleteTarget}
                        />

                        <TransactionPagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalItems}
                            onPageChange={setPage}
                        />
                    </>
                )}
            </div>

            <IncomeFormModal
                isOpen={formOpen}
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                income={selectedIncome}
                loading={addMutation.isPending || editMutation.isPending}
            />

            <ConfirmModal
                isOpen={Boolean(deleteTarget)}
                title="Delete income?"
                message={
                    deleteTarget
                        ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`
                        : ""
                }
                confirmText="Delete"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
                loading={deleteMutation.isPending}
            />
        </FadeIn>
    );
}

export default Income;
