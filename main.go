package main

import (
	"log"

	"example.com/go-htmx/config"
	"example.com/go-htmx/controllers"
	"example.com/go-htmx/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	db := config.InitDB()
	uc := controllers.NewUserController(db)
	hub := controllers.NewHub()
	wsc := controllers.NewWsController(hub)
	routes.WsRouter(router, wsc)
	routes.UserRouter(router, uc)
	go hub.Run()

	log.Fatal(router.Run(":8080"))
}
