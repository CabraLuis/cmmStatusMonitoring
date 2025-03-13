import type { APIRoute } from "astro";
import CMMController from "../../lib/controller";
import { prisma } from "../../lib/prisma";

function fromDateToString(date: Date) {
  date = new Date(+date);
  date.setTime(date.getTime() - date.getTimezoneOffset() * 60000);
  let dateAsString = date.toISOString();
  return dateAsString;
}

export const GET: APIRoute = async () => {
  const workOrders = await prisma.workOrder.findMany({
    take: 18,
    include: {
      area: true,
      part: true,
      priority: true,
      status: true,
      step: true,
      partStatusRegistry: true,
    },
    orderBy: {
      receivedAt: "desc",
    },
  });

  return new Response(JSON.stringify(workOrders), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const PATCH: APIRoute = async ({ request }) => {
  const { workOrder, estimatedTime, cmmTechId, rejected, statusId } =
    await request.json();

  const updatedWorkOrder = await prisma.workOrder.update({
    where: { workOrder: workOrder.workOrder },
    data: {
      statusId: parseInt(statusId),
      rejected: rejected,
      estimatedTime: parseInt(estimatedTime),
      cmmTechId: parseInt(cmmTechId),
    },
    include: { partStatusRegistry: true },
  });

  if (updatedWorkOrder) {
    const regUpdate = await prisma.workOrderStatusRegistry.create({
      data: {
        workOrderId: updatedWorkOrder.id,
        startedAt: fromDateToString(new Date(Date.now())),
        statusId: updatedWorkOrder.statusId,
        rejected: updatedWorkOrder.rejected,
        elapsedTime: 0,
      },
    });

    function calcElapsed(startDate: Date, endDate: Date) {
      var e = Math.round(
        (startDate.getTime() -
          startDate.getTimezoneOffset() * 60000 -
          endDate.valueOf()) /
          1000 /
          60
      );
      if (startDate.getDate != endDate.getDate) {
        e -= 480;
      }
      return e;
    }

    const prevWOReg = await prisma.workOrderStatusRegistry.updateManyAndReturn({
      where: {
        workOrderId: updatedWorkOrder.id,
        statusId: parseInt(statusId) - 1,
      },
      data: {
        elapsedTime: calcElapsed(
          new Date(Date.now()),
          new Date(updatedWorkOrder.receivedAt)
        ),
      },
    });

    if (statusId === 3) {
      await prisma.workOrder.update({
        where: { workOrder: updatedWorkOrder.workOrder },
        data: {
          timeDelayed: Math.round(
            (regUpdate.startedAt.getTime() - prevWOReg[0].startedAt.getTime()) /
              60000 -
              updatedWorkOrder.estimatedTime
          ),
        },
      });
    }
  }

  await prisma.workOrder.update({
    where: { workOrder: workOrder.workOrder },
    data: {
      receivedAt: fromDateToString(new Date(Date.now())),
    },
    include: { partStatusRegistry: true },
  });

  console.log("-----------------------------");
  console.log("NEW WORK ORDER");
  console.log(fromDateToString(new Date(Date.now())));
  console.log(updatedWorkOrder.workOrder);
  console.log(updatedWorkOrder.id);
  console.log("-----------------------------");

  CMMController.getInstance().addOrUpdate();
  return new Response(null, { status: 201 });
};
