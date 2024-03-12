package routes

import (
	"example.com/go-htmx/controllers"
	"github.com/gin-gonic/gin"
)

func UserRouter(router *gin.Engine, uc *controllers.UserController) {
	userGroup := router.Group("/user")
	{
		userGroup.POST("/register", uc.Register)
		userGroup.POST("/login", uc.Login)
	}
}
