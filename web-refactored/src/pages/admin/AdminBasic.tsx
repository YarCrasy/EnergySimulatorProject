import { useEffect, useState } from "react";
import { FaCubes, FaUsers } from "react-icons/fa";
import { Navigate } from "react-router-dom";

import { getAllElements } from "../../api/elements";
import { getAllUsers, type UserProfile } from "../../api/users";
import { useAuth } from "../../auth/auth";
import type { EnergyElement } from "../../models/element";
import "./AdminBasic.css";

interface AdminBasicProps {
  view: "users" | "elements";
}

function AdminBasic({ view }: AdminBasicProps) {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [elements, setElements] = useState<EnergyElement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      const [userData, elementData] = await Promise.all([getAllUsers(), getAllElements()]);
      if (mounted) {
        setUsers(userData);
        setElements(elementData);
        setLoading(false);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  if (user?.role !== "admin") {
    return <Navigate to="/projects" replace />;
  }

  return (
    <main className="admin-page">
      <section className="admin-panel">
        <p className="eyebrow">Administracion</p>
        <h1>{view === "users" ? "Usuarios" : "Elementos"}</h1>
        {loading ? (
          <p>Cargando datos...</p>
        ) : view === "users" ? (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr key={String(item.id ?? item.email)}>
                    <td>
                      <FaUsers aria-hidden="true" />
                      {item.fullName || item.name || "Sin nombre"}
                    </td>
                    <td>{item.email ?? "Sin correo"}</td>
                    <td>{item.admin ? "Admin" : item.role ?? "Usuario"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="admin-elements-grid">
            {elements.map((element) => (
              <article key={String(element.id ?? element.name)}>
                <FaCubes aria-hidden="true" />
                <h2>{element.name ?? "Elemento"}</h2>
                <p>{element.category ?? element.elementType ?? "Catalogo"}</p>
                <span>{element.powerWatt ?? element.powerConsumption ?? element.capacity ?? "-"} {element.powerWatt || element.powerConsumption ? "W" : ""}</span>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminBasic;
