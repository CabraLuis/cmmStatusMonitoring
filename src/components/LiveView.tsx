import { useEffect, useState } from "preact/hooks";
import Navbar from "./Navbar";

export default function LiveView() {
    const [data, setData] = useState([])
    useEffect(() => {
        async function getInfo() {
            let response = await fetch('api/workOrder')
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
            <Navbar title="CMM Status" buttonText="Registro" path="registry">
                <div class="navbar-center gap-1">
                    <div class="badge badge-success">Priodidad Baja</div>
                    <div class="badge badge-warning">Priodidad Media</div>
                    <div class="badge badge-error">Priodidad Alta</div>
                </div>
            </Navbar>
            <div
                class="grid grid-cols-3 bg-base-200  grow"
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
                                <div class="stat place-items-center">
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
                                <div class="stat place-items-center">
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
                            <div class={`stats grid-cols-2 mb-3 mx-4 border-black ${workOrder.priorityId === 1 ? 'bg-success' : (workOrder.priorityId === 2 ? 'bg-warning' : (workOrder.priorityId === 3 ? 'bg-error' : 'bg-transparent'))}`}>
                                <div class="stat place-items-center">
                                    <div class="stat-title text-black text-lg font-bold">{workOrder.part.number} ({workOrder.quantity} pz)</div>
                                    <div class="stat-value text-3xl">{workOrder.workOrder}  </div>
                                    <div class="stat-desc text-black text-xl font-bold">Step {workOrder.step.step}</div>
                                </div>
                                <div class="stat place-items-center relative">
                                    {
                                        workOrder.rejected ? <>
                                            <svg class="absolute top-0 right-0 h-14" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#000000"><path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-60q61.01 0 117.51-20.5Q654-181 699-220L220-699q-38 46-59 102.17T140-480q0 142.37 98.81 241.19Q337.63-140 480-140Zm259-121q37-45 59-101.49 22-56.5 22-117.51 0-142.38-98.81-241.19T480-820q-60.66 0-116.83 21T261-739l478 478Z" /></svg>
                                        </>
                                            :
                                            <>
                                                <svg class="absolute top-0 right-0 h-14" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#000000"><path d="M480-80q-85 0-158-30.5T195-195q-54-54-84.5-127T80-480q0-84 30.5-157T195-764q54-54 127-85t158-31q75 0 140 24t117 66l-43 43q-44-35-98-54t-116-19q-145 0-242.5 97.5T140-480q0 145 97.5 242.5T480-140q145 0 242.5-97.5T820-480q0-30-4.5-58.5T802-594l46-46q16 37 24 77t8 83q0 85-31 158t-85 127q-54 54-127 84.5T480-80Zm-59-218L256-464l45-45 120 120 414-414 46 45-460 460Z" /></svg>
                                            </>
                                    }

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
    )
}