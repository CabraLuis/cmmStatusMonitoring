import type { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import { useEffect, useState } from "preact/hooks";

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
  const [counter, setCounter] = useState("");
  const [isDelayed, setIsDelayed] = useState(false);
  // Cambiar orden de prioridades
  let prioritybg;
  let statusText;
  let border;
  let dateWO = dayjs(workOrder.receivedAt).add(6, "h");

  function isWithinNightTime(date: any) {
    const hour = date.hour();
    return hour >= 22 || hour < 7;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const now = dayjs();
      const diffSeconds = now.diff(dateWO, "seconds");
      let formattedTime = new Date(diffSeconds * 1000)
        .toISOString()
        .substring(11, 19);
      // Verificar si estamos dentro del corte horario (10 PM - 7 AM)
      if (isWithinNightTime(now)) {
        // Si estamos dentro del horario de corte, detener el contador
        setCounter("00:00:00"); // Pausar el contador
        return;
      }

      // Si no estamos dentro del horario de corte, continuar calculando el tiempo
      setCounter(formattedTime);

      if (
        parseInt(formattedTime.substring(0, 2)) * 60 +
          parseInt(formattedTime.substring(3, 5)) >=
        workOrder.estimatedTime
      ) {
        setIsDelayed(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [counter]);

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
      border = "border-black";
      break;
    case 2:
      statusText = `Midiendo: ${date} ${hour}`;
      border = "border-black";
      break;
    case 3:
      statusText = `Finalizado: ${date} ${hour}`;
      border = "border-success";
      break;
    default:
      break;
  }

  function handleClick() {
    if (onButtonClick) {
      onButtonClick(workOrder);
    }
  }

  return (
    <div
      class={`stats grid-cols-2 mb-3 mx-4 bg-base-100 ${border} border-4 relative`}
    >
      <div class="absolute justify-self-center text-lg text-wrap w-28 text-center">
        {/* ESTE ES EL TIMER */}

        {workOrder.statusId === 2 && (
          <>
            {counter}
            {isDelayed && (
              <div class="font-bold text-red-500 italic right-0 top-6 left-0 text-center absolute">
                RETARDO
              </div>
            )}
          </>
        )}

        {workOrder.statusId === 3 &&
          workOrder.timeDelayed &&
          workOrder.timeDelayed > 0 && (
            <div class="font-bold text-red-500 italic">
              RETARDO DE {workOrder.timeDelayed} min.
            </div>
          )}
      </div>

      <div class="stat place-items-center relative ">
        <div
          class={`badge badge-lg absolute bottom-0 left-0 ${prioritybg}`}
        ></div>
        <div class="stat-title text-black text-lg font-bold">
          {workOrder.part.number} ({workOrder.quantity} pz)
        </div>
        <div class="stat-value text-3xl">
          {workOrder.workOrder.split("@").shift()}{" "}
        </div>
        <div class="stat-desc text-black text-xl font-bold">
          Step {workOrder.step.step}
        </div>
        {workOrder.beeperId && (
          <div class="text-center absolute bottom-0 right-0 left-0 font-bold text-blue-500 italic">
            Beeper
            {workOrder.beeperId}
          </div>
        )}
      </div>

      <div class="stat place-items-center relative">
        {onButtonClick && (
          <div class="absolute top-0 right-0 h-14">
            <button onClick={handleClick} class="btn btn-info btn-sm">
              {buttonText}
            </button>
          </div>
        )}

        <div class="stat-title text-black text-lg font-bold">Entregó</div>
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
                <svg
                  class="absolute top-0 right-0 h-14 fill-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                >
                  <path d="m330-288 150-150 150 150 42-42-150-150 150-150-42-42-150 150-150-150-42 42 150 150-150 150 42 42ZM480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" />
                </svg>
              ) : (
                <svg
                  class="absolute top-0 right-0 h-14 fill-green-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                >
                  <path d="m421-298 283-283-46-45-237 237-120-120-45 45 165 166Zm59 218q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-156t86-127Q252-817 325-848.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 82-31.5 155T763-197.5q-54 54.5-127 86T480-80Zm0-60q142 0 241-99.5T820-480q0-142-99-241t-241-99q-141 0-240.5 99T140-480q0 141 99.5 240.5T480-140Zm0-340Z" />
                </svg>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
