const isLogged = async (req, res, next) => {
    try {
        if (req.session.User) {
            next();//true
        } else {
            return res.redirect('/');//login page false
        }
    } catch (error) {
        console.log(error.message);
    }
}

const isLogout = async (req, res, next) => {
    try {
        if (req.session.User) {
            return res.redirect('/')
        }
        else
            next();
    } catch (error) {
        console.log(error.message);
    }
}

const isLoginAdmin = async (req, res, next) => {
    try {
        if (req.session.admin) {
            next();
        }
        else {
          return  res.redirect('/admin');
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    isLogged,
    isLogout,
    isLoginAdmin,

}

