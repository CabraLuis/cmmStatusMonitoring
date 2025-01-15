import { useEffect, useState } from "preact/hooks";
import Navbar from "./Navbar";

export default function StatusUpdate() {
    const [data, setData] = useState([])
    useEffect(() => {
        async function getInfo() {
            let response = await fetch('/api/workOrder')
            let data = await response.json()
            setData(data)
        }

        getInfo()

        const eventSource = new EventSource('/api/stream')
        eventSource.onmessage = (event) => {
            getInfo()
        }
        return () => eventSource.close()
    }, [])

    return (
        <div class="h-screen flex flex-col">
            <div
                class="grid grid-cols-3 bg-gradient-to-b from-base-200 to-red-300 grow"
            >
                <div class="grid grid-flow-row auto-rows-max ">
                    <div class="text-xl font-bold text-left mb-4 px-5">En Standby</div>

                    {
                        data.map((workOrder: any) => workOrder.statusId === 1 ? (
                            <div class={`stats grid-cols-2 mb-3 mx-4 bg-${workOrder.priorityId === 1 ? 'success' : workOrder.priorityId === 2 ? 'warning' : workOrder.priorityId === 3 ? 'error' : 'transparent'}`}>
                                <div class="stat place-items-center">
                                    <div class="stat-title text-black text-lg font-bold">{workOrder.part.number} ({workOrder.quantity} pz)</div>
                                    <div class="stat-value text-3xl">{workOrder.workOrder}  </div>
                                    <div class="stat-desc text-black text-xl font-bold">Step {workOrder.step.step}</div>
                                </div>
                                <div class="stat place-items-center">
                                    <div class="stat-title text-black text-lg font-bold">Entregado por {workOrder.area.area}</div>
                                    <button class="btn btn-primary text-lg">Empezar a Medir </button>
                                    <div class="stat-desc text-black text-lg font-bold">Recibido {new Date(new Date(workOrder.receivedAt).toUTCString()).toISOString().split("T")[0]} {new Date(new Date(workOrder.receivedAt).toUTCString()).toISOString().split("T")[1].split(".")[0]}</div>
                                </div>
                            </div>
                        ) : null)
                    }
                </div>

                <div class="grid grid-flow-row auto-rows-max ">
                    <div class="text-xl font-bold text-left mb-4 px-5">Midiendo</div>

                    {
                        data.map((workOrder: any) => workOrder.statusId === 2 ? (
                            <div class="stats grid-cols-2 mb-3 mx-4 bg-warning">
                                <div class="stat place-items-center">
                                    <div class="stat-title text-black text-lg font-bold">{workOrder.part.number} ({workOrder.quantity} pz)</div>
                                    <div class="stat-value text-3xl">{workOrder.workOrder}  </div>
                                    <div class="stat-desc text-black text-xl font-bold">Step {workOrder.step.step}</div>
                                </div>
                                <div class="stat place-items-center">
                                    <div class="stat-title text-black text-lg font-bold">Entregado por {workOrder.area.area}</div>
                                    <button class="btn btn-primary text-lg">Liberar Piezas</button>
                                    <div class="stat-desc text-black text-lg font-bold">Recibido {new Date(new Date(workOrder.receivedAt).toUTCString()).toISOString().split("T")[0]} {new Date(new Date(workOrder.receivedAt).toUTCString()).toISOString().split("T")[1].split(".")[0]}</div>
                                </div>
                            </div>
                        ) : null)
                    }
                </div>

                <div class="grid grid-flow-row auto-rows-max ">
                    <div class="text-xl font-bold text-left mb-4 px-5">Liberadas</div>

                    {
                        data.map((workOrder: any) => workOrder.statusId === 3 ? (
                            <div class="stats grid-cols-2 mb-3 mx-4 bg-error">
                                <div class="stat place-items-center">
                                    <div class="stat-title text-black text-lg font-bold">{workOrder.part.number} ({workOrder.quantity} pz)</div>
                                    <div class="stat-value text-3xl">{workOrder.workOrder}  </div>
                                    <div class="stat-desc text-black text-xl font-bold">Step {workOrder.step.step}</div>
                                </div>
                                <div class="stat place-items-center">
                                    <div class="stat-title text-black text-lg font-bold">Entregado por {workOrder.area.area}</div>
                                    <button class="btn btn-primary text-lg">Marcar Como Entregado</button>
                                    <div class="stat-desc text-black text-lg font-bold">Recibido {new Date(new Date(workOrder.receivedAt).toUTCString()).toISOString().split("T")[0]} {new Date(new Date(workOrder.receivedAt).toUTCString()).toISOString().split("T")[1].split(".")[0]}</div>
                                </div>
                            </div>
                        ) : null)
                    }
                </div>
            </div>
        </div>
    )
}