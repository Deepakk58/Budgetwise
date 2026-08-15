import { useState } from "react";
import { Plus, TrendingDown } from "lucide-react";
import toast from "react-hot-toast";

import useExpenses from "../hooks/useExpenses";
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
import ExpenseList from "../components/expenses/ExpenseList";
import ExpenseFormModal from "../components/expenses/ExpenseFormModal";

const DEFAULT_FILTERS = {
    category: "",
    startDate: "",
    endDate: "",
    sortBy: "date-desc",
};

function Expenses() {
    const {
        expensesQuery,
        categoriesQuery,
        addMutation,
        editMutation,
        deleteMutation,
        isLoading,
        isError,
        error,
        refetch,
    } = useExpenses();

    const [filters, setFilters] = useState(DEFAULT_FILTERS);
    const [page, setPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const expenses = expensesQuery.data || [];
    const categories = categoriesQuery.data || [];

    const {
        items,
        totalPages,
        currentPage,
        totalItems,
    } = useFilteredTransactions(expenses, filters, page);

    const handleFiltersChange = (nextFilters) => {
        setFilters(nextFilters);
        setPage(1);
    };

    const handleAdd = () => {
        setSelectedExpense(null);
        setFormOpen(true);
    };

    const handleEdit = (expense) => {
        setSelectedExpense(expense);
        setFormOpen(true);
    };

    const handleFormClose = () => {
        setFormOpen(false);
        setSelectedExpense(null);
    };

    const handleFormSubmit = async (data) => {
        if (selectedExpense) {
            await editMutation.mutateAsync({
                id: selectedExpense._id,
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
            toast.success("Expense deleted successfully!");
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
                        Unable to load expenses
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
                            "Something went wrong while fetching your expenses."}
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
                title="Expenses"
                subtitle="Track, filter, and manage your spending."
                action={
                    <Button
                        variant="blue"
                        leftIcon={<Plus size={18} />}
                        onClick={handleAdd}
                    >
                        Add Expense
                    </Button>
                }
            />

            <div className="space-y-6">
                <TransactionFilters
                    filters={filters}
                    onChange={handleFiltersChange}
                    showCategory
                    categories={categories}
                />

                {expenses.length === 0 ? (
                    <EmptyState
                        icon={TrendingDown}
                        title="No expenses yet"
                        description="Start tracking your spending by adding your first expense."
                        action={
                            <Button
                                variant="blue"
                                leftIcon={<Plus size={18} />}
                                onClick={handleAdd}
                            >
                                Add Expense
                            </Button>
                        }
                    />
                ) : (
                    <>
                        <ExpenseList
                            expenses={items}
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

            <ExpenseFormModal
                isOpen={formOpen}
                onClose={handleFormClose}
                onSubmit={handleFormSubmit}
                categories={categories}
                expense={selectedExpense}
                loading={addMutation.isPending || editMutation.isPending}
            />

            <ConfirmModal
                isOpen={Boolean(deleteTarget)}
                title="Delete expense?"
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

export default Expenses;
