import { useEffect, useState } from "preact/hooks";

interface WOFormProps {
  closeForm: Function; counterKey: any
}

export default function WorkOrderForm({ closeForm, counterKey }: WOFormProps) {
  const fields = {
    estimatedTime: "",
    rejected: false,
    cmmTechId: null,
  };

  const [formData, setFormData] = useState(fields);

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
  }

  return (
    <form key={counterKey} onSubmit={submit}>

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
          <option value="1">1 - Gabriel "N"</option>
          <option value="2">2 - Santos "N"</option>
          <option value="3">3 - Nestor "N"</option>
        </select>
      </label>

      <div class="form-control mt-6">
        <button class="btn btn-success text-xl">Agregar</button>
      </div>
    </form>
  );
}
