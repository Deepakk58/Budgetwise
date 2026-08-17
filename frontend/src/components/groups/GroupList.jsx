import { Users } from "lucide-react";
import { Link } from "react-router-dom";

import Card from "../ui/Card";
import BalanceDisplay from "./BalanceDisplay";

function GroupList({ groups = [] }) {
    return (
        <div
            className="
                grid
                gap-4

                sm:grid-cols-2
                lg:grid-cols-3
            "
        >
            {groups.map((item) => (
                <Link
                    key={item.group._id}
                    to={`/groups/${item.group._id}`}
                    className="group"
                >
                    <Card
                        className="
                            h-full
                            p-5

                            transition-all

                            group-hover:shadow-card-hover
                        "
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                                <h3
                                    className="
                                        truncate
                                        text-lg
                                        font-semibold
                                    "
                                >
                                    {item.group.name}
                                </h3>

                                <p
                                    className="
                                        mt-2
                                        flex
                                        items-center
                                        gap-1.5

                                        text-sm

                                        text-zinc-500
                                        dark:text-zinc-400
                                    "
                                >
                                    <Users size={14} />
                                    {item.membersCount}{" "}
                                    {item.membersCount === 1
                                        ? "member"
                                        : "members"}
                                </p>
                            </div>

                            <BalanceDisplay
                                balance={item.myBalance}
                                showLabel
                                size="sm"
                            />
                        </div>
                    </Card>
                </Link>
            ))}
        </div>
    );
}

export default GroupList;
