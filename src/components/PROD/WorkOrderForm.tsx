import type React from "preact/compat";
import { useEffect, useRef, useState } from "preact/hooks";

interface WOFormProps {
  closeForm?: Function;
}

export default function WorkOrderForm({ closeForm }: WOFormProps) {
  const fields = {
    part: "",
    workOrder: "",
    quantity: "",
    step: "",
    area: "",
    priority: 1,
    estimatedTime: "",
    rejected: false,
    beeperId: null,
    employee: null,
  };

  const [formData, setFormData] = useState(fields);
  const [parts, setParts] = useState([]);
  const [steps, setSteps] = useState([]);
  const [areas, setAreas] = useState([]);
  const [beepers, setBeepers] = useState([]);

  const [counter, setCounter] = useState(0);

  const stepRef = useRef<HTMLInputElement>(null);

  async function getInfo() {
    let response = await fetch("/api/info");
    let data = await response.json();
    setParts(data.info.parts);
    setSteps(data.info.steps);
    setAreas(data.info.areas);
    setBeepers(data.info.beepers);
  }

  useEffect(() => {
    getInfo();
  }, []);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    fetch("/api/production", {
      method: "POST",
      body: JSON.stringify({
        workOrder: formData,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setFormData({ ...fields });
    if (closeForm) closeForm();
    getInfo();
    setCounter(counter + 1);
  }

  function handleWOChange(e: any) {
    var workOrder = e.target.value;
    var workOrderNoStep = workOrder.split("-")[0];
    var formDataUpdated = { ...formData, workOrder: workOrderNoStep };
    var step = workOrder.split("-")[1];
    setFormData(formDataUpdated);
    if (stepRef.current) {
      stepRef.current.value = step;
      formDataUpdated = { ...formDataUpdated, step: step };
      setFormData(formDataUpdated)
    }
  }

  return (
    <form key={counter} onSubmit={submit}>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Número de Parte</span>
        </label>
        <input
          autofocus={true}
          type="text"
          placeholder="Ingrese número"
          class="input input-bordered"
          required
          list="parts"
          onChange={(e: any) =>
            setFormData({ ...formData, part: e.target.value })
          }
          value={formData.part}
        />
        <datalist id="parts">
          {parts.map((part: any) => (
            <option value={part.number}></option>
          ))}
        </datalist>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Work Order</span>
        </label>
        <input
          autofocus={true}
          type="text"
          placeholder="Ingrese work order"
          class="input input-bordered"
          required
          onChange={(e: any) =>
            handleWOChange(e)
          }
          value={formData.workOrder}
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Step</span>
        </label>
        <input
          ref={stepRef}
          autofocus={true}
          type="text"
          placeholder="Ingrese número de paso"
          class="input input-bordered"
          required
          list="steps"
          onChange={(e: any) =>
            setFormData({ ...formData, step: e.target.value })
          }
          value={formData.step}
        />
        <datalist id="steps">
          {steps.map((step: any) => (
            <option value={step.step}></option>
          ))}
        </datalist>
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Cantidad de Piezas</span>
        </label>
        <input
          autofocus={true}
          type="number"
          placeholder="Ingrese cantidad"
          class="input input-bordered"
          required
          onChange={(e: any) =>
            setFormData({ ...formData, quantity: e.target.value })
          }
          value={formData.quantity}
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Departamento Que Entrega</span>
        </label>
        <input
          autofocus={true}
          type="text"
          placeholder="Ingrese departamento"
          class="input input-bordered"
          required
          list="departamento"
          onChange={(e: any) =>
            setFormData({ ...formData, area: e.target.value })
          }
          value={formData.area}
        />
        <datalist id="departamento">
          {areas.map((area: any) => (
            <option value={area.area}></option>
          ))}
        </datalist>
      </div>

      {
        formData.area === "WELDING" ? (
<label class="form-control w-full">
        <div class="label">
          <span class="label-text">Empleado</span>
        </div>
        <select
          autofocus={true}
          class="select select-bordered"
          onChange={(e: any) =>
            setFormData({ ...formData, employee: e.target.value })
          }
        >
          <option selected>No Asignado</option>
          <option value = "Yonatahan Rosales">Yonatahan Rosales</option>
          <option value = "Erik Gómez">Eric Gómez</option>
        </select>
      </label>
        )
        :
        (
<label class="form-control w-full">
        <div class="label">
          <span class="label-text">Número de Beeper</span>
        </div>
        <select
          autofocus={true}
          class="select select-bordered"
          onChange={(e: any) =>
            setFormData({ ...formData, beeperId: e.target.value })
          }
        >
          <option selected>Ninguno / Sin Beeper</option>
          {beepers.map((beeper: any) => (
            <option value={beeper.id}>
              {beeper.id} - {beeper.name}
            </option>
          ))}
        </select>
      </label>
        )
      }



      <div class="form-control mt-6">
        <button class="btn btn-success text-xl">Agregar</button>
      </div>
    </form>
  );
}
