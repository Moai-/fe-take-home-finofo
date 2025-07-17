import { useState, useContext, createContext, useEffect } from "react";
import { FormatView, Fruit, GroupBy } from "../types";
import { getFruit } from "../api";

type FruitContextValue = {
  groupBy: GroupBy;
  setGroupBy: React.Dispatch<React.SetStateAction<GroupBy>>;
  formatView: FormatView;
  setFormatView: React.Dispatch<React.SetStateAction<FormatView>>
  fruit: Array<Fruit>;
  fruitMap: Record<number, Fruit>;
  jar: Array<number>;
  addToJar: (fruitId: number | Array<number>) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const FruitContext = createContext<FruitContextValue | undefined>(undefined);

export const FruitProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [groupBy, setGroupBy] = useState<GroupBy>('None');
  const [formatView, setFormatView] = useState<FormatView>('List');
  const [fruit, setFruit] = useState<Array<Fruit>>([]);
  const [jar, setJar] = useState<Array<number>>([]);
  const [fruitMap, setFruitMap] = useState<Record<number, Fruit>>({});
  const [error, setError] = useState<string | null>(null);

  const addToJar = (fruitId: number | Array<number>) => {
    if (Array.isArray(fruitId)) {
      setJar([...jar, ...fruitId as Array<number>])
    } else {
      setJar([...jar, fruitId as number]); 
    }
  }
  useEffect(() => {
    getFruit().then(setFruit).catch((e) => setError(e.toString()));
  }, []);

  useEffect(() => {
    if (fruit && fruit.length) {
      const map: Record<number, Fruit> = {};
      fruit.forEach((f) => {
        map[f.id] = f;
      });
      setFruitMap(map);
    }
  }, [fruit]);

  return (
    <FruitContext.Provider value={{ 
      groupBy, 
      setGroupBy, 
      formatView, 
      setFormatView, 
      fruit, 
      fruitMap, 
      jar, 
      addToJar, 
      error, 
      setError 
    }}>
      {children}
    </FruitContext.Provider>
  );
};

export const useFruitContext = () => {
  const ctx = useContext(FruitContext);
  if (!ctx) throw new Error('useGroup must be used within GroupProvider');
  return ctx;
};