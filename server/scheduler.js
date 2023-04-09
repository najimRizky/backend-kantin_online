import schedule from "node-schedule"
import Order from "../api/Order/orderModel.js"
import Tenant from "../api/Tenant/tenantModel.js"
import Customer from "../api/Customer/customerModel.js"

const assignAutoRejectOrder = (order_id, tenant_id, created_at) => {
    schedule.scheduleJob(order_id.toString(), new Date(Date.parse(created_at) + 3 * 60 * 1000), async () => { // 3 minutes (min x sec x milisec)
        await Order.rejectOrder(order_id, tenant_id)
        console.log(`Order ${order_id} automatically cancelled`)
    })
}

const removeAutoRejectOrder = (order_id) => {
    schedule.cancelJob(order_id.toString())
    console.log(`Auto cancelation for Order ${order_id} was removed`)
}

const assignAutoDeleteResetPasswordToken = (email, token) => {
    schedule.scheduleJob(email, new Date(Date.now() + (30 * 60 * 1000)), async () => {
        await Tenant.findOneAndUpdate({email, reset_password_token: token}, {reset_password_token: null})
        await Customer.findOneAndUpdate({email, reset_password_token: token}, {reset_password_token: null})
    })
}

export default {
    assignAutoRejectOrder,
    removeAutoRejectOrder,
    assignAutoDeleteResetPasswordToken
}