import { useNavigate } from "react-router-dom";
import "./Login.css";
import login from "../../images/login.jpg";

function Login() {
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        // Aquí podrías validar credenciales antes de redirigir
        navigate('/projects')
    }
    return (
        <main className="login-page">
           <div>
             <div className="login-image" style={{
                background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${login}) center/cover no-repeat`,
            }}>
                 </div>
            <div className="login-panel">
                <form className="login-form" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" placeholder="your@email.com" required />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" placeholder="your password" required />
                    </div>
                    <button type="submit">Login</button >
                      <a href="#" target="_blank">
                              Olvide la contraseña
                            </a>
                     <button type="submit">Registrarse</button>
                </form>
            </div>
            </div>
          
        </main>
    );
}
export default Login;