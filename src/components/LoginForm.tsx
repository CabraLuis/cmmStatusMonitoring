import Navbar from "./Navbar";

// Hora y fecha de liberacion agregar
export default function LoginForm() {
    return (
        <div>
            <Navbar title="CMM Dashboard" buttonText="Estado En Vivo" path="/" />
            <div class="hero bg-base-200 min-h-screen">
                <div class="hero-content flex-col lg:flex-row-reverse">
                    <div class="text-center lg:text-left">
                        <h1 class="text-5xl font-bold">Iniciar Sesión</h1>
                        <p class="py-6">Ingresa tus credenciales para administrar los status</p>
                    </div>
                    <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                        <form class="card-body">
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">Email</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="2361****@nibegroup.us"
                                    class="input input-bordered"
                                    required
                                />
                            </div>
                            <div class="form-control">
                                <label class="label">
                                    <span class="label-text">Contraseña</span>
                                </label>
                                <input
                                    type="password"
                                    placeholder="Ingresa contraseña"
                                    class="input input-bordered"
                                    required
                                />
                            </div>
                            <div class="form-control mt-6">
                                <button class="btn btn-primary">Iniciar Sesión</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}