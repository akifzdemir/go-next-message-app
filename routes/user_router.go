package routes

import (
	"example.com/go-htmx/controllers"
	middleware "example.com/go-htmx/middlewares"
	"github.com/gin-gonic/gin"
)

func UserRouter(router *gin.Engine, uc *controllers.UserController) {
	userGroup := router.Group("/user")
	{
		userGroup.POST("/register", uc.Register)
		userGroup.POST("/login", uc.Login)
		userGroup.GET("/", middleware.AuthMiddleware(), uc.GetAllUsers)
	}
}
