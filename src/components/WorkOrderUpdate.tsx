import { useEffect, useRef, useState } from "preact/hooks";
import Navbar from "./Navbar";
import WorkOrderForm from "./WorkOrderForm";
import Card from "./Card";
import { createRef } from "preact";

export default function WorkOrderUpdate() {
  const [data, setData] = useState([]);
  const [wo, setWO] = useState(null);

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

  async function measure(workOrder: any) {
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
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  async function retire(workOrder: any) {
    await fetch("/api/workOrder", {
      method: "PATCH",
      body: JSON.stringify({
        workOrder: workOrder,
        rejected: false,
        statusId: 3,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  function showForm() {
    setTimeout(() => {
      formModalRef.current?.showModal();
    }, 0);
  }

  function closeForm() {
    setTimeout(() => {
      formModalRef.current?.close();
    }, 0);
  }

  function showReject(workOrder: any) {
    setTimeout(() => {
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
          <button onClick={showForm} class="btn btn-info">
            Agregar WorkOrder
          </button>
          <button class="btn btn-primary">Cerrar Sesión</button>
        </div>
      </div>

      <div class="bg-base-200 grow">
        <dialog ref={rejectModalRef} id="modal" class="modal">
          <div className="modal-box">
            <h2 class="card-title">Liberar Pieza</h2>
            <p>Indica si la pieza fue aceptada o rechazada.</p>
            <div class="card-actions justify-end">
              <button onClick={accept} class="btn btn-primary">
                Aceptar
              </button>
              <button onClick={reject} class="btn btn-ghost">
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
            <WorkOrderForm closeForm={closeForm}></WorkOrderForm>
          </div>
        </dialog>

        <div class="grid grid-cols-3 ">
          <div class="grid grid-flow-row auto-rows-max ">
            <div class="text-5xl font-bold text-center mb-4 px-5">
              En Standby
            </div>
            {data.map((workOrder: any) =>
              workOrder.statusId === 1 ? (
                <Card
                  workOrder={workOrder}
                  onButtonClick={measure}
                  buttonText="Medir"
                ></Card>
              ) : null
            )}
          </div>

          <div class="grid grid-flow-row auto-rows-max ">
            <div class="text-5xl font-bold text-center mb-4 px-5">Midiendo</div>
            {data.map((workOrder: any) =>
              workOrder.statusId === 2 ? (
                <Card
                  workOrder={workOrder}
                  onButtonClick={showReject}
                  buttonText="Liberar"
                ></Card>
              ) : null
            )}
          </div>

          <div class="grid grid-flow-row auto-rows-max ">
            <div class="text-5xl font-bold text-center mb-4 px-5">
              Liberadas
            </div>
            {data.map((workOrder: any) =>
              workOrder.statusId === 3 ? (
                <Card
                  workOrder={workOrder}
                  onButtonClick={retire}
                  buttonText="Retirar"
                ></Card>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
