import { useState } from "preact/hooks";
import WorkOrderForm from "./WorkOrderForm";

export default function ProdOps() {
  return (
    <div>
      <div class="hero bg-base-200 min-h-screen">
        <div class="hero-content flex-col lg:flex-row-reverse">
          <div class="text-center lg:text-left">
            <h1 class="text-5xl font-bold">Ingresa Work Order</h1>
            <p class="py-6">Ingresa una work order para ser monitoreada</p>
          </div>
          <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
            <div className="card-body">
              <WorkOrderForm></WorkOrderForm>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
