import Input from "../ui/Input";
import Select from "../ui/Select";
import Card from "../ui/Card";
import { SORT_OPTIONS } from "../../hooks/useTransactionFilters";

function TransactionFilters({
    filters,
    onChange,
    showCategory = false,
    categories = [],
}) {
    const handleChange = (field) => (event) => {
        onChange({
            ...filters,
            [field]: event.target.value,
        });
    };

    return (
        <Card className="p-4 sm:p-5">
            <div
                className="
                    grid
                    gap-4

                    sm:grid-cols-2
                    lg:grid-cols-4
                "
            >
                {showCategory && (
                    <Select
                        label="Category"
                        value={filters.category}
                        onChange={handleChange("category")}
                    >
                        <option value="">All categories</option>
                        {categories.map((category) => (
                            <option
                                key={category._id}
                                value={category.title}
                            >
                                {category.title}
                            </option>
                        ))}
                    </Select>
                )}

                <Input
                    label="From date"
                    type="date"
                    value={filters.startDate}
                    onChange={handleChange("startDate")}
                />

                <Input
                    label="To date"
                    type="date"
                    value={filters.endDate}
                    onChange={handleChange("endDate")}
                />

                <Select
                    label="Sort by"
                    value={filters.sortBy}
                    onChange={handleChange("sortBy")}
                >
                    {SORT_OPTIONS.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                        >
                            {option.label}
                        </option>
                    ))}
                </Select>
            </div>
        </Card>
    );
}

export default TransactionFilters;
