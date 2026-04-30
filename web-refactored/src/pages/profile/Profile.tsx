import { useEffect, useState } from "react";
import { FaEnvelope, FaIdBadge, FaShieldAlt } from "react-icons/fa";

import { getUserById, type UserProfile } from "../../api/users";
import { useAuth } from "../../auth/auth";
import "./Profile.css";

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const data = await getUserById(user.id);
        if (mounted) {
          setProfile(data);
        }
      } catch (error) {
        console.error("No se pudo cargar el perfil", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadProfile();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const displayName = profile?.fullName || profile?.name || user?.name || "Usuario";
  const email = profile?.email || user?.email || "Sin correo";
  const role = profile?.admin || user?.role === "admin" ? "Administrador" : "Usuario";

  return (
    <main className="profile-page">
      <section className="profile-panel">
        <p className="eyebrow">Cuenta</p>
        <h1>Perfil</h1>
        {loading ? (
          <p>Cargando perfil...</p>
        ) : (
          <div className="profile-grid">
            <article>
              <FaIdBadge aria-hidden="true" />
              <span>Nombre</span>
              <strong>{displayName}</strong>
            </article>
            <article>
              <FaEnvelope aria-hidden="true" />
              <span>Email</span>
              <strong>{email}</strong>
            </article>
            <article>
              <FaShieldAlt aria-hidden="true" />
              <span>Rol</span>
              <strong>{role}</strong>
            </article>
          </div>
        )}
      </section>
    </main>
  );
}

export default Profile;
