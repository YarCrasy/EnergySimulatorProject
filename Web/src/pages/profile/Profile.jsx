import { useEffect, useState } from "react";
import api from "../../api/api";
import RegisterForm from "../register/RegisterForm";
import { useAuth } from "@/hooks/auth";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const res = await api.get(`/users/${user.id}`);
      setProfileData(res.data);
    }
    fetchData();
  }, [user.id]);

  if (!profileData) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Mi Perfil</h2>
      <RegisterForm
        editingUser={profileData}
        onSuccess={() => alert("Perfil actualizado")}
        onCancel={() => window.location.reload()}
        forceEditMode={true}   // habilita el botón actualizar
      />
    </div>
  );
}
