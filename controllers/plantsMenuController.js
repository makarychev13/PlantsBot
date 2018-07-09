function backCommand(ctx) {
    ctx.scene.leave()
    ctx.scene.enter('main-menu')
}

module.exports = {
    backCommand
}