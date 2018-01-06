'use strict';

const AV = require('leanengine');
const Router = require('koa-router');
const router = new Router({prefix: '/todos'});
const Todo = AV.Object.extend('Todo');

// 查询 Todo 列表
router.get('/', async function(ctx) {
  ctx.state.title = 'TODO 列表';
  const query = new AV.Query(Todo);
  query.descending('createdAt');
  try {
    ctx.state.todos = await query.find();
  } catch (err) {
    if (err.code === 101) {
      ctx.state.todos = [];
    } else {
      throw err;
    }
  }
  await ctx.render('todos.ejs');
});

// 新增 Todo 项目
router.post('/', async function(ctx) {
  const content = ctx.request.body.content;
  ctx.body = content;
  const todo = new Todo();
  todo.set('content', content);
  await todo.save();
  ctx.redirect('/todos');
});
 
module.exports = router;
