export function buildRoutePath(path) {
  const routeParamsRegex = /:(\w+)/g

  const pathWithParams = path.replace(routeParamsRegex, '(?<$1>[a-zA-Z0-9\-_]+)')

  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)
  return pathRegex
}