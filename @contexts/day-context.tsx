// react
import React, {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useState
} from "react";

type DayContextType = {
  day: { [key: string]: any } | null;
  setDay: Dispatch<SetStateAction<{ [key: string]: any } | null>>;
};

const DayContext = createContext<DayContextType | undefined>(undefined);

function useDay(): DayContextType {
  const context = useContext(DayContext);
  if (!context) {
      throw new Error("useDay must be used within an DayProvider");
  }
  return context;
}

const DayProvider = (props: { children: ReactNode }): ReactElement => {
  const [day, setDay] = useState<{ [key: string]: any } | null>(null);

  return <DayContext.Provider {...props} value={{ day, setDay }} />;
};

export { DayProvider, useDay };