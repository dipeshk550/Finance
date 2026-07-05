import { ActivityLog } from '../models/ActivityLog.js'

const ACTION_MAP = {
  POST: 'create',
  PUT: 'update',
  PATCH: 'update',
  DELETE: 'delete',
}

export function logActivity(moduleName) {
  return (req, res, next) => {
    res.on('finish', () => {
      const action = ACTION_MAP[req.method]
      if (req.user && action && res.statusCode < 400) {
        ActivityLog.create({
          user: req.user._id,
          action,
          module: moduleName,
          description: `${req.user.name} performed ${action} on ${moduleName}`,
          ipAddress: req.ip,
        }).catch(() => {})
      }
    })
    next()
  }
}
