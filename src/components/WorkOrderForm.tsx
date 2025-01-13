import { useState } from "preact/hooks"

export default function WorkOrderForm() {
    const [formData, setFormData] = useState({
        part: "",
        workOrder: "",
        quantity: "",
        step: "",
        deliveredBy: "",
        receivedAt: "",
        priority: "",
    })
    const [parts, setParts] = useState([])
    const [steps, setSteps] = useState([])

    function submit(e: Event) {
        e.preventDefault()
        fetch('api/part', {
            method: "POST",
            body: JSON.stringify({
                part: formData
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })

    }

    return (
        <div class="hero grow bg-base-200">
            <div class="hero-content flex-col lg:flex-row-reverse">
                <div class="card bg-base-100 w-[500px] shrink-0 shadow-2xl">
                    <form onSubmit={submit} class="card-body">
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
                                onChange={(e: any) => setFormData({ ...formData, part: e.target.value })}
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
                                onChange={(e: any) => setFormData({ ...formData, workOrder: e.target.value })}
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
                                onChange={(e: any) => setFormData({ ...formData, quantity: e.target.value })}
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
                                onChange={(e: any) => setFormData({ ...formData, step: e.target.value })}

                            />
                            <datalist id="steps">
                                <option value="123123"></option>
                                <option value="412321"></option>
                                <option value="531134"></option>
                            </datalist>
                        </div>

                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">Departamento Que Entrega</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Ingrese departamento"
                                class="input input-bordered"
                                required
                                list="departamento"
                                onChange={(e: any) => setFormData({ ...formData, deliveredBy: e.target.value })}

                            />
                            <datalist id="departamento">
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
                                onChange={(e: any) => setFormData({ ...formData, receivedAt: e.target.value })}
                            />
                        </div>

                        <label class="form-control w-full">
                            <div class="label">
                                <span class="label-text">Prioridad</span>
                            </div>
                            <select class="select select-bordered"
                                onChange={(e: any) => setFormData({ ...formData, priority: e.target.value })}
                            >
                                <option disabled selected>Selecciona</option>
                                <option>Alta</option>
                                <option>Media</option>
                                <option>Baja</option>
                            </select>
                        </label>
                        <div class="form-control mt-6">
                            <button class="btn btn-success text-xl">Agregar</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}