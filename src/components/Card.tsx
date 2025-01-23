import type { Prisma } from "@prisma/client";

type WorkOrder = Prisma.WorkOrderGetPayload<{
  include: {
    area: true;
    part: true;
    priority: true;
    status: true;
    step: true;
    partStatusRegistry: true;
  };
}>;

interface CardProps {
  workOrder: WorkOrder;
  onButtonClick?: Function;
  buttonText?: string;
}

export default function Card({
  workOrder,
  onButtonClick,
  buttonText,
}: CardProps) {
  // Cambiar orden de prioridades
  let prioritybg;
  let statusText;
  let border

  switch (workOrder.priorityId) {
    case 1:
      prioritybg = "badge-error";
      break;
    case 2:
      prioritybg = "badge-warning";
      break;
    case 3:
      prioritybg = "badge-success";
      break;
    default:
      prioritybg = "badge-transparent";
      break;
  }

  const date = new Date(new Date(workOrder.receivedAt).toUTCString())
    .toISOString()
    .split("T")[0];
  const hour = new Date(new Date(workOrder.receivedAt).toUTCString())
    .toISOString()
    .split("T")[1]
    .split(".")[0];

  switch (workOrder.statusId) {
    case 1:
      statusText = `Recibido: ${date} ${hour}`;
      border = "border-black"
      break;
    case 2:
      statusText = `Midiendo: ${date} ${hour}`;
      border = "border-black"
      break;
    case 3:
      statusText = `Finalizado: ${date} ${hour}`;
      border = "border-success"
      break;
    default:
      break;
  }

  function handleClick() {
    if (onButtonClick) {
      onButtonClick(workOrder.workOrder);
    }
  }

  return (
    <div
      class={`stats grid-cols-2 mb-3 mx-4 bg-base-100 ${border} border-4 relative`}
    >
      <div class="stat place-items-center relative ">
        <div class={`font-bold italic badge badge-lg absolute bottom-0 left-0 ${prioritybg}`}>RETRASO</div>
        <div class="stat-title text-black text-lg font-bold">
          {workOrder.part.number} ({workOrder.quantity} pz)
        </div>
        <div class="stat-value text-3xl">{workOrder.workOrder} </div>
        <div class="stat-desc text-black text-xl font-bold">
          Step {workOrder.step.step}
        </div>
      </div>
      <div class="absolute justify-self-center bg-base-200 text-xl">
        10:00:00
      </div>
      <div class="stat place-items-center relative">
        {onButtonClick && (
          <div class="absolute top-0 right-0 h-14">
            <button onClick={handleClick} class="btn btn-info btn-sm">
              {buttonText}
            </button>
          </div>
        )}

        <div class="stat-title text-black text-lg font-bold">Entregado por</div>
        <div class="stat-value text-3xl">{workOrder.area.area}</div>
        <div class="stat-desc text-black text-lg font-bold">
          {statusText}
          {workOrder.statusId === 2 ? (
            <div class="text-black text-lg font-bold absolute bottom-0 text-center">
              Estimado: {workOrder.estimatedTime} minutos
            </div>
          ) : null}

          {workOrder.statusId === 3 ? (
            <>
              {workOrder.rejected ? (
                <svg class="absolute top-0 right-0 h-14 fill-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="m330-288 150-150 150 150 42-42-150-150 150-150-42-42-150 150-150-150-42 42 150 150-150 150 42 42ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" /></svg>
              ) : (
                <svg class="absolute top-0 right-0 h-14 fill-green-500"
                  xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="m421-298 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" /></svg>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div >
  );
}
