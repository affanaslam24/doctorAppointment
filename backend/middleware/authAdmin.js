import jwt from 'jsonwebtoken';

// admin authentication middleware
// req res and a middleware next
const authAdmin = async (req, res, next) => {
    try {
        const token = req.headers
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
        // this will give us the decoded token, which wass the "email+password" we used to create the token
        //this will verify the token using the secret key
        
//        now lkets check if this toeknn is actually the Same or not
        if(decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
        //if the token is valid, then we will call the next middleware
        // this will be the add doctor middleware
        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
    }
}

export default authAdmin;
//use this configuration or the checking process and add this to the admin route js where we are adding the doctor
