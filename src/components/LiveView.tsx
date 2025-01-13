import { useEffect, useState } from "preact/hooks";
import Navbar from "./Navbar";

export default function LiveView() {
    const [data, setData] = useState([])
    useEffect(() => {
        const eventSource = new EventSource('/api/stream')
        eventSource.onmessage = (event) => {
            console.log(event.data)
            setData(event.data)
        }
    })


    return (
        <div>
            <Navbar title="CMM Status" buttonText="Registro" path="registry">
                <div class="navbar-center gap-1">
                    <div class="badge badge-success">Priodidad Baja</div>
                    <div class="badge badge-warning">Priodidad Media</div>
                    <div class="badge badge-error">Priodidad Alta</div>
                </div>
            </Navbar>
            <div
                class="grid grid-cols-3 bg-gradient-to-r from-neutral-300 to-stone-400"
            >
                <div class="grid grid-flow-row auto-rows-max">
                    <div class="text-xl font-bold text-left mb-4 px-5">En Standby</div>
                    <div class="card w-auto bg-success mb-3 mx-4">
                        <div class="card-body">
                            <h2 class="card-title">X05193-0001</h2>
                            <p>Work Order #</p>
                            <div class="card-actions justify-end">
                                <button class="btn btn-info">Ver</button>
                            </div>
                        </div>
                    </div>
                    <div class="card w-auto bg-warning mb-3 mx-4">
                        <div class="card-body">
                            <h2 class="card-title">X05193-0002</h2>
                            <p>Work Order #</p>
                            <div class="card-actions justify-end">
                                <button class="btn btn-info">Ver</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-flow-row auto-rows-max h-screen">
                    <div class="text-xl font-bold text-left mb-4 px-5">Midiendo</div>
                    <div class="card w-auto bg-warning mb-3 mx-4">
                        <div class="card-body">
                            <h2 class="card-title">X05193-0100</h2>
                            <p>Work Order #</p>
                            <div class="card-actions justify-end">
                                <button class="btn btn-info">Ver</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="grid grid-flow-row auto-rows-max h-screen">
                    <div class="text-xl font-bold text-left mb-4 px-5">Liberadas</div>
                    <div class="card w-auto bg-error mb-3 mx-4">
                        <div class="card-body">
                            <h2 class="card-title">X05193-3000</h2>
                            <p>Work Order #</p>
                            <div class="card-actions justify-end">
                                <button class="btn btn-info">Ver</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}