import schedule from "node-schedule"
import Order from "../api/Order/orderModel.js"
import Tenant from "../api/Tenant/tenantModel.js"
import Customer from "../api/Customer/customerModel.js"
import moment from "moment/moment.js"

const AUTO_REJECT_ORDER_MINUTES = process.env.AUTO_REJECT_ORDER_MINUTES || 10 // minutes

const assignAutoRejectOrder = (order_id, tenant_id, created_at) => {
    schedule.scheduleJob(order_id.toString(), moment(created_at).add(AUTO_REJECT_ORDER_MINUTES, "minutes").toISOString(), async () => {
        await Order.rejectOrder(order_id, tenant_id)
        console.log(`Order ${order_id} automatically cancelled`)
    })
}

const removeAutoRejectOrder = (order_id) => {
    schedule.cancelJob(order_id.toString())
    console.log(`Auto cancelation for Order ${order_id} was removed`)
}

const assignAutoDeleteResetPasswordToken = (userId, role) => {
    console.log("Reset password token was assigned")
    schedule.scheduleJob(userId, moment().add(30, "minutes").toISOString(), async () => {
        if (role === "tenant") {
            await Tenant.findByIdAndUpdate(userId, { reset_password_token: null })
        } else {
            await Customer.findByIdAndUpdate(userId, { reset_password_token: null })
        }
        console.log("Reset password token was deleted")
    })
}

export default {
    assignAutoRejectOrder,
    removeAutoRejectOrder,
    assignAutoDeleteResetPasswordToken
}