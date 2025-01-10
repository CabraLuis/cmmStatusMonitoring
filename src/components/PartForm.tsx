import { useState } from "preact/hooks"

export default function PartForm() {
    const [parts, setParts] = useState([])
    const [steps, setSteps] = useState([])

    return (
        <div class="hero flex-grow bg-base-200 min-h-screen ">
            <div class="hero-content flex-col lg:flex-row-reverse">
                <div class="card bg-base-100 w-[500px] shrink-0 shadow-2xl">
                    <form class="card-body">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Número de Parte</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ingrese número"
                                class="input input-bordered"
                                required
                                list="parts"
                            />
                            <datalist id="parts">
                                <option value="123123"></option>
                                <option value="412321"></option>
                                <option value="531134"></option>
                            </datalist>
                        </div>

                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Work Order</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ingrese work order"
                                class="input input-bordered"
                                required
                            />
                        </div>

                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Cantidad de Piezas</span>
                            </label>
                            <input
                                type="number"
                                placeholder="Ingrese cantidad"
                                class="input input-bordered"
                                required
                            />
                        </div>

                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Step</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ingrese número de paso"
                                class="input input-bordered"
                                required
                                list="steps"
                            />
                            <datalist id="steps">
                                <option value="123123"></option>
                                <option value="412321"></option>
                                <option value="531134"></option>
                            </datalist>
                        </div>

                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Recibido</span>
                            </label>
                            <input
                                type="datetime-local"
                                placeholder="Ingrese cantidad"
                                class="input input-bordered"
                                required
                                value="2025-01-01T00:00"
                            />
                        </div>

                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Prioridad</span>
                            </div>
                            <select class="select select-bordered">
                                <option disabled selected>Selecciona</option>
                                <option>Alta</option>
                                <option>Media</option>
                                <option>Baja</option>
                            </select>
                        </label>
                        <div class="form-control mt-6">
                            <button class="btn btn-primary">Agregar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}