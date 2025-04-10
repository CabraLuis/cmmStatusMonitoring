import { useEffect, useRef, useState } from "preact/hooks";
import Card from "../Card";
import { createRef } from "preact";

export default function CMMModule() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    estimatedTime: "",
    cmmTechId: "",
  });
  const [wo, setWO] = useState();
  const [timeDelayedAux, setTimeDelayedAux] = useState(null);
  let formModalRef = createRef<HTMLDialogElement>();
  let rejectModalRef = createRef<HTMLDialogElement>();

  useEffect(() => {
    async function getInfo() {
      let response = await fetch("/api/cmm");
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

  async function measure(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    fetch("/api/cmm", {
      method: "PATCH",
      body: JSON.stringify({
        workOrder: wo,
        statusId: 2,
        rejected: false,
        cmmTechId: formData.cmmTechId,
        estimatedTime: formData.estimatedTime,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    closeForm();
  }

  async function finalize(rejected: boolean) {
    if (wo) {
      await fetch("/api/cmm", {
        method: "PATCH",
        body: JSON.stringify({
          workOrder: wo,
          rejected: rejected,
          statusId: 3,
          timeDelayed: timeDelayedAux,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }

  function showForm(workOrder: any) {
    setTimeout(() => {
      setWO(workOrder);
      formModalRef.current?.showModal();
    }, 0);
  }

  function closeForm() {
    setTimeout(() => {
      formModalRef.current?.close();
    }, 0);
  }

  function showReject(workOrder: any, timeDelayed: any) {
    setTimeout(() => {
      setTimeDelayedAux(timeDelayed);
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
      <div>
        <dialog ref={rejectModalRef} id="modal" class="modal">
          <div className="modal-box overflow-hidden">
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
            <form onSubmit={measure}>
              <div class="form-control">
                <label class="label">
                  <span class="label-text">Tiempo Estimado (minutos)</span>
                </label>
                <input
                  type="number"
                  placeholder="Ingrese tiempo estimado de medición"
                  class="input input-bordered"
                  required
                  onChange={(e: any) =>
                    setFormData({ ...formData, estimatedTime: e.target.value })
                  }
                  value={formData.estimatedTime}
                />
              </div>

              <label class="form-control w-full">
                <div class="label">
                  <span class="label-text">Técnico de CMM</span>
                </div>
                <select
                  class="select select-bordered"
                  onChange={(e: any) =>
                    setFormData({ ...formData, cmmTechId: e.target.value })
                  }
                >
                  <option disabled selected>
                    Selecciona
                  </option>
                  <option value="1">Gabriel Castro</option>
                  <option value="2">Santos Martínez</option>
                  <option value="3">Nestor Escalante</option>
                  <option value="4">Pablo Rivera</option>
                </select>
              </label>

              <div class="form-control mt-6">
                <button class="btn btn-success text-xl">Medir</button>
              </div>
            </form>
          </div>
        </dialog>

        <div class="grid grid-cols-3 ">
          <div class="flex flex-col">
            <div class="text-5xl font-bold text-center mb-4 px-5">Standby</div>
            {data.map((workOrder: any) =>
              workOrder.statusId === 1 ? (
                <Card
                  workOrder={workOrder}
                  onButtonClick={showForm}
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
                <Card workOrder={workOrder}></Card>
              ) : null
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
