import { useEffect, useRef, useState } from "preact/hooks";
import Navbar from "./Navbar";
import WorkOrderForm from "./WorkOrderForm";
import Card from "./Card";
import { createRef } from "preact";

export default function WorkOrderUpdate() {
  const [data, setData] = useState([]);
  const [wo, setWO] = useState(null);
  const [counterKey, setCounterKey] = useState(0)
  const [timeDelayedAux, setTimeDelayedAux] = useState(null)
  let formModalRef = createRef<HTMLDialogElement>();
  let rejectModalRef = createRef<HTMLDialogElement>();

  useEffect(() => {
    async function getInfo() {
      let response = await fetch("/api/workOrder");
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

  async function measure(workOrder: any, timeDelayed: any) {
    await fetch("/api/workOrder", {
      method: "PATCH",
      body: JSON.stringify({
        workOrder: workOrder,
        rejected: false,
        statusId: 2,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async function finalize(rejected: boolean) {
    if (wo) {
      await fetch("/api/workOrder", {
        method: "PATCH",
        body: JSON.stringify({
          workOrder: wo,
          rejected: rejected,
          statusId: 3,
          timeDelayed: timeDelayedAux
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  function showForm() {
    setTimeout(() => {
      formModalRef.current?.showModal();
    }, 0);
  }

  function closeForm() {
    setTimeout(() => {
      formModalRef.current?.close();
      setCounterKey(counterKey + 1)
    }, 0);
  }

  function showReject(workOrder: any, timeDelayed: any) {
    setTimeout(() => {
      setTimeDelayedAux(timeDelayed)
      setWO(workOrder);
      rejectModalRef.current?.showModal();
    }, 0);
  }

  function closeReject() {
    setTimeout(() => {
      rejectModalRef.current?.close();
    }, 0);
  }

  function accept() {
    finalize(false);
    closeReject();
  }

  async function reject() {
    finalize(true);
    closeReject();
  }

  return (
    <div>
      <div class="navbar bg-base-100">
        <div class="navbar-start">
          <a class="btn btn-ghost text-xl">CMM Dashboard</a>
          <img src="../logo.png" width={"150"} />
        </div>
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
        <div class="navbar-end gap-2">
          <button onClick={showForm} class="btn btn-info">
            Agregar WorkOrder
          </button>
          {/* <button class="btn btn-primary">Cerrar Sesión</button> */}
        </div>
      </div>

      <div>
        <dialog ref={rejectModalRef} id="modal" class="modal">
          <div className="modal-box">
            <h2 class="card-title">Liberar Pieza</h2>
            <p>Indica si la pieza fue aceptada o rechazada.</p>
            <div class="card-actions justify-center">
              <button onClick={accept} class="btn btn-success">
                Aceptar
              </button>
              <button onClick={reject} class="btn btn-error">
                Rechazar
              </button>
            </div>
          </div>
        </dialog>

        <dialog ref={formModalRef} id="modal2" class="modal">
          <div className="modal-box">
            <button
              onClick={closeForm}
              class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </button>
            <WorkOrderForm counterKey={counterKey} closeForm={closeForm}></WorkOrderForm>
          </div>
        </dialog>

        <div class="grid grid-cols-3 ">
          <div class="flex flex-col">
            <div class="text-5xl font-bold text-center mb-4 px-5">
              Standby
            </div>
            {data.map((workOrder: any) =>
              workOrder.statusId === 1 ? (
                <Card
                  workOrder={workOrder}
                  onButtonClick={measure}
                  buttonText="Medir >"
                ></Card>
              ) : null
            )}
          </div>

          <div class="flex flex-col ">
            <div class="text-5xl font-bold text-center mb-4 px-5">Midiendo</div>
            {data.map((workOrder: any) =>
              workOrder.statusId === 2 ? (
                <Card
                  workOrder={workOrder}
                  onButtonClick={showReject}
                  buttonText="Liberar >"
                ></Card>
              ) : null
            )}
          </div>

          <div class="flex flex-col">
            <div class="text-5xl font-bold text-center mb-4 px-5">
              Terminado
            </div>
            {data.map((workOrder: any) =>
              workOrder.statusId === 3 ? (
                <Card
                  workOrder={workOrder}
                ></Card>
              ) : null
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
