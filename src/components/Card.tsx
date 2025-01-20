import type { Prisma } from "@prisma/client";
import type React from "preact/compat";

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
  let cardbg;
  let statusText;

  switch (workOrder.priorityId) {
    case 3:
      cardbg = "bg-success";
      break;
    case 2:
      cardbg = "bg-warning";
      break;
    case 1:
      cardbg = "bg-error";
      break;
    default:
      cardbg = "bg-transparent";
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
      break;
    case 2:
      statusText = `Midiendo: ${date} ${hour}`;
      break;
    case 3:
      statusText = `Finalizado: ${date} ${hour}`;
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
      class={`stats grid-cols-2 mb-3 mx-4 border-black  
        ${cardbg}`}
    >
      <div class="stat place-items-center">
        <div class="stat-title text-black text-lg font-bold">
          {workOrder.part.number} ({workOrder.quantity} pz)
        </div>
        <div class="stat-value text-3xl">{workOrder.workOrder} </div>
        <div class="stat-desc text-black text-xl font-bold">
          Step {workOrder.step.step}
        </div>
      </div>
      <div class="stat place-items-center relative">
        {workOrder.statusId === 3 ? (
          <>
            {workOrder.rejected ? (
              <svg
                class="absolute top-0 right-0 h-14"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="#000000"
              >
                <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-60q61.01 0 117.51-20.5Q654-181 699-220L220-699q-38 46-59 102.17T140-480q0 142.37 98.81 241.19Q337.63-140 480-140Zm259-121q37-45 59-101.49 22-56.5 22-117.51 0-142.38-98.81-241.19T480-820q-60.66 0-116.83 21T261-739l478 478Z" />
              </svg>
            ) : (
              <svg
                class="absolute top-0 right-0 h-14"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="#000000"
              >
                <path d="M480-80q-85 0-158-30.5T195-195q-54-54-84.5-127T80-480q0-84 30.5-157T195-764q54-54 127-85t158-31q75 0 140 24t117 66l-43 43q-44-35-98-54t-116-19q-145 0-242.5 97.5T140-480q0 145 97.5 242.5T480-140q145 0 242.5-97.5T820-480q0-30-4.5-58.5T802-594l46-46q16 37 24 77t8 83q0 85-31 158t-85 127q-54 54-127 84.5T480-80Zm-59-218L256-464l45-45 120 120 414-414 46 45-460 460Z" />
              </svg>
            )}
          </>
        ) : null}

        {onButtonClick && (
          <div class="absolute top-0 right-0 h-14">
            <button onClick={handleClick} class="btn btn-info">
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
        </div>
      </div>
    </div>
  );
}
