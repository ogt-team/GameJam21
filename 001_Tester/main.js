let player = {
    x: 0,
    y: 0
  },
  engine = cEngine.create({
    autoClear: true,
    plugins: {
        input: cEngine.input.create()
    },
    step: (context) => {
      if (engine.plugins.input.keys.W) player.y--
      if (engine.plugins.input.keys.A) player.x--
      if (engine.plugins.input.keys.S) player.y++
      if (engine.plugins.input.keys.D) player.x++

      context.fillStyle = 'red'
      context.fillRect(player.x, player.y, 10, 10)
    }
  })

engine.start()