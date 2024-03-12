package routes

import (
	"example.com/go-htmx/controllers"
	"github.com/gin-gonic/gin"
)

func WsRouter(router *gin.Engine, wsc *controllers.WsController) {
	wsGroup := router.Group("/ws")
	{
		wsGroup.POST("/create-room", wsc.CreateRoom)
		wsGroup.GET("/join-room/:roomId", wsc.JoinRoom)
	}

}
