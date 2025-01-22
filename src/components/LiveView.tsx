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
    };
    return () => eventSource.close();
  }, []);

  return (
    <div class="h-screen flex flex-col bg-base-200">
      <Navbar title="CMM Status" buttonText="Registro" path="registry">
        <div class="navbar-center gap-1">
          <div class="badge badge-success">Priodidad Baja</div>
          <div class="badge badge-warning">Priodidad Media</div>
          <div class="badge badge-error">Priodidad Alta</div>
        </div>
      </Navbar>
      <div class="grid grid-cols-3 ">
        <div class="grid grid-flow-row auto-rows-max ">
          <div class="text-5xl font-bold text-center mb-4 px-5">Standby</div>
          {data.map((workOrder: any) =>
            workOrder.statusId === 1 ? (
              <Card workOrder={workOrder}></Card>
            ) : null
          )}
        </div>

        <div class="grid grid-flow-row auto-rows-max ">
          <div class="text-5xl font-bold text-center mb-4 px-5">Midiendo</div>
          {data.map((workOrder: any) =>
            workOrder.statusId === 2 ? (
              <Card workOrder={workOrder}></Card>
            ) : null
          )}
        </div>

        <div class="grid grid-flow-row auto-rows-max ">
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
