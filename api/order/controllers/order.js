'use strict';
const stripe = require("stripe")("sk_test_51J4661J2eBzDcgFH2m6I8iHqColCmAhKyvbvB8ae9aGC2Qv25GmvzXAWhMPcKy4AmvpGsUY6I7hCZj3I4xBf2EFw00A8b6vds5");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

//end point personalizado para relaizar un pago, reecribir funcion create del POST para que realize el pago

module.exports = {
    async create(ctx)
    {
        const {token, products, idUser,addressShipping} = ctx.request.body;

        for await(const product of products)
        {
            console.log(product.id);
            console.log(addressShipping);
        }
        

        let totalPayment = 0;
        products.forEach((product) => {
            
            totalPayment = totalPayment + product.price;
        });

        const charge = await stripe.charges.create({
            amount: totalPayment * 100, //hay que mandar el precio del carrito en centimos
            currency: "eur", //moneda con la que se pagara
            source: token.id, //id del token
            description: `ID Usuario: ${idUser}`, 
        });

        const createOrder = [];
        for await(const product of products) {
            const data = {
                product: product.id,
                user: idUser,
                totalPayment,
                idPayment: charge.id,
                addressShipping,
            };
            const validData = await strapi.entityValidator.validateEntity(
                strapi.models.order,
                data
            );
            const entry = await strapi.query("order").create(validData);
            createOrder.push(entry);
        }
        return createOrder;
    },
};

