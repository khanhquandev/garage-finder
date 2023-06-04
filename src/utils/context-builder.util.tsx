import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useReducer,
} from 'react';

type MakeContextParams<S, A> = {
  name?: string;
  initial: S | (() => S);
  reducer: (prevState: S, action: A) => S;
};

export function makeContext<S, A>({
  initial,
  reducer,
}: MakeContextParams<S, A>) {
  const Context = createContext<[state: S, dispatch: Dispatch<A>] | undefined>(
    undefined
  );

  function Provider({ children }: PropsWithChildren) {
    const [state, dispatch] = useReducer(
      reducer,
      initial instanceof Function ? initial() : initial
    );

    return (
      <Context.Provider value={[state, dispatch]}>{children}</Context.Provider>
    );
  }

  function useStore() {
    const context = useContext(Context);

    if (context === undefined) {
      throw new Error(
        `context [${name}]: useStore hooks must be used within a Provider`
      );
    }

    return context;
  }

  return [Provider, useStore] as const;
}
