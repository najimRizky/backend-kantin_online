API ENDPOINT LIST

/account
    POST    /login                      Login All User
    POST    /register                   Register Customer
    GET     /confirm                    Confirm Customer Account
    GET     /validate-token             Check Access Token Validity
    POST    /request-reset-password     Request Reset Password
    POST    /reset-password             Reset Password

/tenant
    GET     /                   Get All Tenants
    GET     /:id                Get Detail Tenant
    GET     /dashboard          Get Tenant Dashboard
    GET     /profile            Get Tenant Profile
    GET     /review             Get All Tenant Review
    PUT     /profile            Edit Tenant Profile
    PUT     /profile-image      Edit Tenant Profile Image
    PUT     /change-password    Change Tenant Password

/admin
    POST    /tenant/register    Register Tenant
    GET     /tenant             Get All Tenants
    GET     /tenant/:id         Get Detail Tenant
    PUT     /tenant/:id         Edit Tenant
    DELETE  /tenant/:id         Delete Tenant
    GET     /customer           Get All Customers
    GET     /customer/:id       Get Detail Customer
    GET     /order              Get All Orders
    GET     /menu               Get All Menus
    PUT     /menu/:id           Edit Menu
    DELETE  /menu/:id           Delete Menu

/customer 
    GET     /profile            Get Customer Profile
    POST    /balance            Update Customer Balance
    PUT     /profile            Edit Customer Profile
    PUT     /profile-image      Edit Customer Profile Image
    PUT     /change-password    Change Customer Password

/menu 
    GET     /:id                        Get Detail Menu
    POST    /                           Add Menu
    PUT     /:id                        Edit Menu
    DELETE  /:id                        Delete Menu
    POST    /category                   Add Category
    GET     /category                   Get All Category
    PUT     /category/:category_id      Edit Category
    DELETE  /category/:category_id      Delete Category

/order
    GET     /                   Get All Order
    GET     /:_id               Get Single Order
    POST    /create             Create Order
    PATCH   /confirm/:_id       Confirm Order
    PATCH   /reject/:_id        Reject Order
    PATCH   /ready/:_id         Serve Order
    PATCH   /complete/:_id      Finish Order
    GET     /on-progress        Get All On Progress Order
    POST    /review/:_id        Add Order Review

/search         Search Menu
/random-menu    Get Random Menu
/random-tenant  Get Random Tenant