import WorkOrderForm from "./WorkOrderForm";
import WorkOrderUpdate from "./WorkOrderUpdate";

export default function Dashboard() {
    return (
        <div class="grid grid-cols-2">
            <WorkOrderForm></WorkOrderForm>
            <WorkOrderUpdate></WorkOrderUpdate>
        </div>
    )
}