const jwt = require('jsonwebtoken')


// the decodedToken is user Object in login.js
//  const userForToken = {
//  username: user.username,
//  id: user._id

// get token from request object directly
// const token = request.token
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else
    request.token = null
  next()
}

//validate token is missing, invalid or vaild.  这样写不好, 耦合度太高了. 因为有些路由不需要验证token, 比如login,get
//有些router需要有token也需要decoded但不需要对比id, token例如post, 有些router需要对比id. token, 比如put, delete
//突然这样写下来发现, 这个validator还是有用的. 只有get不需要, post, put, delete都需要.
//userExtractor是可以写的, 因为可以写了不用。 但validator是不可以的, 因为invaild后程序就crash了
// const tokenValidator = (request, response, next) => {
//   if (!request.token) {
//     return response.status(401).json({ error: 'token missing' })
//   }
//   const decodedToken = jwt.verify(request.token, process.env.SECRET)
//   if (!decodedToken.id) {
//     return response.status(401).json({ error: 'invalid token' })
//   }
//   next()
// }

// get user from request object directly
// const user = request.user
// const userExtractor = (request, response, next) => {
//   const decodedToken = jwt.verify(request.token, process.env.SECRET)
//   if (decodedToken.id) {
//     request.user = decodedToken.id
//   } else
//     request.user = null
//   next()
// }

module.exports = {
  tokenExtractor
}