import BalanceDisplay from "./BalanceDisplay";
import { getMemberName } from "../../lib/groupUtils";

function MemberBalanceRow({ member, balance }) {
    return (
        <div
            className="
                flex
                items-center
                justify-between
                gap-4

                px-5
                py-3.5
            "
        >
            <div className="flex min-w-0 items-center gap-3">
                <div
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center

                        rounded-full

                        bg-zinc-100

                        text-sm
                        font-semibold

                        dark:bg-zinc-800
                    "
                >
                    {getMemberName(member).charAt(0).toUpperCase()}
                </div>

                <span className="truncate font-medium">
                    {getMemberName(member)}
                </span>
            </div>

            <BalanceDisplay balance={balance} />
        </div>
    );
}

export default MemberBalanceRow;
