const sendResponse = require("../helper/responseSender");
const Seats = require("../model/seats.model");
const Ticketservice = require("../service/bookTicket.service");
const createTicket = async (req, res) => {
  /*
    1. create Movie
    2. movie_name , movie_type,director name and movie_images , is required
    */
  try {
    let { movieid, seatId } = req.body;
    let userid = req.user._id;
    if (!userid) {
      return sendResponse(res, 400, {
        status: false,
        message: "user id is required!",
      });
    }
    if (!movieid || !seatId)
      return sendResponse(res, 400, {
        status: false,
        message: "movieid , userid  and seatid is required!",
      });

    // const createcar = await Ticketservice.createticket(obj);
    const seats = await Seats.updateMany({ _id: seatId }, { $push: { userid: userid, movieIds: movieid } });
    if (!seats)
      return sendResponse(res, 400, {
        status: false,
        message: "error!",
      });
    
    return sendResponse(res, 200, {
      status: true,
      data: seats,
      message: "created successfully",
    });
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, {
      status: false,
      message: "Internal Error!",
    });
  }
};

const getBookedTicketsByUserId = async (req, res) => {
  try {
    const bookedTickets = await Ticketservice.getBookedTicketsByUserId(req.params.userid);
    if (!bookedTickets)
      return sendResponse(res, 400, {
        status: false,
        message: "error!",
      });
    return sendResponse(res, 200, {
      status: true,
      data: bookedTickets,
      message: "success",
    });
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, {
      status: false,
      message: "Internal Error!",
    });
  }
}

module.exports = {
  createTicket,
  getBookedTicketsByUserId
}