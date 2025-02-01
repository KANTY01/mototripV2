// Import necessary modules
import ProtectedRoute from '../components/common/ProtectedRoute'

// Function to dynamically patch the ProtectedRoute component
function makeAllRoutesPublic() {
  console.log('Making all protected routes public for development purposes')

  // Backup original render method
  const originalRender = ProtectedRoute.prototype.render

  // Override the render method to always return children
  ProtectedRoute.prototype.render = function() {
    return this.props.children
  }

  console.log('All protected routes are now public. Remember to revert these changes before production deployment.')
}

// Function to restore normal behavior
function restoreProtectedRoutes() {
  console.log('Restoring normal protected route behavior')

  // Restore original render method
  ProtectedRoute.prototype.render = originalRender

  console.log('Protected routes behavior restored.')
}

// Export functions as default for direct execution
export default {
  makeAllRoutesPublic,
  restoreProtectedRoutes
}