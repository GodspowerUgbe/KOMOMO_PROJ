const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const dis = (str)=>{
    return `${str[0].toUpperCase()}${str.slice(1)}`;
}

const isJwt = (req, res,next) => {
    // req.isRefreshTok = !!req.cookies.jwt;
    // req.isAccessTok = !!req.cookies.accessTok;
    res.locals.isUser = {
        refreshTok: !!req.cookies.jwt,
        accessTok: !!req.cookies.accessTok
    }
    next(); 
};

const authController = (req, res, next) => {
    let refreshTok = req.cookies.jwt;
    let accessTok = req.cookies.accessTok;
    if (!refreshTok) {
        return res.redirect('/login');
    }
    if (!accessTok) {
        return next();
    }
 
    jwt.verify(accessTok, process.env.ACCESS_KEY, async (err, user) => {
        if (err) return res.sendStatus(403);
        const match = await User.findOne({ email: user.email }).exec();
        if (!match) return res.sendStatus(403);
        console.log('auth')
        req.user = {
            firstName:dis(match.firstName),
            lastName:dis(match.lastName),
            email:match.email,
            projects:match.projects,
            invoices:match.invoices,
            payments:match.payments,
            admin:match.admin
        };
        next(); 
    });
};

const refresh = async (req, res, next) => {
    let accessTok = req.cookies.accessTok;
    if (accessTok) return next();
    const refreshTok = req.cookies.jwt;

    const match = await User.findOne({ refreshToken: refreshTok }).exec();
    if (!match) {
        return res.sendStatus(403);
    };


    jwt.verify(refreshTok, process.env.REFRESH_KEY, (err, client) => {
        if (err || client.email != match.email) return res.sendStatus(403);
        const accessToken = jwt.sign({email:client.email},process.env.ACCESS_KEY,{expiresIn:'120s'});
        res.cookie('accessTok', accessToken, { sameSite: true, httpOnly: true, maxAge: 2 * 60 * 1000 });
        req.user = {
            firstName:dis(match.firstName),
            lastName:dis(match.lastName),
            email:match.email,
            projects:match.projects,
            invoices:match.invoices,
            payments:match.payments,
            admin:match.admin
        };
        console.log('refresh done');
        next();
    })
};

const logout = async (req, res) => {
    let refreshTok = req.cookies.jwt;
    if (!refreshTok) return redirect('/');
    
    const match = await User.findOne({ refreshToken: refreshTok }).exec();
    res.clearCookie('jwt', { sameSite: true, httpOnly: true });
    if (!match) {
        return res.redirect('/');
    }

    match.refreshToken = '';
    const result = await match.save();
    console.log(result);
    res.redirect('/');
}

module.exports = {authController,refresh,logout,isJwt};