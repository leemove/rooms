const Router = require('koa-router');
const router = new Router({prefix: '/rooms'});
const AV = require('leanengine');
const Room = AV.Object.extend('Room');

router.post('/', async (ctx, next) => {
  const body = ctx.request.body
  if (body.power !== 'maymay') {
    ctx.status = 403
    return
  }
  if (
    !body.title ||
    !body.describe ||
    !body.price ||
    !body.auth ||
    !body.wechat
  ) {
    ctx.status = 400
    return
  }
  const room = new Room(
    {
      title: body.title,
      describe: body.describe,
      price:body.price,
      auth:body.auth,
      wechat:body.wechat,
      sold: false
    }
  )
  try {
    room.save()
  } catch (error) {
    ctx.status = 500
    return
  }
  await next()
  ctx.redirect('/rooms')
})

router.get('/', async (ctx, next) => {
  ctx.state.title = '房源列表'
  await next()
  await ctx.render('rooms.ejs')
})

router.get('/add', async (ctx, next) => {
  ctx.state = {
    title: '新增房源'
  }
  await next()
  await ctx.render('addRoom.ejs', {})
})

module.exports = router