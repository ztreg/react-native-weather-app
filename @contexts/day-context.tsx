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

type CitiesContextType = {
  cities: { [key: string]: any } | null;
  setCities: Dispatch<SetStateAction<{ [key: string]: any } | null>>;
};

const CitiesContext = createContext<CitiesContextType | undefined>(undefined);

function useDay(): DayContextType {
  const context = useContext(DayContext);
  if (!context) {
      throw new Error("useDay must be used within an DayProvider");
  }
  return context;
}

function useCities(): CitiesContextType {
  const context = useContext(CitiesContext);
  if (!context) {
      throw new Error("useCities must be used within an CitiesProvider");
  }
  return context;
}

const DayProvider = (props: { children: ReactNode }): ReactElement => {
  const [day, setDay] = useState<{ [key: string]: any } | null>(null);

  return <DayContext.Provider {...props} value={{ day, setDay }} />;
};

const CitiesProvider = (props: { children: ReactNode }): ReactElement => {
  const [cities, setCities] = useState<{ [key: string]: any } | null>(null);

  return <CitiesContext.Provider {...props} value={{ cities, setCities }} />;
};
export { DayProvider, useDay, CitiesProvider, useCities };