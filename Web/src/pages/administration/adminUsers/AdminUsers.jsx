import RegisterForm from "../../../components/registerForm/RegisterForm";
import TableUsers from "../../../components/adminComponents/tableUsers/TableUsers";
import "./AdminUsers.css";
import NavBar from "../../../components/adminComponents/navBar/NavBar";

export default function AdminUsers({ userData }) {
  return (
    <div className="AdminUsersPage">
      <div className="Encabezado">
        <NavBar />
      </div>

      <div className="ContentWrapper">
        <div className="UserList">
          <h3>Lista de Usuarios</h3>
          <TableUsers />
        </div>

        <div className="FormSection">
          <h3>Crear/Editar Usuario</h3>
          <RegisterForm userData={userData} />
        </div>
      </div>
    </div>
  );
}
