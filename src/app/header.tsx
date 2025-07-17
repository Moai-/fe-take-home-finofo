import { FormatView, GroupBy } from "../types";
import { useFruitContext } from "./context";

export const Header: React.FC = () => {
  const { groupBy, setGroupBy, formatView, setFormatView } = useFruitContext();

  return (
    <header className="flex items-center justify-between bg-slate-800 p-4 text-white shadow">
      <h1 className="text-xl font-bold">🍎 Fruit Explorer</h1>
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2">
          <span>View as:</span>
          <select
            value={formatView}
            onChange={(e) => setFormatView(e.target.value as FormatView)}
            className="rounded bg-slate-700 px-2 py-1
                       border border-slate-600
                       focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option>List</option>
            <option>Table</option>
          </select>
        </label>

        <label className="flex items-center gap-2">
          <span>Group by:</span>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value as GroupBy)}
            className="rounded bg-slate-700 px-2 py-1
                       border border-slate-600
                       focus:border-emerald-500 focus:ring-emerald-500"
          >
            <option>None</option>
            <option>Family</option>
            <option>Order</option>
            <option>Genus</option>
          </select>
        </label>
      </div>
    </header>
  );
};
