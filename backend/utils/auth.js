const JWT=require("jsonwebtoken");
require("dotenv").config();
const secret=process.env.JWT_SECRET;
function createtoken(payload){
    const token=JWT.sign(payload,secret);
    return token;
}

function validatetoken(token){
    const payload=JWT.verify(token,secret);
    return payload;

}
module.exports={
    createtoken,
    validatetoken
}
