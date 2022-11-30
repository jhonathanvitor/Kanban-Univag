const router = require('express').Router()
const userController = require('../controllers/user')
const { body } = require('express-validator')
const validation = require('../handlers/validation')
const tokenHandler = require('../handlers/tokenHandler')
const User = require('../models/user')

router.post(
  '/signup',
  body('username').isLength({ min: 8 }).withMessage(
    'O nome de usuário deve ter pelo menos 8 caracteres'
  ),
  body('password').isLength({ min: 8 }).withMessage(
    'A senha deve conter pelo menos 8 caracteres'
  ),
  body('confirmPassword').isLength({ min: 8 }).withMessage(
    'Confirme a senha deve ter pelo menos 8 caracteres'
  ),
  body('username').custom(value => {
    return User.findOne({ username: value }).then(user => {
      if (user) {
        return Promise.reject('username already used')
      }
    })
  }),
  validation.validate,
  userController.register
)

router.post(
  '/login',
  body('username').isLength({ min: 8 }).withMessage(
    'O nome de usuário deve ter pelo menos 8 caracteres'
  ),
  body('password').isLength({ min: 8 }).withMessage(
    'A senha deve conter pelo menos 8 caracteres'
  ),
  validation.validate,
  userController.login
)

router.post(
  '/verify-token',
  tokenHandler.verifyToken,
  (req, res) => {
    res.status(200).json({ user: req.user })
  }
)

module.exports = router