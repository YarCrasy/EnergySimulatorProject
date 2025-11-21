import RegisterForm from "../../../components/registerForm/RegisterForm";
import TableUsers from "../../../components/adminComponents/tableUsers/TableUsers";
import "./AdminUsers.css";

export default function AdminUsers({ userData }) {
  return (
    <div className="AdminUsersPage">
      <div className="Encabezado">
        {/* Aqui iria el nuevo header con botones para ir a usuarios o elementos */}
        <h2>Administración de Usuarios</h2>
        <p>Aquí puedes gestionar los usuarios de la aplicación.</p>
      </div>

      <div className="ContentWrapper">

        <div className="UserList">
          <p>Funcionalidad de administración de usuarios en desarrollo.</p>
          <TableUsers />
        </div>

          <div className="FormSection">
          <h3 >Crear/Editar Usuario</h3>
          <RegisterForm userData={userData} />
        </div>
      </div>
    </div>
  );
}
