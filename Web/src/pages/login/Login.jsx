import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        // Aquí podrías validar credenciales antes de redirigir
        navigate('/projects')
    }
    return (
        <main className="login-page">
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
                    <button type="submit">Login</button>
                </form>
            </div>
        </main>
    );
}
export default Login;