import { useFruitContext } from './context';
import { Header } from './header';
import { LeftPane } from './leftPane';
import { RightPane } from './rightPane';
import { Toast } from './toast';

const App: React.FC = () => {
  const {error, setError} = useFruitContext();
  return (
    <>
      <div className="flex flex-col h-screen">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <aside className="w-1/2 p-4 overflow-auto bg-slate-50">
            <LeftPane />
          </aside>
          <aside className="flex-1 p-4 bg-slate-100">
            <RightPane />
          </aside>
        </div>
      </div>
      {error && (
        <Toast
          message={error}
          onClose={() => setError(null)}
          duration={6000}
        />
      )}
    </>
  );
};

export default App;
