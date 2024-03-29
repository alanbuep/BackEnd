import { ticketDao } from "../dao/index.dao.js";

async function finalizePurchase(req, res) {
    const { cid } = req.params;
    const user = req.session.user;
    console.log(cid)
    console.log(user)
    try {
        const ticket = await ticketDao.createTicket(req, res);
        if (ticket) {
            res.json({
                data: ticket,
                message: "Gracias por su compra",
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al crear el ticket');
    }
}

export { finalizePurchase };