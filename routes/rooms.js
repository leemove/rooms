const Router = require('koa-router');
const router = new Router({prefix: '/rooms'});
const AV = require('leanengine');
const Room = AV.Object.extend('Room');
const _ = require('lodash')

router.get('/', async (ctx, next) => {
  ctx.state.title = '房源列表'
  const page = ctx.query.page || 1
  skip = Math.max(0, (page-1) * 10)
  const query = new AV.Query('Room')
  const res = await query.equalTo('sold', false).limit(10).skip(skip).find()
  const total = await query.count()
  const rooms = res.map(item => {
    return {
      title: item.get('title'),
      describe: item.get('describe'),
      price: item.get('price'),
      wechat: item.get('wechat'),
      auth: item.get('auth'),
      id: item.id
    }
  })
  ctx.state.rooms = rooms
  const totalPage = parseInt(total/10) + 1
  const arr = _.range(totalPage)
  const pages = arr.map((item, index) => {
    const currentPage = item + 1
    return {
      url: '/rooms?page=' + currentPage,
      name: currentPage,
      isActive: page == currentPage
    }
  })
  ctx.state.pages = pages
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
  const index = await new AV.Query('Room').count()
  const room = new Room(
    { 
      index: index + 1,
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



router.get('/detail/:id', async (ctx, next) => {
  ctx.state.title = '测试页面'
  const id = ctx.params.id
  const {attributes: room} = await new AV.Query('Room').get(id)
  ctx.state.room = room
  await next()
  await ctx.render('room.ejs')
})
module.exports = router