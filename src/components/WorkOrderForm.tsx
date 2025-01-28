import { useEffect, useState } from "preact/hooks";

interface WOFormProps {
  closeForm: Function; counterKey: any
}

export default function WorkOrderForm({ closeForm, counterKey }: WOFormProps) {
  const fields = {
    part: "",
    workOrder: "",
    quantity: "",
    step: "",
    area: "",
    receivedAt: new Date(Date.now()),
    priority: "",
    estimatedTime: "",
    rejected: false,
  };

  const [formData, setFormData] = useState(fields);
  const [parts, setParts] = useState([]);
  const [steps, setSteps] = useState([]);
  const [areas, setAreas] = useState([]);

  async function getInfo() {
    let response = await fetch("/api/info");
    let data = await response.json();
    setParts(data.info.parts);
    setSteps(data.info.steps);
    setAreas(data.info.areas);
  }

  useEffect(() => {
    getInfo();
  }, []);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    fetch("/api/workOrder", {
      method: "POST",
      body: JSON.stringify({
        workOrder: formData,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setFormData({ ...fields });
    closeForm();
    getInfo();
  }

  return (
    <form key={counterKey} onSubmit={submit}>
      <div class="form-control">
        <label class="label">
          <span class="label-text">Número de Parte</span>
        </label>
        <input
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
          type="text"
          placeholder="Ingrese work order"
          class="input input-bordered"
          required
          onChange={(e: any) =>
            setFormData({ ...formData, workOrder: e.target.value })
          }
          value={formData.workOrder}
        />
      </div>

      <div class="form-control">
        <label class="label">
          <span class="label-text">Cantidad de Piezas</span>
        </label>
        <input
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
          <span class="label-text">Step</span>
        </label>
        <input
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

      <div class="form-control">
        <label class="label">
          <span class="label-text">Departamento Que Entrega</span>
        </label>
        <input
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

      <div class="form-control">
        <label class="label">
          <span class="label-text">Recibido</span>
        </label>
        <input
          type="datetime-local"
          placeholder="Ingrese cantidad"
          class="input input-bordered"
          required
          onChange={(e: any) =>
            setFormData({ ...formData, receivedAt: e.target.value })
          }
        />
      </div>

      <label class="form-control w-full">
        <div class="label">
          <span class="label-text">Prioridad</span>
        </div>
        <select
          class="select select-bordered"
          onChange={(e: any) =>
            setFormData({ ...formData, priority: e.target.value })
          }
        >
          <option disabled selected>
            Selecciona
          </option>
          <option value="1">Alta</option>
          <option value="2">Media</option>
          <option value="3">Baja</option>
        </select>
      </label>
      <div class="form-control mt-6">
        <button class="btn btn-success text-xl">Agregar</button>
      </div>
    </form>
  );
}
