const Router = require('koa-router');
const router = new Router({prefix: '/rooms'});
const AV = require('leanengine');
const Room = AV.Object.extend('Room');
const _ = require('lodash')

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
      auth: item.get('auth')
    }
  })
  ctx.state.rooms = rooms
  const totalPage = parseInt(total/10) + 1
  // console.log(new Array(totalPage))
  const arr = _.range(totalPage)
  const pages = arr.map((item, index) => {
    const currentPage = item + 1
    console.log(page, currentPage)
    return {
      url: '/rooms?page=' + currentPage,
      name: currentPage,
      isActive: page == currentPage
    }
  })
  console.log(pages)
  // console.log(ctx.state)
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

module.exports = router