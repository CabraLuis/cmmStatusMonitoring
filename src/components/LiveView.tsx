import { useEffect, useState } from "preact/hooks";
import Navbar from "./Navbar";
import Card from "./Card";

export default function LiveView() {
  const [data, setData] = useState([]);
  useEffect(() => {
    async function getInfo() {
      let response = await fetch("api/workOrder");
      let data = await response.json();
      setData(data);
    }

    getInfo();

    const eventSource = new EventSource("/api/stream");

    eventSource.onmessage = (event) => {
      getInfo();
    }

    return () => { eventSource.close() };
  }, []);


  return (
    <div>
      <Navbar title="CMM Status" buttonText="Registro" path="registry">
        <div class="navbar-center gap-1">
          <div class="badge badge-success">Priodidad Baja</div>
          <div class="badge badge-warning">Priodidad Media</div>
          <div class="badge badge-error">Priodidad Alta</div>
          <div className="divider divider-horizontal"></div>
          <div class="inline-flex">
            <div class="content-evenly">Rechazado</div>
            <svg class="h-10 fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="m330-288 150-150 150 150 42-42-150-150 150-150-42-42-150 150-150-150-42 42 150 150-150 150 42 42ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" /></svg>
          </div>

          <div class="inline-flex">
            <div class="content-evenly">Aceptado</div>
            <svg class=" h-10 fill-green-500"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="m421-298 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" /></svg>
          </div>
        </div>
      </Navbar>
      <div class="grid grid-cols-3">
        <div class="flex flex-col">
          <div class="text-5xl font-bold text-center mb-4 px-5">Standby</div>
          {data.map((workOrder: any) =>
            workOrder.statusId === 1 ? (
              <Card workOrder={workOrder}></Card>
            ) : null
          )}
        </div>

        <div class="flex flex-col">
          <div class="text-5xl font-bold text-center mb-4 px-5">Midiendo</div>
          {data.map((workOrder: any) =>
            workOrder.statusId === 2 ? (
              <Card workOrder={workOrder}></Card>
            ) : null
          )}
        </div>

        <div class="flex flex-col">
          <div class="text-5xl font-bold text-center mb-4 px-5">Terminado</div>
          {data.map((workOrder: any) =>
            workOrder.statusId === 3 ? (
              <Card workOrder={workOrder}></Card>
            ) : null
          )}
        </div>
      </div>
    </div>
  );
}
