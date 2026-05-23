import { Route as rootRouteImport } from './root'
import { Route as IndexRouteImport } from '../../src/routes/index'

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport,
} as any)

const rootRouteChildren = { IndexRoute }

export const routeTree = rootRouteImport
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<any>()