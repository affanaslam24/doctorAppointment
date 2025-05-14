import jwt from 'jsonwebtoken';

// user authentication middleware
// req res and a middleware next
const authUser = async (req, res, next) => {
    try {
        // const authHeader = req.headers.authorization;

        // if (!authHeader || !authHeader.startsWith("Bearer ")) {
        //     return res.status(401).json({ success: false, message: 'Unauthorized: Token missing or malformed' });
        // }

        // const token = authHeader.split(" ")[1]; 





        const {token} = req.headers
        console.log(token);
        //this will split the token from the header and get the token
        //the token will be in the format of Bearer token
        //so we split it by space and get the second element
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        //if there is no token, then we return unauthorized
        // first we have to decode this toekn
        //then we will verify the token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded);
        // this will give us the decoded token, which wass the "user._id" we used to create the token
        //this will verify the token using the secret key
       
        req.userId = decoded.id; // by doing this, we are adding the id we got from our token to the req body
        //go to the userController.js file
        console.log(req.userId);

        //if the token is valid, then we will call the next middleware
        // this will be the add doctor middleware
        next();
    } catch (error) {
        console.log(error.message);
        res.status(401).json({ success: false, message: 'not Unauthorized' });
    }
}

export default authUser;
//use this configuration or the checking process and add this to the admin route js where we are adding the doctor
