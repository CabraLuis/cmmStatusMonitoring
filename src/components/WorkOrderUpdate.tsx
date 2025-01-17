import { useEffect, useState } from "preact/hooks";
import Navbar from "./Navbar";
import WorkOrderForm from "./WorkOrderForm";

export default function WorkOrderUpdate() {
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

    function measure(workOrder: any) {
        fetch('/api/workOrder', {
            method: "PATCH",
            body: JSON.stringify({
                workOrder: workOrder,
                rejected: false,
                statusId: 2
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
    }

    function finalize(workOrder: any) {
        fetch('/api/workOrder', {
            method: "PATCH",
            body: JSON.stringify({
                workOrder: workOrder,
                rejected: false,
                statusId: 3
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
    }

    return (
        <div class="h-screen flex flex-col">
            <div class="navbar bg-base-100">
                <div class="navbar-start">
                    <a class="btn btn-ghost text-xl">CMM Dashboard</a>
                </div>
                <div class="navbar-center gap-1">
                    <div class="badge badge-success">Priodidad Baja</div>
                    <div class="badge badge-warning">Priodidad Media</div>
                    <div class="badge badge-error">Priodidad Alta</div>
                </div>
                <div class="navbar-end gap-2">
                    <button onClick={() => document.getElementById('modal')!.showModal()} class="btn btn-info">Agregar WorkOrder</button>
                    <button class="btn btn-primary">Cerrar Sesión</button>
                </div>
            </div>

            <div class="bg-base-200 grow">
                <dialog id="modal" class="modal">
                    <div className="modal-box">
                        <WorkOrderForm></WorkOrderForm>
                        <div className="modal-action">
                            {/* <form method="dialog">
                            <button className="btn">Close</button>
                        </form> */}
                        </div>
                    </div>
                </dialog>
                <div
                    class="grid grid-cols-3 "
                >
                    <div class="grid grid-flow-row auto-rows-max ">
                        <div class="text-5xl font-bold text-center mb-4 px-5">En Standby</div>
                        {
                            data.map((workOrder: any) => workOrder.statusId === 1 ? (
                                <div class={`stats grid-cols-2 mb-3 mx-4 border-black bg-${workOrder.priorityId === 1 ? 'success' : workOrder.priorityId === 2 ? 'warning' : workOrder.priorityId === 3 ? 'error' : 'transparent'}`}>
                                    <div class="stat place-items-center">
                                        <div class="stat-title text-black text-lg font-bold">{workOrder.part.number} ({workOrder.quantity} pz)
                                        </div>
                                        <div class="stat-value text-3xl">{workOrder.workOrder}  </div>
                                        <div class="stat-desc text-black text-xl font-bold">Step {workOrder.step.step}</div>
                                    </div>
                                    <div class="stat place-items-center relative">
                                        <div class="absolute top-0 right-0 h-14">
                                            <button onClick={() => measure(workOrder.workOrder)} class="btn btn-info">{'>'}</button>
                                        </div>
                                        <div class="stat-title text-black text-lg font-bold">
                                            Entregado por
                                        </div>
                                        <div class="stat-value text-3xl">{workOrder.area.area}</div>
                                        <div class="stat-desc text-black text-lg font-bold">Recibido {new Date(new Date(workOrder.receivedAt).toUTCString()).toISOString().split("T")[0]} {new Date(new Date(workOrder.receivedAt).toUTCString()).toISOString().split("T")[1].split(".")[0]}</div>
                                    </div>

                                </div>
                            ) : null)
                        }
                    </div>

                    <div class="grid grid-flow-row auto-rows-max ">
                        <div class="text-5xl font-bold text-center mb-4 px-5">Midiendo</div>
                        {
                            data.map((workOrder: any) => workOrder.statusId === 2 ? (
                                <div class={`stats grid-cols-2 mb-3 mx-4 border-black bg-${workOrder.priorityId === 1 ? 'success' : workOrder.priorityId === 2 ? 'warning' : workOrder.priorityId === 3 ? 'error' : 'transparent'}`}>
                                    <div class="stat place-items-center">
                                        <div class="stat-title text-black text-lg font-bold">{workOrder.part.number} ({workOrder.quantity} pz)</div>
                                        <div class="stat-value text-3xl">{workOrder.workOrder}  </div>
                                        <div class="stat-desc text-black text-xl font-bold">Step {workOrder.step.step}</div>
                                    </div>
                                    <div class="stat place-items-center relative">
                                        <div class="absolute top-0 right-0 h-14">
                                            <button onClick={() => finalize(workOrder.workOrder)} class="btn btn-info">{'>'}</button>
                                        </div>
                                        <div class="stat-title text-black text-lg font-bold">Entregado por</div>
                                        <div class="stat-value text-3xl">{workOrder.area.area}</div>
                                        <div class="stat-desc text-black text-lg font-bold">Midiendo **********</div>

                                    </div>
                                </div>
                            ) : null)
                        }
                    </div>

                    <div class="grid grid-flow-row auto-rows-max ">
                        <div class="text-5xl font-bold text-center mb-4 px-5">Liberadas</div>
                        {
                            data.map((workOrder: any) => workOrder.statusId === 3 ? (
                                <div class={`stats grid-cols-2 mb-3 mx-4 border-black bg-${workOrder.priorityId === 1 ? 'success' : workOrder.priorityId === 2 ? 'warning' : workOrder.priorityId === 3 ? 'error' : 'transparent'}`}>
                                    <div class="stat place-items-center">
                                        <div class="stat-title text-black text-lg font-bold">{workOrder.part.number} ({workOrder.quantity} pz)</div>
                                        <div class="stat-value text-3xl">{workOrder.workOrder}  </div>
                                        <div class="stat-desc text-black text-xl font-bold">Step {workOrder.step.step}</div>
                                    </div>
                                    <div class="stat place-items-center">
                                        <div class="stat-title text-black text-lg font-bold">Entregado por</div>
                                        <div class="stat-value text-3xl">{workOrder.area.area}</div>
                                        <div class="stat-desc text-black text-lg font-bold">Liberado *****</div>
                                    </div>
                                </div>
                            ) : null)
                        }
                    </div>
                </div>
            </div>

        </div>
    )
}