const fetch = require('node-fetch');
const url = require('url');
const WooCommerceAPI = require("@woocommerce/woocommerce-rest-api").default;
console.log('oi')

async function getWoocAllCustomersData(site,consumerKey,consumerSecret, start_date, end_date, order_status){
    var orders = [];
    for(let i=1;i<=100;i++){
        try{
            console.log(orders);
            console.log(i)
            var page_order  = await getWoocOrderByPage(i,site,consumerKey,consumerSecret, start_date, end_date, order_status);
            if(!(page_order.length)){
                break;
            }
            page_order.forEach((order,index)=>{
                orders.push(order);
            })
        }
        catch{
            return false
        }
    }
    console.log('Orders antes do retorno');
    console.log(orders)
    return orders;
}

function getWoocOrderByPage(page, site, consumerKey, consumerSecret, start_date, end_date, order_status) {
    return new Promise((resolve, reject) => {
        console.log('numero de paginas')
        console.log(page)
        if (!page) {
            reject("Page parameter is missing");
            return;
        }
        
        const page_orders = [];
        
        const WooCommerce = new WooCommerceAPI({
            url: site,
            consumerKey: consumerKey,
            consumerSecret: consumerSecret,
            version: 'wc/v3'
        });
        
        WooCommerce.get("orders", {
            'per_page': 100,
            'page': page,
            'before': end_date + "T00:00:00",
            'after': start_date + "T00:00:00",
            'status':order_status
        })
        .then((response) => {
            response.data.forEach((order, index) => {
                var splittedDate = (order.date_created?.slice(0, 10))?.split("-");
                var formattedDate = splittedDate?(`${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`):'';
                page_orders.push({
                    'order_number': order.number,
                    'order_date': formattedDate,
                    'order_status': order.status,
                    'nome': order.billing?.first_name + ' ' + order.billing?.last_name,
                    'phone': order.billing?.phone
                });
            });
            resolve(page_orders);
        }).catch((error) => {
            console.log(error)
            reject(error); // Propagate the error
        });
    });
}

module.exports={
    getWoocAllCustomersData
}






  