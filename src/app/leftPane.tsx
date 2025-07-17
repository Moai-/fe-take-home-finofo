import { Fruit } from "../types";
import { useFruitContext } from "./context";
import { MiniButton } from "./miniButton";

export const LeftPane: React.FC = () => {
  const { groupBy, fruit, addToJar } = useFruitContext();

  if (groupBy === 'None') {
    return <FruitDisplay fruits={fruit} onAdd={addToJar} />;
  }

  const key = groupBy.toLowerCase() as keyof Fruit;
  const grouped = groupFruits(fruit, key);

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([label, fruits]) => (
        <details key={label} className="border rounded shadow">
          <summary className="cursor-pointer select-none px-4 py-2 bg-slate-200 font-semibold">
            {label} ({fruits.length})
            <MiniButton className="ml-4"onClick={() => addToJar(fruits.map((f)=>f.id))}>Add All</MiniButton>
          </summary>
          <div className="p-4 bg-white">
            <FruitDisplay fruits={fruits} onAdd={addToJar}/>
          </div>
        </details>
      ))}
    </div>
  );
};

type FruitDisplayProps = {fruits: Array<Fruit>, onAdd: (fruitId: number) => void}

const FruitDisplay: React.FC<FruitDisplayProps> = ({fruits, onAdd}) => {
  const { formatView } = useFruitContext();
  if (!fruits.length) {
    return (<></>);
  }
  if (formatView === 'List') {
    return (
      <FruitList fruits={fruits} onAdd={onAdd} />
    )
  }
  return (
    <FruitTable fruits={fruits} onAdd={onAdd} />
  )
}

const FruitTable: React.FC<FruitDisplayProps> = ({ fruits, onAdd }) => (
  <table className="min-w-full border-collapse text-sm">
    <thead>
      <tr className="bg-slate-100">
        <th className="border p-2">Name</th>
        <th className="border p-2">Family</th>
        <th className="border p-2">Order</th>
        <th className="border p-2">Genus</th>
        <th className="border p-2">Calories</th>
        <th className="border p-2">Jar</th>
      </tr>
    </thead>
    <tbody>
      {fruits.map((f) => (
        <tr key={f.id} className="even:bg-slate-50">
          <td className="border p-2">{f.name}</td>
          <td className="border p-2">{f.family}</td>
          <td className="border p-2">{f.order}</td>
          <td className="border p-2">{f.genus}</td>
          <td className="border p-2">{f.nutritions.calories}</td>
          <td className="border p-2">
            <MiniButton onClick={() => onAdd?.(f.id)}>Add</MiniButton>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const FruitList: React.FC<FruitDisplayProps> = ({ fruits, onAdd }) => (
  <ul className="space-y-1">
    {fruits.map((f) => (
      <li
        key={f.id}
        className="flex items-center justify-between rounded-md p-2 even:bg-slate-50"
      >
        <span>
          {f.name} ({f.nutritions.calories})
        </span>
        <MiniButton onClick={() => onAdd?.(f.id)}>Add</MiniButton>
      </li>
    ))}
  </ul>
);


const groupFruits = (fruits: Array<Fruit>, key: keyof Fruit) => {
  return fruits.reduce<Record<string, Array<Fruit>>>((acc, fruit) => {
    const grp = fruit[key] as unknown as string;
    acc[grp] = acc[grp] || [];
    acc[grp].push(fruit);
    return acc;
  }, {});
};
