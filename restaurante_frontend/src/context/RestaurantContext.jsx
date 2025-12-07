import { createContext, useContext, useState, useEffect } from "react";

const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [mesas, setMesas] = useState([]);
  const [menu, setMenu] = useState([]);
  const [pedidosCocina, setPedidosCocina] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshMesas = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/mesas");
      const data = await res.json();
      setMesas(data);
    } catch (error) {
      console.error("Error cargando mesas:", error);
    }
  };

  const refreshMenu = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/menu");
      const data = await res.json();
      setMenu(data);
    } catch (error) {
      console.error("Error cargando menú:", error);
    }
  };

  useEffect(() => {
    Promise.all([refreshMesas(), refreshMenu()]).then(() => setLoading(false));
  }, []);

  return (
    <RestaurantContext.Provider value={{ mesas, menu, refreshMesas, refreshMenu, loading }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = () => useContext(RestaurantContext);