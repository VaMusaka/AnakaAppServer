module.exports = {
  CodeGenerator: (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min
  },
  RegExEmail: email => {
    return new RegExp(`^${email}$`, 'i')
  },
}
