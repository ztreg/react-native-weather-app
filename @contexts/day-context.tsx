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

type ChoosenLocationContextType = {
  choosenLocation: { [key: string]: any } | null;
  setChoosenLocation: Dispatch<SetStateAction<{ [key: string]: any } | null>>;
};

const ChoosenLocationContext = createContext<ChoosenLocationContextType | undefined>(undefined);

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

function useChoosenLocation(): ChoosenLocationContextType {
  const context = useContext(ChoosenLocationContext);
  if (!context) {
      throw new Error("useLocation must be used within an LocationsProvider");
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

const ChoosenLocationProvider = (props: { children: ReactNode }): ReactElement => {
  const [choosenLocation, setChoosenLocation] = useState<{ [key: string]: any } | null>(null);

  return <CitiesContext.Provider {...props} value={{ choosenLocation, setChoosenLocation }} />;
};

export { DayProvider, useDay, CitiesProvider, useCities, ChoosenLocationProvider, useChoosenLocation };