import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { logger, router, reduxRouterMiddleware } from '../middleware'
import rootReducer from '../reducers'

const nextReducer = require('../reducers')

export default function configure(initialState) {
  // console.log('initialState', initialState)
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore

  const createStoreWithMiddleware = applyMiddleware(
    reduxRouterMiddleware,
    thunkMiddleware,
    logger,
    router
  )(create)
/*    Middleware 可以让你包装 store 的 dispatch 方法来达到你想要的目的*/

  const store = createStoreWithMiddleware(rootReducer,initialState)
  if (module.hot) {
    module.hot.accept('../reducers',() => {
       store.replaceReducer(nextReducer);
    })
  }
/*    创建 一个Redux store 来以存放应用中所有的 state。 应用中应有且仅有一个 store。】*/
  return store;
}
