import RegisterForm from "../../../components/registerForm/RegisterForm";
import TableUsers from "../../../components/adminComponents/tableUsers/TableUsers";

import { useState } from "react";
import NavBar from "../../../components/adminComponents/navBar/NavBar";
import "./AdminUsers.css";
export default function AdminUsers() {
// Estado para el usuario que se está editando
   const [editingUser, setEditingUser] = useState(null);

  return (
    <div className="AdminUsersPage">
      <div className="Encabezado">
        <NavBar />
      </div>

      <div className="ContentWrapper">
        <div className="UserList">
          <h3>Lista de Usuarios</h3>
         <TableUsers onEdit={setEditingUser} />
        </div>

        <div className="FormSection">
          <RegisterForm
        user={editingUser}
        onSaved={() => setEditingUser(null)}
        onCancel={() => setEditingUser(null)}
      />
        </div>
      </div>
    </div>
  );
}
