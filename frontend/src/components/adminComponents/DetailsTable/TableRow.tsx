import { ConfirmDialog } from "../../ui/ConfirmDialog";
import type { User } from "../../../api/adminApi";

const noProfileUrl = "https://cdn.pixabay.com/photo/2019/08/11/18/59/icon-4399701_1280.png";

export default function TableRow({ user, onBlock }: { user: User; onBlock: (id: string) => void }) {
  const chipClass = user.is_blocked
    ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300";

  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <td className="px-6 py-4 flex items-center space-x-3">
        <img src={user.profile_picture_url || noProfileUrl} className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </td>
      <td className="px-6 py-4">{"1"}</td>
      <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${chipClass}`}>
          {user.is_blocked ? "Blocked" : "Active"}
        </span>
      </td>
      <td className="px-6 py-4">
        <ConfirmDialog
          triggerText={user.is_blocked ? "Unblock" : "Block"}
          title={`${user.is_blocked ? "Unblock" : "Block"} ${user.name}?`}
          description={`Are you sure you want to ${user.is_blocked ? "unblock" : "block"} this user?`}
          confirmText={user.is_blocked ? "Unblock" : "Block"}
          variant={user.is_blocked ? "outline" : "destructive"}
          onConfirm={() => onBlock(user._id)}
        />
      </td>
    </tr>
  );
}
