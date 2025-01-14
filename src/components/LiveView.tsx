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
        console.log(data)

        const eventSource = new EventSource('/api/stream')
        eventSource.onmessage = (event) => {
            console.log("Client:" + event.data)
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
                class="grid grid-cols-3 bg-gradient-to-b from-base-200 to-red-300 grow"
            >
                <div class="grid grid-flow-row auto-rows-max ">
                    <div class="text-xl font-bold text-left mb-4 px-5">En Standby</div>

                    {
                        data.map((workOrder: any) => workOrder.statusId === 1 ? (
                            <div class="card w-auto bg-success mb-3 mx-4">
                                <div class="card-body">
                                    <h2 class="card-title">{workOrder.part.number}</h2>
                                    <p>{workOrder.workOrder}</p>
                                </div>
                            </div>
                        ) : null)
                    }
                </div>

                <div class="grid grid-flow-row auto-rows-max ">
                    <div class="text-xl font-bold text-left mb-4 px-5">Midiendo</div>

                    {
                        data.map((workOrder: any) => workOrder.statusId === 2 ? (
                            <div class="card w-auto bg-warning mb-3 mx-4">
                                <div class="card-body">
                                    <h2 class="card-title">{workOrder.part.number}</h2>
                                    <p>{workOrder.workOrder}</p>
                                </div>
                            </div>
                        ) : null)
                    }
                </div>

                <div class="grid grid-flow-row auto-rows-max ">
                    <div class="text-xl font-bold text-left mb-4 px-5">Liberadas</div>

                    {
                        data.map((workOrder: any) => workOrder.statusId === 3 ? (
                            <div class="card w-auto bg-error mb-3 mx-4">
                                <div class="card-body">
                                    <h2 class="card-title">{workOrder.part.number}</h2>
                                    <p>{workOrder.workOrder}</p>
                                </div>
                            </div>
                        ) : null)
                    }
                </div>
            </div>
        </div>
    )
}