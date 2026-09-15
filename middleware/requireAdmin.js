// function to check if user is admin
// it run after auth middleware
function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({error: 'unauthorized'});}
    if (req.user.role !== 'admin'){
        return res.status(403).json({error: 'admin access required'});
    }
    next();
}
module.exports= requireAdmin;