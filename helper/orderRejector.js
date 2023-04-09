import schedule from "node-schedule"
import Order from "../api/Order/orderModel.js"

const assignAutoReject = (order_id, tenant_id, created_at) => {
    schedule.scheduleJob(order_id.toString(), new Date(Date.parse(created_at) + 3 * 60 * 1000), async () => { // 3 minutes (min x sec x milisec)
        await Order.rejectOrder(order_id, tenant_id)
        console.log(`Order ${order_id} automatically cancelled`)
    }) 
}

const removeAutoReject = (order_id) => {
    schedule.cancelJob(order_id.toString())
    console.log(`Auto cancelation for Order ${order_id} was removed`)
}

export default {
    assignAutoReject,
    removeAutoReject
}