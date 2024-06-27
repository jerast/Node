import { Router } from 'express'
import { MovieController } from '../controllers/movies.controller.js'

export const moviesRoutes = ({ movieModel }) => {
  const router = Router()
  const movieController = new MovieController({ movieModel })
  
  router.get('/', movieController.getAll)
  router.post('/', movieController.create)
  
  router.get('/:id', movieController.getById)
  router.patch('/:id', movieController.update)
  router.delete('/:id', movieController.delete)

  return router
}
