const jwt = require('jsonwebtoken');
module.exports = (req,res,next) =>{
    let authHeader = req.get('Authorization');
   //  console.log(authHeader);
   //  console.log(req.get('Authorization').split(' '));
    if(!authHeader){
        const error = new Error('not authenticated');
        error.statuscode = 401;
        throw error;
    }
   
const token = authHeader.split(' ')[1];
// console.log(token);
let decodedToken ;
 try {
    decodedToken = jwt.verify(token,'secretKey');
    // console.log(decodedToken);
    
 } catch (error) {
    error.statusCode = 500 ;
    throw error; 
 }
 if(!decodedToken){
    const error = new Error('unauthorized user');
    error.statusCode = 401;
    throw error;
 }
 req.userId = decodedToken.id;
//  console.log(decodedToken.id)
 next();
};
